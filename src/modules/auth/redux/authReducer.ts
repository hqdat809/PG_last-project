import { IGetUser, IUser } from 'models/user';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';

export interface AuthState {
  accessToken?: string;
  user?: IUser;
  listUser?: IGetUser[];
  isLogged?: boolean;
}

export const setAuthorization = createCustomAction('auth/setAuthorization', (data: string) => ({
  data,
}));

export const clearAuthorization = createCustomAction('auth/clearAuthorization', () => {
  return;
});

export const setUserInfo = createCustomAction('auth/setUserInfo', (data: IUser) => ({
  data,
}));

export const clearUserInfo = createCustomAction('auth/clearUserInfo', () => {
  return;
});

export const setIsLogged = createCustomAction('auth/setIsLogged', (data: boolean) => ({ data }));

const actions = {
  setAuthorization,
  setUserInfo,
  clearUserInfo,
  clearAuthorization,
  setIsLogged,
};

type Action = ActionType<typeof actions>;

export default function reducer(state: AuthState = {}, action: Action) {
  switch (action.type) {
    case getType(setAuthorization):
      return { ...state, accessToken: action.data };
    case getType(setUserInfo):
      return { ...state, user: action.data };
    case getType(clearUserInfo):
      return { ...state, user: {} };
    case getType(clearAuthorization):
      return { ...state, accessToken: '' };
    case getType(setIsLogged):
      return { ...state, isLogged: action.data };
    default:
      return state;
  }
}
