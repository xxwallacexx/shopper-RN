import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Input } from 'tamagui';
import { Form, Label, YStack } from 'tamagui';
import { ScrollView } from 'tamagui';
import { login } from '~/api';
import { Spinner } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const Signin = () => {
  const { t } = useLocale();
  const { signin } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending: isSubmitting, mutate: loginMutate } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return login(email, password);
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

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const disabled = !email || email == '' || !password || password == '';

  const onSubmit = () => {
    if (!email || !password) return;
    loginMutate({ email, password });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView bg="white" p="$4">
        <Form onSubmit={onSubmit}>
          <YStack gap="$2" p="$2">
            <Label>{t('email')}</Label>
            <Input
              autoCapitalize="none"
              disabled={isSubmitting}
              boc={'lightgrey'}
              bc={'whitesmoke'}
              onChangeText={(value) => setEmail(value)}
            />
            <Label>{t('password')}</Label>
            <Input
              autoCapitalize="none"
              disabled={isSubmitting}
              boc={'lightgrey'}
              bc={'whitesmoke'}
              onChangeText={(value) => setPassword(value)}
            />
            <Form.Trigger asChild disabled={isSubmitting}>
              <StyledButton
                disabled={disabled}
                als="center"
                m="$4"
                w="$20"
                style={{ opacity: isSubmitting ? 0.5 : 1 }}
                icon={isSubmitting ? <Spinner /> : null}>
                {t('confirm')}
              </StyledButton>
            </Form.Trigger>
            <Spinner />
          </YStack>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
