import moment from 'moment';
import { Image, SizableText, Text, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { Badge } from '~/tamagui.config';

const CouponCard = ({
  imageUri,
  name,
  endDate,
  credit,
}: {
  imageUri: string;
  name: string;
  endDate: Date;
  credit: number;
}) => {
  const { t } = useLocale();

  return (
    <YStack
      bc="white"
      f={1}
      p="$4"
      br="$radius.3"
      shac="black"
      shof={{
        height: 2,
        width: 0,
      }}
      shop={0.25}
      shar={3.84}>
      <Image
        aspectRatio={1}
        source={{ uri: imageUri }}
        w="100%"
        objectFit="contain"
        borderRadius={4}
      />
      <Badge pos="absolute" t={22} r={22}>
        <SizableText fos={8} col="#fff">
          {t('couponCredit', { credit })}
        </SizableText>
      </Badge>
      <Text fos="$2" col="slategrey" numberOfLines={1} ellipsizeMode="tail">
        {moment(endDate).format('YYYY-MM-DD HH:mm')}
      </Text>
      <SizableText numberOfLines={1} ellipsizeMode="tail">
        {name}
      </SizableText>
    </YStack>
  );
};

export default CouponCard;
