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
import './LoginPage.scss';

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

      setLoading(false);

      if (!json?.errors) {
        Cookies.set(ACCESS_TOKEN_KEY, json.user_cookie, {
          expires: 7,
        });

        Cookies.set(USER_INFO, JSON.stringify(json.user), {
          expires: 7,
        });

        dispatch(setUserInfo(json.user));
        dispatch(setAuthorization(json.user_cookie));
        dispatch(replace(ROUTES.user));

        return;
      }

      setErrorMessage(json.errors.email);
    },
    [dispatch]
  );

  return (
    <div>
      <div className="wrapper-login-page">
        <LoginForm onLogin={onLogin} loading={loading} errorMessage={errorMessage} />
      </div>
    </div>
  );
};

export default LoginPage;
