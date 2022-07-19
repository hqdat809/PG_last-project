import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from 'configs/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTags, faUserGroup } from '@fortawesome/free-solid-svg-icons';

import 'modules/component/SideBar/SideBar.scss';
const SideBar = () => {
  return (
    <div className="side-bar">
      <div>
        <NavLink activeClassName="active" className="link item-side-bar" to={ROUTES.user}>
          <div>
            <FontAwesomeIcon icon={faUserGroup} style={{ paddingRight: '5px' }} />
            User
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
            Catalog
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
