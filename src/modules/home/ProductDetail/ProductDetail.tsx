import React, { useEffect, useRef, useState } from 'react';
import { faArrowLeftLong, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AppState } from 'redux/reducer';
import { push } from 'connected-react-router';
import JoditEditor from 'jodit-react';
import { FastField, Field, Form, Formik } from 'formik';
import moment from 'moment';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import flatpickr from 'flatpickr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { API_PATHS } from 'configs/api';
import { ROUTES } from 'configs/routes';
import InputField from 'CustomField/InputField/InputField';
import MultiSelectField from 'CustomField/SelectField/MultiSelectField';
import SingleSelectField from 'CustomField/SelectField/SingleSelectField';
import { IBranch, IProductDetail } from 'models/product';
import { setListBranch } from 'modules/home/redux/productReducer';
import { CreateProductSchema } from 'modules/auth/utils';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import AutocompleteField from 'modules/component/InputCreateComponent/AutocompleteField';
import InputImage from 'modules/component/InputCreateComponent/InputImage';
import 'modules/home/ProductDetail/ProductDetail.scss';
import {
  listCondition,
  listMemberProduct,
  listPriceType,
  metaDesType,
  ogTagsType,
} from 'modules/intl/constants';

interface Props {}

const ProductDetail = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const id = useParams<{ id?: string }>();
  const listBranch = useSelector((state: AppState) => state.productManage.listBranch);
  const listCategory = useSelector((state: AppState) => state.productManage.listCategory);
  const [vendorId, setVendorId] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [imagesName, setImagesName] = useState([]);
  const [content, setContent] = useState('');
  const [isSale, setIsSale] = useState(false);
  const [isCustomMetaDes, setIsCustomMetaDes] = useState(false);
  const [isCustomOgTags, setIsCustomOgTags] = useState(false);
  const [detailProduct, setDetailProduct] = useState<IProductDetail>();
  const [imageDelete, setImageDelete] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const editor = useRef(null);

  const fetchDetailProduct = async () => {
    setIsLoading(true);
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/products/detail',
        'post',
        id,
        true,
        ''
      )
    );
    setDetailProduct(res.data);
    setVendorId(res.data.vendor_id);
    setContent(res.data.description);
    setIsLoading(false);
  };

  const fetchBranch = async () => {
    const res = await dispatch(fetchThunk(API_PATHS.listBrand, 'get', undefined, true, ''));

    const branchs = res.data.map((item: IBranch) => {
      return { value: item.id, label: item.name };
    });

    dispatch(setListBranch(branchs));
  };

  // Xu li change image

  const handleUploadImages = async (productId: string) => {
    const data = images;
    const formData = new FormData();
    formData.append('productId', `${productId}`);
    const promises = [];
    for (let i = 0; i < data.length; i++) {
      formData.append('order', `${i}`);
      formData.append('images[]', data[i]);
      promises.push(
        dispatch(fetchThunk(API_PATHS.uploadImage, 'post', formData, true, 'multipart/form-data'))
      );
      formData.delete('order');
      formData.delete('images[]');
    }

    Promise.all(promises).then((response) => {
      const isSuccess = response.every((item) => {
        return item.success;
      });
      if (isSuccess) {
        toast.success('Update Product Success! ');
      } else {
        toast.error('Update images is error');
      }
      setIsLoading(false);
    });
  };

  const handleClickBackSite = () => {
    dispatch(push(ROUTES.product));
  };

  useEffect(() => {
    fetchBranch();
    fetchDetailProduct();
  }, []);

  if (!detailProduct) {
    return <></>;
  } else {
    return (
      <Formik
        initialValues={{
          vendor_id: detailProduct?.vendor_id,
          name: detailProduct?.name,
          brand_id: detailProduct?.brand_id,
          condition_id: detailProduct?.condition_id,
          categories: detailProduct?.categories.map((item: any) => item.category_id),
          description: detailProduct?.description,
          enabled: 0,
          memberships: detailProduct?.memberships[0]?.membership_id || [
            {
              value: 0,
              label: 'null',
              disabled: false,
            },
          ],
          shipping_to_zones: [
            { id: 1, price: parseFloat(detailProduct.shipping[0].price).toFixed(2) },
          ],
          tax_exempt: !!Number(detailProduct?.tax_exempt),
          price: parseFloat(detailProduct.price).toFixed(2),
          sale_price_type: detailProduct?.sale_price_type,
          arrival_date: moment(Number(detailProduct.arrival_date) * 1000).format('YYYY-MM-DD'),
          inventory_tracking: 0,
          quantity: Number(detailProduct.quantity),
          sku: detailProduct?.sku,
          participate_sale: !!Number(detailProduct?.participate_sale),
          sale_price: parseFloat(detailProduct?.sale_price).toFixed(2),
          og_tags_type: detailProduct.og_tags_type,
          og_tags: detailProduct.og_tags,
          meta_desc_type: detailProduct.meta_desc_type,
          meta_description: detailProduct.meta_description,
          meta_keywords: detailProduct.meta_keywords,
          product_page_title: detailProduct.product_page_title,
          id: detailProduct?.id,
          facebook_marketing_enabled: !!Number(detailProduct?.facebook_marketing_enabled),
          google_feed_enabled: !!Number(detailProduct?.google_feed_enabled),
          imagesOrder: new Array(),
          deleted_images: [],
        }}
        onSubmit={async (values) => {
          setIsLoading(true);
          values.vendor_id = vendorId;
          values.imagesOrder = imagesName;
          values.description = content;
          values.deleted_images = imageDelete;

          const formData = new FormData();
          formData.append('productDetail', JSON.stringify(values));
          const json = await dispatch(
            fetchThunk(API_PATHS.createProduct, 'post', formData, true, 'multipart/form-data')
          );
          if (json.success) {
            await handleUploadImages(json.data);
          } else {
            toast.error(json.errors);
          }
        }}
        validationSchema={CreateProductSchema}
      >
        {({ errors, touched, values, handleChange }) => {
          flatpickr('.date-arrival', {
            defaultDate: Number(detailProduct.arrival_date) * 1000,
            dateFormat: 'Y-m-d',
            onChange: function (selectedDates, dateStr, instance) {
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
                        <h1 style={{ color: '#fff' }}>{detailProduct.name}</h1>
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
                            defaultIdVendor={detailProduct?.vendor_id}
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
                          Branch <p style={{ color: 'red' }}>*</p>
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
                            oldImages={detailProduct.images}
                            setImageDelete={setImageDelete}
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
                        Update account
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
  }
};

export default ProductDetail;
