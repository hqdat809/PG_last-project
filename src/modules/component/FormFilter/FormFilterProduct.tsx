import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'flatpickr/dist/themes/material_green.css';
import {
  ICategory,
  ICountry,
  ICountrySelect,
  IFilterUser,
  IOptionsHasDisabled,
  IRolesUser,
} from 'models/user';
import MultipleSelectFilter from 'modules/component/InputFilterComponent/MultipleSelectFilter';
import SingleSelectFilter from 'modules/component/InputFilterComponent/SingleSelectFilter';
import TextFilter from 'modules/component/InputFilterComponent/TextFilter';
import UserActivityRadio from 'modules/component/InputFilterComponent/UserActivityRadio';
import 'modules/home/pages/HomePage.scss';
import {
  listAvailability,
  listMemberShip,
  listStatus,
  listStockStatus,
} from 'modules/intl/constants';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as userService from 'service/userService';
import { boolean } from 'yup';
import { Action } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import { IFilterProduct, IVendorList } from 'models/product';
import { setListCategory } from 'modules/auth/redux/productReducer';
import RecommendInput from '../InputFilterComponent/RecommendInput';

interface Props {
  handleFilter(): void;
  setFilterProduct(filterUser: IFilterProduct): void;
  filterProduct: IFilterProduct;
}

const FormFilter = (props: Props) => {
  const { handleFilter, setFilterProduct, filterProduct } = props;
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const categoryOptions = useSelector((state: AppState) => state.productManage.listCategory);

  const [isHiddenForm, setIsHiddenForm] = React.useState(true);
  const [searchType, setSearchType] = React.useState<string[]>([]);
  const [searchVendor, setSearchVendor] = React.useState('');
  const [listSearchVendor, setListSearchVendor] = React.useState<IOptionsHasDisabled[]>();

  const fetchCategory = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/api/categories/list',
        'get',
        undefined,
        true,
        ''
      )
    );

    const category = res.data.map((item: ICategory) => {
      return { value: item.id, label: item.name, disabled: false };
    });
    category.unshift({ value: '', label: 'Any Category', disabled: false });
    console.log('check category: ', category);
    dispatch(setListCategory(category));
  };

  const onChangeFilter = (nameFilter: string, value: any) => {
    setFilterProduct({ ...filterProduct, [nameFilter]: value });
  };

  const loadSearchVendor = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list',
        'post',
        { search: searchVendor },
        true,
        ''
      )
    );
    // console.log('check list search vendor: ', res.data);

    if (res.data) {
      const listVendor = res?.data?.map((item: IVendorList) => {
        return { label: item.name, value: item.id, disable: false };
      });
      setListSearchVendor(listVendor);
    } else {
      setListSearchVendor([]);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    loadSearchVendor();
  }, [searchVendor]);

  console.log('check list search vendor: ', listSearchVendor);

  return (
    <form
      style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        handleFilter();
      }}
    >
      <fieldset className="form-filter" style={{ width: '100%' }}>
        <div className="form-filter-show">
          {/* search keywords */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label className="form-label">Search keywords</label>
            <TextFilter onChangeFilter={onChangeFilter} nameFilter="search" />
          </div>
          {/* search Any Category */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="inputEmail" className="form-label">
              Any Category
            </label>
            <div className="">
              <SingleSelectFilter
                onChangeFilter={onChangeFilter}
                options={categoryOptions ? categoryOptions : []}
                nameFilter="category"
                typeConvertValue="string"
              />
            </div>
          </div>
          {/* search member ships */}
          <div className="mb-3" style={{ width: '100%' }}>
            <label htmlFor="inputEmail" className="form-label">
              Stock status
            </label>
            <div className="">
              <SingleSelectFilter
                onChangeFilter={onChangeFilter}
                options={listStockStatus}
                nameFilter="stock_status"
                typeConvertValue="string"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-search">
            Search
          </button>
        </div>
        {/* hidden form */}

        <div className={`form-filter-hidden ${isHiddenForm ? '' : 'show'}`}>
          <div className={`field-filter-form `}>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Search in:
              </label>
              <div className="wraper-search-in">
                <div>
                  <input
                    type="checkbox"
                    className=""
                    value="name"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newArrSearchType = [...searchType, e.target.value];
                        setSearchType(newArrSearchType);
                        setFilterProduct({
                          ...filterProduct,
                          search_type: newArrSearchType.join(','),
                        });
                      }
                    }}
                  />
                  <p>Name</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    className=""
                    value="sku"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newArrSearchType = [...searchType, e.target.value];
                        setSearchType(newArrSearchType);
                        setFilterProduct({
                          ...filterProduct,
                          search_type: newArrSearchType.join(','),
                        });
                      }
                    }}
                  />
                  <p>SKU</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    className=""
                    value="description"
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newArrSearchType = [...searchType, e.target.value];
                        setSearchType(newArrSearchType);
                        setFilterProduct({
                          ...filterProduct,
                          search_type: newArrSearchType.join(','),
                        });
                      }
                    }}
                  />
                  <p>Full Description</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`field-filter-form `}>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Availability
              </label>
              <div className="wraper-input-filter">
                <SingleSelectFilter
                  onChangeFilter={onChangeFilter}
                  options={listAvailability}
                  nameFilter="availability"
                  typeConvertValue="string"
                />
              </div>
            </div>
          </div>
          <div className={`field-filter-form `}>
            <div className="item-filter">
              <label htmlFor="inputEmail" className="form-label">
                Vendor
              </label>
              <div className="wraper-input-filter">
                <RecommendInput onChangeFilter={onChangeFilter} />
              </div>
            </div>
          </div>
        </div>
        <span
          className="sortcut-form"
          onClick={() => {
            setIsHiddenForm(!isHiddenForm);
          }}
        >
          {isHiddenForm ? (
            <FontAwesomeIcon icon={faAngleDoubleDown} />
          ) : (
            <FontAwesomeIcon icon={faAngleDoubleUp} />
          )}
        </span>
      </fieldset>
    </form>
  );
};

export default FormFilter;
