import { IVendorList } from 'models/product';
import { IFilterUser, IOptionsHasDisabled } from 'models/user';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { values } from 'lodash';
import useDebounce from 'hooks/useDebounce';
import 'modules/component/InputCreateComponent/AutocompleteField.scss';
import { Field } from 'formik';
import { AppState } from 'redux/reducer';

interface Props {
  handleSetValue(value: string): void;
  name: string;
  defaultIdVendor: string | undefined;
}

const AutocompleteField = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const listVendorFromRedux = useSelector((state: AppState) => state.userManage.listUser);
  const { handleSetValue, name, defaultIdVendor } = props;

  const [search, setSearch] = useState<string | undefined>();
  const [listVendor, setListVendor] = useState<IOptionsHasDisabled[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isNoData, setIsNoData] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const loadSearchVendor = async () => {
    const res = await dispatch(
      fetchThunk(
        `https://api.gearfocus.div4.pgtest.co/apiAdmin/${name}/list`,
        'post',
        { search: debouncedSearch },
        true,
        ''
      )
    );
    if (res.data) {
      const listVendor = res?.data?.map((item: IVendorList) => {
        return { label: item.name, value: item.id, disable: false };
      });
      setIsLoading(false);
      setListVendor(listVendor);
      setIsNoData(false);
    } else {
      setIsLoading(false);
      setListVendor([]);
      setIsNoData(true);
    }
  };

  const loadAllVendor = async () => {
    const res = await dispatch(
      fetchThunk(
        `https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list`,
        'get',
        undefined,
        true,
        ''
      )
    );
    console.log('check vendor', defaultIdVendor);
    console.log(res.data);
    const defaultVendor = res.data?.filter((item: IVendorList) => item.id === defaultIdVendor);
    console.log('check arr', defaultVendor);
    if (defaultVendor) {
      if (defaultVendor[0]) {
        console.log(defaultVendor[0].name);
        setSearch(defaultVendor[0].name);
      }
    }
  };

  useEffect(() => {
    loadAllVendor();
  }, [defaultIdVendor]);

  useEffect(() => {
    if (debouncedSearch) {
      loadSearchVendor();
    } else {
      setIsLoading(false);
      setListVendor([]);
    }
  }, [debouncedSearch]);

  return (
    <div className="search-options ">
      <Field
        type="text"
        value={search}
        name="vendor_id"
        onChange={(e: any) => {
          setIsLoading(true);
          setListVendor([]);
          setSearch(e.target.value);
        }}
        className="input-search-vendor form-control"
        style={{
          padding: '10px 15px',
          borderRadius: '5px',
        }}
        placeholder="Type to select"
        onBlur={() => {
          setIsTyping(false);
        }}
        tabIndex={1}
      />

      <ul
        className="list-options"
        hidden={!isLoading && listVendor?.length === 0 && isTyping}
        onBlur={() => {
          console.log('blur');
        }}
      >
        {isLoading && <li>loading...</li>}

        {listVendor?.map((item: IOptionsHasDisabled, index) => (
          <li
            key={index}
            onClick={() => {
              console.log(item.label);
              setSearch(item.label);
              handleSetValue(item.value);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
      {/* {!isLoading && listVendor?.length === 0 && isNoData && <li>No Option</li>} */}
    </div>
  );
};

export default AutocompleteField;
