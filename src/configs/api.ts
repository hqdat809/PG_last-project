import { APIHost } from '../utils/constants';

enum APIService {
  api,
  apiAdmin,
  apiVendor,
  public,
}

function getBaseUrl(service: APIService) {
  if (service === APIService.api) {
    return `${APIHost}/api`;
  } else if (service === APIService.apiAdmin) {
    return `${APIHost}/apiAdmin`;
  } else if (service === APIService.apiVendor) {
    return `${APIHost}/apiVendor`;
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.api)}/authentication/login`,
  userProfile: `${getBaseUrl(APIService.public)}/user`,
  listUser: `${getBaseUrl(APIService.apiAdmin)}/users/list`,
  editUser: `${getBaseUrl(APIService.apiAdmin)}/users/edit`,
  listBrand: `${getBaseUrl(APIService.apiAdmin)}/brands/list`,
  listRole: `${getBaseUrl(APIService.apiAdmin)}/commons/role`,
  listCountry: `${getBaseUrl(APIService.apiAdmin)}/commons/country`,
  createProduct: `${getBaseUrl(APIService.apiAdmin)}/products/create`,
  createUser: `${getBaseUrl(APIService.apiAdmin)}/users/create`,
  uploadImage: `${getBaseUrl(APIService.api)}/products/upload-image`,
};
