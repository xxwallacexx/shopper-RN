import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { Separator, SizableText, XStack, YStack } from 'tamagui';

import { BannerCarousel } from '~/components';
import { useLocale } from '~/hooks';
import { Title } from '~/tamagui.config';
import { Feed as TFeed } from '~/types';

const Feed = ({
  liked,
  shopName,
  createdAt,
  photos,
  title,
  detail,
  onLikePress,
  onCommentPress,
}: {
  liked: boolean;
  shopName: string;
  createdAt: Date;
  photos: TFeed['photos'];
  title: string;
  detail: string;
  onLikePress: () => void;
  onCommentPress: () => void;
}) => {
  const { t } = useLocale();
  return (
    <YStack f={1}>
      <XStack p="$4" w="100%" jc="space-between">
        <SizableText col="$primary">{shopName}</SizableText>
        <SizableText>{moment(createdAt).format('YYYY-MM-DD')}</SizableText>
      </XStack>
      <BannerCarousel
        banners={photos.map((p) => {
          return { type: p.type, uri: p.path };
        })}
      />
      <YStack p="$2" gap="$2">
        <Title>{title}</Title>
        <HTMLView value={detail} />
      </YStack>
      <Separator w="100%" />
      <XStack p="$2" jc="space-around">
        <TouchableOpacity onPress={onLikePress}>
          <XStack gap="$2" ai="center">
            <AntDesign color={liked ? tokens.color.yellow7Light.val : '#000'} name="like1" />
            <SizableText>{t('like')}</SizableText>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress}>
          <XStack gap="$2" ai="center">
            <EvilIcons name="comment" />
            <SizableText>{t('comment')}</SizableText>
          </XStack>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
};

export default Feed;
