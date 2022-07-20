import React from 'react';
import { replace } from 'connected-react-router';
import Cookies from 'js-cookie';
import { clearAuthorization, clearUserInfo } from 'modules/auth/redux/authReducer';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { push } from 'connected-react-router';

import { ROUTES } from 'configs/routes';
import 'modules/home/pages/HomePage.scss';
import { AppState } from 'redux/reducer';
import { ACCESS_TOKEN_KEY, IS_REMEMBER, USER_INFO } from 'utils/constants';
import 'modules/component/Header/Header.scss';
import { setIsSortSideBar } from 'modules/home/redux/userReducer';

const Header = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const userInfo = useSelector((state: AppState) => state.profile.user);
  const isSortSideBar = useSelector((state: AppState) => state.userManage.isSortSideBar);

  const handleLogout = () => {
    Cookies.remove(IS_REMEMBER);
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(USER_INFO);
    dispatch(clearAuthorization());
    dispatch(clearUserInfo());
    dispatch(replace(ROUTES.login));
  };

  return (
    <div id="header">
      <menu
        className="header-bars"
        onClick={() => {
          dispatch(setIsSortSideBar(!isSortSideBar));
        }}
      >
        <FontAwesomeIcon icon={faBars} />
      </menu>
      <div className="header-title">
        <h3>Gear Focus Admin</h3>
      </div>
      <div className="header-profile">
        <span className="user">
          <FontAwesomeIcon icon={faUser} />
        </span>
        <div className="actions-user">
          <div className="holder"></div>
          <li
            className="profile-user"
            onClick={() => {
              dispatch(push(`/detail-user/${userInfo?.profile_id}`));
            }}
          >
            <p>My Profile</p>
            <p>{userInfo?.login}</p>
          </li>
          <li className="logout-user" onClick={handleLogout}>
            Logout
          </li>
        </div>
      </div>
    </div>
  );
};

export default Header;
