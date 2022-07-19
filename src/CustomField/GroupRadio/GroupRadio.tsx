import { ErrorMessage, Field } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

GroupRadio.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

GroupRadio.defaultProps = {
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

function GroupRadio(props: Props) {
  const { field, type, label, placeholder, disabled } = props;
  const { name } = field;

  console.log(name, ' is reloaded...');

  return (
    <div role="group" aria-labelledby="my-radio-group">
      <label style={{ marginRight: '15px' }}>
        <Field type="radio" name={name} value="R" />
        Register
      </label>
      <label>
        <Field type="radio" name={name} value="L" />
        Last logged in
      </label>
    </div>
    // <FormGroup>
    //   <Input id={name} {...field} type={type} disabled={disabled} placeholder={placeholder} />
    //   <ErrorMessage name={name} />
    // </FormGroup>
  );
}

export default GroupRadio;
