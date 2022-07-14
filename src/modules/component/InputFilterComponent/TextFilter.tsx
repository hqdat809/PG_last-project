import { IFilterUser } from 'models/user';
import React from 'react';

interface Props {
  onChangeFilter(nameFilter: string, value: any): void;
  nameFilter: string;
}

const TextFilter = (props: Props) => {
  const { onChangeFilter, nameFilter } = props;
  return (
    <input
      type="text"
      id="disabledTextInput"
      className="form-control"
      style={{ padding: '8px 10px' }}
      onChange={(e) => {
        onChangeFilter(nameFilter, e.target.value);
      }}
    />
  );
};

export default TextFilter;
