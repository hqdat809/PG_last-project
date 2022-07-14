import React from 'react';
import './App.css';
import { Routes } from './Routes';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, USER_INFO } from './utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from './redux/reducer';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchThunk } from './modules/common/redux/thunk';
import { API_PATHS } from './configs/api';
import { RESPONSE_STATUS_SUCCESS } from './utils/httpResponseCode';
import { setAuthorization, setUserInfo } from './modules/auth/redux/authReducer';

function App() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user } = useSelector((state: AppState) => ({
    user: state.profile.user,
  }));
  //
  const getProfile = React.useCallback(async () => {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
    const userInfo = Cookies.get(USER_INFO);

    if (accessToken) {
      dispatch(setAuthorization(accessToken));
    }

    if (userInfo) {
      dispatch(setUserInfo(JSON.parse(userInfo)));
    }
  }, [dispatch, user]);

  React.useEffect(() => {
    getProfile();
  }, []);

  return (
    <div id="app">
      <Routes />
    </div>
  );
}

export default App;
