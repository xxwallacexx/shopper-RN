import moment from 'moment';
import { SizableText, XStack, YStack } from 'tamagui';
import { Feed } from '~/types';
import BannerCarousel from './BannerCarousel';
import { Title } from '~/tamagui.config';
import { useLocale } from '~/hooks';

const FeedCard = ({
  shopName,
  createdAt,
  photos,
  title,
  likeCount,
  commentCount,
}: {
  shopName: string;
  createdAt: Date;
  photos: Feed['photos'];
  title: string;
  likeCount: number;
  commentCount: number;
}) => {
  const { t } = useLocale();
  return (
    <YStack
      flex={1}
      backgroundColor={'white'}
      space="$2"
      borderRadius={'$radius.3'}
      shadowColor={'black'}
      shadowOffset={{
        height: 2,
        width: 0,
      }}
      shadowOpacity={0.25}
      shadowRadius={3.84}>
      <XStack p="$4" w="100%" justifyContent="space-between">
        <SizableText color="$primary">{shopName}</SizableText>
        <SizableText>{moment(createdAt).format('YYYY-MM-DD')}</SizableText>
      </XStack>
      <BannerCarousel
        banners={photos.map((p) => {
          return { type: p.type, uri: p.path };
        })}
      />
      <YStack p="$2" space="$2">
        <Title>{title}</Title>
        <XStack space="$2">
          <SizableText size={'$2'}>
            {likeCount} {t('likeCount')}
          </SizableText>
          <SizableText size={'$2'}>
            {commentCount} {t('commentCount')}
          </SizableText>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default FeedCard;
