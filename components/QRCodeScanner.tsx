import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import { Circle, SizableText, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, StyledButton } from '~/tamagui.config';
import * as Linking from 'expo-linking';
import { useRef } from 'react';
import { TouchableOpacity } from 'react-native';

const QRCodeScanner = ({
  onBack,
  onScan,
}: {
  onBack: () => void;
  onScan: (uri: string) => void;
}) => {
  const { t } = useLocale();
  const [permission, requestPermission] = useCameraPermissions();

  const camera = useRef<CameraView>(null);
  if (!permission) return <></>;

  const onCameraSettingPress = async () => {
    await Linking.openSettings();
  };

  if (!permission.granted) {
    if (!permission.canAskAgain)
      return (
        <Container gap="$2" f={1} ai="center" jc="center">
          <YStack pos="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                onBack();
              }}>
              <Ionicons size={20} name="arrow-back" color="#000" />
            </TouchableOpacity>
          </YStack>

          <SizableText ta="center">{t('cameraSettingMessage')}</SizableText>
          <StyledButton onPress={onCameraSettingPress}>{t('cameraSetting')}</StyledButton>
        </Container>
      );
    return (
      <Container gap="$2" f={1} ai="center" jc="center">
        <YStack pos="absolute" l="$4" t="$10">
          <TouchableOpacity
            onPress={() => {
              onBack();
            }}>
            <Ionicons size={20} name="arrow-back" color="#000" />
          </TouchableOpacity>
        </YStack>

        <SizableText ta="center">{t('cameraPermissionMessage')}</SizableText>
        <StyledButton onPress={requestPermission}>{t('cameraPermission')}</StyledButton>
      </Container>
    );
  }

  return (
    <CameraView
      onBarcodeScanned={(res) => {
        if (res.type !== 'qr') return;
        onScan(res.data);
      }}
      ref={camera}
      style={{ flex: 1 }}
      facing={CameraType.back}>
      <YStack f={1} jc="center" ai="center">
        <Circle bg="black" p="$2" pos="absolute" l="$4" t="$10">
          <TouchableOpacity
            onPress={() => {
              onBack();
            }}>
            <Ionicons size={20} name="arrow-back" color="#fff" />
          </TouchableOpacity>
        </Circle>
        <MaterialCommunityIcons color={'white'} name="crop-free" size={360} />
      </YStack>
    </CameraView>
  );
};

export default QRCodeScanner;
