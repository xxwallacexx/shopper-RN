import { useQuery } from '@tanstack/react-query';
import { YStack, H2, Separator } from 'tamagui';
import { listAdsBanners } from '~/api/adsBanner';
import { Gallery } from '~/components';

import EditScreenInfo from '~/components/edit-screen-info';

const Home = () => {

  const { data: adsBanners = [], isFetching: isAdsBannersFetching } = useQuery({ queryKey: ['adsBanner'], queryFn: listAdsBanners })

  return (
    <YStack flex={1} alignItems="center" >
      <Gallery
        photos={adsBanners.map((p) => { return p.photo })}
      />
      <H2>Tab One</H2>
      <Separator />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </YStack>
  );
}

export default Home
