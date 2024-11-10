import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import { Platform, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HTMLView from 'react-native-htmlview';
import { Button, H2, ScrollView } from 'tamagui';
import { appleLogin, facebookLogin, getShop } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { Container, StyledButton } from '~/tamagui.config';
import * as AppleAuthentication from 'expo-apple-authentication';
import Toast from 'react-native-toast-message';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import FBAccessToken from 'react-native-fbsdk-next/lib/typescript/src/FBAccessToken';

const AppleLogin = ({ onPress }: { onPress: () => void }) => {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ height: 32, width: '100%', alignSelf: 'center' }}
      onPress={onPress}
    />
  );
};
const Auth = () => {
  const { t } = useLocale();
  const { signin } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      return await getShop();
    },
  });

  const { isPending: isAppleLoginSubmitting, mutate: appleLoginMutate } = useMutation({
    mutationFn: ({
      email,
      username,
      appleUser,
      identityToken,
    }: {
      email: string | null;
      username: string;
      appleUser: string;
      identityToken: string | null;
    }) => {
      return appleLogin(email, username, appleUser, identityToken);
    },
    onSuccess: async (res) => {
      await signin(res.token, res.tokenExpAt);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.replace('/(app)/(root)/(tabs)/profile');
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

  const { isPending: isFacebookLoginSubmitting, mutate: facebookLoginMutate } = useMutation({
    mutationFn: ({ token }: { token: string }) => {
      return facebookLogin(token);
    },
    onSuccess: async (res) => {
      await signin(res.token, res.tokenExpAt);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.replace('/(app)/(root)/(tabs)/profile');
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

  if (!shop) return <></>;

  const onAppleLoginPress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);
      // signed in
      const { email, fullName, user, identityToken } = credential;
      const username = `${fullName?.givenName ?? ''} ${fullName?.familyName ?? ''}`;
      appleLoginMutate({ email, username, appleUser: user, identityToken });
    } catch (e) {
      console.log('cancel');
    }
  };

  const onFacebookLoginPress = async () => {
    try {
      const response = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (response.isCancelled) {
        console.log('cancelled');
      } else {
        const response: FBAccessToken | null = await AccessToken.getCurrentAccessToken();
        if (!response) return;
        facebookLoginMutate({ token: response.accessToken });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const disabled = isAppleLoginSubmitting || isFacebookLoginSubmitting;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container space="$5">
        <H2>{t('TnC')}</H2>
        <ScrollView maxHeight={'50%'}>
          <HTMLView value={shop.terms} />
        </ScrollView>
        <Link disabled={disabled} href="/auth/signin" asChild>
          <StyledButton disabled={disabled}>{t('signin')}</StyledButton>
        </Link>
        <TouchableOpacity disabled={disabled} onPress={onFacebookLoginPress}>
          <StyledButton disabled={disabled} bg="$blue10">
            {t('facebookLogin')}
          </StyledButton>
        </TouchableOpacity>
        {Platform.OS == 'ios' ? <AppleLogin onPress={onAppleLoginPress} /> : null}
        <Button disabled={disabled} variant="outlined" color={'$primary'}>
          {t('createVisitorAcc')}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export default Auth;
