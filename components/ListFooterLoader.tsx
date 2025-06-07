import { StyleSheet, View } from 'react-native';
import { SizableText, XStack } from 'tamagui';
import Spinner from './Spinner';

interface ListFooterLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  spinnerColor?: string;
  testID?: string;
}

const ListFooterLoader = ({
  isLoading,
  loadingText = 'Loading...',
  spinnerColor = '$color.primary',
  testID,
}: ListFooterLoaderProps) => {
  if (!isLoading) {
    return null;
  }

  return (
    <XStack testID={testID} style={styles.container}>
      <Spinner color={spinnerColor} />
      <SizableText style={styles.text}>{loadingText}</SizableText>
    </XStack>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginLeft: 8,
    color: 'slategrey',
  },
});

export default ListFooterLoader;
