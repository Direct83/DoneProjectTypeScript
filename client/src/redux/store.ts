import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import userReducer from './auth/reducer';

const rootReducer = combineReducers({
  auth: userReducer,
})
export const store = createStore(
  rootReducer,
  composeWithDevTools(),
);
export type RootState = ReturnType<typeof rootReducer>
