import { ILoginParams, ILoginValidation } from '../../models/auth';
import { validEmailRegex } from '../../utils';
import * as Yup from 'yup';

const validateEmail = (email: string) => {
  if (!email) {
    return 'emailRequire';
  }

  if (!validEmailRegex.test(email)) {
    return 'emailInvalid';
  }

  return '';
};

const validatePassword = (password: string) => {
  if (!password) {
    return 'passwordRequire';
  }

  if (password.length < 4) {
    return 'minPasswordInvalid';
  }

  return '';
};

export const validateLogin = (values: ILoginParams): ILoginValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
};

export const validLogin = (values: ILoginValidation) => {
  return !values.email && !values.password;
};

export const SignupSchema = Yup.object().shape({
  email: Yup.string().email().required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(6, 'Password is too short - should be 8 chars minimum.')
    .matches(/(?=.*[0-9])/, 'Password must contain a number.'),
});

export const CreateUserSchema = Yup.object().shape({
  email: Yup.string().email().required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(6, 'Password is too short - should be 8 chars minimum.')
    .matches(/(?=.*[0-9])/, 'Password must contain a number.'),
  confirm_password: Yup.string()
    .required('Please repeat your password')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  firstName: Yup.string().required('Please enter your first name'),
  lastName: Yup.string().required('Please enter your last name'),
});

export const CreateProductSchema = Yup.object().shape({
  name: Yup.string().required('This field is required'),
  price: Yup.number().required('This field is required'),
  quantity: Yup.string().required('This field is required'),
});

export const UpdateUserSchema = Yup.object().shape({
  email: Yup.string().email().required('Required'),
  firstName: Yup.string().required('Please enter your first name'),
  lastName: Yup.string().required('Please enter your last name'),
});
