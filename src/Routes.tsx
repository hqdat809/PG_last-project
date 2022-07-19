import Cookies from 'js-cookie';
import Header from 'modules/component/Header/Header';
import SideBar from 'modules/component/SideBar/SideBar';
import React, { lazy, Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import ProtectedRoute from './modules/common/components/ProtectedRoute';
import { ToastContainer, toast } from 'react-toastify';
import {
  ACCESS_TOKEN_KEY,
  IS_REMEMBER,
  IS_REMEMBER_TRUE,
  IS_REMEMBER_FALSE,
} from './utils/constants';

const UserPage = lazy(() => import('./modules/home/pages/UserPage'));
const CreateUserPage = lazy(() => import('./modules/home/CreateUser/CreateUser'));
const CreateProduct = lazy(() => import('./modules/home/CreateProduct/CreateProduct'));
const ProductPage = lazy(() => import('./modules/home/pages/ProductPage'));
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage2'));
const UserDetail = lazy(() => import('./modules/home/UserDetail/UserDetail'));
const ProductDetail = lazy(() => import('./modules/home/ProductDetail/ProductDetail'));
const LoadingPage = lazy(() => import('./modules/common/components/LoadingPage'));

interface Props {}

export const Routes = (props: Props) => {
  const location = useLocation();
  const cookiesLogin = Cookies.get(IS_REMEMBER);
  const token = Cookies.get(ACCESS_TOKEN_KEY);

  return (
    <>
      <Suspense
        fallback={
          <div className="page-loading">
            <div className="loader"></div>
          </div>
        }
      >
        {token ? <Header /> : true}
        <div className="content">
          {token ? <SideBar /> : true}
          <div className="main-content">
            <Switch location={location}>
              <Route
                path={ROUTES.login}
                component={cookiesLogin === IS_REMEMBER_TRUE ? UserPage : LoginPage}
              />
              <ProtectedRoute path={ROUTES.user} component={UserPage} />
              <ProtectedRoute path={ROUTES.createUser} component={CreateUserPage} />
              <ProtectedRoute path={ROUTES.product} component={ProductPage} />
              <ProtectedRoute path={ROUTES.detailUser} component={UserDetail} />
              <ProtectedRoute path={ROUTES.createProduct} component={CreateProduct} />
              <ProtectedRoute path={ROUTES.productDetail} component={ProductDetail} />

              <Route path="/" component={token ? UserPage : LoginPage} />
            </Switch>
          </div>
          {/* <ToastContainer /> */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Suspense>
    </>
  );
};
