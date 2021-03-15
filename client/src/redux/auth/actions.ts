import { actionTypes } from '../actionTypes';

export function signInUser(userId: string, userName: string) {
  return {
    type: actionTypes.LOGIN_USER,
    payload: {
      userId,
      userName,
    },
  };
}
export function logOutUser() {
  return {
    type: actionTypes.LOGOUT_USER,
  };
}

export function message(mes: string) {
  return {
    type: actionTypes.MESSAGE,
    payload: { mes },
  };
}
