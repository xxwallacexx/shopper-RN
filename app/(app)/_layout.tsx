import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(root)',
};

const Layout = () => {
  return (
    <Stack
      screenOptions={({}) => ({
        headerShown: false,
      })}>
      <Stack.Screen name="(root)" />
      <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

export default Layout;
