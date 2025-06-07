import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface TabBarIconProps {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  testID?: string;
  size?: number;
}

const TabBarIcon = ({ name, color, testID, size = 28 }: TabBarIconProps) => {
  return (
    <View testID={testID}>
      <MaterialIcons name={name} size={size} color={color} style={styles.tabBarIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});

export default TabBarIcon; 