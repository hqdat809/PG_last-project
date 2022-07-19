import { ROUTES } from 'configs/routes';
import { push } from 'connected-react-router';
import { AppState } from 'redux/reducer';
import { ThunkDispatch } from 'redux-thunk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import 'flatpickr/dist/themes/material_green.css';

import { IFilterProduct } from 'models/product';
import { IDeleteUSer } from 'models/user';
import { getListProduct } from 'modules/auth/redux/productReducer';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import FormFilterProduct from 'modules/component/FormFilter/FormFilterProduct';
import ModalConfirmDelete from 'modules/component/ModalConfirmDelete/ModalConfirmDelete';
import Pagination from 'modules/component/Pagination/Pagination';
import TableListProduct from 'modules/component/TableList/TableListProduct';
import 'modules/home/pages/HomePage.scss';
import { ItemPerPage } from 'modules/intl/constants';

const ContactPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const modal = document.getElementsByClassName('modal');

  const [page, setPage] = useState(1);
  const [multiDelete, setmultiDelete] = useState<IDeleteUSer[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>();
  const [numberPage, setNumberPage] = useState<number>();
  const [numberProduct, setNumberProduct] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const [filterProduct, setFilterProduct] = useState<IFilterProduct>({
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
  });

  const fetchData = async (activePage: number) => {
    setIsLoading(true);
    const json = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/api/products/list',
        'post',
        { page: activePage, count: 25 },
        true,
        ''
      )
    );

    setNumberPage(Math.ceil(json.recordsTotal / 25));
    dispatch(getListProduct(json.data));
    setNumberProduct(Number(json.recordsTotal));
    setIsLoading(false);
  };

  const handleChangePage = async (page: number) => {
    setIsLoading(true);

    const json = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/api/products/list',
        'post',
        { ...filterProduct, page: page },
        true,
        ''
      )
    );
    setNumberPage(Math.ceil(json.recordsTotal / filterProduct.count));
    dispatch(getListProduct(json.data));
    setIsFiltering(true);
    setNumberProduct(Number(json.recordsTotal));
    setIsLoading(false);
  };

  const handleFilter = async () => {
    setIsLoading(true);

    const json = await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/api/products/list',
        'post',
        filterProduct,
        true,
        ''
      )
    );
    setNumberPage(Math.ceil(json.recordsTotal / filterProduct.count));
    dispatch(getListProduct(json.data));
    setIsFiltering(true);
    setNumberProduct(Number(json.recordsTotal));
    setIsLoading(false);
  };

  useEffect(() => {
    setFilterProduct({ ...filterProduct, page: page });
    if (!isFiltering) {
      fetchData(page);
    } else {
      handleChangePage(page);
    }
  }, [page]);

  const handleDelete = () => {
    modal[0].classList.add('active');
  };

  const handleClickCancel = () => {
    modal[0].classList.remove('active');
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);

    modal[0].classList.remove('active');
    await dispatch(
      fetchThunk(
        'https://api.gearfocus.div4.pgtest.co/apiAdmin/products/edit',
        'post',
        { params: [...multiDelete] },
        true,
        ''
      )
    );
    fetchData(page);
    const checkBoxes = document.getElementsByTagName('input');
    for (let i = 0, max = checkBoxes.length; i < max; i++) {
      if (checkBoxes[i].type === 'checkbox') checkBoxes[i].checked = false;
    }
    setIsLoading(false);
  };

  const handleClickAddProduct = () => {
    dispatch(push(ROUTES.createProduct));
  };

  return (
    <div id="home-page">
      {/* form filter */}
      <div className="form-filter">
        <FormFilterProduct
          handleFilter={handleFilter}
          setFilterProduct={setFilterProduct}
          filterProduct={filterProduct}
        />
      </div>
      <button className="btn-add-user" onClick={handleClickAddProduct}>
        Add Product
      </button>
      {/* tables user list */}
      <TableListProduct
        multiDelete={multiDelete}
        setmultiDelete={setmultiDelete}
        handleDelete={handleDelete}
        setFilterProduct={setFilterProduct}
        filterProduct={filterProduct}
      />
      {/* pagination */}
      <div className="pagination">
        <Pagination setPage={setPage} numberPage={numberPage} />
        <p style={{ marginRight: '10px' }}>
          <span>{numberProduct}</span> Items
        </p>
        <div style={{ display: 'flex' }}>
          <select
            className="select-per-page"
            onChange={async (e) => {
              if (e) {
                setFilterProduct({ ...filterProduct, count: Number(e.target.value) });
                const json = await dispatch(
                  fetchThunk(
                    'https://api.gearfocus.div4.pgtest.co/api/products/list',
                    'post',
                    { ...filterProduct, count: Number(e.target.value) },
                    true,
                    ''
                  )
                );
                setNumberPage(Math.ceil(json.recordsTotal / Number(e.target.value)));
                dispatch(getListProduct(json.data));
                setIsFiltering(true);
                setNumberProduct(Number(json.recordsTotal));
              }
            }}
          >
            {ItemPerPage.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <span style={{ marginLeft: '10px' }}> per page</span>
        </div>
      </div>
      {/* modal confirm delete*/}
      <ModalConfirmDelete
        handleClickCancel={handleClickCancel}
        handleConfirmDelete={handleConfirmDelete}
      />
      {/* manage delete multi user */}
      <div className="footer">
        <button className="btn-multi-delete" onClick={() => handleDelete()}>
          Remove selected
        </button>
      </div>
      {isLoading ? <LoadingPage /> : ''}
    </div>
  );
};

export default ContactPage;
