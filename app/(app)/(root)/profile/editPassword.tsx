import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { Formik } from 'formik';
import { Form, Input, Label, ScrollView, YStack, Text } from 'tamagui';

import { getSelf, resetPassword } from '~/api';
import { Spinner } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { useMutationWithErrorHandling } from '~/hooks/useMutationWithErrorHandling';
import { StyledButton } from '~/tamagui.config';
import { createChangePasswordSchema } from '~/utils/validationSchemas';

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

  const { isPending: isSubmitting, mutate: updatePasswordMutate } = useMutationWithErrorHandling(
    {
      mutationFn: ({ password }: { password: string }) => {
        return resetPassword(token, password);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        navigation.goBack();
      },
    },
    t
  );

  if (!user) {
    return <></>;
  }

  // Use the pre-defined validation schema
  const Schema = createChangePasswordSchema(t);

  const initialValues: Values = {
    password: '',
    confirmPassword: '',
  };

  return (
    <ScrollView f={1} bg="white">
      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={(values) => {
          updatePasswordMutate({ password: values.password });
        }}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Form onSubmit={handleSubmit} f={1} gap="$4" p="$4">
            <YStack>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder={t('password')}
                secureTextEntry
              />
              {errors.password && touched.password ? (
                <Text col="red">{errors.password}</Text>
              ) : null}
            </YStack>
            <YStack>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder={t('confirmPassword')}
                secureTextEntry
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <Text col="red">{errors.confirmPassword}</Text>
              ) : null}
            </YStack>
            <StyledButton onPress={() => handleSubmit()} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : t('confirm')}
            </StyledButton>
          </Form>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditPassword;
