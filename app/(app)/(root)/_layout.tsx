import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack screenOptions={({ navigation }) => ({
      title: "",
      headerStyle: { backgroundColor: process.env.EXPO_PUBLIC_PRIMARY_COLOR ?? "#fff" }
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
