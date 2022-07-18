import { IFilterUser, IOptions, IOptionsHasDisabled } from 'models/user';
import React from 'react';
import Select from 'react-select';

interface Props {
  nameFilter: string;
  roleOptions: IOptionsHasDisabled[] | undefined;
  onChangeFilter(nameFilter: string, value: any): void;
}

const MultipleSelectFilter = (props: Props) => {
  const { nameFilter, onChangeFilter, roleOptions } = props;

  return (
    <Select
      isMulti
      options={roleOptions}
      className="react-select-container"
      classNamePrefix="react-select"
      placeholder="All user types..."
      onChange={(e) => {
        const selectRoles = e.map((item: IOptionsHasDisabled) => {
          return item.value;
        });
        console.log(selectRoles);
        onChangeFilter(nameFilter, selectRoles);
      }}
    />
  );
};

export default MultipleSelectFilter;
