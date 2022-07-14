import React, { useState } from 'react';
import LoginForm from 'modules/auth/components/LoginForm2';
import logo from 'logo-420-x-108.png';
import { ILoginParams } from 'models/auth';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducer';
import { Action } from 'redux';
import { fetchThunk } from 'modules/common/redux/thunk';
import { API_PATHS } from 'configs/api';
import { RESPONSE_STATUS_SUCCESS } from 'utils/httpResponseCode';
import { setAuthorization, setUserInfo } from 'modules/auth/redux/authReducer';
import { setIsLogged } from 'modules/auth/redux/authReducer';
import Cookies from 'js-cookie';
import {
  ACCESS_TOKEN_KEY,
  IS_REMEMBER,
  IS_REMEMBER_TRUE,
  IS_REMEMBER_FALSE,
  IS_LOGGED_IN,
  USER_INFO,
} from '../../../utils/constants';
import { ROUTES } from '../../../configs/routes';
import { replace } from 'connected-react-router';
import { getErrorMessageResponse } from '../../../utils';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onLogin = React.useCallback(
    async (values: ILoginParams) => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(
        fetchThunk(API_PATHS.signIn, 'post', { email: values.email, password: values.password })
      );
      console.log(json);

      setLoading(false);

      if (!json?.errors) {
        console.log('succes');

        if (values.rememberMe) {
          Cookies.set(IS_REMEMBER, IS_REMEMBER_TRUE);
        } else {
          Cookies.set(IS_REMEMBER, IS_REMEMBER_FALSE);
        }

        Cookies.set(ACCESS_TOKEN_KEY, json.user_cookie, {
          expires: values.rememberMe ? 7 : undefined,
        });

        Cookies.set(USER_INFO, JSON.stringify(json.user), {
          expires: values.rememberMe ? 7 : undefined,
        });

        // Cookies.set(IS_LOGGED_IN, "true", { expires: values.rememberMe ? 7 : undefined });

        dispatch(setUserInfo(json.user));
        dispatch(setAuthorization(json.user_cookie));

        dispatch(replace(ROUTES.home));

        return;
      }

      setErrorMessage(getErrorMessageResponse(json));
    },
    [dispatch]
  );

  return (
    <div>
      <div className="wrapper-login-page">
        <img src={logo} alt="" />
        <LoginForm onLogin={onLogin} loading={loading} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

export default LoginPage;
