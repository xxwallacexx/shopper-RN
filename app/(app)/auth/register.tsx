import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { Input, Text, Form, Label, YStack } from 'tamagui';
import * as Yup from 'yup';

import { createUser } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

type Values = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const Register = () => {
  const { t } = useLocale();
  const { signin } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending: isSubmitting, mutate: registerMutate } = useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      return createUser(username, email, password);
    },
    onSuccess: async (res) => {
      await signin(res.token, res.tokenExpAt);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.replace('/(app)/(root)/(tabs)/profile');
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required(t('regUsernamePresenceMessage')),
    password: Yup.string()
      .min(4, t('regPasswordLengthMessage'))
      .required(t('regPasswordPresenceMessage')),
    email: Yup.string().email(t('regEmailEmailMessage')).required(t('regEmailPresenceMessage')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('regRetypePasswordMessage'))
      .required(t('regRetypePasswordMessage')),
  });

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validateOnMount={false}
      validateOnChange={false}
      validationSchema={SignupSchema}
      onSubmit={(values: Values) => {
        registerMutate(values);
      }}>
      {({ errors, values, handleChange, handleSubmit }) => {
        return (
          <Form f={1} ai="center" onSubmit={handleSubmit}>
            <YStack w="100%" p="$2" gap="$4">
              <YStack w="100%" ai="flex-start" gap="$2">
                <Label>{t('username')}</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  bw={2}
                  disabled={isSubmitting}
                  value={values.username}
                  placeholder={t('username')}
                  placeholderTextColor="slategrey"
                  onChangeText={handleChange('username')}
                />
                {errors.username ? (
                  <Text col="$red10" fos="$1">
                    {errors.username}
                  </Text>
                ) : null}
              </YStack>
              <YStack w="100%" ai="flex-start" gap="$2">
                <Label>{t('email')}</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  bw={2}
                  disabled={isSubmitting}
                  value={values.email}
                  placeholder={t('email')}
                  placeholderTextColor="slategrey"
                  onChangeText={handleChange('email')}
                />
                {errors.email ? (
                  <Text col="$red10" fos="$1">
                    {errors.email}
                  </Text>
                ) : null}
              </YStack>
              <YStack w="100%" ai="flex-start" gap="$2">
                <Label>{t('password')}</Label>
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  bw={2}
                  disabled={isSubmitting}
                  value={values.password}
                  placeholder={t('password')}
                  placeholderTextColor="slategrey"
                  onChangeText={handleChange('password')}
                />
                {errors.password ? (
                  <Text col="$red10" fos="$1">
                    {errors.password}
                  </Text>
                ) : null}
              </YStack>
              <YStack w="100%" ai="flex-start" gap="$2">
                <Label>{t('confirmPassword')}</Label>
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  bw={2}
                  disabled={isSubmitting}
                  value={values.confirmPassword}
                  placeholder={t('confirmPassword')}
                  placeholderTextColor="slategrey"
                  onChangeText={handleChange('confirmPassword')}
                />
                {errors.confirmPassword ? (
                  <Text col="$red10" fos="$1">
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </YStack>
              <StyledButton onPress={() => handleSubmit()} disabled={isSubmitting} w="100%">
                {t('confirm')}
              </StyledButton>
            </YStack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Register;
