import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ScrollView, YStack } from 'tamagui';

import ActionSheet from './ActionSheet';
import Camera from './Camera';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const ImageInput = ({ onChange }: { onChange: (value: string) => void }) => {
  const { t } = useLocale();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [actionSheetPosition, setActionSheetPosition] = useState(0);
  const [isCameraSheetOpen, setIsCameraSheetOpen] = useState(false);
  const [cameraSheetPosition, setCameraSheetPosition] = useState(0);

  const onImagePickerPress = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    setIsActionSheetOpen(false);
    if (
      status !== ImagePicker.PermissionStatus.GRANTED &&
      status !== ImagePicker.PermissionStatus.UNDETERMINED
    )
      return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });

    if (result.canceled) return;
    const [asset] = result.assets;

    onChange(asset.uri);
  };

  const onCameraPress = async () => {
    setIsActionSheetOpen(false);
    setIsCameraSheetOpen(true);
  };

  const onPhotoChange = async (uri: string) => {
    setIsCameraSheetOpen(false);
    onChange(uri);
  };

  return (
    <YStack>
      <TouchableOpacity onPress={() => setIsActionSheetOpen(true)}>
        <YStack
          bc="white"
          w="$14"
          h="$14"
          br="$radius.3"
          shac="black"
          shof={{
            height: 2,
            width: 0,
          }}
          shop={0.25}
          shar={3.84}
          jc="center"
          ai="center">
          <MaterialCommunityIcons name="plus" size={40} />
        </YStack>
      </TouchableOpacity>
      <ActionSheet
        isSheetOpen={isActionSheetOpen}
        setIsSheetOpen={setIsActionSheetOpen}
        sheetPosition={actionSheetPosition}
        snapPoints={[40]}
        setSheetPosition={setActionSheetPosition}>
        <ScrollView>
          <YStack gap="$2">
            <StyledButton onPress={onImagePickerPress}>{t('chooseFromAlbum')}</StyledButton>
            <StyledButton onPress={onCameraPress}>{t('uploadFromCamera')}</StyledButton>
          </YStack>
        </ScrollView>
      </ActionSheet>
      <ActionSheet
        isSheetOpen={isCameraSheetOpen}
        setIsSheetOpen={setIsCameraSheetOpen}
        sheetPosition={cameraSheetPosition}
        snapPoints={[100]}
        setSheetPosition={setCameraSheetPosition}>
        <Camera onBack={() => setIsCameraSheetOpen(false)} onPhotoChange={onPhotoChange} />
      </ActionSheet>
    </YStack>
  );
};

export default ImageInput;
