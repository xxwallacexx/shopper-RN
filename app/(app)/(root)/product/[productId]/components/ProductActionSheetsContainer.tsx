import { AntDesign, Ionicons } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native';
import { ScrollView, Separator, SizableText, Spinner, XStack, YStack, Stack, Image } from 'tamagui';

import {
  ActionSheet,
  OptionSheetContent,
  ProductCommentCard,
  QuantitySelector,
} from '~/components';
import { useLocale } from '~/hooks';
import { Container, StyledButton, Title } from '~/tamagui.config';
import {
  Option,
  Product,
  ProductComment,
  ProductPriceDetail,
  Reservation,
  ReservationOption,
  User,
} from '~/types';

const Price = ({ isLoading, price }: { isLoading: boolean; price: number }) => {
  return <>{isLoading ? <Spinner /> : <SizableText>HK$ {price}</SizableText>}</>;
};

const ProductActionSheetContainer = ({
  isReservationOptionSheetOpen,
  setIsReservationOptionSheetOpen,
  reservationOptionsSheetPosition,
  setReservationOptionsSheetPosition,
  availableReservationOptions,
  selectedReservationOption,
  onReservationOptionChange,
  isOptionSheetOpen,
  setIsOptionSheetOpen,
  sheetPosition,
  setSheetPosition,
  product,
  options,
  selectedChoices,
  onChoiceChange,
  isReservationsFetching,
  reservations,
  onDayChange,
  availableTimes,
  onTimeChange,
  quantity,
  stock,
  minQuantity,
  onQuantityChange,
  isPriceDetailFetching,
  isReservationTotalPriceFetching,
  onAddCartPress,
  onCheckoutPress,
  disabled,
  isPhotoSheetOpen,
  setIsPhotoSheetOpen,
  photoSheetPosition,
  setPhotoSheetPosition,
  selectedPhoto,
  isCommentsSheetOpen,
  setIsCommentsSheetOpen,
  commentsSheetPosition,
  productCommentsData,
  setCommentsSheetPosition,
  user,
  setSelectedPhoto,
  setSelectedCommentId,
  setIsCommentActionSheetOpen,
  fetchMoreProductComments,
  isProductCommentsFetching,
  isFetchingMoreProductComments,
  isCommentActionSheetOpen,
  commentActionSheetPosition,
  setCommentActionSheetPosition,
  isRemoveCommentSubmiting,
  selectedCommentId,
  onEditCommentPress,
  onRemoveCommentPress,
  priceDetail,
  selectedDate,
  selectedTime,
  reservationTotalPrice,
}: {
  isReservationOptionSheetOpen: boolean;
  setIsReservationOptionSheetOpen: (value: boolean) => void;
  reservationOptionsSheetPosition: number;
  setReservationOptionsSheetPosition: (value: number) => void;
  availableReservationOptions: ReservationOption[];
  selectedReservationOption?: string;
  onReservationOptionChange: (value: string) => void;
  isOptionSheetOpen: boolean;
  setIsOptionSheetOpen: (value: boolean) => void;
  sheetPosition: number;
  setSheetPosition: (value: number) => void;
  product: Product;
  options: Option[];
  selectedChoices: { optionId: string; choiceId: string }[];
  onChoiceChange: (optionId: string, choiceId: string) => void;
  isReservationsFetching: boolean;
  reservations: Reservation[];
  onDayChange: (value?: string) => void;
  availableTimes: Date[];
  onTimeChange: (value?: string) => void;
  quantity: number;
  stock: number;
  minQuantity: number;
  onQuantityChange: (value: number) => void;
  isPriceDetailFetching: boolean;
  isReservationTotalPriceFetching: boolean;
  onAddCartPress: () => void;
  onCheckoutPress: () => void;
  disabled: boolean;
  isPhotoSheetOpen: boolean;
  setIsPhotoSheetOpen: (value: boolean) => void;
  photoSheetPosition: number;
  setPhotoSheetPosition: (value: number) => void;
  selectedPhoto?: string;
  isCommentsSheetOpen: boolean;
  setIsCommentsSheetOpen: (value: boolean) => void;
  commentsSheetPosition: number;
  productCommentsData: ProductComment[];
  setCommentsSheetPosition: (value: number) => void;
  user: User;
  setSelectedPhoto: (value: string) => void;
  setSelectedCommentId: (value: string) => void;
  setIsCommentActionSheetOpen: (value: boolean) => void;
  fetchMoreProductComments: () => void;
  isProductCommentsFetching: boolean;
  isFetchingMoreProductComments: boolean;
  isCommentActionSheetOpen: boolean;
  commentActionSheetPosition: number;
  setCommentActionSheetPosition: (value: number) => void;
  isRemoveCommentSubmiting: boolean;
  selectedCommentId?: string;
  onEditCommentPress: (value: string) => void;
  onRemoveCommentPress: (value: string) => void;
  reservationTotalPrice?: number;
  priceDetail?: ProductPriceDetail;
  selectedDate?: string;
  selectedTime?: Date;
}) => {
  const { t } = useLocale();
  return (
    <>
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
                if (!selectedCommentId) return;
                onEditCommentPress(selectedCommentId);
              }}
              disabled={isRemoveCommentSubmiting}>
              {t('editComment')}
            </StyledButton>
            <StyledButton
              onPress={() => {
                if (!selectedCommentId) return;
                onRemoveCommentPress(selectedCommentId);
              }}
              disabled={isRemoveCommentSubmiting}>
              {t('removeComment')}
            </StyledButton>
          </YStack>
        </ScrollView>
      </ActionSheet>
    </>
  );
};

export default ProductActionSheetContainer;
