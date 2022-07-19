import { IFilterUser, IOptions, IOptionsHasDisabled } from 'models/user';
import React, { memo } from 'react';
import Select from 'react-select';

interface Props {
  nameFilter: string;
  roleOptions: IOptionsHasDisabled[] | undefined;
  onChangeFilter(nameFilter: string, value: any): void;
}

const MultipleSelectFilter = (props: Props) => {
  const { nameFilter, onChangeFilter, roleOptions } = props;
  console.log(nameFilter, ' is loaded...');

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
        onChangeFilter(nameFilter, selectRoles);
      }}
    />
  );
};

export default memo(MultipleSelectFilter);
