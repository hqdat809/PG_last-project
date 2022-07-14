import React from 'react';
import { Field, Form, Formik } from 'formik';

interface Props {
  error: string | undefined;
  touched: boolean | undefined;
  isShowError: boolean | undefined;
  name: string | undefined;
  type: string | undefined;
}

const TextInput = (props: Props) => {
  const { name, error, touched, isShowError, type } = props;
  return (
    <div>
      <Field
        type={type}
        name={name}
        className={`form-control ${isShowError && error && touched && 'error-input'}`}
      />
      {isShowError && error && touched && <div className="input-feedback">{error}</div>}
    </div>
  );
};

export default TextInput;
