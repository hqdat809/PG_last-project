import { Field } from 'formik';
import { AppState } from 'redux/reducer';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import useDebounce from 'hooks/useDebounce';
import { IVendorList } from 'models/product';
import { IOptionsHasDisabled } from 'models/user';
import { fetchThunk } from 'modules/common/redux/thunk';
import 'modules/component/InputCreateComponent/AutocompleteField.scss';

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
    const defaultVendor = res.data?.filter((item: IVendorList) => item.id === defaultIdVendor);
    if (defaultVendor) {
      if (defaultVendor[0]) {
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
        onBlur={() => {}}
      >
        {isLoading && <li>loading...</li>}

        {listVendor?.map((item: IOptionsHasDisabled) => (
          <li
            key={item.value}
            onClick={() => {
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
