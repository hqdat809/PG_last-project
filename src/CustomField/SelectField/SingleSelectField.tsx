import { IOptions } from 'models/user';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import 'CustomField/SelectField/SelectField.scss';
import { ErrorMessage } from 'formik';

interface Props {
  field: any;
  form: any;

  label: string;
  placeholder: string;
  disabled: boolean;
  options: any[];
}

SingleSelectField.defaultProps = {
  label: '',
  placeholder: '',
  disabled: false,
  options: [],
};

function SingleSelectField(props: Props) {
  const { field, options, label, placeholder, disabled, form } = props;
  const { name, value } = field;
  const { errors, touched, handleBlur } = form;
  const showError = errors[name] && touched[name];
  const selectedOption = options.find((option: IOptions) => option.value === value);

  const handleSelectedOptionChange = (selectedOption: IOptions) => {
    const selectedValue = selectedOption ? selectedOption.value : selectedOption;

    const changeEvent = {
      target: {
        name: name,
        value: selectedValue,
      },
    };
    field.onChange(changeEvent);
  };

  if (options.length !== 0) {
    return (
      <FormGroup>
        <Select
          id={name}
          {...field}
          value={selectedOption}
          defaultValue={options[0]}
          onChange={handleSelectedOptionChange}
          classNamePrefix="react-select"
          isDisabled={disabled}
          onBlur={(e) => {
            if (value === '') {
              touched[name] = true;
              console.log(touched[name]);
              console.log(errors[name]);
            }
            handleBlur(e);
          }}
          placeholder={placeholder}
          options={options}
          className={`react-select-container is-invalid`}
        />
        {/* <ErrorMessage name={name} /> */}
        {errors[name]}
      </FormGroup>
    );
  } else {
    return <></>;
  }
}

export default SingleSelectField;
