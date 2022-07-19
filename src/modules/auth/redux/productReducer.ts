import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IGetProduct } from './../../../models/product';
import { IOptions, IOptionsHasDisabled } from './../../../models/user';

export interface ProductState {
  listProduct?: IGetProduct[];
  listCategory?: IOptionsHasDisabled[];
  listBranch?: IOptions[];
}

export const getListProduct = createCustomAction('auth/getListProduct', (data: IGetProduct[]) => ({
  data,
}));

export const setListCategory = createCustomAction(
  'auth/setListCategory',
  (data: IOptionsHasDisabled[]) => ({
    data,
  })
);

export const setListBranch = createCustomAction('auth/setListBranch', (data: IOptions[]) => ({
  data,
}));

const actions = {
  getListProduct,
  setListCategory,
  setListBranch,
};

type Action = ActionType<typeof actions>;

export default function reducer(state: ProductState = {}, action: Action) {
  switch (action.type) {
    case getType(getListProduct):
      return { ...state, listProduct: action.data };
    case getType(setListCategory):
      return { ...state, listCategory: action.data };
    case getType(setListBranch):
      return { ...state, listBranch: action.data };
    default:
      return state;
  }
}
