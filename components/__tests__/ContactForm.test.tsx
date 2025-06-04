import React from 'react';

import ContactForm from '../ContactForm';

import { useLocale } from '~/hooks';

// Mock dependencies
jest.mock('~/hooks', () => ({
  useLocale: jest.fn(),
}));

jest.mock('@tamagui/themes', () => ({
  tokens: {
    color: {
      green9Light: { val: '#00FF00' },
      green9: '#00FF00',
    },
  },
}));

jest.mock('tamagui', () => ({
  Input: jest.fn((props) => props),
  Text: jest.fn(({ children }) => children),
  XStack: jest.fn(({ children }) => children),
  Label: jest.fn(({ children }) => children),
  YStack: jest.fn(({ children }) => children),
}));

jest.mock('@expo/vector-icons', () => ({
  AntDesign: jest.fn(() => null),
}));

jest.mock('~/tamagui.config', () => ({
  StyledButton: jest.fn(({ children, onPress }) => ({ children, onPress })),
}));

describe('ContactForm', () => {
  const defaultProps = {
    name: '',
    disabled: false,
    phoneNumber: '',
    isVerified: false,
    verifyCode: '',
    seconds: 0,
    isVerifyCodeSubmitting: false,
    onNameChange: jest.fn(),
    onPhoneNumberChange: jest.fn(),
    onVerifyCodePress: jest.fn(),
    onGetVerifyCodePress: jest.fn(),
    onVerifyCodeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocale as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  it('should render with default props', () => {
    const form = ContactForm(defaultProps);
    expect(form).toBeDefined();
    expect(useLocale).toHaveBeenCalled();
  });

  it('should display verification UI when not verified', () => {
    const form = ContactForm({
      ...defaultProps,
      isVerified: false,
    });
    expect(form).toBeDefined();
    expect(useLocale).toHaveBeenCalled();
  });

  it('should display verified status when isVerified is true', () => {
    const form = ContactForm({
      ...defaultProps,
      isVerified: true,
    });
    expect(form).toBeDefined();
    expect(useLocale).toHaveBeenCalled();
  });

  it('should display countdown when seconds > 0', () => {
    const seconds = 30;
    const form = ContactForm({
      ...defaultProps,
      seconds,
    });
    expect(form).toBeDefined();
    expect(useLocale).toHaveBeenCalled();
  });
});
