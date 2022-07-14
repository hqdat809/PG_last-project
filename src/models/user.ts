export interface AuthToken {
  accessToken: string;
}

export interface IUser {
  profile_id: string;
  login: string;
  firstName: string;
  lastName: string;
  dateOfLoginAttempt: string;
  countOfLoginAttempts: string;
  forceChangePassword: string;
}

export interface IGetUser {
  access_level: string;
  created: string;
  fistName: string;
  lastName: string;
  last_login: string;
  order: { order_as_buyer: number; order_as_buyer_total: number };
  product: number;
  profile_id: string;
  storeName: null;
  vendor: string;
  vendor_id: string;
  wishlist: string;
}

export interface IUserDeleted {
  params: { id: number; delete: number }[];
}

export interface IUpdateUser {
  params: {
    access_level: string;
    confirm_password: string;
    email: string;
    firstName: string;
    forceChangePassword: number;
    lastName: string;
    membership_id: string;
    password: string;
    paymentRailsType: string;
    roles: string[] | undefined;
    taxExempt: boolean;
    id: string | undefined;
    status: string;
    statusComment: string;
  }[];
}

export interface IUserCreate {
  access_level: string;
  confirm_password: string;
  email: string;
  firstName: string;
  forceChangePassword: number;
  lastName: string;
  membership_id: string;
  password: string;
  paymentRailsType: string;
  roles: string[] | undefined;
  taxExempt: boolean;
}

export interface IRolesUser {
  id: string;
  // enable: string;
  name: string;
}

export interface ICountry {
  active_currency: null;
  code: string;
  code3: string;
  country: string;
  currency_id: string;
  enabled: string;
  id: string;
  is_fraudlent: string;
}

export interface ICategory {
  id: string;
  name: string;
  parentId: string;
  path: string;
  pos: string;
}

export interface ICountrySelect {
  label: string;
  value: string;
  disabled: boolean;
}

export interface IDeleteUSer {
  id: number;
  delete: number;
}

export interface IFilterUser {
  address: string;
  count: number;
  country: string;
  date_range: string[];
  date_type: string;
  memberships: string[] | undefined;
  order_by: string;
  page: number;
  phone: string;
  search: string;
  sort: string;
  state: string;
  status: string[] | undefined;
  types: string[] | undefined;
  tz: number;
}

export interface IOptions {
  value: any | undefined;
  label: string | undefined;
}

export interface IOptionsHasDisabled {
  value: string;
  label: string;
  disabled: boolean;
}
