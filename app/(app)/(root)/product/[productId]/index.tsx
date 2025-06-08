import { PRIMARY_9_COLOR } from '@env';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useFocusEffect, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  AlertDialog,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
  Stack,
  Image,
} from 'tamagui';

import {
  getProduct,
  listOptions,
  getProductPriceDetail,
  getProductIsBookmarked,
  removeBookmark,
  createBookmark,
  getShop,
  listReservations,
  reservationCreateCart,
  productCreateCart,
  getReservationTotalPrice,
  listProductComments,
  removeProductComment,
  getSelf,
} from '~/api';
import {
  ActionSheet,
  Dialog,
  OptionSheetContent,
  ProductCommentCard,
  ProductDetailSection,
  QuantitySelector,
} from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { BottomAction, Container, StyledButton, Title } from '~/tamagui.config';
import { OrderContent, ReservationContent, ReservationOption } from '~/types';

const Price = ({ isLoading, price }: { isLoading: boolean; price: number }) => {
  return <>{isLoading ? <Spinner /> : <SizableText>HK$ {price}</SizableText>}</>;
};

const ProductDetail = () => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useLocale();
  const { token } = useAuth();
  if (!token) return <></>;
  const [isOptionSheetOpen, setIsOptionSheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<{ optionId: string; choiceId: string }[]>(
    []
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddCartSuccessDialogOpen, setIsAddCartSuccessDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  //reservations
  const [selectedDate, setSelectedDate] = useState<string>();
  const [availableTimes, setAvailableTimes] = useState<Date[]>([]);
  const [selectedTime, setSeletedTime] = useState<Date>();
  const [availableReservationOptions, setAvailableReservationOptions] = useState<
    ReservationOption[]
  >([]);
  const [selectedReservationOption, setSelectedReservationOption] = useState<string>();
  const [isReservationOptionSheetOpen, setIsReservationOptionSheetOpen] = useState(false);
  const [reservationOptionsSheetPosition, setReservationOptionsSheetPosition] = useState(0);

  //comments
  const [isCommentsSheetOpen, setIsCommentsSheetOpen] = useState(false);
  const [commentsSheetPosition, setCommentsSheetPosition] = useState(0);

  //photo
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [photoSheetPosition, setPhotoSheetPosition] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string>();

  const [isCommentActionSheetOpen, setIsCommentActionSheetOpen] = useState(false);
  const [commentActionSheetPosition, setCommentActionSheetPosition] = useState(0);
  const [selectedCommentId, setSelectedCommentId] = useState<string>();

  const { isPending: isReservationCreateCartSubmiting, mutate: reservationCreateCartMutate } =
    useMutation({
      mutationFn: async ({
        reservationId,
        reservationContent,
      }: {
        reservationId: string;
        reservationContent: ReservationContent;
      }) => {
        return await reservationCreateCart(token, reservationId, reservationContent);
      },
      onSuccess: async (res) => {
        setIsOptionSheetOpen(false);
        setIsAddCartSuccessDialogOpen(true);
        queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      },
      onError: (e) => {
        const error = e as Error;
        Toast.show({
          type: 'error',
          text1: t(error.message),
        });
      },
    });

  const { isPending: isProductCreateCartSubmiting, mutate: productCreateCartMutate } = useMutation({
    mutationFn: async ({ orderContent }: { orderContent: OrderContent }) => {
      return await productCreateCart(token, productId, orderContent);
    },
    onSuccess: async (res) => {
      setIsOptionSheetOpen(false);
      setIsAddCartSuccessDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await getSelf(token);
    },
  });

  const { data: shop } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      return await getShop();
    },
  });

  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      return await getProduct(productId);
    },
  });

  const { data: options = [], isFetching: isOptionsFetching } = useQuery({
    queryKey: ['productOption', productId],
    queryFn: async () => {
      return await listOptions(productId);
    },
  });

  const {
    data: productComments,
    isFetching: isProductCommentsFetching,
    isFetchingNextPage: isFetchingMoreProductComments,
    fetchNextPage: fetchMoreProductComments,
    refetch: refetchProductComments,
  } = useInfiniteQuery({
    queryKey: ['productComments', productId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return await listProductComments(productId, pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage) return null;
      if (!lastPage.length) return null;
      return pages.flat().length;
    },
  });

  const productCommentsData = productComments?.pages ? productComments.pages.flat() : [];

  const orderContent = {
    choices: selectedChoices.map((c) => {
      return c.choiceId;
    }),
    quantity,
  };

  const { data: priceDetail, isFetching: isPriceDetailFetching } = useQuery({
    queryKey: ['priceDetail', productId, selectedChoices, quantity],
    queryFn: async () => {
      return await getProductPriceDetail(token, productId, orderContent);
    },
    enabled: product?.productType == 'ORDER',
  });

  const { data: reservationTotalPrice, isFetching: isReservationTotalPriceFetching } = useQuery({
    queryKey: ['reservationTotalPrice', selectedTime, selectedReservationOption, quantity],
    queryFn: async () => {
      const reservation = reservations.find((f) => {
        return moment(f.time).toISOString() == moment(selectedTime).toISOString();
      });
      if (!reservation || !selectedReservationOption) throw new Error('no reservation');
      const reservationContent = {
        reservation: reservation._id,
        option: selectedReservationOption,
        quantity,
      };

      return await getReservationTotalPrice(token, reservation._id, reservationContent);
    },
    enabled: product?.productType == 'RESERVATION',
  });

  const { data: isBookmarked, refetch: refetchIsBookmarked } = useQuery({
    queryKey: ['productBookmark', productId],
    queryFn: async () => {
      return await getProductIsBookmarked(token, `${productId}`);
    },
  });

  const { mutate: updateBookmarked } = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        return await removeBookmark(token, productId);
      } else {
        return await createBookmark(token, productId);
      }
    },
    onSuccess: () => {
      refetchIsBookmarked();
      queryClient.resetQueries({ queryKey: ['bookmarks'] });
    },
  });

  const { data: reservations = [], isFetching: isReservationsFetching } = useQuery({
    queryKey: ['reservations', productId],
    queryFn: async () => {
      return await listReservations(
        token,
        productId,
        moment().valueOf(),
        moment().endOf('month').valueOf(),
        0
      );
    },
    enabled: product?.productType == 'RESERVATION',
  });

  const { isPending: isRemoveCommentSubmiting, mutate: removeCommentMutate } = useMutation({
    mutationFn: async ({ commentId }: { commentId: string }) => {
      return await removeProductComment(token, commentId);
    },
    onSuccess: async (res) => {
      setIsCommentActionSheetOpen(false);
      refetchProductComments();
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  useLayoutEffect(() => {
    if (isBookmarked == undefined) return;
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => updateBookmarked()}>
            <Ionicons name="bookmark" size={24} color={isBookmarked ? PRIMARY_9_COLOR : '#fff'} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, isBookmarked]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = () => {
        setIsOptionSheetOpen(false);
      };

      return () => unsubscribe();
    }, [navigation])
  );

  if (!product || isProductFetching || isOptionsFetching || !shop || !user) {
    return <></>;
  }

  const getStock = () => {
    switch (product.productType) {
      case 'ORDER':
        return product.stock;
      case 'RESERVATION':
        if (!selectedTime || !selectedReservationOption) return 0;
        const reservation = reservations.find((f) => {
          return moment(f.time).toISOString() == moment(selectedTime).toISOString();
        });
        const option = reservation?.options.find((f) => {
          return f._id == selectedReservationOption;
        });
        if (!reservation || !option) return 0;
        const { stock } = option;
        const { userCountMax } = reservation;
        return stock > userCountMax ? userCountMax : stock;
    }
  };

  const getMinQuantity = () => {
    switch (product.productType) {
      case 'ORDER':
        return 1;
      case 'RESERVATION':
        if (!selectedTime || !selectedReservationOption) return 0;
        const reservation = reservations.find((f) => {
          return moment(f.time).toISOString() == moment(selectedTime).toISOString();
        });
        if (!reservation) return 1;
        const { userCountMin } = reservation;
        return userCountMin;
    }
  };

  const stock = getStock();
  const minQuantity = getMinQuantity();
  const onChoiceChange = (optionId: string, choiceId: string) => {
    let aSelectedChoices = [...selectedChoices];
    aSelectedChoices = [
      ...aSelectedChoices.filter((s) => {
        return s.optionId !== optionId;
      }),
      { optionId, choiceId },
    ];
    setSelectedChoices(aSelectedChoices);
  };

  const onQuantityChange = (value: number) => {
    if (value < minQuantity) return;
    setQuantity(value);
  };

  const onCheckoutPress = () => {
    setIsOptionSheetOpen(false);
    switch (product.productType) {
      case 'ORDER':
        return router.navigate({
          pathname: '/product/[productId]/checkout',
          params: { productId, orderContentStr: JSON.stringify(orderContent) },
        });
      case 'RESERVATION':
        const reservation = reservations.find((f) => {
          return moment(f.time).toISOString() == moment(selectedTime).toISOString();
        });
        if (!reservation || !selectedReservationOption) return;
        const reservationContent = {
          option: selectedReservationOption,
          quantity,
        };

        return router.navigate({
          pathname: '/reservation/[reservationId]/checkout',
          params: {
            productId,
            reservationId: reservation._id,
            reservationContentStr: JSON.stringify(reservationContent),
          },
        });
    }
  };

  const onSharePress = async () => {
    await Sharing.shareAsync(`https://mall.${shop?.mallDomainName}/productDetail/${product._id}`, {
      dialogTitle: t('shareProductWithYou', {
        product: product.name,
        url: `https://mall.${shop?.mallDomainName}/productDetail/${product._id}`,
      }),
    });
  };

  const onDayChange = (value?: string) => {
    setSelectedDate(value);
    setSeletedTime(undefined);
    setSelectedReservationOption(undefined);
    setAvailableReservationOptions([]);

    if (!value) {
      return setAvailableTimes([]);
    }
    const availableTimes = reservations
      .map((r) => {
        return r.time;
      })
      .filter((t) => {
        return moment(t).format('YYYY-MM-DD') == value;
      })
      .sort((a, b) => {
        return moment(a).valueOf() - moment(b).valueOf();
      });
    setAvailableTimes(availableTimes);
  };

  const onTimeChange = (value?: string) => {
    setSelectedReservationOption(undefined);

    setSeletedTime(moment(value).toDate());
    if (!value) return;
    const reservation = reservations.find((f) => {
      return moment(f.time).toISOString() == value;
    });
    const availableOptions = reservation?.options ?? [];
    setAvailableReservationOptions(availableOptions);
  };

  const onReservationOptionChange = (value: string) => {
    setIsReservationOptionSheetOpen(false);
    if (selectedReservationOption == value) {
      return setSelectedReservationOption(undefined);
    }
    setSelectedReservationOption(value);
  };

  const onAddCartPress = () => {
    if (stock < 1 || isProductCreateCartSubmiting || isReservationCreateCartSubmiting) return;
    switch (product.productType) {
      case 'ORDER':
        const orderContent = {
          choices: selectedChoices.map((f) => {
            return f.choiceId;
          }),
          quantity,
        };
        productCreateCartMutate({ orderContent });
        break;
      case 'RESERVATION':
        const reservation = reservations.find((f) => {
          return moment(f.time).toISOString() == moment(selectedTime).toISOString();
        });
        if (!reservation || !selectedReservationOption) return;
        const reservationContent = {
          reservation: reservation._id!,
          option: selectedReservationOption,
          quantity: quantity!,
        };
        reservationCreateCartMutate({ reservationId: reservation._id, reservationContent });
        break;
    }
  };

  const isDisabled = () => {
    if (product.productType == 'ORDER') {
      if (stock < 1 || isProductCreateCartSubmiting || isReservationCreateCartSubmiting)
        return true;
    } else if (product.productType == 'RESERVATION') {
      if (!selectedTime || !selectedReservationOption) return true;
    }
    return false;
  };

  const disabled = isDisabled();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <YStack f={1} testID="product-detail-screen">
        <ProductDetailSection
          product={product}
          shop={shop}
          productComments={productCommentsData}
          onSharePress={onSharePress}
          onCommentPress={() => setIsCommentsSheetOpen(true)}
        />
        <BottomAction jc="flex-end">
          <StyledButton
            onPress={() => {
              setIsOptionSheetOpen(true);
            }}>
            {t('addToCart')}
            <AntDesign name="shoppingcart" color="#fff" />
          </StyledButton>
        </BottomAction>
        <ActionSheet
          isSheetOpen={isReservationOptionSheetOpen}
          setIsSheetOpen={setIsReservationOptionSheetOpen}
          sheetPosition={reservationOptionsSheetPosition}
          snapPoints={[40]}
          setSheetPosition={setReservationOptionsSheetPosition}>
          <ScrollView gap="$4">
            {availableReservationOptions.map((o) => {
              const selected = o._id == selectedReservationOption;
              return (
                <StyledButton
                  bc={selected ? '$primary' : 'slategray'}
                  key={o._id}
                  onPress={() => onReservationOptionChange(o._id)}>
                  <SizableText col="white">{o.name}</SizableText>
                </StyledButton>
              );
            })}
          </ScrollView>
        </ActionSheet>
        <ActionSheet
          isSheetOpen={isOptionSheetOpen}
          setIsSheetOpen={setIsOptionSheetOpen}
          sheetPosition={sheetPosition}
          snapPoints={[80]}
          setSheetPosition={setSheetPosition}>
          <YStack f={1} gap="$2" jc="space-between">
            <ScrollView>
              <OptionSheetContent
                productType={product.productType}
                options={options}
                selectedChoices={selectedChoices}
                onChoiceChange={onChoiceChange}
                isReservationsFetching={isReservationsFetching}
                reservations={reservations}
                selectedDate={selectedDate}
                onDayChange={onDayChange}
                availableTimes={availableTimes}
                selectedTime={selectedTime}
                onTimeChange={onTimeChange}
                availableReservationOptions={availableReservationOptions}
                onAvailableReservationOptionPress={() => setIsReservationOptionSheetOpen(true)}
                selectedReservationOption={selectedReservationOption}
              />
              <QuantitySelector
                productType={product.productType}
                quantity={quantity}
                stock={stock}
                minQuantity={minQuantity}
                selectedReservationOption={selectedReservationOption}
                onQuantityChange={onQuantityChange}
              />
            </ScrollView>
            <Separator boc="lightslategrey" />
            <XStack mih="$6" jc="space-between">
              <Price
                isLoading={
                  product.productType == 'ORDER'
                    ? isPriceDetailFetching
                    : isReservationTotalPriceFetching
                }
                price={
                  product.productType == 'ORDER'
                    ? parseFloat(priceDetail?.subtotal ?? '0')
                    : (reservationTotalPrice ?? 0)
                }
              />
              <XStack gap="$2">
                <StyledButton
                  testID="add-to-cart-button"
                  onPress={onAddCartPress}
                  disabled={disabled}>
                  {t('addToCart')}
                  <AntDesign name="shoppingcart" color="#fff" />
                </StyledButton>
                <StyledButton onPress={onCheckoutPress} disabled={disabled}>
                  {product.productType == 'RESERVATION' ? t('reservation') : t('checkout')}
                  <Ionicons name="cash-outline" color="#fff" />
                </StyledButton>
              </XStack>
            </XStack>
          </YStack>
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
        <ActionSheet
          bg="white"
          isSheetOpen={isCommentsSheetOpen}
          setIsSheetOpen={setIsCommentsSheetOpen}
          snapPoints={[60]}
          sheetPosition={commentsSheetPosition}
          setSheetPosition={setCommentsSheetPosition}>
          <FlatList
            data={productCommentsData}
            scrollIndicatorInsets={{ right: 0 }}
            renderItem={({ item }) => {
              return (
                <ProductCommentCard
                  username={item.user.username}
                  userAvatar={item.user.avatar}
                  isSelf={Boolean(item.user._id == user._id)}
                  rating={item.rating}
                  photos={item.photos.map((p) => {
                    return p.path;
                  })}
                  comment={item.comment}
                  createdAt={item.createdAt}
                  onPhotoPress={(photo) => {
                    setSelectedPhoto(photo);
                    setIsPhotoSheetOpen(true);
                  }}
                  onActionPress={() => {
                    setSelectedCommentId(item._id);
                    setIsCommentActionSheetOpen(true);
                  }}
                />
              );
            }}
            contentContainerStyle={{ backgroundColor: '#fff' }}
            ItemSeparatorComponent={() => {
              return <Separator my="$4" />;
            }}
            onEndReached={() => fetchMoreProductComments()}
            ListEmptyComponent={() => {
              if (isProductCommentsFetching || isFetchingMoreProductComments) {
                return null;
              }
              return (
                <Container ai="center">
                  <AntDesign name="folderopen" size={120} color="#666" />
                  <Title>{t('emptyContent')}</Title>
                </Container>
              );
            }}
            ListFooterComponent={() => {
              if (!isProductCommentsFetching && !isFetchingMoreProductComments) {
                return null;
              }
              return (
                <XStack f={1} gap="$2" ai="center" jc="center">
                  <Spinner color="$color.primary" />
                  <SizableText col="slategrey">{t('loading')}</SizableText>
                </XStack>
              );
            }}
          />
        </ActionSheet>
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
                  setIsCommentsSheetOpen(false);
                  setIsCommentActionSheetOpen(false);
                  router.navigate({
                    pathname: '/productComment/[commentId]/editComment',
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

        <Dialog isOpen={isAddCartSuccessDialogOpen}>
          <YStack gap="$4">
            <SizableText fos="$6">{t('addSuccess')}</SizableText>
            <Stack>
              <Text>{t('addSuccessContent')}</Text>
              <XStack>
                <Text>{t('pleaseGoTo')}</Text>
                <Text fow="700">{t('shoppingCart')}</Text>
                <Text>{t('toCheck')}</Text>
              </XStack>
            </Stack>

            <AlertDialog.Action asChild>
              <StyledButton onPress={() => setIsAddCartSuccessDialogOpen(false)}>
                {t('confirm')}
              </StyledButton>
            </AlertDialog.Action>
          </YStack>
        </Dialog>
      </YStack>
    </SafeAreaView>
  );
};

export default ProductDetail;
