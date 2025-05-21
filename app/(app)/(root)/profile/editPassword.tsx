import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Label, YStack } from 'tamagui';
import { Formik } from 'formik';
import { getSelf, resetPassword, updateSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import * as Yup from 'yup';
import { Text } from 'tamagui';

type Values = {
  password: string;
  confirmPassword: string;
};

const EditPassword = () => {
  const { t } = useLocale();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  if (!token) return <></>;
  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });

  const { isPending: isSubmitting, mutate: updatePasswordMutate } = useMutation({
    mutationFn: ({ password }: { password: string }) => {
      return resetPassword(token, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigation.goBack();
    },
    onError: (e) => {
      console.log(e);
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  if (!user) {
    return <></>;
  }
  const onSubmit = async ({ password }: { password: string }) => {
    updatePasswordMutate({ password });
  };

  const Schema = Yup.object().shape({
    password: Yup.string()
      .min(4, t('regPasswordLengthMessage'))
      .required(t('regPasswordPresenceMessage')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('regRetypePasswordMessage'))
      .required(t('regRetypePasswordMessage')),
  });

  return (
    <Formik
      initialValues={{
        password: '',
      }}
      validateOnMount={false}
      validateOnChange={false}
      validationSchema={Schema}
      onSubmit={(values: Values) => {
        onSubmit(values);
      }}>
      {({ errors, values, handleChange, handleSubmit }) => {
        return (
          <Form flex={1} alignItems="center" onSubmit={handleSubmit}>
            <YStack w="100%" p="$2" space="$4">
              <YStack w="100%" alignItems="flex-start" space="$2">
                <Label>{t('password')}</Label>
                <Input
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  borderWidth={2}
                  disabled={isSubmitting}
                  value={values.password}
                  placeholder={t('password')}
                  placeholderTextColor={'slategrey'}
                  onChangeText={handleChange('password')}
                />
                {errors.password ? (
                  <Text color="$red10" fontSize={'$1'}>
                    {errors.password}
                  </Text>
                ) : null}
              </YStack>
              <YStack w="100%" alignItems="flex-start" space="$2">
                <Label>{t('confirmPassword')}</Label>
                <Input
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  borderWidth={2}
                  disabled={isSubmitting}
                  value={values.confirmPassword}
                  placeholder={t('confirmPassword')}
                  placeholderTextColor={'slategrey'}
                  onChangeText={handleChange('confirmPassword')}
                />
                {errors.confirmPassword ? (
                  <Text color="$red10" fontSize={'$1'}>
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

export default EditPassword;
