import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

InputField.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
};

interface Props {
  field: any;
  form: any;

  label: string;
  placeholder: string;
  disabled: boolean;
  type: string;
}

function InputField(props: Props) {
  const { field, type, label, placeholder, disabled } = props;
  const { name } = field;

  return (
    <FormGroup>
      <Input id={name} {...field} type={type} disabled={disabled} placeholder={placeholder} />
      <ErrorMessage name={name} />
    </FormGroup>
  );
}

export default InputField;
