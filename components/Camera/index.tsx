import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { CameraView } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { SizableText, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { useCameraWithPermissions } from '~/hooks/useCameraWithPermissions';
import { Container, StyledButton } from '~/tamagui.config';
import { CameraProps } from '~/types/components';
import { cropSquareImage } from '~/utils/imageManipulation';

const PermissionDeniedView = ({ onBack, onAction, message, actionText }: {
  onBack: () => void;
  onAction: () => void;
  message: string;
  actionText: string;
}) => (
  <Container gap="$2" f={1} ai="center" jc="center">
    <YStack pos="absolute" l="$4" t="$10">
      <TouchableOpacity onPress={onBack}>
        <Ionicons size={20} name="arrow-back" color="#000" />
      </TouchableOpacity>
    </YStack>
    <SizableText ta="center">{message}</SizableText>
    <StyledButton onPress={onAction}>{actionText}</StyledButton>
  </Container>
);

const Camera = ({ onBack, onPhotoChange }: CameraProps) => {
  const { t } = useLocale();
  const { hasPermission, canAskAgain, requestPermission, openCameraSettings } = useCameraWithPermissions();
  const camera = useRef<CameraView>(null);

  const { isPending: isCropping, mutate: cropImage } = useMutation({
    mutationFn: cropSquareImage,
    onSuccess: async (res) => {
      onPhotoChange(res.uri);
    },
  });

  if (!hasPermission) {
    if (!canAskAgain) {
      return (
        <PermissionDeniedView
          onBack={onBack}
          onAction={openCameraSettings}
          message={t('cameraSettingMessage')}
          actionText={t('cameraSetting')}
        />
      );
    }
    return (
      <PermissionDeniedView
        onBack={onBack}
        onAction={requestPermission}
        message={t('cameraPermissionMessage')}
        actionText={t('cameraPermission')}
      />
    );
  }

  const onTakePicturePress = async () => {
    if (!camera.current) return;
    const res = await camera.current.takePictureAsync({ quality: 0.1 });
    if (!res) return;
    cropImage({
      uri: res.uri,
      height: res.width,
      width: res.width,
      originX: 0,
      originY: (res.height - res.width) / 2,
    });
  };

  return (
    <CameraView ref={camera} style={{ flex: 1 }} facing={CameraType.back}>
      <YStack f={1}>
        <YStack bg="black" h="25%" w="100%">
          <YStack pos="absolute" l="$4" t="$10">
            <TouchableOpacity onPress={onBack}>
              <Ionicons size={20} name="arrow-back" color="#fff" />
            </TouchableOpacity>
          </YStack>
        </YStack>
        <YStack bg="black" h="25%" w="100%" pos="absolute" b={0} jc="center" ai="center">
          <TouchableOpacity disabled={isCropping} onPress={onTakePicturePress}>
            <Ionicons size={40} name="camera-outline" color="#fff" />
          </TouchableOpacity>
        </YStack>
      </YStack>
    </CameraView>
  );
};

export default Camera; 