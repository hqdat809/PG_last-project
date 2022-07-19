import productReducer, { ProductState } from '../modules/home/redux/productReducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import userReducer, { UserManagerState } from 'modules/home/redux/userReducer';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';
import intlReducer, { IntlState } from '../modules/intl/redux/intlReducer';

export interface AppState {
  router: RouterState;
  intl: IntlState;
  profile: AuthState;
  userManage: UserManagerState;
  productManage: ProductState;
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    intl: intlReducer,
    profile: authReducer,
    userManage: userReducer,
    productManage: productReducer,
  });
}
