import { ROUTES } from 'configs/routes';
import { push } from 'connected-react-router';
import flatpickr from 'flatpickr';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import moment from 'moment';
import 'flatpickr/dist/themes/material_green.css';

import { API_PATHS } from 'configs/api';
import { ICategory, ICountry, IDeleteUSer, IFilterUser, IRolesUser } from 'models/user';
import { getListUser, setListCountry, setListRole } from 'modules/home/redux/userReducer';
import LoadingPage from 'modules/common/components/LoadingPage';
import { fetchThunk } from 'modules/common/redux/thunk';
import FormFilterUser from 'modules/component/FormFilter/FormFilterUser';
import ModalConfirmDelete from 'modules/component/ModalConfirmDelete/ModalConfirmDelete';
import Pagination from 'modules/component/Pagination/Pagination';
import TableListUser from 'modules/component/TableList/TableListUser';
import 'modules/home/pages/HomePage.scss';
import { ItemPerPage } from 'modules/intl/constants';
import { AppState } from 'redux/reducer';
import { setListBranch, setListCategory } from '../redux/productReducer';
import { IBranch } from 'models/product';

const HomePage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const isSortSideBar = useSelector((state: AppState) => state.userManage.isSortSideBar);

  const modal = document.getElementsByClassName('modal');

  const [page, setPage] = useState(1);
  const [multiDelete, setmultiDelete] = useState<IDeleteUSer[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>();
  const [numberPage, setNumberPage] = useState<number>();
  const [numberUser, setNumberUser] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [filterUser, setFilterUser] = useState<IFilterUser>({
    address: '',
    count: 25,
    country: '',
    date_range: [],
    date_type: 'R',
    memberships: [],
    order_by: '',
    page: 1,
    phone: '',
    search: '',
    sort: '',
    state: '',
    status: [],
    types: [],
    tz: 7,
  });

  const fetchData = async (activePage: number) => {
    setIsLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.listUser, 'post', { page: activePage, count: 25 }, true, '')
    );
    setNumberPage(Math.ceil(json.recordsTotal / 25));
    dispatch(getListUser(json.data));
    setNumberUser(Number(json.recordsTotal));
    setIsLoading(false);
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

    const category = res.data.map((item: ICategory) => {
      return { value: item.id, label: item.name, disabled: false };
    });
    category.unshift({ value: '0', label: 'Any Category', disabled: false });
    dispatch(setListCategory(category));
  };

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

  const fetchRole = async () => {
    const res = await dispatch(fetchThunk(API_PATHS.listRole, 'get', undefined, true, ''));
    const administratorRoles = res.data.administrator;
    const customerRoles = res.data.customer;
    const allRole = administratorRoles.concat(customerRoles);
    const roleOptionSelect = allRole.map((item: IRolesUser) => {
      return { value: item.id, label: item.name, disable: false };
    });
    dispatch(setListRole(roleOptionSelect));
    console.log('fetch roles, ', roleOptionSelect);
  };

  const fetchCountry = async () => {
    const res = await dispatch(fetchThunk(API_PATHS.listCountry, 'get', undefined, true, ''));

    const selectCountry = res.data.map((item: ICountry) => {
      return { value: item.code, label: item.country, disabled: false };
    });

    selectCountry.unshift({ value: '', label: 'All country', disabled: false });

    dispatch(setListCountry(selectCountry));
    console.log('fetch country, ', selectCountry);
  };

  const handleFilter = async (values: IFilterUser) => {
    setIsLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.listUser, 'post', values, true, ''));
    setIsLoading(false);
    setNumberPage(Math.ceil(json.recordsTotal / filterUser.count));
    dispatch(getListUser(json.data));
    setIsFiltering(true);
    setNumberUser(Number(json.recordsTotal));
  };

  const handleChangePage = async (page: number) => {
    setIsLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.listUser, 'post', { ...filterUser, page: page }, true, '')
    );
    setNumberPage(Math.ceil(json.recordsTotal / filterUser.count));
    dispatch(getListUser(json.data));
    setIsFiltering(true);
    setNumberUser(Number(json.recordsTotal));
    setIsLoading(false);
  };

  const handleDelete = () => {
    modal[0].classList.add('active');
  };

  const handleClickCancel = () => {
    modal[0].classList.remove('active');
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    modal[0].classList.remove('active');

    await dispatch(fetchThunk(API_PATHS.editUser, 'post', { params: [...multiDelete] }, true, ''));
    fetchData(page);
    const checkBoxes = document.getElementsByTagName('input');
    for (let i = 0, max = checkBoxes.length; i < max; i++) {
      if (checkBoxes[i].type === 'checkbox') checkBoxes[i].checked = false;
    }
    setIsLoading(false);
  };

  const handleClickAddUser = () => {
    dispatch(push(ROUTES.createUser));
  };

  flatpickr('.date-selector', {
    // enableTime: true,
    // time_24hr: true,
    altInput: true,
    altFormat: 'M d Y',
    dateFormat: 'Y-m-d',
    mode: 'range',
    conjunction: ' - ',
    onChange: function (selectedDates, dateStr, instance) {
      const formatSelectedDate = selectedDates.map((item) => {
        return moment(item).format('YYYY-MM-DD');
      });
      setFilterUser({ ...filterUser, date_range: formatSelectedDate });
    },
  });

  useEffect(() => {
    setFilterUser({ ...filterUser, page: page });
    if (!isFiltering) {
      fetchData(page);
    } else {
      handleChangePage(page);
    }
  }, [page]);

  useEffect(() => {
    fetchCategory();
    fetchBranch();
    fetchRole();
    fetchCountry();
  }, []);

  return (
    <div id="home-page" className={`${isSortSideBar ? 'sorted' : ''}`}>
      {/* form filter */}
      <div className="form-filter">
        <FormFilterUser handleFilter={handleFilter} />
      </div>
      <button className="btn-add-user" onClick={handleClickAddUser}>
        Add User
      </button>
      {/* tables user list */}
      <TableListUser
        multiDelete={multiDelete}
        setmultiDelete={setmultiDelete}
        handleDelete={handleDelete}
        setFilterUser={setFilterUser}
        filterUser={filterUser}
      />
      {/* pagination */}
      <div className="pagination">
        <Pagination setPage={setPage} numberPage={numberPage} />
        <p style={{ marginRight: '10px' }}>
          <span>{numberUser}</span> Items
        </p>
        <div style={{ display: 'flex' }}>
          {/* count per page */}
          <select
            className="select-per-page"
            onChange={async (e) => {
              if (e) {
                setFilterUser({ ...filterUser, count: Number(e.target.value) });
                const json = await dispatch(
                  fetchThunk(
                    'https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list',
                    'post',
                    { ...filterUser, count: Number(e.target.value) },
                    true,
                    ''
                  )
                );
                setNumberPage(Math.ceil(json.recordsTotal / Number(e.target.value)));
                dispatch(getListUser(json.data));
                setIsFiltering(true);
                setNumberUser(Number(json.recordsTotal));
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
      <div className={`footer ${isSortSideBar ? 'sorted' : ''}`}>
        <button className="btn-multi-delete" onClick={() => handleDelete()}>
          Remove selected
        </button>
      </div>
      {isLoading ? <LoadingPage /> : ''}
    </div>
  );
};

export default HomePage;
