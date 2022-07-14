export const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const APIHost = development ? '/api' : 'https://google.com';

export const ACCESS_TOKEN_KEY = 'token';

export const IS_LOGGED_IN = 'isLoggedIn';

export const USER_INFO = 'userInfo';

export const IS_REMEMBER = 'isRemember';

export const IS_REMEMBER_TRUE = 'rememberMe';

export const IS_REMEMBER_FALSE = 'notRememberMe';
