import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Label, YStack } from 'tamagui';
import { getSelf, updateSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import { Address } from '~/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Text } from 'tamagui';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
      console.log(e);
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
        console.log(values);
        onSubmit(values);
      }}>
      {({ errors, values, handleChange, handleSubmit }) => {
        return (
          <Form flex={1} alignItems="center" onSubmit={handleSubmit}>
            <YStack w="100%" p="$2" space="$4">
              <YStack w="100%" alignItems="flex-start" space="$2">
                <Label>{t('username')}</Label>
                <Input
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  w="100%"
                  size="$4"
                  borderWidth={2}
                  disabled={isSubmitting}
                  value={values.username}
                  placeholder={t('username')}
                  placeholderTextColor={'slategrey'}
                  onChangeText={handleChange('username')}
                />
                {errors.username ? (
                  <Text color="$red10" fontSize={'$1'}>
                    {errors.username}
                  </Text>
                ) : null}
              </YStack>
              <TouchableOpacity onPress={() => handleSubmit()} disabled={isSubmitting}>
                <StyledButton disabled={isSubmitting} w="100%">
                  {t('confirm')}
                </StyledButton>
              </TouchableOpacity>
            </YStack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditUsername;
