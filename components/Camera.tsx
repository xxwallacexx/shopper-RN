import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import { SizableText, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, StyledButton } from '~/tamagui.config';
import * as Linking from 'expo-linking';
import { useRef } from 'react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useMutation } from '@tanstack/react-query';
import { TouchableOpacity } from 'react-native';

const Camera = ({
  onBack,
  onPhotoChange,
}: {
  onBack: () => void;
  onPhotoChange: (uri: string) => void;
}) => {
  const { t } = useLocale();
  const [permission, requestPermission] = useCameraPermissions();
  const { isPending: isCropping, mutate: cropImage } = useMutation({
    mutationFn: async ({
      uri,
      height,
      width,
      originX,
      originY,
    }: {
      uri: string;
      height: number;
      width: number;
      originX: number;
      originY: number;
    }) => {
      const actionCrop = [
        {
          crop: {
            height,
            width,
            originX,
            originY,
          },
        },
      ];

      return await manipulateAsync(uri, actionCrop, { format: SaveFormat.PNG });
    },
    onSuccess: async (res) => {
      onPhotoChange(res.uri);
    },
  });

  const camera = useRef<CameraView>(null);
  if (!permission) return <></>;

  const onCameraSettingPress = async () => {
    await Linking.openSettings();
  };

  const onTakePicturePress = async () => {
    if (!camera) return;
    const res = await camera.current?.takePictureAsync({ quality: 0.1 });
    if (!res) return;
    cropImage({
      uri: res.uri,
      height: res.width,
      width: res.width,
      originX: 0,
      originY: (res.height - res.width) / 2,
    });
  };

  if (!permission.granted) {
    if (!permission.canAskAgain)
      return (
        <Container space="$2" flex={1} alignItems="center" justifyContent="center">
          <YStack position="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                onBack();
              }}>
              <Ionicons size={20} name="arrow-back" color="#000" />
            </TouchableOpacity>
          </YStack>

          <SizableText textAlign="center">{t('cameraSettingMessage')}</SizableText>
          <StyledButton onPress={onCameraSettingPress}>{t('cameraSetting')}</StyledButton>
        </Container>
      );
    return (
      <Container space="$2" flex={1} alignItems="center" justifyContent="center">
        <YStack position="absolute" l="$4" t="$10">
          <TouchableOpacity
            onPress={() => {
              onBack();
            }}>
            <Ionicons size={20} name="arrow-back" color="#000" />
          </TouchableOpacity>
        </YStack>

        <SizableText textAlign="center">{t('cameraPermissionMessage')}</SizableText>
        <StyledButton onPress={requestPermission}>{t('cameraPermission')}</StyledButton>
      </Container>
    );
  }

  return (
    <CameraView ref={camera} style={{ flex: 1 }} facing={CameraType.back}>
      <YStack flex={1}>
        <YStack bg="black" h="25%" w="100%">
          <YStack position="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                onBack();
              }}>
              <Ionicons size={20} name="arrow-back" color="#fff" />
            </TouchableOpacity>
          </YStack>
        </YStack>
        <YStack
          bg="black"
          h="25%"
          w="100%"
          position="absolute"
          b={0}
          justifyContent="center"
          alignItems="center">
          <TouchableOpacity
            disabled={isCropping}
            onPress={() => {
              onTakePicturePress();
            }}>
            <Ionicons size={40} name="camera-outline" color="#fff" />
          </TouchableOpacity>
        </YStack>
      </YStack>
    </CameraView>
  );
};

export default Camera;
