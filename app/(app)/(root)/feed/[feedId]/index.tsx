import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { FlatList } from 'react-native';
import { Image, Separator, SizableText, Stack } from 'tamagui';
import { XStack } from 'tamagui';
import { YStack } from 'tamagui';
import {
  createFeedLike,
  getFeed,
  getFeedLike,
  getSelf,
  listFeedComments,
  removeFeedLike,
  removeFeedComment,
} from '~/api';
import { BannerCarousel, Spinner } from '~/components';
import { Container, StyledButton, Title } from '~/tamagui.config';
import { Feed as TFeed } from '~/types';
import HTMLView from 'react-native-htmlview';
import { AntDesign, EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth, useLocale } from '~/hooks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { tokens } from '@tamagui/themes';
import ActionSheet from '~/components/ActionSheet';
import { useState } from 'react';
import { ScrollView } from 'tamagui';
import Toast from 'react-native-toast-message';

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
    <YStack flex={1}>
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
        <HTMLView value={detail} />
      </YStack>
      <Separator w="100%" />
      <XStack p="$2" justifyContent="space-around">
        <TouchableOpacity onPress={onLikePress}>
          <XStack space="$2" alignItems="center">
            <AntDesign color={liked ? tokens.color.yellow7Light.val : '#000'} name="like1" />
            <SizableText>{t('like')}</SizableText>
          </XStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress}>
          <XStack space="$2" alignItems="center">
            <EvilIcons name="comment" />
            <SizableText>{t('comment')}</SizableText>
          </XStack>
        </TouchableOpacity>
      </XStack>
    </YStack>
  );
};

const CommentCard = ({
  isSelf,
  username,
  avatar,
  photos,
  comment,
  onPhotoPress,
  onActionPress,
  createdAt,
}: {
  isSelf: boolean;
  username: string;
  avatar: string;
  photos: string[];
  comment: string;
  onPhotoPress: (uri: string) => void;
  onActionPress: () => void;
  createdAt: Date;
}) => {
  return (
    <XStack p="$2" space="$1">
      <Stack w="$5" aspectRatio={1}>
        <Image flex={1} source={{ uri: avatar }} resizeMode="contain" />
      </Stack>
      <YStack p="$2" flex={1} borderRadius={'$radius.3'} bg="whitesmoke">
        <XStack justifyContent="space-between">
          <SizableText fontSize={'$7'} fontWeight={'bold'}>
            {username}
          </SizableText>
          {isSelf ? (
            <TouchableOpacity onPress={onActionPress}>
              <MaterialIcons name="more-horiz" size={18} />
            </TouchableOpacity>
          ) : null}
        </XStack>
        <FlatList
          data={photos}
          horizontal={true}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => onPhotoPress(item)}>
                <YStack
                  backgroundColor={'white'}
                  w="$14"
                  h="$14"
                  borderRadius={'$radius.3'}
                  shadowColor={'black'}
                  shadowOffset={{
                    height: 2,
                    width: 0,
                  }}
                  shadowOpacity={0.25}
                  shadowRadius={3.84}
                  justifyContent="center"
                  alignItems="center">
                  <YStack flex={1} borderRadius={'$radius.3'} overflow="hidden">
                    <Image
                      aspectRatio={1}
                      source={{ uri: item }}
                      width={'100%'}
                      resizeMode="contain"
                    />
                  </YStack>
                </YStack>
              </TouchableOpacity>
            );
          }}
        />

        <SizableText>{comment}</SizableText>
        <SizableText fontSize={'$2'}>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</SizableText>
      </YStack>
    </XStack>
  );
};

const FeedDetail = () => {
  const { t } = useLocale();
  const { token } = useAuth();
  const { feedId } = useLocalSearchParams<{ feedId: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [photoSheetPosition, setPhotoSheetPosition] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string>();

  const [isCommentActionSheetOpen, setIsCommentActionSheetOpen] = useState(false);
  const [commentActionSheetPosition, setCommentActionSheetPosition] = useState(0);
  const [selectedCommentId, setSelectedCommentId] = useState<string>();

  if (!token) return <></>;

  const { data: feed } = useQuery({
    queryKey: ['feed', feedId],
    queryFn: async () => {
      return await getFeed(feedId);
    },
  });

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });

  const { data: liked, refetch: refetchLiked } = useQuery({
    queryKey: ['feedLike', feedId],
    queryFn: async () => {
      return await getFeedLike(token, feedId);
    },
  });

  const {
    data: feedComments,
    isFetching: isFeedCommentsFetching,
    isFetchingNextPage: isFetchingMoreFeedComments,
    refetch: refetchFeedComments,
    fetchNextPage: fetchMoreFeedComments,
  } = useInfiniteQuery({
    queryKey: ['feedComments', feedId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listFeedComments(feedId, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const { isPending: isLikeMutating, mutate: likeMutate } = useMutation({
    mutationFn: async () => {
      if (isLikeMutating) return;
      if (liked) {
        return await removeFeedLike(token, feedId);
      }
      return await createFeedLike(token, feedId);
    },
    onSuccess: () => {
      refetchLiked();
      queryClient.resetQueries({ queryKey: ['feeds'] });
    },
  });

  const { isPending: isRemoveCommentSubmiting, mutate: removeCommentMutate } = useMutation({
    mutationFn: async ({ commentId }: { commentId: string }) => {
      return await removeFeedComment(token, commentId);
    },
    onSuccess: async (res) => {
      setIsCommentActionSheetOpen(false);
      refetchFeedComments();
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
    onError: (e) => {
      console.log(e);
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const onPhotoPress = (photo: string) => {
    setSelectedPhoto(photo);
    setIsPhotoSheetOpen(true);
  };

  const onActionPress = (commentId: string) => {
    setSelectedCommentId(commentId);
    setIsCommentActionSheetOpen(true);
  };

  const feedCommentsData = feedComments?.pages ? feedComments.pages.flat() : [];

  if (!feed || liked == undefined || !user) return <></>;
  return (
    <Stack>
      <FlatList
        data={feedCommentsData}
        renderItem={({ item }) => {
          return (
            <CommentCard
              isSelf={item.user._id == user._id}
              username={item.user.username}
              avatar={item.user.avatar}
              photos={item.photos.map((p) => {
                return p.path;
              })}
              comment={item.comment}
              createdAt={item.createdAt}
              onPhotoPress={onPhotoPress}
              onActionPress={() => onActionPress(item._id)}
            />
          );
        }}
        contentContainerStyle={{ backgroundColor: '#fff', padding: 12 }}
        ListHeaderComponent={() => {
          return (
            <Feed
              liked={liked}
              shopName={feed.shop.name}
              createdAt={feed.createdAt}
              photos={feed.photos}
              title={feed.title}
              detail={feed.detail}
              onLikePress={likeMutate}
              onCommentPress={() =>
                router.navigate({ pathname: '/feed/[feedId]/createComment', params: { feedId } })
              }
            />
          );
        }}
        onEndReached={() => fetchMoreFeedComments()}
        ListEmptyComponent={() => {
          if (isFeedCommentsFetching || isFetchingMoreFeedComments) {
            return null;
          }
          return (
            <Container flex={1} justifyContent="center" alignItems="center">
              <AntDesign name="folderopen" size={120} color={'#666'} />
              <Title>{t('emptyComment')}</Title>
            </Container>
          );
        }}
        ItemSeparatorComponent={() => {
          return <Separator />;
        }}
        ListFooterComponent={() => {
          if (!isFeedCommentsFetching && !isFetchingMoreFeedComments) {
            return null;
          }
          return (
            <XStack flex={1} space="$2" alignItems="center" justifyContent="center">
              <Spinner color="$color.primary" />
              <SizableText color="slategrey">{t('loading')}</SizableText>
            </XStack>
          );
        }}
      />
      <ActionSheet
        isSheetOpen={isCommentActionSheetOpen}
        setIsSheetOpen={setIsCommentActionSheetOpen}
        snapPoints={[60]}
        sheetPosition={commentActionSheetPosition}
        setSheetPosition={setCommentActionSheetPosition}>
        <ScrollView space="$4">
          <TouchableOpacity
            disabled={isRemoveCommentSubmiting}
            onPress={() => {
              setIsCommentActionSheetOpen(false);
              router.navigate({
                pathname: '/feedComment/[commentId]/editComment',
                params: { commentId: selectedCommentId },
              });
            }}>
            <StyledButton disabled={isRemoveCommentSubmiting}>{t('editComment')}</StyledButton>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isRemoveCommentSubmiting}
            onPress={() => {
              if (!selectedCommentId) return;
              removeCommentMutate({ commentId: selectedCommentId });
            }}>
            <StyledButton disabled={isRemoveCommentSubmiting}> {t('removeComment')}</StyledButton>
          </TouchableOpacity>
        </ScrollView>
      </ActionSheet>

      <ActionSheet
        isSheetOpen={isPhotoSheetOpen}
        setIsSheetOpen={setIsPhotoSheetOpen}
        snapPoints={[100]}
        sheetPosition={photoSheetPosition}
        setSheetPosition={setPhotoSheetPosition}>
        <YStack bg="black" flex={1} justifyContent="center" alignItems="center">
          <YStack position="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                setIsPhotoSheetOpen(false);
              }}>
              <Ionicons size={20} name="arrow-back" color="white" />
            </TouchableOpacity>
          </YStack>
          <Stack aspectRatio={1} w={'100%'}>
            <Image flex={1} resizeMode="contain" source={{ uri: selectedPhoto }} />
          </Stack>
        </YStack>
      </ActionSheet>
    </Stack>
  );
};

export default FeedDetail;
