import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Label, Text, YStack } from 'tamagui';
import { getSelf, updateSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import { Address } from '~/types';
import { Formik } from 'formik';
import * as Yup from 'yup';

type Values = {
  username: string;
};

const EditUsername = () => {
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
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const Schema = Yup.object().shape({
    username: Yup.string().required(t('regUsernamePresenceMessage')),
  });

  if (!user) {
    return <></>;
  }

  const onSubmit = async ({ username }: { username: string }) => {
    const { email, address } = user;
    updateSelfMutate({ token, username, email, address });
  };

  return (
    <Formik
      initialValues={{
        username: user.username,
      }}
      validateOnMount={false}
      validateOnChange={false}
      validationSchema={Schema}
      onSubmit={(values: Values) => {
        onSubmit(values);
      }}>
      {({ errors, values, handleChange, handleSubmit }) => {
        return (
          <Form f={1} ai="center" onSubmit={handleSubmit}>
            <YStack w="100%" p="$2" gap="$4">
              <YStack w="100%" ai="flex-start" gap="$2">
                <Label>{t('username')}</Label>
                <Input
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  bw={2}
                  disabled={isSubmitting}
                  value={values.username}
                  placeholder={t('username')}
                  placeholderTextColor={'slategrey'}
                  onChangeText={handleChange('username')}
                />
                {errors.username ? (
                  <Text col="$red10" fos={'$1'}>
                    {errors.username}
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

export default EditUsername;
