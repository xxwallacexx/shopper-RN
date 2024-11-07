import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { XStack } from 'tamagui';
import { SizableText } from 'tamagui';
import { Spinner } from 'tamagui';
import { YStack, H2, Separator, ScrollView } from 'tamagui';
import { listFeeds } from '~/api';
import { FeedCard } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';

const Feeds = () => {
  const { t } = useLocale();
  const { token } = useAuth();
  const router = useRouter();

  if (!token) return <></>;

  const {
    data: feeds,
    isFetching: isFeedsFetching,
    isFetchingNextPage: isFetchingMoreFeeds,
    fetchNextPage: fetchMoreFeeds,
  } = useInfiniteQuery({
    queryKey: ['feeds'],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listFeeds(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });
  const feedsData = feeds?.pages ? feeds.pages.flat() : [];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        <FlatList
          data={feedsData}
          ListHeaderComponent={() => {
            return <Title>{t('shareFeed')}</Title>;
          }}
          contentContainerStyle={{ padding: 12, gap: 20 }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  router.navigate({ pathname: '/feed/[feedId]', params: { feedId: item._id } })
                }>
                <FeedCard
                  shopName={item.shop.name}
                  createdAt={item.createdAt}
                  photos={item.photos}
                  title={item.title}
                  likeCount={item.likeCount}
                  commentCount={item.commentCount}
                />
              </TouchableOpacity>
            );
          }}
          onEndReached={() => fetchMoreFeeds()}
          ListEmptyComponent={() => {
            if (isFeedsFetching || isFetchingMoreFeeds) {
              return null;
            }
            return (
              <Container flex={1} justifyContent="center" alignItems="center">
                <AntDesign name="folderopen" size={120} color={'#666'} />
                <Title>{t('emptyContent')}</Title>
              </Container>
            );
          }}
          ListFooterComponent={() => {
            if (!isFeedsFetching && !isFetchingMoreFeeds) {
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
      </YStack>
    </SafeAreaView>
  );
};

export default Feeds;
