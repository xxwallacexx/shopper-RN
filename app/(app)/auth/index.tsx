import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link, useRouter } from 'expo-router';
import { Platform, SafeAreaView } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import FBAccessToken from 'react-native-fbsdk-next/lib/typescript/src/FBAccessToken';
import HTMLView from 'react-native-htmlview';
import Toast from 'react-native-toast-message';
import { Button, H2, ScrollView, YStack } from 'tamagui';

import { appleLogin, createUserTemp, facebookLogin, getShop, googleLogin } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { Container, StyledButton } from '~/tamagui.config';

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

  const { data: hasPlayServices } = useQuery({
    queryKey: ['googlePlayService'],
    queryFn: async () => {
      return await GoogleSignin.hasPlayServices();
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
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const { isPending: isGoogleLoginSubmitting, mutate: googleLoginMutate } = useMutation({
    mutationFn: ({
      email,
      username,
      googleId,
      identityToken,
    }: {
      email: string;
      username: string;
      googleId: string;
      identityToken: string | null;
    }) => {
      return googleLogin(email, username, googleId, identityToken);
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

  const { isPending: isGuestLoginSubmitting, mutate: guestLoginMutate } = useMutation({
    mutationFn: () => {
      return createUserTemp();
    },
    onSuccess: async (res) => {
      await createUserTemp();
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

  if (!shop || hasPlayServices == undefined) return <></>;

  const onAppleLoginPress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      const { email, fullName, user, identityToken } = credential;
      const username = `${fullName?.givenName ?? ''} ${fullName?.familyName ?? ''}`;
      appleLoginMutate({ email, username, appleUser: user, identityToken });
    } catch (e) {}
  };

  const onFacebookLoginPress = async () => {
    try {
      const response = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (response.isCancelled) {
      } else {
        const response: FBAccessToken | null = await AccessToken.getCurrentAccessToken();
        if (!response) return;
        facebookLoginMutate({ token: response.accessToken });
      }
    } catch (e) {}
  };

  const onGoogleSigninPress = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      const { idToken: identityToken, user } = await GoogleSignin.signIn();
      const { email, name, id: googleId } = user;
      googleLoginMutate({ email, username: name ?? '', googleId, identityToken });
    } catch (e) {}
  };

  const disabled =
    isAppleLoginSubmitting ||
    isFacebookLoginSubmitting ||
    isGoogleLoginSubmitting ||
    isGuestLoginSubmitting;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container gap="$5">
        <H2>{t('TnC')}</H2>
        <ScrollView mah="50%">
          <HTMLView value={shop.terms} />
        </ScrollView>
        <Link disabled={disabled} href="/auth/signin" asChild>
          <StyledButton disabled={disabled}>{t('signin')}</StyledButton>
        </Link>
        <StyledButton onPress={onFacebookLoginPress} disabled={disabled} bg="$blue10">
          {t('facebookLogin')}
        </StyledButton>
        {hasPlayServices ? (
          <GoogleSigninButton
            disabled={disabled}
            style={{ width: '100%', height: 40 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={onGoogleSigninPress}
          />
        ) : null}
        {Platform.OS == 'ios' ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ height: 32, width: '100%', alignSelf: 'center' }}
            onPress={onAppleLoginPress}
          />
        ) : null}
        <YStack>
          <Link disabled={disabled} href="/auth/register" asChild>
            <Button disabled={disabled} variant="outlined" color="$primary">
              {t('createAcc')}
            </Button>
          </Link>
          <Button
            onPress={() => {
              return guestLoginMutate();
            }}
            disabled={disabled}
            variant="outlined"
            color="$primary">
            {t('createVisitorAcc')}
          </Button>
        </YStack>
      </Container>
    </SafeAreaView>
  );
};

export default Auth;
