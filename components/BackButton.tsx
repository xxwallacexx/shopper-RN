import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color?: string;
  size?: number;
  testID?: string;
}

const BackButton = ({ color = '#fff', size = 24, testID }: BackButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity testID={testID} onPress={() => navigation.goBack()}>
      <AntDesign name="arrowleft" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
