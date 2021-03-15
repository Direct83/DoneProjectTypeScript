import faker from 'faker';
import { Sequelize } from 'sequelize';
import pkg from 'sequelize';
const { DataTypes } = pkg;
const sequelize = new Sequelize('typeScriptStore', 'postgres', '1', {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
});
const productModel = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});
(async () => {
  for (let i = 0; i < 20; i++) {
    await productModel.create({
      name: faker.commerce.productName(),
      price: +faker.commerce.price(),
      img: faker.image.fashion() + i,
    });
  }
})();
