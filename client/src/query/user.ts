import { gql } from '@apollo/client';

export const GET_ITEMS_GRAPH = gql`
mutation ($page: Int $limit: Int){
  getItems(
    input: { page: $page, limit: $limit}
  ) {
    items {
      id
      name
      price
      img
    }
    itemsLength
    message
  }
}
`;
export const GET_BASKET_GRAPH = gql`
mutation ($userId: String){
  getBasket(
    input: { userId: $userId}
  ) {
    basket {
      basketId
      objProduct {
        id
        name
        price
        img
      }
    }
    message
  }
}
`;
export const SIGNUP_GRAPH = gql`
  mutation ($name: String $password: String $email: String){
    signUp(
      input: { name: $name,password: $password, email: $email }
    ) {
      userName
      userId
      password
      email
      message
    }
  }
`;
export const SIGNIN_GRAPH = gql`
mutation ($name: String $password: String){
  signIn(input: { name: $name, password: $password }) {
    userName,
    userId,
    password,
    email,
    message
  }
}
`;
export const CHECK_GRAPH = gql`
query {
  check {
    message, userId, userName
  }
}
`;
export const ADD_ITEM_GRAPH = gql`
mutation($idProd:String $userId: String) {
  addItem(input: {idProd: $idProd, userId: $userId}) {
    message
  }
}
`;
export const DEL_ITEM_GRAPH = gql`
mutation($basketId: String ) {
  delItem(input: {basketId: $basketId}) {
    message
  }
}
`;
export const SIGNOUT_GRAPH = gql`
mutation($message: String) {
  signOut(input:{message: $message}) {
    message
  }
}
`;

