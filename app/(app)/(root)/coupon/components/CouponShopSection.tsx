import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import moment from 'moment';
import { SizableText } from 'tamagui';
import { Text } from 'tamagui';
import { XStack, YStack } from 'tamagui';
import { Container } from '~/tamagui.config';

const CouponShopSection = ({
  name,
  address,
  couponName,
  endDate,
}: {
  name: string;
  address: string;
  couponName: string;
  endDate: Date;
}) => {
  return (
    <Container gap="$2">
      <YStack gap="$2">
        <XStack gap="$2" ai="center">
          <AntDesign name="isv" color={tokens.color.gray10Dark.val} />
          <Text col="lightslategray">{name}</Text>
        </XStack>
        <XStack gap="$2" ai="center">
          <MaterialIcons name="location-pin" color={tokens.color.gray10Dark.val} />
          <Text col="lightslategray">{address}</Text>
        </XStack>
      </YStack>
      <XStack gap={4} ai="center">
        <AntDesign name="clockcircleo" />
        <SizableText>{moment(endDate).format('YYYY-MM-DD HH:mm')}</SizableText>
      </XStack>
      <Text>{couponName}</Text>
    </Container>
  );
};

export default CouponShopSection;
