import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'flatpickr/dist/themes/material_green.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'redux/reducer';

import AutocompleteField from 'CustomField/AutocompletedField/AutocompletedField';
import InputField from 'CustomField/InputField/InputField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import { FastField, Form, Formik } from 'formik';
import { IFilterProduct, IVendorList } from 'models/product';
import { ICategory, IOptionsHasDisabled } from 'models/user';
import { setListCategory } from 'modules/home/redux/productReducer';
import { fetchThunk } from 'modules/common/redux/thunk';
import 'modules/component/FormFilter/FormFilter.scss';
import { listAvailability, listStockStatus } from 'modules/intl/constants';

interface Props {
  handleFilter(values: IFilterProduct): void;
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
  const [vendorId, setVendorId] = React.useState('');
  const [listSearchVendor, setListSearchVendor] = React.useState<IOptionsHasDisabled[]>();
  const [stringSearchType, setStringSearchType] = useState('');

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
    dispatch(setListCategory(category));
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

  return (
    <Formik
      initialValues={{
        availability: '',
        category: '',
        count: 25,
        order_by: 'DESC',
        page: 1,
        search: '',
        search_type: '',
        sort: 'name',
        stock_status: 'all',
        vendor: '',
      }}
      onSubmit={async (values) => {
        values.vendor = vendorId;
        values.search_type = searchType.join(', ');
        handleFilter(values);
      }}
    >
      <Form style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <fieldset className="form-filter" style={{ width: '100%' }}>
          <div className="form-filter-show">
            {/* search keywords */}
            <div className="mb-3" style={{ width: '100%' }}>
              <label className="form-label">Search keywords</label>
              <FastField
                name="search"
                component={InputField}
                label=""
                placeholder="Search..."
                type="text"
              />
            </div>
            {/* search Any Category */}
            <div className="mb-3" style={{ width: '100%' }}>
              <label htmlFor="inputEmail" className="form-label">
                Any Category
              </label>
              <div className="">
                <FastField
                  name="category"
                  component={SingleSelectField}
                  label=""
                  placeholder="Type..."
                  options={categoryOptions}
                />
              </div>
            </div>
            {/* search member ships */}
            <div className="mb-3" style={{ width: '100%' }}>
              <label htmlFor="inputEmail" className="form-label">
                Stock status
              </label>
              <div className="">
                <FastField
                  name="stock_status"
                  component={SingleSelectField}
                  label=""
                  placeholder="Type..."
                  options={listStockStatus}
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
                        } else {
                          const newArrSearchType = searchType;
                          console.log(newArrSearchType.indexOf(e.target.value));
                          newArrSearchType.splice(newArrSearchType.indexOf(e.target.value), 1);
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
                        } else {
                          const newArrSearchType = searchType;
                          console.log(newArrSearchType.indexOf(e.target.value));
                          newArrSearchType.splice(newArrSearchType.indexOf(e.target.value), 1);
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
                        } else {
                          const newArrSearchType = searchType;
                          console.log(newArrSearchType.indexOf(e.target.value));
                          newArrSearchType.splice(newArrSearchType.indexOf(e.target.value), 1);
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
                  <FastField
                    name="availability"
                    component={SingleSelectField}
                    label=""
                    placeholder=""
                    options={listAvailability}
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
                  <AutocompleteField
                    handleSetValue={setVendorId}
                    name="vendors"
                    defaultIdVendor=""
                  />
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
      </Form>
    </Formik>
  );
};

export default FormFilter;
