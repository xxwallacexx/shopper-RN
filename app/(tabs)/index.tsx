import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { YStack, H2, Separator } from 'tamagui';
import { listAdsBanners } from '~/api/adsBanner';
import { listCategories } from '~/api/product';
import { BannerCarousel } from '~/components';

import EditScreenInfo from '~/components/edit-screen-info';
import { useLocale } from '~/hooks/useLocale';

const Home = () => {
  const { t } = useLocale()
  const { data: adsBanners = [], isFetching: isAdsBannersFetching } = useQuery({ queryKey: ['adsBanners'], queryFn: listAdsBanners })
  const { data: categories = [], isFetching: isCategoriesFetching } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  const [currentCategoryId, setCurrentCategoryId] = useState()
  return (
    <YStack flex={1} alignItems="center" >
      <BannerCarousel
        banners={adsBanners.map((p) => { return p.photo })}
      />
      <H2>{t('hotItems')}</H2>
      <Separator />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </YStack>
  );
}

export default Home
