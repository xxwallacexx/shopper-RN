import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '@env';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
}

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: '#000',
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
        tabBarStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
        headerTitle: '',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
        }}
      />
      <Tabs.Screen
        name="carts"
        options={{
          headerShown: false,
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
        }}
      />
      <Tabs.Screen
        name="coupons"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
        }}
      />
      <Tabs.Screen
        name={'profile'}
        options={{
          tabBarLabel: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarButton: (props) => <TouchableOpacity {...props} />,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});

export default Layout;
