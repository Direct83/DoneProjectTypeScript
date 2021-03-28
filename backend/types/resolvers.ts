import bcrypt from 'bcrypt';
import { productModel, userModel, basketModel } from '../db/models/models.js';

type Resolver = (parent: any, args: any, context: any, info: any) => any;

interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
interface ObjProductType {
  id: string,
  name: string,
  price: string,
  img: string,
}
export const resolvers: ResolverMap = {
  Query: {
    check: (_, __, { req }) => {
      if (req.session.user) {
        return { ...req.session.user }
      } else {
        return { message: "Could not find cookie :(" };
      }
    }
  },
  Mutation: {
    getItems: async (_, args, { req, res, next }) => {
      const { page, limit } = args.input
      const offset = page * limit - limit
      const items = await productModel.findAll({ offset, limit, raw: true })
      const itemsLength = (await productModel.findAll({ raw: true })).length
      return { items, itemsLength }
    },
    getBasket: async (_, args, { req, res, next }) => {
      const { userId } = args.input
      console.log(userId)
      const arrBasket = await basketModel.findAll({ where: { userIdModel: userId }, raw: true })
      const basket = await Promise.all(arrBasket.map(async (el: any) => ({
        basketId: el.id, objProduct: await productModel.findOne({
          where: { id: el.productIdModel }, raw: true
        })
      })))
      return { basket }
    },
    addItem: async (_, args, { req, res, next }) => {
      const { idProd, userId } = args.input
      await basketModel.create({
        userIdModel: userId,
        productIdModel: idProd,
      })
    },
    delItem: async (_, args, { req, res, next }) => {
      const { basketId } = args.input
      const basket = await basketModel.destroy({ where: { id: basketId } })
    },
    signOut: async (_, __, { req, res, next }) => {
      try {
        req.session.destroy();
        res.clearCookie('sid');
      } catch (error) {
        return { message: 'Ошибка выхода' }
      }
      return { message: 'Вы успeшно вышли из системы' };
    },
    signUp: async (_, args, { req }) => {
      const { name, password, email } = args.input;
      console.log(args.input)
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userFind = await userModel.findOne({ where: { name } });
        const emailFind = await userModel.findOne({ where: { email } })

        if (userFind === null && emailFind === null) {
          const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
          })
          req.session.user = { userId: user.getDataValue('id'), userName: user.getDataValue('name') }
          return { userId: user.getDataValue('id'), userName: user.getDataValue('name'), }
        }
        return userFind ? { message: "пользователь уже существует в базе" } : { message: "пользователь c таким email уже существует" }
      } catch (error) {
        return { message: "все не ок", error: error.message }
      }
    },
    signIn: async (_, args, { req }) => {
      const { name, password } = args.input;
      try {
        const user = await userModel.findOne({ where: { name } });
        if (user) {
          const passwordString = String(user.getDataValue('password'));

          if (!user) {
            return { message: 'все не ок c Именем' }
          }
          const isValidPassword = await bcrypt.compare(password, passwordString);
          if (!isValidPassword) {
            return { message: 'все не ок c Паролем' }
          }
          req.session.user = { userId: user.getDataValue('id'), userName: user.getDataValue('name') };
          return { userId: user.getDataValue('id'), userName: user.getDataValue('name') }
        }
      } catch (error) {
        return { message: "все не ок", error: error.message }
      }
    },
  }
};
