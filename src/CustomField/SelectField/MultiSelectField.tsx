import 'CustomField/SelectField/MultiSelectField.scss';
import { IOptionsHasDisabled } from 'models/user';

import PropTypes from 'prop-types';
import Select from 'react-select';
import { FormGroup } from 'reactstrap';
import React from 'react';

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
  const selectedOption = options.filter(
    (item: IOptionsHasDisabled) => value.indexOf(item.value) !== -1
  );

  console.log(name, ' is loaded...');

  const handleSelectedOptionChange = (selectedOption: IOptionsHasDisabled[]) => {
    const selectedValue = selectedOption.map((item) => {
      return item.value;
    });

    const changeEvent = {
      target: {
        name: name,
        value: selectedValue,
      },
    };
    field.onChange(changeEvent);
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
          if (value.length == 0) {
            touched[name] = true;
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
