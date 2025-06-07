import { PRIMARY_COLOR } from '@env';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '~/components';

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: '#000',
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
        tabBarStyle: { backgroundColor: PRIMARY_COLOR ?? '#fff' },
        headerTitle: '',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon testID="home-tab" name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          headerTitle: '',
          tabBarIcon: ({ color }) => <TabBarIcon testID="feed-tab" name="rss-feed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="carts"
        options={{
          headerShown: false,
          headerTitle: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon testID="cart-tab" name="shopping-cart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coupons"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon testID="coupons-tab" name="confirmation-number" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon testID="profile-tab" name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
