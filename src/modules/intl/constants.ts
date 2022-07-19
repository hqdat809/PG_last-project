import { values } from 'lodash';
export const LS_LANG = 'lang';

export const listStatus = [
  {
    label: 'Any Status',
    value: [],
  },
  {
    label: 'Enable',
    value: ['E'],
  },

  {
    label: 'Disable',
    value: ['D'],
  },

  {
    label: 'Unapproved vendor',
    value: ['U'],
  },
];

export const listPriceType = [
  { label: '%', value: '%' },
  { label: '$', value: '$' },
];

export const listStatusCreate = [
  {
    label: 'Enable',
    value: 'E',
  },

  {
    label: 'Disable',
    value: 'D',
  },

  {
    label: 'Unapproved vendor',
    value: 'U',
  },
];

export const listMemberShip = [
  { label: 'Memberships', value: 'M_4', disabled: false },
  { label: 'Pending Memberships', value: 'P_4', disabled: false },
];

export const listType = [
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'Business',
    value: 'business',
  },
];

export const listCondition = [
  {
    label: 'New',
    value: '262',
  },
  {
    label: 'Used',
    value: '295',
  },
];

export const ogTagsType = [
  {
    label: 'Autogenerated',
    value: '0',
  },
  {
    label: 'Custom',
    value: '1',
  },
];

export const metaDesType = [
  {
    label: 'Autogenerated',
    value: 'A',
  },
  {
    label: 'Custom',
    value: 'C',
  },
];

export const listMemberCreate = [
  { label: 'Ignore Membership', value: '' },
  { label: 'General', value: '4' },
];

export const listMemberProduct = [{ label: 'General', value: 4, disabled: false }];

export const listAccessLevel = [
  { label: 'Vendor', value: '10' },
  { label: 'Administrator', value: '100' },
];

export const ItemPerPage = [
  { label: '25', value: 25 },
  { label: '10', value: 10 },
  { label: '50', value: 50 },
  { label: '75', value: 75 },
  { label: '100', value: 100 },
];

export const listStockStatus = [
  {
    label: 'Any stock status',
    value: '',
    disabled: false,
  },
  {
    label: 'In stock',
    value: 'in',
    disabled: false,
  },

  {
    label: 'Low stock',
    value: 'low',
    disabled: false,
  },

  {
    label: 'SOLD',
    value: 'out',
    disabled: false,
  },
];

export const listAvailability = [
  {
    label: 'Any availability status',
    value: 'all',
    disabled: false,
  },
  {
    label: 'Only enable',
    value: '1',
    disabled: false,
  },

  {
    label: 'Only disable',
    value: '0',
    disabled: false,
  },
];
