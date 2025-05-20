import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { XStack, YStack, Image, SizableText, Text, Separator, Button } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge, StyledButton } from '~/tamagui.config';
import { AvailabelCoupon, CartItemOrderContent, Coupon, Product } from '~/types';
import { Skeleton } from 'moti/skeleton';
import { Pressable, TouchableOpacity } from 'react-native';

const OrderCartItemCard = ({
  photoUri,
  totalPrice,
  stock,
  coupon,
  singleItemPrice,
  product,
  orderContent,
  onProductPress,
  onDeductPress,
  onAddPress,
  onRemovePress,
  onAvailableCouponPress,
  isCartItemUpdating,
  isCartItemRemoving,
}: {
  photoUri: string;
  totalPrice: number;
  stock: number;
  coupon?: AvailabelCoupon;
  singleItemPrice: number;
  product: Product;
  orderContent: CartItemOrderContent;
  onProductPress: () => void;
  onDeductPress: () => void;
  onAddPress: () => void;
  onRemovePress: () => void;
  onAvailableCouponPress: () => void;
  isCartItemUpdating: boolean;
  isCartItemRemoving: boolean;
}) => {
  const { t } = useLocale();
  const quantity = orderContent.quantity ?? 0;
  return (
    <YStack
      flex={1}
      backgroundColor={'white'}
      p={'$1'}
      space="$2"
      borderRadius={'$radius.3'}
      shadowColor={'black'}
      shadowOffset={{
        height: 2,
        width: 0,
      }}
      shadowOpacity={0.25}
      shadowRadius={3.84}>
      <Pressable onPress={onProductPress}>
        <XStack space="$2" flex={1}>
          <YStack width={'40%'} borderRadius={'$radius.3'} overflow="hidden">
            <Image
              backgroundColor={'white'}
              resizeMode="contain"
              aspectRatio={1}
              source={{ uri: photoUri }}
              width={'100%'}
            />
            <Badge position="absolute" top={8} right={8}>
              <SizableText size={'$1'} color="#fff">
                HK$ {singleItemPrice.toFixed(2)}
              </SizableText>
            </Badge>
          </YStack>
          <YStack flex={1} py={'$2'} space="$2" justifyContent="space-between">
            <YStack>
              <SizableText numberOfLines={1} ellipsizeMode="tail">
                {product.name} {product.introduction}
              </SizableText>
              {orderContent.choices.map((c) => {
                return (
                  <Text key={c._id} fontWeight={'300'} fontSize={'$2'}>
                    {t('option')}: {c.name}
                  </Text>
                );
              })}
            </YStack>
            <XStack space="$2" alignItems="center">
              {isCartItemUpdating ? (
                <Skeleton height={12} colorMode="light" width={80} />
              ) : (
                <SizableText color={'$primary'}>HK$ {totalPrice.toFixed(2)}</SizableText>
              )}
              <Text fontWeight={'300'} fontSize={'$2'}>
                {t('stock')}: {stock}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Pressable>

      <Separator />
      <XStack px="$2" flex={1} h="$3" alignItems="center" justifyContent="space-between">
        <XStack space="$2" alignItems="center">
          <TouchableOpacity disabled={quantity < 2} onPress={onDeductPress}>
            <Ionicons size={24} name="remove-circle-outline" />
          </TouchableOpacity>
          {isCartItemUpdating ? (
            <Skeleton height={8} colorMode="light" width={18} />
          ) : (
            <SizableText textAlign="center" w={18}>
              {quantity}
            </SizableText>
          )}
          <TouchableOpacity disabled={quantity >= stock} onPress={onAddPress}>
            <Ionicons size={24} name="add-circle-outline" />
          </TouchableOpacity>
        </XStack>
        <StyledButton w="40%" onPress={onAvailableCouponPress}>
          {coupon ? coupon.coupon.name : t('redeemCoupon')}
        </StyledButton>
        {isCartItemRemoving ? (
          <Skeleton height={18} colorMode="light" width={22} />
        ) : (
          <TouchableOpacity onPress={onRemovePress}>
            <EvilIcons size={24} name="trash" />
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
};

export default OrderCartItemCard;
