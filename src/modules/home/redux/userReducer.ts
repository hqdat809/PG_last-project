import { IGetUser } from 'models/user';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IOptionsHasDisabled } from '../../../models/user';

export interface UserManagerState {
  listUser?: IGetUser[];
  listCountry?: IOptionsHasDisabled[];
  listRole?: IOptionsHasDisabled[];
  isSortSideBar?: boolean;
}

export const getListUser = createCustomAction('user/getListUser', (data: IGetUser[]) => ({
  data,
}));

export const setListCountry = createCustomAction(
  'user/setListCountry',
  (data: IOptionsHasDisabled[]) => ({
    data,
  })
);

export const setListRole = createCustomAction(
  'user/setListRole',
  (data: IOptionsHasDisabled[]) => ({
    data,
  })
);

export const setIsSortSideBar = createCustomAction('user/setIsSortSideBar', (data: boolean) => ({
  data,
}));

const actions = {
  getListUser,
  setListCountry,
  setListRole,
  setIsSortSideBar,
};

type Action = ActionType<typeof actions>;

export default function reducer(
  state: UserManagerState = { isSortSideBar: false },
  action: Action
) {
  switch (action.type) {
    case getType(getListUser):
      return { ...state, listUser: action.data };
    case getType(setListCountry):
      return { ...state, listCountry: action.data };
    case getType(setListRole):
      return { ...state, listRole: action.data };
    case getType(setIsSortSideBar):
      return { ...state, isSortSideBar: action.data };
    default:
      return state;
  }
}
