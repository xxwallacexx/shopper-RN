import { AntDesign } from '@expo/vector-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import { FlatList, SafeAreaView, SectionList, TouchableOpacity } from 'react-native';
import { ScrollView, Stack, Image, YStack, SizableText, AnimatePresence } from 'tamagui';

import { getSelf, listBookmarks, listUserCoupon, listOrders } from '~/api';
import { AnimatedTabs, CouponCard, ProductCard, ActionSheet, Loader } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { AnimatedYStack, Container, StyledButton, Title } from '~/tamagui.config';
import { Bookmark, Order, UserCoupon } from '~/types';

const Profile = () => {
  const { t } = useLocale();
  const { token } = useAuth();
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetPosition, setSheetPoistion] = useState(0);
  const [isGuestUserAlertSheetOpen, setIsGuestUserAlertSheetOpen] = useState(false);
  const [guestUserAlertSheetPosition, setGuestUserAlertSheetPoistion] = useState(0);

  if (!token) return <></>;
  const tabs = [
    { label: t('myBookmarks'), value: 'myBookmarks' },
    { label: t('myWallet'), value: 'myWallet' },
    { label: t('myOrders'), value: 'myOrders' },
  ];

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });

  const {
    data: bookmarks,
    isFetching: isBookmarksFetching,
    isFetchingNextPage: isFetchingMoreBookmarks,
    fetchNextPage: fetchMoreBookmarks,
  } = useInfiniteQuery({
    queryKey: ['bookmarks', token],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listBookmarks(token, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const {
    data: userCoupons,
    isFetching: isUserCouponsFetching,
    isFetchingNextPage: isFetchingMoreUserCoupons,
    fetchNextPage: fetchMoreUserCoupons,
  } = useInfiniteQuery({
    queryKey: ['userCoupons', token],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listUserCoupon(token, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const {
    data: orders,
    isFetching: isOrdersFetching,
    isFetchingNextPage: isFetchingMoreOrders,
    fetchNextPage: fetchMoreOrders,
  } = useInfiniteQuery({
    queryKey: ['orders', token],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listOrders(token, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const bookmarksData = bookmarks?.pages ? bookmarks.pages.flat() : [];
  const userCouponsData = userCoupons?.pages ? userCoupons.pages.flat() : [];
  const ordersData = orders?.pages ? orders.pages.flat() : [];

  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  const onEndReached = () => {
    switch (selectedTab) {
      case 'myBookmarks':
        fetchMoreBookmarks();
        break;
      case 'myWallet':
        fetchMoreUserCoupons();
        break;
      case 'myOrders':
        fetchMoreOrders();
        break;
      default:
        break;
    }
  };

  const renderBookmark = ({ item }: { item: Bookmark }) => {
    const { product } = item;
    const { _id, price, category, name, introduction, photos } = product;
    const uri = photos[0].path;
    return (
      <Link href={`/product/${_id}`} asChild>
        <Stack w="48%" pressStyle={{ o: 0.5 }}>
          <ProductCard
            imageUri={uri}
            price={price}
            categoryName={category.name}
            name={name}
            introduction={introduction}
          />
        </Stack>
      </Link>
    );
  };

  const renderUserCoupon = ({ item }: { item: UserCoupon }) => {
    const { coupon } = item;
    const { _id, name, credit, photo, endDate } = coupon;
    return (
      <Link href={`/coupon/${_id}`} asChild>
        <Stack w="48%" pressStyle={{ o: 0.5 }}>
          <CouponCard imageUri={photo} name={name} endDate={endDate} credit={credit} />
        </Stack>
      </Link>
    );
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const { _id, products, createdAt, reservations, shippingFee, price } = item;
    const totalProducts = products.reduce((acc, f) => {
      return acc + f.quantity;
    }, 0);
    const ashippingFee = shippingFee ?? 0;
    return (
      <Link href={`/order/${_id}`} asChild>
        <TouchableOpacity>
          <YStack
            f={1}
            bc="white"
            p="$2"
            m="$2"
            gap="$1"
            br="$radius.3"
            shac="black"
            shof={{
              height: 2,
              width: 0,
            }}
            shop={0.25}
            shar={3.84}>
            <SizableText>
              {t('orderCreatedAt', { date: moment(createdAt).format('YYYY-MM-DD') })}
            </SizableText>
            <SizableText numberOfLines={1}>
              {t('orderSummary', {
                totalProducts,
                totalReservations: reservations.length,
                shippingFee: ashippingFee,
                price,
              })}
            </SizableText>
          </YStack>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'myBookmarks':
        return (
          <FlatList
            data={bookmarksData}
            renderItem={renderBookmark}
            numColumns={2}
            keyExtractor={(item, index) => item._id}
            style={{ flex: 1 }}
            columnWrapperStyle={{
              flex: 1,
              padding: 12,
              justifyContent: 'space-between',
            }}
            ListFooterComponent={() => {
              if (!isBookmarksFetching && !isFetchingMoreBookmarks) {
                return null;
              }
              return <Loader />;
            }}
            ListEmptyComponent={() => {
              if (isBookmarksFetching || isFetchingMoreBookmarks) {
                return null;
              }
              return (
                <Container ai="center">
                  <AntDesign name="folderopen" size={120} color="#666" />
                  <Title>{t('emptyBookmark')}</Title>
                </Container>
              );
            }}
          />
        );
      case 'myWallet':
        return (
          <FlatList
            data={userCouponsData}
            renderItem={renderUserCoupon}
            numColumns={2}
            keyExtractor={(item, index) => item._id}
            style={{ flex: 1 }}
            columnWrapperStyle={{
              flex: 1,
              padding: 12,
              justifyContent: 'space-between',
            }}
            ListFooterComponent={() => {
              if (!isUserCouponsFetching && !isFetchingMoreUserCoupons) {
                return null;
              }
              return <Loader />;
            }}
            ListEmptyComponent={() => {
              if (isUserCouponsFetching || isFetchingMoreUserCoupons) {
                return null;
              }
              return (
                <Container ai="center">
                  <AntDesign name="folderopen" size={120} color="#666" />
                  <Title>{t('emptyCoupon')}</Title>
                </Container>
              );
            }}
          />
        );
      case 'myOrders':
        return (
          <FlatList
            data={ordersData}
            renderItem={renderOrder}
            keyExtractor={(item, index) => item._id}
            style={{ flex: 1 }}
            ListFooterComponent={() => {
              if (!isOrdersFetching && !isFetchingMoreOrders) {
                return null;
              }
              return <Loader />;
            }}
            ListEmptyComponent={() => {
              if (isUserCouponsFetching || isFetchingMoreUserCoupons) {
                return null;
              }
              return (
                <Container ai="center">
                  <AntDesign name="folderopen" size={120} color="#666" />
                  <Title>{t('emptyOrderHistory')}</Title>
                </Container>
              );
            }}
          />
        );

      default:
        return <></>;
    }
  };

  const renderSectionItem = ({ section }) => {
    switch (section.key) {
      case 'main':
        return (
          <YStack gap="$2" p="$2" ai="center">
            {user?.isTemp ? (
              <StyledButton
                onPress={() => {
                  setIsGuestUserAlertSheetOpen(true);
                }}
                bc="red"
                w="80%">
                <SizableText col="#fff">{t('tempAcc')}</SizableText>
              </StyledButton>
            ) : null}
            <TouchableOpacity
              style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => setIsSheetOpen(true)}>
              <YStack w="100%" ai="center" gap="$2">
                <Image
                  objectFit="contain"
                  aspectRatio={1}
                  source={{ uri: user?.avatar }}
                  width="20%"
                />
                <SizableText>{user?.username}</SizableText>
              </YStack>
            </TouchableOpacity>
          </YStack>
        );
      case 'tabView':
        return (
          <AnimatePresence
            exitBeforeEnter
            custom={{ enterVariant: 'defaultFade', exitVariant: 'defaultFase' }}>
            <AnimatedYStack key={selectedTab} animation="100ms" x={0} o={1} f={1}>
              {renderTabContent()}
            </AnimatedYStack>
          </AnimatePresence>
        );

      default:
        return <></>;
    }
  };

  const renderSectionHeader = ({ section }) => {
    switch (section.key) {
      case 'tabView':
        return (
          <AnimatedTabs tabs={tabs} initialTab={tabs[0].value} onTabChanged={setSelectedTab} />
        );

      default:
        return <></>;
    }
  };

  const onQRPaymentPress = () => {
    setIsSheetOpen(false);
    router.navigate({ pathname: '/qrPayment' });
  };

  const onQRPaymentHistoryPress = () => {
    setIsSheetOpen(false);
    router.navigate({ pathname: '/qrPayment/history' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SectionList
        onEndReached={onEndReached}
        renderItem={renderSectionItem}
        sections={[
          { key: 'main', data: [''] },
          { key: 'tabView', data: [''] },
        ]}
        renderSectionHeader={renderSectionHeader}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
      />
      <ActionSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPoistion}>
        <ScrollView>
          <YStack gap="$4">
            <StyledButton onPress={onQRPaymentPress}>{t('QRPayment')}</StyledButton>
            <StyledButton onPress={onQRPaymentHistoryPress}>{t('QRPaymentHistory')}</StyledButton>
          </YStack>
        </ScrollView>
      </ActionSheet>
      <ActionSheet
        isSheetOpen={isGuestUserAlertSheetOpen}
        setIsSheetOpen={setIsGuestUserAlertSheetOpen}
        sheetPosition={guestUserAlertSheetPosition}
        setSheetPosition={setGuestUserAlertSheetPoistion}>
        <ScrollView>
          <SizableText>{t('tempAccAlert')}</SizableText>
        </ScrollView>
      </ActionSheet>
    </SafeAreaView>
  );
};

export default Profile;
