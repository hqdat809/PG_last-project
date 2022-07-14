import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ROUTES } from 'configs/routes';
import { push } from 'connected-react-router';
import { convertFromHTML, convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Field, Form, Formik } from 'formik';
import { IBranch, IProductDetail } from 'models/product';
import { ICategory, IOptions } from 'models/user';
import { setListBranch } from 'modules/auth/redux/productReducer';
import { CreateProductSchema } from 'modules/auth/utils';
import { fetchThunk } from 'modules/common/redux/thunk';
import AutocompleteField from 'modules/component/InputCreateComponent/AutocompleteField';
import InputImage from 'modules/component/InputCreateComponent/InputImage';
import MultipleSelectCreate from 'modules/component/InputCreateComponent/MultipleSelectCreate';
import SingleSelectInput from 'modules/component/InputCreateComponent/SingleSelectInput';
import TextInput from 'modules/component/InputCreateComponent/TextInput';
import 'modules/home/pages/ProductDetail/ProductDetail.scss';
import { listCondition } from 'modules/intl/constants';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ContentBlock, ContentState, Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../../redux/reducer';
import HtmlToDraft from 'html-to-draftjs';
import JoditEditor from 'jodit-react';

interface Props {}

const ProductDetail = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const id = useParams<{ id?: string }>();
  const listBranch = useSelector((state: AppState) => state.productManage.listBranch);

  const [vendorId, setVendorId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [shipping, setShipping] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [imagesName, setImagesName] = useState([]);
  const [multiCategory, setMultiCategory] = useState<any[]>([]);
  const [category, setCategory] = useState<ICategory[]>([]);
  const [content, setContent] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [detailProduct, setDetailProduct] = useState<IProductDetail>();
  const [defaultBranch, setDefaultBranch] = useState<IOptions>();
  const [imageDelete, setImageDelete] = useState([]);
  const editor = useRef(null);

  const fetchDetailProduct = async () => {
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
    console.log('detail product: ', res.data);
    const initBranch = listBranch?.filter((item: IOptions) => {
      return item.value === res.data.brand_id;
    });
    if (initBranch) {
      setDefaultBranch(initBranch[0]);
    }
    configCategory(res.data.categories);
    setVendorId(res.data.vendor_id);
    setContent(res.data.description);
    setShipping(parseFloat(res.data.shipping[0].price).toFixed(2));
    console.log(HtmlToDraft(res.data.description).contentBlocks);
  };

  const fetchBranch = async () => {
    const res = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/brands/list',
        'get',
        undefined,
        true,
        ''
      )
    );

    const branchs = res.data.map((item: IBranch) => {
      return { value: item.id, label: item.name };
    });

    dispatch(setListBranch(branchs));
  };

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

    setCategory(res.data);
  };

  // Xu li change image
  const handleUploadImages = async (productId: string) => {
    const data = images;
    const formData = new FormData();
    formData.append('productId', `${productId}`);
    for (let i = 0; i < data.length; i++) {
      formData.append('order', `${i}`);
      formData.append('images[]', data[i]);
      await dispatch(
        fetchThunk(
          'https://api.gearfocus.div4.pgtest.co/api/products/upload-image',
          'post',
          formData,
          true,
          'multipart/form-data'
        )
      );
      formData.delete('order');
      formData.delete('images[]');
    }
  };

  const handleClickBackSite = () => {
    dispatch(push(ROUTES.contact));
  };

  const configCategory = (categories: []) => {
    const detailCategories = categories.map((item: any) => item.category_id);
    setMultiCategory(detailCategories);
  };

  useEffect(() => {
    fetchBranch();
    fetchDetailProduct();
    fetchCategory();
  }, []);

  if (!detailProduct) {
    return <></>;
  } else {
    return (
      <Formik
        initialValues={{
          vendor_id: detailProduct?.vendor_id,
          name: detailProduct?.name,
          brand_id: '',
          condition_id: detailProduct?.condition_id,
          categories: new Array(),
          description: '',
          enabled: 0,
          memberships: [],
          shipping_to_zones: [{ id: 1, price: '' }],
          tax_exempt: 0,
          price: parseFloat(detailProduct.price).toFixed(2),
          sale_price_type: '',
          arrival_date: '',
          inventory_tracking: 0,
          quantity: Math.round(Number(detailProduct.price) * 100) / 100,
          sku: detailProduct?.sku,
          participate_sale: 0,
          sale_price: '',
          og_tags_type: '',
          og_tags: '',
          meta_desc_type: '',
          meta_description: '',
          meta_keywords: '',
          product_page_title: '',
          id: detailProduct?.id,
          facebook_marketing_enabled: 0,
          google_feed_enabled: 0,
          imagesOrder: new Array(),
          deleted_images: [],
        }}
        onSubmit={async (values) => {
          values.vendor_id = vendorId;
          values.brand_id = brandId;
          values.categories = multiCategory;
          values.imagesOrder = imagesName;
          values.shipping_to_zones[0].price = shipping;
          values.description = content;
          values.deleted_images = imageDelete;

          console.log('check submit : ', values);
          const formData = new FormData();
          formData.append('productDetail', JSON.stringify(values));
          const json = await dispatch(
            fetchThunk(
              'https://api.gearfocus.div4.pgtest.co/apiAdmin/products/create',
              'post',
              formData,
              true,
              'multipart/form-data'
            )
          );
          if (json.success) {
            await handleUploadImages(json.data);
            toast.success('Update Product Success! ');
          } else {
            toast.error(json.errors);
          }
        }}
        // validationSchema={CreateProductSchema}
      >
        {({ errors, touched, values, handleChange }) => {
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
                        <div className="wrapper-input-field">
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
                          <TextInput
                            type="text"
                            name="name"
                            error={errors.name}
                            touched={touched.name}
                            isShowError={true}
                          />
                        </div>
                      </div>
                      {/* branch */}
                      <div className="form-group field-create-product input-element">
                        <label>
                          Branch <p style={{ color: 'red' }}>*</p>
                        </label>

                        <div className="wrapper-input-field">
                          {console.log(defaultBranch)}
                          <Select
                            value={defaultBranch}
                            options={listBranch}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e) => {
                              setBrandId(e?.value);
                              if (e) {
                                setDefaultBranch(e);
                              }
                            }}
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
                          <SingleSelectInput name="condition_id" options={listCondition} />
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
                        className="form-group field-create-product"
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
                        className="form-group field-create-product"
                        style={{ marginBottom: '20px' }}
                      >
                        <label htmlFor="inputEmail" className="form-label">
                          Category
                          <p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <MultipleSelectCreate
                            value={multiCategory}
                            setValue={setMultiCategory}
                            options={category}
                          />
                        </div>
                      </div>
                      {/* Description */}
                      <div className="form-group field-create-product">
                        <label htmlFor="inputEmail" className="form-label">
                          Description
                          <p style={{ color: 'red' }}>*</p>
                        </label>
                        <div className="wrapper-input-field">
                          <JoditEditor
                            ref={editor}
                            value={content}
                            // config={config}
                            // tabIndex={1} // tabIndex of textarea
                            onBlur={(newContent) => {
                              setContent(newContent);
                            }} // preferred to use only this option to update the content for performance reasons
                            onChange={(newContent) => {}}
                          />
                          {/* <Editor
                            editorState={editorState}
                            onEditorStateChange={(newState) => {
                              setEditorState(newState);
                              setContent(draftToHtml(convertToRaw(newState.getCurrentContent())));
                            }}
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div className="prices-inventory">
                      <div className="title-page">
                        <h1 style={{ color: '#fff' }}>Prices & inventory</h1>
                      </div>
                      {/* price */}
                      <div className="form-group field-create-product input-element">
                        <label>
                          Price <p style={{ color: 'red' }}>*</p>
                        </label>

                        <div className="wrapper-input-field input-number">
                          <TextInput
                            type="number"
                            name="price"
                            error={errors.price}
                            touched={touched.price}
                            isShowError={true}
                          />
                        </div>
                      </div>

                      {/* quantity in sock */}
                      <div className="form-group field-create-product input-element">
                        <label>
                          Quantity in stock <p style={{ color: 'red' }}>*</p>
                        </label>

                        <div className="wrapper-input-field">
                          <TextInput
                            type="number"
                            name="quantity"
                            error={errors.quantity}
                            touched={touched.quantity}
                            isShowError={true}
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
                          <input
                            type="number"
                            value={shipping}
                            className="form-control"
                            style={{ width: '100%' }}
                            onChange={(e) => {
                              setShipping(e.target.value);
                            }}
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
            </div>
          );
        }}
      </Formik>
    );
  }
};

export default ProductDetail;
