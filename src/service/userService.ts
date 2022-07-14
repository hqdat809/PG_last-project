import { IGetUser, IUserCreate, IUserDeleted, IUpdateUser, IFilterUser } from './../models/user';
import { ACCESS_TOKEN_KEY } from 'utils/constants';
import Cookies from 'js-cookie';

const getUser = (activePage: number) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify({ page: activePage, count: 25 }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const filterUser = (body: IFilterUser) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/list', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const deleteUser = (items: IUserDeleted) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify(items),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const createUser = (item: IUserCreate) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/create', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const updateUser = (item: IUpdateUser) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/users/edit', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const getUserDetail = (idUser: object) => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiVendor/profile/detail', {
        credentials: 'include',
        method: 'post',
        body: JSON.stringify(idUser),
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const getRole = () => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/role', {
        credentials: 'include',
        method: 'get',
        body: null,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

const getCountry = () => {
  return new Promise((resolve, reject) => {
    try {
      const res = fetch('https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country', {
        credentials: 'include',
        method: 'get',
        body: null,
        headers: {
          'Content-Type': 'application/json',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        },
      }).then((res) => {
        return res.json();
      });
      resolve(res);
    } catch (error) {
      console.log(error);
    }
  });
};

export {
  getUser,
  deleteUser,
  createUser,
  getUserDetail,
  updateUser,
  getRole,
  filterUser,
  getCountry,
};
