import React from 'react';

import { Field, Form, Formik } from 'formik';
import { IOptions } from 'models/user';

interface Props {
  name: string | undefined;
  options: IOptions[];
}

const SingleSelectInput = (props: Props) => {
  const { name, options } = props;

  return (
    <Field as="select" className="form-control create-user-select" name={name}>
      {options?.map((item, index) => (
        <option key={index} value={item.value} style={{ padding: '10px 20px' }}>
          {item.label}
        </option>
      ))}
    </Field>
  );
};

export default SingleSelectInput;
