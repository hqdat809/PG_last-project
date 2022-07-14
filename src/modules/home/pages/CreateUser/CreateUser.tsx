import { Field, Form, Formik } from 'formik';
import { CreateUserSchema } from 'modules/auth/utils';
import React, { useEffect } from 'react';
import * as userService from 'service/userService';
import 'modules/home/pages/CreateUser/CreateUser.scss';
import TextInput from 'modules/component/InputCreateComponent/TextInput';
import SingleSelectInput from 'modules/component/InputCreateComponent/SingleSelectInput';
import { listAccessLevel, listMemberCreate, listType } from 'modules/intl/constants';
import MultipleSelectCreate from 'modules/component/InputCreateComponent/MultipleSelectCreate';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../../redux/reducer';
import { push } from 'connected-react-router';
import { ROUTES } from 'configs/routes';
import { toast } from 'react-toastify';
import { fetchThunk } from 'modules/common/redux/thunk';
import { IRolesUser } from 'models/user';

interface Props {}

const CreateUser = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [multiRoles, setMultiRoles] = React.useState([]);
  const [options, setOptions] = React.useState<[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

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

    console.log('res fetch role: ', res);
  };

  useEffect(() => {
    // const options = userService.getRole().then((values: any) => {
    //   const administratorRoles = values.data.administrator;
    //   return setOptions(values.data.administrator);
    // });
    fetchRole();
  }, []);

  console.log(options);

  console.log(multiRoles);

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
        values.roles = multiRoles;
        // const json = await userService.createUser(values).then((values: any) => values);
        const json = await dispatch(
          fetchThunk(
            'https://api.gearfocus.div4.pgtest.co/apiAdmin/users/create',
            'post',
            values,
            true,
            ''
          )
        );
        if (!json.errors) {
          toast.success('Create User Success! ');
          dispatch(push(ROUTES.home));
        } else {
          toast.error(json.errors);
        }
      }}
      validationSchema={CreateUserSchema}
    >
      {({ errors, touched, values, handleChange }) => {
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
                        type="email"
                        name="email"
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
                        type="password"
                        name="password"
                        error={errors.password}
                        touched={touched.password}
                        isShowError={true}
                      />
                    </div>
                  </div>
                  {/* password confirm */}
                  <div className="form-group field-create-user input-element">
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
                  {/* membership_id */}
                  <div className="form-group field-create-user" style={{ marginBottom: '20px' }}>
                    <label htmlFor="inputEmail" className="form-label">
                      Membership
                    </label>
                    <SingleSelectInput name="membership_id" options={listMemberCreate} />
                  </div>
                  {/* access level */}
                  <div className="form-group field-create-user" style={{ marginBottom: '20px' }}>
                    <label htmlFor="inputEmail" className="form-label">
                      Access level *
                    </label>
                    <SingleSelectInput name="access_level" options={listAccessLevel} />
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
                  {/* tax exempt */}
                  <div className="form-group field-create-user" style={{ marginBottom: '20px' }}>
                    <label htmlFor="inputEmail" className="form-label">
                      Tax exempt
                    </label>
                    <Field type="checkbox" name="taxExempt" className="tax-check" />
                  </div>
                  <div className="footer">
                    <button type="submit" className="btn btn-primary btn-submit-create">
                      Create account
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
};

export default CreateUser;
