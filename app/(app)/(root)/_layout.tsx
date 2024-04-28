import { Stack } from 'expo-router';
import { PRIMARY_COLOR } from '@env';

const Layout = () => {
  return (
    <Stack screenOptions={({ navigation }) => ({
      title: "",
      headerStyle: { backgroundColor: PRIMARY_COLOR ?? "#fff" }
    })}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="product"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="coupon"
        options={{
          headerShown: false,
        }}
      />
    </Stack>

  );
}

export default Layout
