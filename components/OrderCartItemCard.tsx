import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { XStack, YStack, Image, SizableText, Text, Separator } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge, StyledButton } from '~/tamagui.config';
import { AvailabelCoupon, CartItemOrderContent, Product } from '~/types';
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
      f={1}
      bc={'white'}
      p={'$1'}
      gap="$2"
      br={'$radius.3'}
      shac={'black'}
      shof={{
        height: 2,
        width: 0,
      }}
      shop={0.25}
      shar={3.84}>
      <Pressable onPress={onProductPress}>
        <XStack gap="$2" f={1}>
          <YStack w={'40%'} br={'$radius.3'} ov="hidden">
            <Image
              bc={'white'}
              objectFit="contain"
              aspectRatio={1}
              source={{ uri: photoUri }}
              w={'100%'}
            />
            <Badge pos="absolute" t={8} r={8}>
              <SizableText size={'$1'} col="#fff">
                HK$ {singleItemPrice.toFixed(2)}
              </SizableText>
            </Badge>
          </YStack>
          <YStack f={1} py={'$2'} gap="$2" jc="space-between">
            <YStack>
              <SizableText numberOfLines={1} ellipsizeMode="tail">
                {product.name} {product.introduction}
              </SizableText>
              {orderContent.choices.map((c) => {
                return (
                  <Text key={c._id} fow={'300'} fos={'$2'}>
                    {t('option')}: {c.name}
                  </Text>
                );
              })}
            </YStack>
            <XStack gap="$2" ai="center">
              {isCartItemUpdating ? (
                <Skeleton height={12} colorMode="light" width={80} />
              ) : (
                <SizableText col={'$primary'}>HK$ {totalPrice.toFixed(2)}</SizableText>
              )}
              <Text fow={'300'} fos={'$2'}>
                {t('stock')}: {stock}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Pressable>

      <Separator />
      <XStack px="$2" f={1} h="$3" ai="center" jc="space-between">
        <XStack gap="$2" ai="center">
          <TouchableOpacity disabled={quantity < 2} onPress={onDeductPress}>
            <Ionicons size={24} name="remove-circle-outline" />
          </TouchableOpacity>
          {isCartItemUpdating ? (
            <Skeleton height={8} colorMode="light" width={18} />
          ) : (
            <SizableText ta="center" w={18}>
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
