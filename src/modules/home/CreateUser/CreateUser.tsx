import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { API_PATHS } from 'configs/api';
import { ROUTES } from 'configs/routes';
import InputField from 'CustomField/InputField/InputField';
import MultiSelectField from 'CustomField/SelectField/MultiSelectField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import { CreateUserSchema } from 'modules/auth/utils';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import 'modules/home/CreateUser/CreateUser.scss';
import { listAccessLevel, listMemberCreate, listType } from 'modules/intl/constants';
import { AppState } from 'redux/reducer';

interface Props {}

const CreateUser = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const listRole = useSelector((state: AppState) => state.userManage.listRole);

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClickBackSite = () => {
    dispatch(push(ROUTES.user));
  };

  return (
    <Formik
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirm_password: '',
        membership_id: '',
        forceChangePassword: 0,
        taxExempt: false,
        paymentRailsType: 'individual',
        roles: [],
        access_level: '10',
      }}
      onSubmit={async (values) => {
        setIsLoading(true);
        const json = await dispatch(fetchThunk(API_PATHS.createUser, 'post', values, true, ''));
        if (!json.errors) {
          toast.success('Create User Success! ');
          dispatch(push(ROUTES.user));
        } else {
          toast.error(json.errors);
        }
        setIsLoading(false);
      }}
      validationSchema={CreateUserSchema}
    >
      {({ values, dirty }) => {
        console.log(dirty);
        useEffect(() => {
          if (values.access_level === '100') {
            setIsAdmin(true);
          } else setIsAdmin(false);
        }, [values.access_level]);
        return (
          <>
            <div id="create-user-page">
              <div className="wrapper-content">
                <div className="content-create-user">
                  <Form>
                    <div className="email-password-content">
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
                        <h1 style={{ color: '#fff' }}>Add User</h1>
                      </div>
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
                      {/* membership_id */}
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
                      {/* access level */}
                      <div
                        className="form-group field-create-user"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Access level
                          <p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <FastField
                            name="access_level"
                            component={SingleSelectField}
                            label=""
                            placeholder="Access level..."
                            options={listAccessLevel}
                          />
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
                      <button
                        type="submit"
                        className="btn btn-primary btn-submit-create"
                        disabled={!dirty}
                      >
                        Create account
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            {isLoading && <LoadingPage />}
          </>
        );
      }}
    </Formik>
  );
};

export default CreateUser;
