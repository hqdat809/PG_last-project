import { faArrowDown, faArrowUp, faPowerOff, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'flatpickr/dist/themes/material_green.css';
import { IDeleteUSer } from 'models/user';
import 'modules/home/pages/HomePage.scss';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AppState } from '../../../redux/reducer';
import React, { useState } from 'react';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchThunk } from 'modules/common/redux/thunk';
import { getListProduct } from 'modules/auth/redux/productReducer';
import { IFilterProduct } from 'models/product';

interface Props {
  setmultiDelete(multiDelete: IDeleteUSer[]): void;
  multiDelete: IDeleteUSer[];
  handleDelete(): void;
  setFilterProduct(filterProduct: IFilterProduct): void;
  filterProduct: IFilterProduct;
}

const TableListProduct = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const listProduct = useSelector((state: AppState) => state?.productManage?.listProduct);
  const { multiDelete, setmultiDelete, handleDelete, setFilterProduct, filterProduct } = props;
  const [isIncrease, setIsIncrease] = useState(false);

  const hanldeSort = async (sortBy: string) => {
    setFilterProduct({
      ...filterProduct,
      sort: sortBy,
      order_by: `${isIncrease ? 'DESC' : 'ASC'}`,
    });
    setIsIncrease(!isIncrease);
    const json = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/api/products/list',
        'post',
        { ...filterProduct, sort: sortBy },
        true,
        ''
      )
    );
    dispatch(getListProduct(json.data));
  };

  return (
    <table className="table">
      <thead>
        <tr className="header-table">
          <th className="header-table" scope="col">
            <input type="checkbox" />
          </th>
          <th className="header-table" scope="col"></th>
          <th
            className="header-table sort"
            scope="col"
            onClick={() => {
              hanldeSort('sku');
            }}
          >
            SKU
            {filterProduct.sort === 'sku' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'sku' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th
            className="header-table sort"
            scope="col"
            onClick={async () => {
              hanldeSort('name');
            }}
          >
            Name
            {filterProduct.sort === 'name' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'name' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th scope="col" className="header-table ">
            Category
          </th>
          <th
            className="header-table sort"
            scope="col"
            onClick={async () => {
              hanldeSort('price');
            }}
          >
            Price
            {filterProduct.sort === 'price' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'price' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th
            className="header-table"
            scope="col"
            onClick={async () => {
              hanldeSort('amount');
            }}
          >
            In stock
            {filterProduct.sort === 'amount' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'amount' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th
            className="header-table"
            scope="col"
            onClick={async () => {
              hanldeSort('vendor');
            }}
          >
            Vendor
            {filterProduct.sort === 'vendor' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'vendor' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th
            className="header-table sort"
            scope="col"
            onClick={async () => {
              hanldeSort('arrivalDate');
            }}
          >
            Arrival Date
            {filterProduct.sort === 'arrivalDate' && isIncrease && (
              <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '5px' }} />
            )}
            {filterProduct.sort === 'arrivalDate' && !isIncrease && (
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '5px' }} />
            )}
          </th>
          <th className="header-table" scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {listProduct &&
          listProduct?.map((item, index) => {
            return (
              <tr className="item-table" key={index}>
                <th scope="row" className="check-box-delete">
                  <div className="wrapper-check-box-delete">
                    <input
                      type="checkbox"
                      name="check-delete"
                      className=""
                      onChange={(e) => {
                        if (e.target.checked) {
                          setmultiDelete([...multiDelete, { id: Number(item.id), delete: 1 }]);
                        } else {
                          const removeUserSelected = multiDelete.indexOf({
                            id: Number(item.id),
                            delete: 1,
                          });
                          const newArraySelected = multiDelete;
                          newArraySelected.splice(removeUserSelected, 1);
                          console.log('check new array: ', newArraySelected);
                          setmultiDelete(newArraySelected);
                        }
                      }}
                    />
                  </div>
                </th>
                <th scope="row" className="check-box-delete">
                  <div className="wrapper-check-box-delete">
                    <span className="wrapper-power-off">
                      <FontAwesomeIcon style={{ color: 'green' }} icon={faPowerOff} />
                    </span>
                  </div>
                </th>
                <td
                  onClick={() => {
                    // handleSelectUser(item);
                  }}
                >
                  {item.sku}
                </td>
                <td>
                  <NavLink
                    activeClassName="active"
                    className="link detail-user"
                    to={`/detai-product/${item.id}`}
                  >
                    {item.name}
                  </NavLink>
                </td>
                <td>{item.category}</td>
                <td>{`$${item.price}`}</td>
                <td>{item.amount}</td>
                <td>
                  <NavLink
                    activeClassName="active"
                    className="link detail-user"
                    to={`/detail-user/${item.vendorID}`}
                  >
                    {item.vendor}
                  </NavLink>
                </td>
                <td>
                  {item.arrivalDate === '0'
                    ? '--'
                    : moment(Number(item.arrivalDate) * 1000).format('DD MMM YYYY')}
                </td>
                <td>
                  <div
                    className="btn-delete"
                    onClick={() => {
                      setmultiDelete([...multiDelete, { id: Number(item.id), delete: 1 }]);
                      handleDelete();
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
  );
};

export default TableListProduct;
