import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SizableText } from 'tamagui';

interface EmptyStateProps {
  message: string;
  iconName?: React.ComponentProps<typeof AntDesign>['name'];
  iconSize?: number;
  iconColor?: string;
  testID?: string;
}

const EmptyState = ({ 
  message, 
  iconName = 'folderopen', 
  iconSize = 80, 
  iconColor = '#666',
  testID
}: EmptyStateProps) => {
  return (
    <View testID={testID} style={styles.container}>
      <AntDesign name={iconName} size={iconSize} color={iconColor} />
      <SizableText size="$5" style={styles.message}>{message}</SizableText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  }
});

export default EmptyState; 