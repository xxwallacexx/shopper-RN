import { PRIMARY_9_COLOR } from '@env';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useFocusEffect, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import { useCallback, useLayoutEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { AlertDialog, YStack } from 'tamagui';

import {
  removeBookmark,
  createBookmark,
  getShop,
  reservationCreateCart,
  productCreateCart,
  removeProductComment,
  getSelf,
} from '~/api';
import { Dialog, ProductDetailSection } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { useProductData } from '~/hooks/useProductData';
import { BottomAction, StyledButton } from '~/tamagui.config';
import { OrderContent, ReservationContent, ReservationOption } from '~/types';
import ProductActionSheetContainer from './components/ProductActionSheetsContainer';
import AddCartSuccessContent from './components/AddCartSuccessContent';

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

  const {
    product,
    isProductFetching,
    options,
    isOptionsFetching,
    productComments,
    isProductCommentsFetching,
    fetchMoreProductComments,
    refetchProductComments,
    isFetchingMoreProductComments,
    reservations,
    isReservationsFetching,
    priceDetail,
    isPriceDetailFetching,
    reservationTotalPrice,
    isReservationTotalPriceFetching,
    isBookmarked,
    refetchIsBookmarked,
    onCalendarMonthChange,
    selectedCalendarMonth,
  } = useProductData({
    token,
    productId,
    selectedChoices,
    quantity,
    selectedTime,
    selectedReservationOption,
  });

  const productCommentsData = productComments?.pages ? productComments.pages.flat() : [];

  const orderContent = {
    choices: selectedChoices.map((c) => {
      return c.choiceId;
    }),
    quantity,
  };

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

        <ProductActionSheetContainer
          isReservationOptionSheetOpen={isReservationOptionSheetOpen}
          setIsReservationOptionSheetOpen={setIsReservationOptionSheetOpen}
          reservationOptionsSheetPosition={reservationOptionsSheetPosition}
          setReservationOptionsSheetPosition={setReservationOptionsSheetPosition}
          availableReservationOptions={availableReservationOptions}
          selectedReservationOption={selectedReservationOption}
          onReservationOptionChange={onReservationOptionChange}
          isOptionSheetOpen={isOptionSheetOpen}
          setIsOptionSheetOpen={setIsOptionSheetOpen}
          sheetPosition={sheetPosition}
          setSheetPosition={setSheetPosition}
          product={product}
          options={options}
          selectedChoices={selectedChoices}
          onChoiceChange={onChoiceChange}
          isReservationsFetching={isReservationsFetching}
          reservations={reservations}
          selectedCalendarMonth={selectedCalendarMonth}
          onDayChange={onDayChange}
          onMonthChange={onCalendarMonthChange}
          availableTimes={availableTimes}
          onTimeChange={onTimeChange}
          quantity={quantity}
          stock={stock}
          minQuantity={minQuantity}
          onQuantityChange={onQuantityChange}
          isPriceDetailFetching={isPriceDetailFetching}
          isReservationTotalPriceFetching={isReservationTotalPriceFetching}
          onAddCartPress={onAddCartPress}
          onCheckoutPress={onCheckoutPress}
          disabled={disabled}
          isPhotoSheetOpen={isPhotoSheetOpen}
          setIsPhotoSheetOpen={setIsPhotoSheetOpen}
          photoSheetPosition={photoSheetPosition}
          setPhotoSheetPosition={setPhotoSheetPosition}
          selectedPhoto={selectedPhoto}
          isCommentsSheetOpen={isCommentsSheetOpen}
          setIsCommentsSheetOpen={setIsCommentsSheetOpen}
          commentsSheetPosition={commentsSheetPosition}
          productCommentsData={productCommentsData}
          setCommentsSheetPosition={setCommentsSheetPosition}
          user={user}
          setSelectedPhoto={setSelectedPhoto}
          setSelectedCommentId={setSelectedCommentId}
          setIsCommentActionSheetOpen={setIsCommentActionSheetOpen}
          fetchMoreProductComments={fetchMoreProductComments}
          isProductCommentsFetching={isProductCommentsFetching}
          isFetchingMoreProductComments={isFetchingMoreProductComments}
          isCommentActionSheetOpen={isCommentActionSheetOpen}
          commentActionSheetPosition={commentActionSheetPosition}
          setCommentActionSheetPosition={setCommentActionSheetPosition}
          isRemoveCommentSubmiting={isRemoveCommentSubmiting}
          selectedCommentId={selectedCommentId}
          onEditCommentPress={(commentId: string) => {
            return router.navigate({
              pathname: '/productComment/[commentId]/editComment',
              params: { commentId },
            });
          }}
          onRemoveCommentPress={(commentId: string) => {
            return removeCommentMutate({ commentId });
          }}
          priceDetail={priceDetail}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          reservationTotalPrice={reservationTotalPrice}
        />

        <Dialog isOpen={isAddCartSuccessDialogOpen}>
          <YStack gap="$4">
            <AddCartSuccessContent />
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
