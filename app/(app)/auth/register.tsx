import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { Input, Text, Form, Label, YStack } from 'tamagui';

import { createUser } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { useMutationWithErrorHandling } from '~/hooks/useMutationWithErrorHandling';
import { StyledButton } from '~/tamagui.config';
import { createRegistrationSchema } from '~/utils/validationSchemas';

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

  const { isPending: isSubmitting, mutate: registerMutate } = useMutationWithErrorHandling(
    {
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
    },
    t
  );

  // Use the pre-defined validation schema
  const SignupSchema = createRegistrationSchema(t);

  const initialValues: Values = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        registerMutate({
          username: values.username,
          email: values.email,
          password: values.password,
        });
      }}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <Form onSubmit={handleSubmit} f={1} gap="$4" p="$4">
          <YStack>
            <Label htmlFor="username">{t('username')}</Label>
            <Input
              id="username"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              placeholder={t('username')}
            />
            {errors.username && touched.username ? <Text col="red">{errors.username}</Text> : null}
          </YStack>
          <YStack>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder={t('email')}
              inputMode="email"
              autoCapitalize="none"
            />
            {errors.email && touched.email ? <Text col="red">{errors.email}</Text> : null}
          </YStack>
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
            {errors.password && touched.password ? <Text col="red">{errors.password}</Text> : null}
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
            {t('createAcc')}
          </StyledButton>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
