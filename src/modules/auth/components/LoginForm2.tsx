import { Field, Form, Formik } from 'formik';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ILoginParams } from 'models/auth';
import EmailField from 'modules/component/EmailField';
import PasswordField from 'modules/component/PasswordField';
import { SignupSchema } from 'modules/auth/utils';

interface Props {
  onLogin(values: ILoginParams): void;
  loading: boolean;
  errorMessage: string;
}

const LoginForm = (props: Props) => {
  const { onLogin, loading, errorMessage } = props;

  return (
    <>
      <div></div>
      <Formik
        initialValues={{ email: '', password: '', rememberMe: false }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            onLogin(values);
          }, 500);
        }}
        validationSchema={SignupSchema}
      >
        {({ touched, errors }) => {
          return (
            <Form className="row g-3 needs-validation form-login">
              {!!errorMessage && (
                <div className="alert alert-danger" role="alert" style={{ width: '100%' }}>
                  {errorMessage}
                </div>
              )}
              <EmailField error={errors.email} isToached={touched.email} />
              <PasswordField error={errors.password} isToached={touched.password} />

              <div>
                <Field
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  className="form-check-input"
                />
                <label className="form-check-label" htmlFor="invalidCheck">
                  <FormattedMessage id="rememberMe" />
                </label>
              </div>
              <div className="row justify-content-md-center" style={{ margin: '16px 0' }}>
                <div className="col-md-auto">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    <FormattedMessage id="login" />
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default LoginForm;
