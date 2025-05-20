import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Label, YStack } from 'tamagui';
import { Formik } from 'formik';
import { getSelf, updateSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import { Address } from '~/types';
import * as Yup from 'yup';
import { Text } from 'tamagui';

type Values = {
  email: string;
};

const EditEmail = () => {
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

  const { isPending: isSubmitting, mutate: updateSelfMutate } = useMutation({
    mutationFn: ({
      token,
      username,
      email,
      address,
    }: {
      token: string;
      username: string;
      email?: string;
      address?: Address;
    }) => {
      return updateSelf(token, username, email, address);
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
  const onSubmit = async ({ email }: { email: string }) => {
    const { username, address } = user;
    updateSelfMutate({ token, username, email, address });
  };

  const Schema = Yup.object().shape({
    email: Yup.string().email(t('regEmailEmailMessage')).required(t('regEmailPresenceMessage')),
  });

  return (
    <Formik
      initialValues={{
        email: '',
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
                <Label>{t('email')}</Label>
                <Input
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  borderWidth={2}
                  disabled={isSubmitting}
                  value={values.email}
                  placeholder={t('email')}
                  placeholderTextColor={'slategrey'}
                  onChangeText={handleChange('email')}
                />
                {errors.email ? (
                  <Text color="$red10" fontSize={'$1'}>
                    {errors.email}
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

export default EditEmail;
