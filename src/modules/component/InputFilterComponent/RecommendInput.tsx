import { IVendorList } from 'models/product';
import { IFilterUser, IOptionsHasDisabled } from 'models/user';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { values } from 'lodash';
import useDebounce from 'hooks/useDebounce';
import '../InputFilterComponent/RecommendInput.scss';

interface Props {
  onChangeFilter(name: string, value: any): void;
}

const RecommendInput = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { onChangeFilter } = props;

  const [search, setSearch] = useState<string | undefined>();
  const [listVendor, setListVendor] = useState<IOptionsHasDisabled[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const inputSearch = document.getElementsByClassName('input-search-vendor');
  const labelSelect = document.getElementsByClassName('list-vendor');

  const debouncedSearch = useDebounce(search, 500);

  const loadSearchVendor = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list',
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

  useEffect(() => {
    if (debouncedSearch) {
      loadSearchVendor();
    } else {
      setIsLoading(false);
      setListVendor([]);
    }
  }, [debouncedSearch]);

  return (
    <div className="search-vendor">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setIsLoading(true);
          setListVendor([]);
          setSearch(e.target.value);
        }}
        className="input-search-vendor"
        style={{
          padding: '6px 15px',
          borderRadius: '5px',
          width: '250px',
        }}
        placeholder="Type to select"
        onFocus={() => {
          setIsTyping(true);
        }}
      />

      <ul
        className="list-vendor"
        hidden={!isTyping}
        onBlur={() => {
          setIsTyping(false);
        }}
        tabIndex={1}
      >
        {isLoading && <li>loading...</li>}
        {!isLoading && listVendor?.length === 0 && isNoData && <li>No Option</li>}
        {listVendor?.map((item: IOptionsHasDisabled) => (
          <li
            key={item.value}
            onClick={() => {
              setSearch(item.label);
              onChangeFilter('vendor', item.value);
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendInput;
