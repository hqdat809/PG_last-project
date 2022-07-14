import { values } from 'lodash';
export const LS_LANG = 'lang';

export const listStatus = [
  {
    label: 'Any Status',
    value: '',
    disabled: false,
  },
  {
    label: 'Enable',
    value: 'E',
    disabled: false,
  },

  {
    label: 'Disable',
    value: 'D',
    disabled: false,
  },

  {
    label: 'Unapproved vendor',
    value: 'U',
    disabled: false,
  },
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
  { label: 'All memberships', value: '', disabled: false },
  { label: 'Memberships', value: 'M_4', disabled: false },
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

export const listMemberCreate = [
  { label: 'Ignore Membership', value: '' },
  { label: 'General', value: '4' },
];

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
