import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'flatpickr/dist/themes/material_green.css';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducer';

import { API_PATHS } from 'configs/api';
import GroupRadio from 'CustomField/GroupRadio/GroupRadio';
import InputField from 'CustomField/InputField/InputField';
import MultiSelectField from 'CustomField/SelectField/MultiSelectField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import flatpickr from 'flatpickr';
import { FastField, Form, Formik } from 'formik';
import { ICountry, IFilterUser, IRolesUser } from 'models/user';
import { setListCountry, setListRole } from 'modules/home/redux/userReducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import 'modules/component/FormFilter/FormFilter.scss';
import { listMemberShip, listStatus } from 'modules/intl/constants';
import moment from 'moment';

interface Props {
  handleFilter(values: IFilterUser): void;
}

const FormFilter = (props: Props) => {
  const { handleFilter } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const countryOptions = useSelector((state: AppState) => state.userManage.listCountry);
  const roleOptions = useSelector((state: AppState) => state.userManage.listRole);

  const [isHiddenForm, setIsHiddenForm] = React.useState(false);

  return (
    <>
      <Formik
        initialValues={{
          address: '',
          count: 25,
          country: '',
          date_range: new Array(),
          date_type: 'R',
          memberships: [],
          order_by: 'DESC',
          page: 1,
          phone: '',
          search: '',
          sort: 'last_login',
          state: '',
          status: [],
          types: [],
          tz: 7,
        }}
        onSubmit={async (values) => {
          handleFilter(values);
        }}
      >
        {({ values }) => {
          flatpickr('.date-selector', {
            altInput: true,
            altFormat: 'M d Y',
            dateFormat: 'Y-m-d',
            mode: 'range',
            conjunction: ' - ',
            onChange: function (selectedDates, dateStr, instance) {
              const formatSelectedDate = selectedDates.map((item) => {
                return moment(item).format('YYYY-MM-DD');
              });
              values.date_range = formatSelectedDate;
            },
          });

          return (
            <Form style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <fieldset className="form-filter" style={{ width: '100%' }}>
                <div className="form-filter-show">
                  {/* search keywords */}
                  <div className="mb-3" style={{ width: '100%' }}>
                    <label className="form-label">Search keywords</label>
                    <FastField
                      name="search"
                      component={InputField}
                      label=""
                      placeholder="Search..."
                      type="text"
                    />
                  </div>
                  {/* search user types */}
                  <div className="mb-3" style={{ width: '100%' }}>
                    <label className="form-label">User type</label>
                    <FastField
                      name="types"
                      component={MultiSelectField}
                      label=""
                      placeholder="Chose roles..."
                      options={roleOptions}
                    />
                  </div>
                  {/* search status */}
                  <div className="mb-3" style={{ width: '100%' }}>
                    <label htmlFor="inputEmail" className="form-label">
                      Status
                    </label>
                    <FastField
                      name="status"
                      component={SingleSelectField}
                      label=""
                      placeholder="Status..."
                      options={listStatus}
                    />
                  </div>
                  {/* search member ships */}
                  <div className="mb-3" style={{ width: '100%' }}>
                    <label htmlFor="inputEmail" className="form-label">
                      Member Ships
                    </label>
                    <FastField
                      name="memberships"
                      component={MultiSelectField}
                      label=""
                      placeholder="Any member ship..."
                      options={listMemberShip}
                    />
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
                        <FastField
                          name="country"
                          component={SingleSelectField}
                          label=""
                          placeholder="Type..."
                          options={countryOptions}
                        />
                      </div>
                    </div>
                    <div className="item-filter">
                      <label htmlFor="inputEmail" className="form-label">
                        State
                      </label>
                      <div className="wraper-input-filter">
                        <FastField
                          name="state"
                          component={InputField}
                          label=""
                          placeholder="State..."
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="item-filter">
                      <label htmlFor="inputEmail" className="form-label">
                        Address
                      </label>
                      <div className="wraper-input-filter">
                        <FastField
                          name="address"
                          component={InputField}
                          label=""
                          placeholder="Address..."
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="item-filter">
                      <label htmlFor="inputEmail" className="form-label">
                        Phone
                      </label>
                      <div className="wraper-input-filter">
                        <FastField
                          name="phone"
                          component={InputField}
                          label=""
                          placeholder="Phone..."
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`right-filter-form ${isHiddenForm ? '' : 'show'}`}>
                    {/* User activity */}
                    <div className="item-filter">
                      <label htmlFor="inputEmail" className="form-label">
                        User activity
                      </label>
                      <div className="wraper-input-filter" style={{ display: 'flex', gap: '20px' }}>
                        <FastField
                          name="date_type"
                          component={GroupRadio}
                          label=""
                          placeholder=""
                          type="radio"
                        />
                      </div>
                    </div>
                    {/* Date selector */}
                    <div className="item-filter">
                      <label htmlFor="inputEmail" className="form-label"></label>
                      <div className="wraper-input-filter">
                        <input
                          type="text"
                          id="disabledTextInput"
                          className="form-control date-selector"
                          placeholder="Enter date range"
                          style={{ paddingBottom: '11px' }}
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
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default memo(FormFilter);
