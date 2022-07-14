import React from 'react';
import { Col, Select, Tag, Typography } from 'antd';
import { ICategory, IRolesUser } from 'models/user';

interface Props {
  value: string[] | undefined;
  setValue(e: any): void;
  options: IRolesUser[] | ICategory[];
}

const MultipleSelectCreate = (props: Props) => {
  const { value, setValue, options } = props;

  console.log(options);

  return (
    <div style={{ minWidth: '412px' }}>
      <Col sm={24}>
        <Select
          mode="multiple"
          allowClear
          placeholder="Please select"
          style={{ width: '100%' }}
          value={value}
          onChange={(e) => {
            setValue(e);
          }}
        >
          {options.map((item: IRolesUser, index) => (
            <Select.Option key={index} value={item.id} label="High">
              <Tag color="gray">{item.name}</Tag>
            </Select.Option>
          ))}
        </Select>
      </Col>
    </div>
  );
};

export default MultipleSelectCreate;
