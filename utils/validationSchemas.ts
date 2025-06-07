import * as Yup from 'yup';

/**
 * Creates a schema for validating an email field
 * @param t Translation function
 * @returns Yup schema for email validation
 */
export const createEmailSchema = (t: (key: string, options?: any) => string) => {
  return Yup.string()
    .email(t('regEmailEmailMessage'))
    .required(t('regEmailPresenceMessage'));
};

/**
 * Creates a schema for validating a password field
 * @param t Translation function
 * @returns Yup schema for password validation
 */
export const createPasswordSchema = (t: (key: string, options?: any) => string) => {
  return Yup.string()
    .min(4, t('regPasswordLengthMessage'))
    .required(t('regPasswordPresenceMessage'));
};

/**
 * Creates a schema for validating a confirm password field
 * @param t Translation function
 * @param passwordField The name of the password field to match against (default: 'password')
 * @returns Yup schema for confirm password validation
 */
export const createConfirmPasswordSchema = (
  t: (key: string, options?: any) => string,
  passwordField = 'password'
) => {
  return Yup.string()
    .oneOf([Yup.ref(passwordField)], t('regRetypePasswordMessage'))
    .required(t('regRetypePasswordMessage'));
};

/**
 * Creates a schema for validating a username field
 * @param t Translation function
 * @returns Yup schema for username validation
 */
export const createUsernameSchema = (t: (key: string, options?: any) => string) => {
  return Yup.string().required(t('regUsernamePresenceMessage'));
};

/**
 * Creates a complete registration form validation schema
 * @param t Translation function
 * @returns Yup schema for registration form validation
 */
export const createRegistrationSchema = (t: (key: string, options?: any) => string) => {
  return Yup.object().shape({
    username: createUsernameSchema(t),
    email: createEmailSchema(t),
    password: createPasswordSchema(t),
    confirmPassword: createConfirmPasswordSchema(t),
  });
};

/**
 * Creates a schema for validating a change password form
 * @param t Translation function
 * @returns Yup schema for change password form validation
 */
export const createChangePasswordSchema = (t: (key: string, options?: any) => string) => {
  return Yup.object().shape({
    password: createPasswordSchema(t),
    confirmPassword: createConfirmPasswordSchema(t),
  });
}; 