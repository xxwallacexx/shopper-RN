
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={({ navigation }) => ({
      headerShown: false
    })}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
    </Stack>
  );
}

export default Layout
