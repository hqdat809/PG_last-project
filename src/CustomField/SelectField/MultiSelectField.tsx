import { IOptions, IOptionsHasDisabled } from 'models/user';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';
import 'CustomField/SelectField/MultiSelectField.scss';
import { ErrorMessage } from 'formik';

MultiSelectField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
};

interface Props {
  field: any;
  form: any;

  label: string;
  placeholder: string;
  disabled: boolean;
  options: [];
}

MultiSelectField.defaultProps = {
  label: '',
  placeholder: '',
  disabled: false,
  options: [],
};

function MultiSelectField(props: Props) {
  const { field, options, form, label, placeholder, disabled } = props;
  const { name, value } = field;
  const { errors, touched, handleBlur } = form;
  console.log(value);
  const selectedOption = options.filter(
    (item: IOptionsHasDisabled) => value.indexOf(item.value) !== -1
  );

  console.log('selec options: ', selectedOption);
  console.log('value: ', options);

  const handleSelectedOptionChange = (selectedOption: IOptionsHasDisabled[]) => {
    const selectedValue = selectedOption.map((item) => {
      return item.value;
    });
    console.log(selectedOption);

    const changeEvent = {
      target: {
        name: name,
        value: selectedValue,
      },
    };
    field.onChange(changeEvent);
    console.log(selectedValue);
  };

  return (
    <FormGroup>
      <Select
        isMulti
        className={`react-select-container is-invalid`}
        classNamePrefix="react-select"
        id={name}
        {...field}
        value={selectedOption}
        onChange={handleSelectedOptionChange}
        placeholder={placeholder}
        isDisabled={disabled}
        onBlur={(e) => {
          console.log(value);
          if (value.length == 0) {
            touched[name] = true;
            console.log(touched[name]);
            console.log(errors[name]);
          }
          handleBlur(e);
        }}
        options={options}
      />
      {/* <ErrorMessage name={name} /> */}
      {errors[name]}
    </FormGroup>
  );
}

export default MultiSelectField;
