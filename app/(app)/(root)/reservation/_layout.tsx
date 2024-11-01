import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        title: '',
        headerShown: false,
      })}>
      <Stack.Screen name="[reservationId]" />
    </Stack>
  );
};

export default Layout;
