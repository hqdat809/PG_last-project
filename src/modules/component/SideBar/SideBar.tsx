import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from 'configs/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppState } from 'redux/reducer';
import { useSelector } from 'react-redux';
import { faAngleRight, faTags, faUserGroup } from '@fortawesome/free-solid-svg-icons';

import 'modules/component/SideBar/SideBar.scss';
const SideBar = () => {
  const isSortSideBar = useSelector((state: AppState) => state.userManage.isSortSideBar);

  return (
    <div className={`side-bar ${isSortSideBar ? 'sorted' : ''}`}>
      <div>
        <NavLink activeClassName="active" className="link item-side-bar" to={ROUTES.user}>
          <div>
            <FontAwesomeIcon icon={faUserGroup} style={{ paddingRight: '5px' }} />
            <label className="text-side-bar" hidden={isSortSideBar}>
              User
            </label>
          </div>
          <div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </NavLink>
      </div>
      <div>
        <NavLink activeClassName="active" className="link item-side-bar" to={ROUTES.product}>
          <div>
            <FontAwesomeIcon icon={faTags} style={{ paddingRight: '5px' }} />
            <label className="text-side-bar" hidden={isSortSideBar}>
              Catalog
            </label>
          </div>
          <div>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
