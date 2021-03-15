import { gql } from 'apollo-server-express';

export const typeDefs = gql`
type itemObj {
  id: String,
  name: String,
  price: String,
  img: String,
}
type getItemsType {
  message: String,
  items: [itemObj],
  itemsLength: Int,
}
input getItemsInput {
  page: Int,
  limit: Int,
}
type signUpType {
  userId: String,
  userName: String,
  name: String,
  password: String,
  email: String,
  message: String,
}
input signUpInput {
  userId: String,
  userName: String,
  name: String,
  password: String,
  email: String,
  message: String,
}
type signInType {
  userId: String,
  name: String,
  password: String,
  email: String
  message: String,
  userName: String,
}
input signInInput {
  userId: String,
  name: String,
  password: String,
  email: String,
  message: String,
  userName: String,
}
input signOut {
  message: String
}
type BasketObj {
  basketId: String,
  objProduct: itemObj
}
type getBasketType {
  message: String,
  basket: [BasketObj],
}
input basket {
  userId: String
}
type Message {
  message:String,
  userId:String,
  userName:String,
}
type Query {
  check: Message
}
type MessageAddDelItem {
  message:String,
}
input addItemInput{
  idProd: String,
  userId: String,
}
input delItemInput{
  basketId: String,
}
type Mutation {
  signUp(input: signUpInput): signUpType
  signIn(input: signInInput ): signInType
  getItems(input: getItemsInput ): getItemsType
  getBasket(input: basket ): getBasketType
  addItem(input: addItemInput): MessageAddDelItem
  delItem(input: delItemInput): MessageAddDelItem
  signOut(input: signOut): signInType
}
`;
