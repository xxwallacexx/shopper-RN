import { YStack, H2, Separator } from 'tamagui';

import EditScreenInfo from '~/components/edit-screen-info';

const Two = () => {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <H2>Tab Two</H2>
      <Separator />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </YStack>
  );
}

export default Two
