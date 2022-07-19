import { IGetUser } from 'models/user';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IOptionsHasDisabled } from './../../../models/user';

export interface UserManagerState {
  listUser?: IGetUser[];
  listCountry?: IOptionsHasDisabled[];
  listRole?: IOptionsHasDisabled[];
}

export const getListUser = createCustomAction('auth/getListUser', (data: IGetUser[]) => ({
  data,
}));

export const setListCountry = createCustomAction(
  'auth/setListCountry',
  (data: IOptionsHasDisabled[]) => ({
    data,
  })
);

export const setListRole = createCustomAction(
  'auth/setListRole',
  (data: IOptionsHasDisabled[]) => ({
    data,
  })
);

const actions = {
  getListUser,
  setListCountry,
  setListRole,
};

type Action = ActionType<typeof actions>;

export default function reducer(state: UserManagerState = {}, action: Action) {
  switch (action.type) {
    case getType(getListUser):
      return { ...state, listUser: action.data };
    case getType(setListCountry):
      return { ...state, listCountry: action.data };
    case getType(setListRole):
      return { ...state, listRole: action.data };
    default:
      return state;
  }
}
