export interface ContactFormProps {
  name: string;
  disabled: boolean;
  onNameChange: (value: string) => void;
  isVerified: boolean;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  verifyCode: string;
  seconds: number;
  isVerifyCodeSubmitting: boolean;
  onVerifyCodePress: () => void;
  onGetVerifyCodePress: () => void;
  onVerifyCodeChange: (value: string) => void;
}

export interface VerificationStatusProps {
  isVerified: boolean;
}

export interface PhoneNumberInputProps
  extends Pick<
    ContactFormProps,
    | 'phoneNumber'
    | 'disabled'
    | 'isVerified'
    | 'onPhoneNumberChange'
    | 'seconds'
    | 'onGetVerifyCodePress'
  > {}

export interface VerificationCodeInputProps
  extends Pick<
    ContactFormProps,
    | 'isVerified'
    | 'verifyCode'
    | 'disabled'
    | 'onVerifyCodeChange'
    | 'isVerifyCodeSubmitting'
    | 'onVerifyCodePress'
  > {}
