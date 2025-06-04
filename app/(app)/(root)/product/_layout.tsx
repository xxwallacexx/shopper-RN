import { PRIMARY_COLOR } from '@env';
import { AntDesign } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        title: '',
        headerShown: true,
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => {
                return navigation.goBack();
              }}>
              <AntDesign name="arrowleft" size={24} color="#fff" />
            </TouchableOpacity>
          );
        },
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
      })}>
      <Stack.Screen name="index" />
      <Stack.Screen options={{ headerShown: false }} name="[productId]" />
    </Stack>
  );
};

export default Layout;
