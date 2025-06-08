import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Text, XStack } from 'tamagui';
import { tokens } from '@tamagui/themes';

const Shop = ({ name, address }: { name: string; address: string }) => {
  return (
    <>
      <XStack gap="$2" ai="center">
        <AntDesign name="isv" color={tokens.color.gray10Dark.val} />
        <Text fos="$2" col="lightslategray">
          {name}
        </Text>
      </XStack>
      <XStack gap="$2" ai="center">
        <MaterialIcons name="location-pin" color={tokens.color.gray10Dark.val} />
        <Text fos="$2" col="lightslategray">
          {address}
        </Text>
      </XStack>
    </>
  );
};

export default Shop;
