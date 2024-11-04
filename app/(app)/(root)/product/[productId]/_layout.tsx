import { AntDesign } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '@env';

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
              <AntDesign name="arrowleft" size={24} color={'#fff'} />
            </TouchableOpacity>
          );
        },
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
      })}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="createComment" />
    </Stack>
  );
};

export default Layout;
