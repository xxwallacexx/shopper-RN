import { TouchableOpacity } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { ScrollView, Separator, SizableText, XStack } from 'tamagui';

import { BannerCarousel } from '~/components';
import { useLocale } from '~/hooks';
import { Badge, Container } from '~/tamagui.config';
import { Product, ProductComment, Shop as TShop } from '~/types';
import ProductHeader from './ProductHeader';
import ProductIntro from './ProductIntro';
import Shop from './Shop';

const ProductDetailSection = ({
  product,
  shop,
  productComments,
  onSharePress,
  onCommentPress,
}: {
  product: Product;
  shop: TShop;
  productComments: ProductComment[];
  onSharePress: () => void;
  onCommentPress: () => void;
}) => {
  const { t } = useLocale();
  return (
    <>
      <ScrollView contentContainerStyle={{ fg: 1, ai: 'center' }}>
        <BannerCarousel
          banners={product.photos.map((p) => {
            return { type: 'IMAGE', uri: p.path };
          })}
        />
        <Container w="100%" gap="$2">
          <ProductHeader
            category={product.category.name}
            name={product.name}
            introduction={product.introduction}
            onSharePress={onSharePress}
          />
          <Badge>
            <SizableText fos={8} col="#fff">
              $ {product.price.toFixed(2)} {t('up')}
            </SizableText>
          </Badge>
          <Shop name={shop.name} address={shop.address} />
        </Container>
        {productComments.length && product.productRating.count ? (
          <Container w="100%" gap="$2">
            <Separator boc="lightslategray" />
            <TouchableOpacity onPress={onCommentPress}>
              <XStack jc="space-between">
                <StarRatingDisplay rating={Math.ceil(product.productRating.rating)} starSize={28} />
                <SizableText>{`${product.productRating.count} ${t('commentCount')}`}</SizableText>
              </XStack>
            </TouchableOpacity>
          </Container>
        ) : null}
        <ProductIntro
          description={product.description}
          logisticDescription={product.logisticDescription}
        />
      </ScrollView>
    </>
  );
};

export default ProductDetailSection;
