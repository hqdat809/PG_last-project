import { faArrowLeftLong, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_PATHS } from 'configs/api';
import { ROUTES } from 'configs/routes';
import { push } from 'connected-react-router';
import InputField from 'CustomField/InputField/InputField';
import MultiSelectField from 'CustomField/SelectField/MultiSelectField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import flatpickr from 'flatpickr';
import { FastField, Field, Form, Formik } from 'formik';
import JoditEditor from 'jodit-react';
import { IBranch } from 'models/product';
import { ICategory } from 'models/user';
import { setListBranch } from 'modules/auth/redux/productReducer';
import { CreateProductSchema, CreateUserSchema } from 'modules/auth/utils';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import AutocompleteField from 'modules/component/InputCreateComponent/AutocompleteField';
import InputImage from 'modules/component/InputCreateComponent/InputImage';
import MultipleSelectCreate from 'modules/component/InputCreateComponent/MultipleSelectCreate';
import SingleSelectInput from 'modules/component/InputCreateComponent/SingleSelectInput';
import TextInput from 'modules/component/InputCreateComponent/TextInput';
import 'modules/home/pages/CreateProduct/CreateProduct.scss';
import {
  listCondition,
  listMemberProduct,
  listPriceType,
  metaDesType,
  ogTagsType,
} from 'modules/intl/constants';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch, useSelector } from 'react-redux';
import Select, { useStateManager } from 'react-select';
import { toast } from 'react-toastify';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../../redux/reducer';

interface Props {}

const CreateProduct = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const listBranch = useSelector((state: AppState) => state.productManage.listBranch);
  const listCategory = useSelector((state: AppState) => state.productManage.listCategory);
  const listCountry = useSelector((state: AppState) => state.userManage.listCountry);

  const [vendorId, setVendorId] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [imagesName, setImagesName] = useState([]);
  const [content, setContent] = React.useState('');
  const editor = useRef(null);
  const [isSale, setIsSale] = useState(false);
  const [isCustomMetaDes, setIsCustomMetaDes] = useState(false);
  const [isCustomOgTags, setIsCustomOgTags] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchBranch = async () => {
    const res = await dispatch(fetchThunk(API_PATHS.listBrand, 'get', undefined, true, ''));

    const branchs = res.data.map((item: IBranch) => {
      if (item.name === 'None') {
        return { value: '', label: item.name };
      }
      return { value: item.id, label: item.name };
    });
    dispatch(setListBranch(branchs));
  };

  const hanldeMoveToDetail = (idProduct: string) => {
    dispatch(push(`/detai-product/${idProduct}`));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchBranch();
    setIsLoading(false);
  }, []);

  // Xu li change image
  const handleUploadImages = async (productId: string) => {
    const data = images;
    const formData = new FormData();
    formData.append('productId', `${productId}`);
    for (let i = 0; i < data.length; i++) {
      formData.append('order', `${i}`);
      formData.append('images[]', data[i]);
      await dispatch(
        fetchThunk(API_PATHS.uploadImage, 'post', formData, true, 'multipart/form-data')
      );
      formData.delete('order');
      formData.delete('images[]');
    }
  };

  const handleClickBackSite = () => {
    dispatch(push(ROUTES.contact));
  };

  return (
    <Formik
      initialValues={{
        vendor_id: '',
        name: '',
        brand_id: '',
        condition_id: '',
        categories: new Array(),
        description: '',
        enabled: 0,
        memberships: new Array(),
        shipping_to_zones: [{ id: 1, price: '' }],
        tax_exempt: false,
        price: '',
        sale_price_type: '$',
        arrival_date: '',
        inventory_tracking: 0,
        quantity: '',
        sku: Math.floor(Math.random() * (100000000000000 - 10000000000000)),
        participate_sale: false,
        sale_price: parseFloat('0').toFixed(2),
        og_tags_type: '',
        og_tags: '',
        meta_desc_type: '',
        meta_description: '',
        meta_keywords: '',
        product_page_title: '',
        facebook_marketing_enabled: false,
        google_feed_enabled: false,
        imagesOrder: new Array(),
        deleted_images: new Array(),
      }}
      onSubmit={async (values) => {
        setIsLoading(true);
        values.vendor_id = vendorId;
        values.imagesOrder = imagesName;
        values.description = content;

        console.log('check submit : ', values);
        const formData = new FormData();
        formData.append('productDetail', JSON.stringify(values));
        const json = await dispatch(
          fetchThunk(API_PATHS.createProduct, 'post', formData, true, 'multipart/form-data')
        );
        if (json.success) {
          await handleUploadImages(json.data);
          hanldeMoveToDetail(json.data);
          toast.success('Create User Success! ');
        } else {
          toast.error(json.errors);
        }
        setIsLoading(false);
      }}
      validationSchema={CreateProductSchema}
    >
      {({ errors, values, handleChange }) => {
        flatpickr('.date-arrival', {
          defaultDate: new Date(),
          dateFormat: 'Y-m-d',
          onChange: function (selectedDates, dateStr, instance) {
            console.log(moment(selectedDates[0]).format('YYYY-MM-DD'));
            values.arrival_date = moment(selectedDates[0]).format('YYYY-MM-DD');
          },
        });

        useEffect(() => {
          if (values.participate_sale) {
            setIsSale(true);
          } else {
            setIsSale(false);
            values.sale_price = '0';
          }
        }, [values.participate_sale]);

        useEffect(() => {
          if (values.og_tags_type === '1') {
            setIsCustomOgTags(true);
          } else {
            values.og_tags = '';
            setIsCustomOgTags(false);
          }
        }, [values.og_tags_type]);

        useEffect(() => {
          if (values.meta_desc_type == 'C') {
            setIsCustomMetaDes(true);
            console.log('meta des: ', values.meta_desc_type);
          } else {
            values.meta_description = '';
            setIsCustomMetaDes(false);
          }
        }, [values.meta_desc_type]);

        return (
          <div id="create-product-page">
            <div className="wrapper-content">
              <div className="content-create-product">
                <Form style={{ width: '100%' }}>
                  <div className="main-detail">
                    {/* btn back site */}
                    <div className="wrapper-btn-back">
                      <button
                        className="btn-back"
                        onClick={(e) => {
                          handleClickBackSite();
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowLeftLong} style={{ color: '#000' }} />
                      </button>
                    </div>
                    <div className="title-page">
                      <h1 style={{ color: '#fff' }}>Add Product</h1>
                    </div>
                    {/* vendor */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Vendor
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field" style={{ display: 'block' }}>
                        <AutocompleteField
                          handleSetValue={setVendorId}
                          name="vendors"
                          defaultIdVendor=""
                        />
                      </div>
                    </div>
                    {/* product title */}
                    <div className="form-group field-create-product input-element">
                      <label>
                        Product Title <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="name"
                          component={InputField}
                          label=""
                          placeholder="Product title..."
                          type="text"
                        />
                      </div>
                    </div>
                    {/* branch */}
                    <div className="form-group field-create-product input-element">
                      <label>
                        Brand <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="brand_id"
                          component={SingleSelectField}
                          label="Brand"
                          placeholder="Brand's product?"
                          options={listBranch}
                        />
                      </div>
                    </div>
                    {/* Condition */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Condition
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="condition_id"
                          component={SingleSelectField}
                          label=""
                          placeholder="Condition's product..."
                          options={listCondition}
                        />
                      </div>
                    </div>
                    {/* sku */}
                    <div className="form-group field-create-product input-element">
                      <label>
                        SKU <p style={{ color: 'red' }}>*</p>
                      </label>

                      <div className="wrapper-input-field input-number">
                        <Field
                          type="text"
                          name="sku"
                          style={{ width: '100%' }}
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* images */}
                    <div
                      className="form-group field-create-product long-field"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Images
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <InputImage
                          setImages={setImages}
                          images={images}
                          setImagesName={setImagesName}
                          oldImages={[]}
                          setImageDelete={() => undefined}
                        />
                      </div>
                    </div>
                    {/* categories */}
                    <div
                      className="form-group field-create-product long-field"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Category
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="categories"
                          component={MultiSelectField}
                          label=""
                          placeholder="Chose categories..."
                          options={listCategory}
                        />
                      </div>
                    </div>
                    {/* Description */}
                    <div className="form-group field-create-product long-field">
                      <label htmlFor="inputEmail" className="form-label">
                        Description
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <JoditEditor
                          ref={editor}
                          value={content}
                          onBlur={(newContent) => {
                            setContent(newContent);
                          }}
                          onChange={(newContent) => {}}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="prices-inventory">
                    <div className="title-page">
                      <h1 style={{ color: '#fff' }}>Prices & inventory</h1>
                    </div>
                    {/* memberships */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Memberships
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="memberships"
                          component={MultiSelectField}
                          label=""
                          placeholder=""
                          options={listMemberProduct}
                        />
                      </div>
                    </div>
                    {/* tax exempt */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Tax exempt
                      </label>
                      <div className="wrapper-input-field">
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <label style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            Default
                          </label>
                          <FastField
                            name="tax_exempt"
                            component={InputField}
                            label=""
                            placeholder=""
                            type="checkbox"
                          />
                        </div>
                      </div>
                    </div>
                    {/* price */}
                    <div className="form-group field-create-product input-element long-field">
                      <label>
                        Price <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field input-number price-field">
                        <div className="input-price">
                          <button disabled className="label-input">
                            $
                          </button>
                          <FastField
                            name="price"
                            component={InputField}
                            label=""
                            placeholder="0.00"
                            type="number"
                          />
                        </div>

                        <div className="check-box-sale">
                          <FastField
                            name="participate_sale"
                            component={InputField}
                            label=""
                            placeholder=""
                            type="checkbox"
                          />
                          <label>Sale</label>
                        </div>

                        <div className="wrapper-price-sale" hidden={!isSale}>
                          <FastField
                            name="sale_price_type"
                            component={SingleSelectField}
                            label=""
                            placeholder=""
                            options={listPriceType}
                          />
                          <FastField
                            name="sale_price"
                            component={InputField}
                            label=""
                            placeholder=""
                            type="number"
                          />
                        </div>
                      </div>
                    </div>
                    {/* arrival date */}
                    <div className="form-group field-create-product input-element">
                      <label>Arrival date</label>

                      <div className="wrapper-input-field">
                        <button className="label-input" disabled>
                          <FontAwesomeIcon icon={faCalendar} />
                        </button>
                        <input
                          type="text"
                          id="disabledTextInput"
                          className="form-control date-arrival"
                          style={{ paddingBottom: '11px' }}
                          onChange={(e) => {}}
                        />
                      </div>
                    </div>
                    {/* quantity in sock */}
                    <div className="form-group field-create-product input-element">
                      <label>
                        Quantity in stock <p style={{ color: 'red' }}>*</p>
                      </label>

                      <div className="wrapper-input-field">
                        {/* <TextInput
                          type="number"
                          name="quantity"
                          error={errors.quantity}
                          touched={touched.quantity}
                          isShowError={true}
                        /> */}
                        <FastField
                          name="quantity"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="shipping">
                    <div className="title-page">
                      <h1 style={{ color: '#fff' }}>Shipping</h1>
                    </div>
                    {/* shipping */}
                    <div className="form-group field-create-product input-element">
                      <label>
                        Continental U.S. <p style={{ color: 'red' }}>*</p>
                      </label>

                      <div className="wrapper-input-field">
                        <button className="label-input" disabled>
                          $
                        </button>
                        <FastField
                          name="shipping_to_zones[0].price"
                          component={InputField}
                          label=""
                          placeholder="0.00"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="marketing">
                    <div className="title-page">
                      <h1 style={{ color: '#fff' }}>Marketing</h1>
                    </div>
                    {/* open graph meta tags */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Open Graph meta tags
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="og_tags_type"
                          component={SingleSelectField}
                          label=""
                          placeholder=""
                          options={ogTagsType}
                        />
                      </div>
                    </div>
                    {/* og tags */}
                    <div
                      className="form-group field-create-product input-element"
                      hidden={!isCustomOgTags}
                    >
                      <label></label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="og_tags"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="textarea"
                        />
                      </div>
                    </div>
                    {/* meta description */}
                    <div
                      className="form-group field-create-product"
                      style={{ marginBottom: '20px' }}
                    >
                      <label htmlFor="inputEmail" className="form-label">
                        Meta description
                        <p style={{ color: 'red' }}>*</p>
                      </label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="meta_desc_type"
                          component={SingleSelectField}
                          label=""
                          placeholder=""
                          options={metaDesType}
                        />
                      </div>
                    </div>
                    {/* meta description */}
                    <div
                      className="form-group field-create-product input-element"
                      hidden={!isCustomMetaDes}
                    >
                      <label></label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="meta_description"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="textarea"
                        />
                      </div>
                    </div>
                    {/* meta keyword */}
                    <div className="form-group field-create-product input-element">
                      <label>Meta keywords</label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="meta_keywords"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="text"
                        />
                      </div>
                    </div>
                    {/* meta keyword */}
                    <div className="form-group field-create-product input-element">
                      <label>Product page title</label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="product_page_title"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="text"
                        />
                      </div>
                    </div>
                    {/* Add to Facebook product feed */}
                    <div className="form-group field-create-product input-element">
                      <label>Add to Facebook product feed</label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="facebook_marketing_enabled"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="checkbox"
                        />
                      </div>
                    </div>
                    {/* Add to Google product feed*/}
                    <div className="form-group field-create-product input-element">
                      <label>Add to Google product feed</label>
                      <div className="wrapper-input-field">
                        <FastField
                          name="google_feed_enabled"
                          component={InputField}
                          label=""
                          placeholder=""
                          type="checkbox"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="footer">
                    <button type="submit" className="btn btn-primary btn-submit-create">
                      Create account
                    </button>
                  </div>
                </Form>
              </div>
            </div>
            {isLoading && <LoadingPage />}
          </div>
        );
      }}
    </Formik>
  );
};

export default CreateProduct;
