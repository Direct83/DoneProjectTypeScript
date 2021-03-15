import { actionTypes, AuthActionTypes, AuthReducerIS } from '../actionTypes';

const initialState = {
  userId: '',
  userName: '',
  isAuth: false,
  message: '',
};
export default function userReducer(state = initialState, action: AuthActionTypes): AuthReducerIS {
  switch (action.type) {
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        userId: action.payload.userId,
        userName: action.payload.userName,
        isAuth: true,
        message: `Вы залогинены под пользователем ${action.payload.userName}!`,
      };
    case actionTypes.LOGOUT_USER:
      return {
        userId: '',
        userName: '',
        isAuth: false,
        message: 'Вы разлогинились',
      };
    case actionTypes.MESSAGE:
      return {
        ...state,
        message: action.payload.mes,
      };
    default:
      return state;
  }
}
