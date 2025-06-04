import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Image, Separator, SizableText, Stack, XStack, YStack, ScrollView } from 'tamagui';

import {
  createFeedLike,
  getFeed,
  getFeedLike,
  getSelf,
  listFeedComments,
  removeFeedLike,
  removeFeedComment,
} from '~/api';
import { CommentCard, Feed, Spinner, ActionSheet } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { Container, StyledButton, Title } from '~/tamagui.config';

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
      queryClient.resetQueries({ queryKey: ['feedComments'] });
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
    onError: (e) => {
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
            <Container f={1} jc="center" ai="center">
              <AntDesign name="folderopen" size={120} color="#666" />
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
            <XStack f={1} space="$2" ai="center" jc="center">
              <Spinner color="$color.primary" />
              <SizableText col="slategrey">{t('loading')}</SizableText>
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
        <ScrollView>
          <YStack gap="$4">
            <StyledButton
              onPress={() => {
                setIsCommentActionSheetOpen(false);
                router.navigate({
                  pathname: '/feedComment/[commentId]/editComment',
                  params: { commentId: selectedCommentId },
                });
              }}
              disabled={isRemoveCommentSubmiting}>
              {t('editComment')}
            </StyledButton>
            <StyledButton
              onPress={() => {
                if (!selectedCommentId) return;
                removeCommentMutate({ commentId: selectedCommentId });
              }}
              disabled={isRemoveCommentSubmiting}>
              {t('removeComment')}
            </StyledButton>
          </YStack>
        </ScrollView>
      </ActionSheet>

      <ActionSheet
        isSheetOpen={isPhotoSheetOpen}
        setIsSheetOpen={setIsPhotoSheetOpen}
        snapPoints={[100]}
        sheetPosition={photoSheetPosition}
        setSheetPosition={setPhotoSheetPosition}>
        <YStack bg="black" f={1} jc="center" ai="center">
          <YStack pos="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                setIsPhotoSheetOpen(false);
              }}>
              <Ionicons size={20} name="arrow-back" color="white" />
            </TouchableOpacity>
          </YStack>
          <Stack aspectRatio={1} w="100%">
            <Image f={1} objectFit="contain" source={{ uri: selectedPhoto }} />
          </Stack>
        </YStack>
      </ActionSheet>
    </Stack>
  );
};

export default FeedDetail;
