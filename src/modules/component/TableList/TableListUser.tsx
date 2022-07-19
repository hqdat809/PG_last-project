import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'flatpickr/dist/themes/material_green.css';
import { IDeleteUSer, IFilterUser, IGetUser } from 'models/user';
import 'modules/home/pages/HomePage.scss';
import { AppState } from 'redux/reducer';
import { getListUser } from 'modules/auth/redux/userReducer';
import { fetchThunk } from 'modules/common/redux/thunk';

interface Props {
  setmultiDelete(multiDelete: IDeleteUSer[]): void;
  multiDelete: IDeleteUSer[];
  handleDelete(item: IGetUser): void;
  setFilterUser(filterUser: IFilterUser): void;
  filterUser: IFilterUser;
}

const TableListUser = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const listUser = useSelector((state: AppState) => state?.userManage?.listUser);
  const { multiDelete, setmultiDelete, handleDelete, setFilterUser, filterUser } = props;
  const [isIncrease, setIsIncrease] = useState(false);

  const hanldeSort = async (sortBy: string) => {
    setFilterUser({
      ...filterUser,
      sort: sortBy,
      order_by: `${isIncrease ? 'ASC' : 'DESC'}`,
    });
    setIsIncrease(!isIncrease);
    const json = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list',
        'post',
        { ...filterUser, sort: sortBy },
        true,
        ''
      )
    );
    dispatch(getListUser(json.data));
  };

  return (
    <div className="wrapper-table">
      <table className="table">
        <thead>
          <tr className="header-table">
            <th className="header-table" scope="col">
              <input type="checkbox" />
            </th>
            <th
              className="header-table sort"
              scope="col"
              onClick={() => {
                hanldeSort('vendor');
              }}
            >
              Login/Email
              {filterUser.sort === 'vendor' && isIncrease && (
                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
              )}
              {filterUser.sort === 'vendor' && !isIncrease && (
                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
              )}
            </th>
            <th
              className="header-table sort"
              scope="col"
              onClick={async () => {
                hanldeSort('fistName');
              }}
            >
              Name
              {filterUser.sort === 'fistName' && isIncrease && (
                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
              )}
              {filterUser.sort === 'fistName' && !isIncrease && (
                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
              )}
            </th>
            <th
              scope="col"
              className="header-table sort"
              onClick={async () => {
                hanldeSort('access_level');
              }}
            >
              Access level
              {filterUser.sort === 'access_level' && isIncrease && (
                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
              )}
              {filterUser.sort === 'access_level' && !isIncrease && (
                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
              )}
            </th>
            <th className="header-table" scope="col">
              Product
            </th>
            <th className="header-table" scope="col">
              Orders
            </th>
            <th className="header-table" scope="col">
              Wishlist
            </th>
            <th
              className="header-table sort"
              scope="col"
              onClick={async () => {
                hanldeSort('created');
              }}
            >
              Created
              {filterUser.sort === 'created' && isIncrease && (
                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
              )}
              {filterUser.sort === 'created' && !isIncrease && (
                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
              )}
            </th>
            <th
              className="header-table sort"
              scope="col"
              onClick={async () => {
                hanldeSort('last_login');
              }}
            >
              Last Login
              {filterUser.sort === 'last_login' && isIncrease && (
                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
              )}
              {filterUser.sort === 'last_login' && !isIncrease && (
                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
              )}
            </th>
            <th className="header-table" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {listUser?.map((item) => {
            return (
              <tr className="item-table" key={item.vendor_id}>
                <th scope="row" className="check-box-delete">
                  <div className="wrapper-check-box-delete">
                    <input
                      type="checkbox"
                      name="check-delete"
                      className=""
                      onChange={(e) => {
                        if (e.target.checked) {
                          setmultiDelete([
                            ...multiDelete,
                            { id: Number(item.profile_id), delete: 1 },
                          ]);
                        } else {
                          const removeUserSelected = multiDelete.indexOf({
                            id: Number(item.profile_id),
                            delete: 1,
                          });
                          const newArraySelected = multiDelete;
                          newArraySelected.splice(removeUserSelected, 1);
                          setmultiDelete(newArraySelected);
                        }
                      }}
                    />
                  </div>
                </th>
                <td
                  onClick={() => {
                    // handleSelectUser(item);
                  }}
                >
                  <NavLink
                    activeClassName="active"
                    className="link detail-user"
                    to={`/detail-user/${item.profile_id}`}
                  >
                    {item.vendor}
                  </NavLink>
                  <div>{item.storeName}</div>
                </td>
                <td>{item.fistName && item.lastName && `${item.fistName} ${item.lastName}`}</td>
                <td>{item.access_level}</td>
                <td>{item.product}</td>
                <td>{item.order.order_as_buyer}</td>
                <td>{item.wishlist}</td>
                <td>{moment(Number(item.created) * 1000).format('DD MMM YYYY')}</td>
                <td>{moment(Number(item.last_login) * 1000).format('DD MMM YYYY')}</td>
                <td>
                  <div
                    className="btn-delete"
                    onClick={() => {
                      setmultiDelete([...multiDelete, { id: Number(item.profile_id), delete: 1 }]);
                      handleDelete(item);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableListUser;
