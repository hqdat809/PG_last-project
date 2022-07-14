import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'flatpickr/dist/themes/material_green.css';
import { ICountry, ICountrySelect, IFilterUser, IRolesUser } from 'models/user';
import MultipleSelectFilter from 'modules/component/InputFilterComponent/MultipleSelectFilter';
import SingleSelectFilter from 'modules/component/InputFilterComponent/SingleSelectFilter';
import TextFilter from 'modules/component/InputFilterComponent/TextFilter';
import UserActivityRadio from 'modules/component/InputFilterComponent/UserActivityRadio';
import 'modules/home/pages/HomePage.scss';
import { listMemberShip, listStatus } from 'modules/intl/constants';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userService from 'service/userService';
import { boolean } from 'yup';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import { setListCountry, setListRole } from 'modules/auth/redux/userReducer';

interface Props {
  handleFilter(): void;
  setFilterUser(filterUser: IFilterUser): void;
  filterUser: IFilterUser;
}

const FormFilter = (props: Props) => {
  const { handleFilter, setFilterUser, filterUser } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const countryOptions = useSelector((state: AppState) => state.userManage.listCountry);
  const roleOptions = useSelector((state: AppState) => state.userManage.listRole);

  const [isHiddenForm, setIsHiddenForm] = React.useState(false);

  const fetchRole = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/role',
        'get',
        undefined,
        true,
        ''
      )
    );
    const administratorRoles = res.data.administrator;
    const customerRoles = res.data.customer;
    const allRole = administratorRoles.concat(customerRoles);
    const roleOptionSelect = allRole.map((item: IRolesUser) => {
      return { value: item.id, label: item.name, disable: false };
    });
    dispatch(setListRole(roleOptionSelect));
    // setRoleOptions(roleOptionSelect);
    console.log('res fetch role: ', res);
  };

  const fetchCountry = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country',
        'get',
        undefined,
        true,
        ''
      )
    );

    const selectCountry = res.data.map((item: ICountry) => {
      return { value: item.code, label: item.country, disabled: false };
    });

    selectCountry.unshift({ value: '', label: 'All country', disabled: false });

    dispatch(setListCountry(selectCountry));

    console.log('res fetch country: ', res);
  };

  const onChangeFilter = (nameFilter: string, value: any) => {
    setFilterUser({ ...filterUser, [nameFilter]: value });
  };

  useEffect(() => {
    fetchRole();
    fetchCountry();
  }, []);

  return (
    <form
      style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        handleFilter();
      }}
    >
      <fieldset className="form-filter" style={{ width: '100%' }}>
        <div className="form-filter-show">
          {/* search keywords */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label className="form-label">Search keywords</label>
            <TextFilter onChangeFilter={onChangeFilter} nameFilter="search" />
          </div>
          {/* search user types */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label className="form-label">User types</label>
            <MultipleSelectFilter
              roleOptions={roleOptions}
              nameFilter="types"
              onChangeFilter={onChangeFilter}
            />
          </div>
          {/* search status */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="inputEmail" className="form-label">
              Status
            </label>
            <div className="">
              <SingleSelectFilter
                onChangeFilter={onChangeFilter}
                options={listStatus}
                nameFilter="status"
                typeConvertValue="array"
              />
            </div>
          </div>
          {/* search member ships */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="inputEmail" className="form-label">
              Member Ships
            </label>
            <div className="">
              <SingleSelectFilter
                onChangeFilter={onChangeFilter}
                options={listMemberShip}
                nameFilter="memberships"
                typeConvertValue="array"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-search">
            Search
          </button>
        </div>
        {/* hidden form */}
        <div className={`form-filter-hidden ${isHiddenForm ? '' : 'show'}`}>
          <div className={`left-filter-form ${isHiddenForm ? '' : 'show'}`}>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Availability
              </label>
              <div className="wraper-input-filter">
                <SingleSelectFilter
                  onChangeFilter={onChangeFilter}
                  options={countryOptions ? countryOptions : []}
                  nameFilter="country"
                  typeConvertValue="array"
                />
              </div>
            </div>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                State
              </label>
              <div className="wraper-input-filter">
                <TextFilter onChangeFilter={onChangeFilter} nameFilter="state" />
              </div>
            </div>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Address
              </label>
              <div className="wraper-input-filter">
                <TextFilter onChangeFilter={onChangeFilter} nameFilter="address" />
              </div>
            </div>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Phone
              </label>
              <div className="wraper-input-filter">
                <TextFilter onChangeFilter={onChangeFilter} nameFilter="phone" />
              </div>
            </div>
          </div>
          <div className={`right-filter-form ${isHiddenForm ? '' : 'show'}`}>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                User activity
              </label>
              <div className="wraper-input-filter" style={{ display: 'flex', gap: '20px' }}>
                <UserActivityRadio setFilterUser={setFilterUser} filterUser={filterUser} />
              </div>
            </div>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label"></label>
              <div className="wraper-input-filter">
                <input
                  type="text"
                  id="disabledTextInput"
                  className="form-control date-selector"
                  style={{ paddingBottom: '11px' }}
                  onChange={(e) => {
                    // console.log(e.selectedDates);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <span
          className="sortcut-form"
          onClick={() => {
            setIsHiddenForm(!isHiddenForm);
          }}
        >
          {isHiddenForm ? (
            <FontAwesomeIcon icon={faAngleDoubleDown} />
          ) : (
            <FontAwesomeIcon icon={faAngleDoubleUp} />
          )}
        </span>
      </fieldset>
    </form>
  );
};

export default FormFilter;
