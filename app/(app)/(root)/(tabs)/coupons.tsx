import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import {
  SectionList,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Image, ScrollView, SizableText, XStack, YStack } from 'tamagui';
import { Spinner } from '~/components';
import { getCredit, getShop, listCoupons } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import { Badge, Container, StyledButton, Title } from '~/tamagui.config';
import { Coupon } from '~/types';
import ActionSheet from '~/components/ActionSheet';

const Coupons = () => {
  const { t } = useLocale();
  const { token } = useAuth();
  if (!token) return <></>;
  const sortOptions = [
    { label: t('newToOld'), value: '-endDate' },
    { label: t('oldToNew'), value: 'endDate' },
    { label: t('creditHighToLow'), value: '-credit' },
    { label: t('creditLowToHigh'), value: 'credit' },
  ];
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value);
  const [isSortingSheetOpen, setIsSortingSheetOpen] = useState(false);
  const [sortingSheetPosition, setSortingSheetPoistion] = useState(0);

  const { data: shop } = useQuery({ queryKey: ['shop'], queryFn: getShop });
  const { data: credit, refetch: refetchCredit } = useQuery({
    queryKey: ['credit', token],
    queryFn: async () => {
      return await getCredit(token);
    },
  });
  const {
    data: coupons,
    isFetching: isCouponsFetching,
    isFetchingNextPage: isFetchingMoreCoupons,
    fetchNextPage: fetchMoreCoupons,
    hasNextPage: couponsHasNextPage,
    refetch: refetchCoupons,
  } = useInfiniteQuery({
    queryKey: ['coupons', selectedSortOption],
    initialPageParam: 0,
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return listCoupons(token, pageParam, selectedSortOption, undefined);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });
  const couponsData = coupons?.pages ? coupons.pages.flat() : [];

  if (!shop || credit == undefined) {
    return <></>;
  }
  const onRefresh = () => {
    refetchCredit();
    refetchCoupons();
  };

  const onEndReached = () => {
    fetchMoreCoupons();
  };

  const renderCoupons = ({ item }: { item: Coupon }) => {
    return (
      <Link href={`/coupon/${item._id}`} asChild>
        <TouchableOpacity style={{ width: '48%' }}>
          <YStack
            backgroundColor={'white'}
            flex={1}
            p="$4"
            borderRadius={'$radius.3'}
            shadowColor={'black'}
            shadowOffset={{
              height: 2,
              width: 0,
            }}
            shadowOpacity={0.25}
            shadowRadius={3.84}>
            <Image
              resizeMode="contain"
              aspectRatio={1}
              source={{ uri: item.photo }}
              width={'100%'}
            />
            <Badge position="absolute" top={22} right={22}>
              <SizableText fontSize={8} color="#fff">
                {t('couponCredit', { credit: item.credit })}
              </SizableText>
            </Badge>
            <XStack space={4} alignItems="center">
              <AntDesign name="clockcircleo" color={tokens.color.gray10Dark.val} />
              <SizableText color="lightslategrey">
                {moment(item.endDate).format('YYYY-MM-DD HH:mm')}
              </SizableText>
            </XStack>
            <SizableText>{item.name}</SizableText>
          </YStack>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        data={couponsData}
        renderItem={renderCoupons}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1 }}
        ListHeaderComponent={() => {
          return (
            <YStack>
              <YStack>
                <Image aspectRatio={16 / 9} source={{ uri: shop.couponCover }} width={'100%'} />
                <Badge position="absolute" bottom={22} left={22}>
                  <SizableText size={8} color="#fff">
                    {t('credit')}: {credit}
                  </SizableText>
                </Badge>
              </YStack>
              <YStack p={'$4'} flex={1} alignItems="flex-end" justifyContent="flex-end">
                <StyledButton onPress={() => setIsSortingSheetOpen(true)}>
                  {
                    sortOptions.find((s) => {
                      return s.value == selectedSortOption;
                    })?.label
                  }
                </StyledButton>
              </YStack>
            </YStack>
          );
        }}
        columnWrapperStyle={{
          flex: 1,
          padding: 12,
          justifyContent: 'space-between',
        }}
        ListFooterComponent={() => {
          if (!isCouponsFetching && !isFetchingMoreCoupons) {
            return null;
          }
          return (
            <XStack flex={1} space="$2" alignItems="center" justifyContent="center">
              <Spinner color="$color.primary" />
              <SizableText color="slategrey">{t('loading')}</SizableText>
            </XStack>
          );
        }}
        ListEmptyComponent={() => {
          if (isCouponsFetching || isFetchingMoreCoupons) {
            return null;
          }
          return (
            <Container alignItems="center">
              <AntDesign name="folderopen" size={120} color="$666" />
              <Title>{t('emptyContent')}</Title>
            </Container>
          );
        }}
      />
      <ActionSheet
        isSheetOpen={isSortingSheetOpen}
        setIsSheetOpen={setIsSortingSheetOpen}
        sheetPosition={sortingSheetPosition}
        setSheetPosition={setSortingSheetPoistion}>
        <ScrollView>
          <YStack space={'$4'}>
            {sortOptions.map((option, index) => {
              const isSelected = option.value == selectedSortOption;
              return (
                <StyledButton
                  onPress={() => {
                    setIsSortingSheetOpen(false);
                    setSelectedSortOption(option.value);
                  }}
                  key={option.value + index.toString()}
                  width={'100%'}
                  backgroundColor={isSelected ? '$color.primary' : 'lightslategrey'}>
                  {option.label}
                </StyledButton>
              );
            })}
          </YStack>
        </ScrollView>
      </ActionSheet>
    </SafeAreaView>
  );
};

export default Coupons;
