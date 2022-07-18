import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_PATHS } from 'configs/api';
import { ROUTES } from 'configs/routes';
import { push } from 'connected-react-router';
import InputField from 'CustomField/InputField/InputField';
import MultiSelectField from 'CustomField/SelectField/MultiSelectField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import { FastField, Form, Formik } from 'formik';
import { IUserDetail } from 'models/user';
import { UpdateUserSchema } from 'modules/auth/utils';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import 'modules/home/UserDetail/UserDetail.scss';
import { listMemberCreate, listStatusCreate, listType } from 'modules/intl/constants';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';

interface Props {}

const UserDetail = (props: Props) => {
  const id = useParams<{ id?: string }>();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const listRole = useSelector((state: AppState) => state.userManage.listRole);

  const [userDetail, setUserDetail] = useState<IUserDetail>();
  const [options, setOptions] = React.useState<[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fecthDataUser = async () => {
      const res = await dispatch(
        fetchThunk(
          'https://api.gearfocus.div4.pgtest.co/apiVendor/profile/detail',
          'post',
          id,
          true,
          ''
        )
      );
      setUserDetail(res.data.info);
    };
    fecthDataUser();
  }, []);

  const handleClickBackSite = () => {
    dispatch(push(ROUTES.home));
  };

  if (!userDetail) {
    return <></>;
  } else {
    return (
      <Formik
        initialValues={{
          email: userDetail?.email,
          firstName: userDetail?.firstName,
          lastName: userDetail?.lastName,
          password: '',
          confirm_password: '',
          membership_id: userDetail?.membership_id,
          forceChangePassword: userDetail?.forceChangePassword,
          taxExempt: !!Number(userDetail?.taxExempt),
          paymentRailsType: userDetail?.paymentRailsType,
          roles: userDetail.roles,
          id: id.id,
          access_level: userDetail?.access_level,
          status: 'E',
          statusComment: userDetail?.statusComment,
        }}
        onSubmit={async (values) => {
          setIsLoading(true);
          const json = await dispatch(
            fetchThunk(API_PATHS.editUser, 'post', { params: [values] }, true, '')
          );
          if (!json.errors) {
            toast.success('Update User Success! ');
            dispatch(push(ROUTES.home));
          } else {
            toast.error(json.errors);
          }
          setIsLoading(false);
        }}
        validationSchema={UpdateUserSchema}
      >
        {({ errors, touched, values }) => {
          useEffect(() => {
            if (values.access_level === '100') {
              setIsAdmin(true);
            } else setIsAdmin(false);
          }, [values.access_level]);

          return (
            <div id="create-user-page">
              <div className="wrapper-content">
                <div className="content-create-user">
                  <div className="user-detail">
                    <div className="wrapper-btn-back">
                      <button
                        className="btn-back"
                        onClick={(e) => {
                          handleClickBackSite();
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowLeftLong} style={{ color: '#000' }} />
                      </button>
                    </div>
                    <div className="title-page">
                      <h1
                        style={{ color: '#fff' }}
                      >{`${userDetail.email} (${userDetail.companyName})`}</h1>
                    </div>
                    <div className="title-content">
                      <h3 style={{ color: '#fff' }}>Account detail</h3>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Orders placed as a buyer</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>
                          <a style={{ color: 'blue' }}>{userDetail.order_as_buyer}</a> ($0.00)
                        </h6>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Vendor Income</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>{`$${userDetail.income}`}</h6>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Vendor Expense</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>{`$${userDetail.expense}`}</h6>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Earning balance</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>{`$${userDetail.earning}`}</h6>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Products listed as vendor</label>
                      <div className="wrapper-input-field">
                        <a style={{ color: 'blue' }}>{`${userDetail.products_total}`}</a>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Joined</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>
                          {moment(Number(userDetail.joined) * 1000).format('DD MMM YYYY')}
                        </h6>
                      </div>
                    </div>
                    <div className="form-group field-create-user detail-element">
                      <label>Last login</label>
                      <div className="wrapper-input-field">
                        <h6 style={{ color: '#fff' }}>
                          {moment(Number(userDetail.last_login) * 1000).format('DD MMM YYYY')}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <Form>
                    <div className="email-password-content">
                      <div className="title-content">
                        <h3 style={{ color: '#fff' }}>Email & password</h3>
                      </div>
                      {/* email */}
                      <div className="form-group field-create-user input-element">
                        <label>
                          Email address
                          <p style={{ color: 'red' }}>*</p>
                        </label>

                        <div className="wrapper-input-field">
                          <FastField
                            name="email"
                            component={InputField}
                            label=""
                            placeholder="Email..."
                            type="text"
                          />
                        </div>
                      </div>
                      {/* password */}
                      <div className="form-group field-create-user input-element">
                        <label>
                          Password<p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="password"
                            component={InputField}
                            label=""
                            placeholder="Password..."
                            type="password"
                          />
                        </div>
                      </div>
                      {/* password confirm */}
                      <div className="form-group field-create-user input-element">
                        <label>
                          Password Confirm<p style={{ color: 'red' }}>*</p>{' '}
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="confirm_password"
                            component={InputField}
                            label=""
                            placeholder="Repeat password..."
                            type="password"
                          />
                        </div>
                      </div>
                      {/* first name */}
                      <div className="form-group field-create-user input-element">
                        <label>
                          First Name<p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="firstName"
                            component={InputField}
                            label=""
                            placeholder="Enter your first name..."
                            type="text"
                          />
                        </div>
                      </div>
                      {/* last name */}
                      <div className="form-group field-create-user input-element">
                        <label>
                          Last Name <p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="lastName"
                            component={InputField}
                            label=""
                            placeholder="Enter your last name..."
                            type="text"
                          />
                        </div>
                      </div>
                      {/* rails type */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Type
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="paymentRailsType"
                            component={SingleSelectField}
                            label=""
                            placeholder="Type..."
                            options={listType}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="access-information">
                      <div className="title-content">
                        <h3 style={{ color: '#fff' }}>Access Information</h3>
                      </div>
                      {/* access level */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label
                          htmlFor="inputEmail"
                          className="form-label"
                          style={{ marginRight: '10px' }}
                        >
                          Access level *
                        </label>
                        <div className="wrapper-input-field">
                          <h6 style={{ color: '#fff' }}>{isAdmin ? 'Administrator' : 'Vendor'}</h6>
                        </div>
                      </div>
                      {/* roles */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                        hidden={!isAdmin}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Roles
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="roles"
                            component={MultiSelectField}
                            label=""
                            placeholder="Chose roles..."
                            options={listRole}
                          />
                          {console.log(userDetail.roles)}
                        </div>
                      </div>
                      {/* member ships */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Membership
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="membership_id"
                            component={SingleSelectField}
                            label=""
                            placeholder="Member..."
                            options={listMemberCreate}
                          />
                        </div>
                      </div>
                      {/* status comment */}
                      <div className="form-group field-create-user input-element">
                        <label>Status Comment</label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="statusComment"
                            component={InputField}
                            label=""
                            placeholder="Status comment..."
                            type="textarea"
                          />
                        </div>
                      </div>
                      {/* status */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Status
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="status"
                            component={SingleSelectField}
                            label=""
                            placeholder="Access level..."
                            options={listStatusCreate}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="tax-information">
                      <div className="title-content">
                        <h3 style={{ color: '#fff' }}>Tax Information</h3>
                      </div>
                      {/* tax exempt */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Tax exempt
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="taxExempt"
                            component={InputField}
                            label=""
                            placeholder=""
                            type="checkbox"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="footer">
                      <button type="submit" className="btn btn-primary btn-submit-create">
                        Update account
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
              {isLoading && <LoadingPage />}
            </div>
          );
        }}
      </Formik>
    );
  }
};

export default UserDetail;
