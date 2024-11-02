import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation, useFocusEffect, useRouter } from 'expo-router';
import { SectionList, SafeAreaView } from 'react-native';
import {
  AlertDialog,
  Label,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
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
} from '~/api';
import { BannerCarousel, Dialog, OptionSheetContent } from '~/components';
import { Badge, BottomAction, Container, StyledButton, Subtitle, Title } from '~/tamagui.config';
import HTMLView from 'react-native-htmlview';
import ActionSheet from '~/components/ActionSheet';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useAuth, useLocale } from '~/hooks';
import { PRIMARY_9_COLOR } from '@env';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import { OrderContent, Product, ReservationContent, ReservationOption } from '~/types';
import Toast from 'react-native-toast-message';
import { Stack } from 'tamagui';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Price = ({ isLoading, price }: { isLoading: boolean; price: number }) => {
  return <>{isLoading ? <Spinner /> : <SizableText>HK$ {price}</SizableText>}</>;
};

const QuantitySelector = ({
  productType,
  quantity,
  stock,
  minQuantity,
  selectedReservationOption,
  onQuantityChange,
}: {
  productType: Product['productType'];
  quantity: number;
  stock: number;
  minQuantity: number;
  selectedReservationOption?: string;
  onQuantityChange: (value: number) => void;
}) => {
  const { t } = useLocale();
  if (productType == 'RESERVATION' && !selectedReservationOption) return;
  return (
    <YStack>
      <Label>{t('quantity')}</Label>
      <XStack ml={2} space={'$2'} alignItems="center">
        <StyledButton
          disabled={quantity < minQuantity + 1 || quantity < 2}
          pressStyle={{ opacity: 0.5 }}
          size="$2"
          onPress={() => onQuantityChange(quantity - 1)}
          icon={<AntDesign name="minus" />}
        />
        <SizableText>{quantity}</SizableText>
        <StyledButton
          disabled={quantity >= stock}
          pressStyle={{ opacity: 0.5 }}
          size="$2"
          onPress={() => onQuantityChange(quantity + 1)}
          icon={<AntDesign name="plus" />}
        />
        {stock < 20 ? (
          <SizableText>
            {t('stock')}: {stock}
          </SizableText>
        ) : null}
      </XStack>
    </YStack>
  );
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
      console.log(e);
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
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

  if (!product || isProductFetching || isOptionsFetching || !shop) {
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

  let stock = getStock();
  let minQuantity = getMinQuantity();
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

  const renderItem = ({ item, index, section }) => {
    const { price, photos, category, name, introduction, shop, description, logisticDescription } =
      product;

    switch (section.key) {
      case 'photos':
        return (
          <BannerCarousel
            banners={photos.map((p) => {
              return p.path;
            })}
          />
        );
      case 'primary':
        return (
          <Container space="$2">
            <YStack space="$2">
              <XStack justifyContent="space-between">
                <Subtitle size="$4">{category.name}</Subtitle>
                <StyledButton onPress={onSharePress}>
                  {t('shareProduct')}
                  <AntDesign name="link" color="#fff" />
                </StyledButton>
              </XStack>
              <Text>{name}</Text>
              <Text>{introduction}</Text>
              <Badge>
                <SizableText fontSize={8} color="#fff">
                  $ {price.toFixed(2)} {t('up')}
                </SizableText>
              </Badge>
              <XStack space="$2" alignItems="center">
                <AntDesign name="isv" color={tokens.color.gray10Dark.val} />
                <Text fontSize={'$2'} color={'lightslategray'}>
                  {shop.name}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <MaterialIcons name="location-pin" color={tokens.color.gray10Dark.val} />
                <Text fontSize={'$2'} color="lightslategray">
                  {shop.address}
                </Text>
              </XStack>
            </YStack>
          </Container>
        );
      case 'productRating':
        if (!product.productRating.count) {
          return <></>;
        }
        const rating = Math.round(product.productRating.rating);
        return <></>;
      case 'secondary':
        return (
          <Container space="$2">
            <Separator borderColor={'lightslategray'} />
            <YStack space="$4">
              <Title>{t('productDetail')}</Title>
              <HTMLView value={description} />
              <Title>{t('TnC')}</Title>
              <HTMLView value={logisticDescription} />
            </YStack>
          </Container>
        );
      default:
        return <> </>;
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} alignItems="center">
        <SectionList
          renderItem={renderItem}
          sections={[
            { key: 'photos', data: [''] },
            { key: 'primary', data: [''] },
            { key: 'productRating', data: [''] },
            { key: 'secondary', data: [''] },
          ]}
          keyExtractor={(item, index) => item + index.toString()}
        />
        <BottomAction justifyContent="flex-end">
          <TouchableOpacity
            onPress={() => {
              setIsOptionSheetOpen(true);
            }}>
            <StyledButton>
              {t('addToCart')}
              <AntDesign name="shoppingcart" color="#fff" />
            </StyledButton>
          </TouchableOpacity>
        </BottomAction>
      </YStack>
      <ActionSheet
        isSheetOpen={isReservationOptionSheetOpen}
        setIsSheetOpen={setIsReservationOptionSheetOpen}
        sheetPosition={reservationOptionsSheetPosition}
        snapPoints={[40]}
        setSheetPosition={setReservationOptionsSheetPosition}>
        <ScrollView space="$4">
          {availableReservationOptions.map((o) => {
            const selected = o._id == selectedReservationOption;
            return (
              <StyledButton
                backgroundColor={selected ? '$primary' : 'slategray'}
                key={o._id}
                onPress={() => onReservationOptionChange(o._id)}>
                <SizableText color="white">{o.name}</SizableText>
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
        <YStack flex={1} space="$2" justifyContent="space-between">
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
          <Separator borderColor={'lightslategrey'} />
          <XStack minHeight={'$6'} justifyContent="space-between">
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
            <XStack space="$2">
              <TouchableOpacity disabled={disabled} onPress={onAddCartPress}>
                <StyledButton disabled={disabled}>
                  {t('addToCart')}
                  <AntDesign name="shoppingcart" color="#fff" />
                </StyledButton>
              </TouchableOpacity>
              <TouchableOpacity disabled={disabled} onPress={onCheckoutPress}>
                <StyledButton disabled={disabled}>
                  {product.productType == 'RESERVATION' ? t('reservation') : t('checkout')}
                  <Ionicons name="cash-outline" color="#fff" />
                </StyledButton>
              </TouchableOpacity>
            </XStack>
          </XStack>
        </YStack>
      </ActionSheet>

      <Dialog isOpen={isAddCartSuccessDialogOpen}>
        <YStack space="$4">
          <SizableText fontSize={'$6'}>{t('addSuccess')}</SizableText>
          <Stack>
            <Text>{t('addSuccessContent')}</Text>
            <XStack>
              <Text>{t('pleaseGoTo')}</Text>
              <Text fontWeight={'700'}>{t('shoppingCart')}</Text>
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
    </SafeAreaView>
  );
};

export default ProductDetail;
