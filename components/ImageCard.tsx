import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView, YStack, Image } from 'tamagui';
import ActionSheet from './ActionSheet';
import { useState } from 'react';
import { StyledButton } from '~/tamagui.config';
import { useLocale } from '~/hooks';

const ImageCard = ({ imageUri, onRemove }: { imageUri: string; onRemove: () => void }) => {
  const { t } = useLocale();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [actionSheetPosition, setActionSheetPosition] = useState(0);

  return (
    <YStack>
      <TouchableOpacity onPress={() => setIsActionSheetOpen(true)}>
        <YStack
          backgroundColor={'white'}
          w="$14"
          h="$14"
          borderRadius={'$radius.3'}
          shadowColor={'black'}
          shadowOffset={{
            height: 2,
            width: 0,
          }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          justifyContent="center"
          alignItems="center">
          <YStack flex={1} borderRadius={'$radius.3'} overflow="hidden">
            <Image aspectRatio={1} source={{ uri: imageUri }} width={'100%'} resizeMode="contain" />
          </YStack>
        </YStack>
      </TouchableOpacity>
      <ActionSheet
        isSheetOpen={isActionSheetOpen}
        setIsSheetOpen={setIsActionSheetOpen}
        sheetPosition={actionSheetPosition}
        snapPoints={[40]}
        setSheetPosition={setActionSheetPosition}>
        <ScrollView space="$4">
          <StyledButton onPress={onRemove}>{t('remove')}</StyledButton>
        </ScrollView>
      </ActionSheet>
    </YStack>
  );
};

export default ImageCard;
