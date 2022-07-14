import React from 'react';
import { Field, Form, Formik } from 'formik';

interface Props {
  error: string | undefined;
  touched: boolean | undefined;
  isShowError: boolean | undefined;
  name: string | undefined;
}

const PasswordInput = (props: Props) => {
  const { name, error, touched, isShowError } = props;

  return (
    <div>
      <Field
        type={name}
        name={name}
        className={`form-control ${isShowError && error && touched && 'error-input'}`}
        id="exampleInputPassword1"
        placeholder="Password"
      />
      {isShowError && error && touched && <div className="input-feedback">{error}</div>}
    </div>
  );
};

export default PasswordInput;
