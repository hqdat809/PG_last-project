import { Col, Select, Tag, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import { IRolesUser, IUserCreate } from 'models/user';
import { UpdateUserSchema } from 'modules/auth/utils';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import * as userService from 'service/userService';
import 'modules/home/pages/UserDetail/UserDetail.scss';
import TextInput from 'modules/component/InputCreateComponent/TextInput';
import PasswordInput from 'modules/component/InputCreateComponent/PasswordInput';
import SingleSelectInput from 'modules/component/InputCreateComponent/SingleSelectInput';
import { listMemberCreate, listStatusCreate, listType } from 'modules/intl/constants';
import MultipleSelectCreate from 'modules/component/InputCreateComponent/MultipleSelectCreate';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../../redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import { ROUTES } from 'configs/routes';

interface Props {}

const UserDetail = (props: Props) => {
  const id = useParams<{ id?: string }>();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [userDetail, setUserDetail] = useState<IUserCreate>();
  const [options, setOptions] = React.useState<[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [multiRoles, setMultiRoles] = React.useState<string[] | undefined>(userDetail?.roles);

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

    setOptions(res.data.administrator);
  };

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
      setMultiRoles(res.data.info.roles);
    };
    fecthDataUser();
    fetchRole();
  }, []);

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
          taxExempt: userDetail?.taxExempt,
          paymentRailsType: userDetail?.paymentRailsType,
          roles: userDetail.roles,
          id: id.id,
          access_level: userDetail?.access_level,
          status: 'E',
          statusComment: '',
        }}
        onSubmit={async (values) => {
          values.roles = multiRoles;
          console.log(JSON.stringify({ params: [values] }));
          // await userService.updateUser({ params: [values] });
          const json = await dispatch(
            fetchThunk(
              'https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit',
              'post',
              { params: [values] },
              true,
              ''
            )
          );
          if (!json.errors) {
            toast.success('Update User Success! ');
            dispatch(push(ROUTES.home));
          } else {
            toast.error(json.errors);
          }
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
                  <Form>
                    {/* email */}
                    <div className="form-group field-create-user input-element">
                      <label>Email address</label>
                      <div className="wrapper-input-field">
                        <TextInput
                          name="email"
                          type="email"
                          error={errors.email}
                          touched={touched.email}
                          isShowError={true}
                        />
                      </div>
                    </div>
                    {/* password */}
                    <div className="form-group field-create-user input-element">
                      <label>Password</label>
                      <div className="wrapper-input-field">
                        <TextInput
                          name="password"
                          type="password"
                          error={errors.password}
                          touched={touched.password}
                          isShowError={false}
                        />
                      </div>
                    </div>
                    {/* password confirm */}
                    <div className="form-group  field-create-user input-element">
                      <label>Password Confirm: </label>
                      <div className="wrapper-input-field">
                        <TextInput
                          type="password"
                          name="confirm_password"
                          error={errors.confirm_password}
                          touched={touched.confirm_password}
                          isShowError={true}
                        />
                      </div>
                    </div>
                    {/* first name */}
                    <div className="form-group field-create-user input-element">
                      <label>First Name</label>
                      <div className="wrapper-input-field">
                        <TextInput
                          name="firstName"
                          type="text"
                          error={errors.firstName}
                          touched={touched.firstName}
                          isShowError={true}
                        />
                      </div>
                    </div>
                    {/* last name */}
                    <div className="form-group field-create-user input-element">
                      <label>Last Name</label>
                      <div className="wrapper-input-field">
                        <TextInput
                          name="lastName"
                          type="text"
                          error={errors.lastName}
                          touched={touched.lastName}
                          isShowError={true}
                        />
                      </div>
                    </div>
                    {/* rails type */}
                    <div className="form-group field-create-user" style={{ marginBottom: '20px' }}>
                      <label htmlFor="inputEmail" className="form-label">
                        Type
                      </label>
                      <SingleSelectInput name="paymentRailsType" options={listType} />
                    </div>
                    {/* member ships */}
                    <div className="form-group field-create-user " style={{ marginBottom: '20px' }}>
                      <label
                        htmlFor="inputEmail"
                        className="form-label "
                        style={{ marginRight: '10px' }}
                      >
                        Membership
                      </label>
                      <SingleSelectInput name="membership_id" options={listMemberCreate} />
                    </div>
                    {/* status */}
                    <div
                      className="form-group field-create-user"
                      style={{ marginBottom: '20px', marginLeft: '10px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Status
                      </label>
                      <SingleSelectInput name="status" options={listStatusCreate} />
                    </div>
                    {/* status comment */}
                    <div className="form-group field-create-user input-element">
                      <label>Status Comment</label>
                      <div className="wrapper-input-field">
                        <Field
                          as="textarea"
                          name="statusComment"
                          className={`form-control ${
                            errors.lastName && touched.lastName && 'error-input'
                          }`}
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                        />
                      </div>
                    </div>
                    {/* access level */}
                    <div className="form-group field-create-user" style={{ marginBottom: '20px' }}>
                      <label
                        htmlFor="inputEmail"
                        className="form-label"
                        style={{ marginRight: '10px' }}
                      >
                        Access level *
                      </label>
                      <label>{isAdmin ? 'Administrator' : 'Vendor'}</label>
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
                      <MultipleSelectCreate
                        value={multiRoles}
                        setValue={setMultiRoles}
                        options={options}
                      />
                    </div>
                    <div className="footer">
                      <button type="submit" className="btn btn-primary btn-submit-create">
                        Update account
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
};

export default UserDetail;
