import { IFilterUser, IOptionsHasDisabled } from 'models/user';
import React from 'react';
import Select from 'react-select';

interface Props {
  nameFilter: string;
  options: IOptionsHasDisabled[];
  onChangeFilter(nameFilter: string, value: any): void;
  typeConvertValue: string;
}

const SingleSelectFilter = (props: Props) => {
  const { options, onChangeFilter, nameFilter, typeConvertValue } = props;

  return (
    <Select
      defaultValue={options[0]}
      options={options}
      className="react-select-container"
      classNamePrefix="react-select"
      isOptionDisabled={(option) => option.disabled}
      onChange={(e) => {
        if (e) {
          if (typeConvertValue === 'array') {
            if (!e.value) {
              console.log(e.value);
              onChangeFilter(nameFilter, []);
            } else {
              onChangeFilter(nameFilter, [e.value]);
            }
          } else if (typeConvertValue === 'string') {
            onChangeFilter(nameFilter, e.value);
          }
        }
      }}
    />
  );
};

export default SingleSelectFilter;
