import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Circle, SizableText, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, StyledButton } from '~/tamagui.config';
import * as Linking from 'expo-linking';
import { useRef } from 'react';

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
    <CameraView
      onBarcodeScanned={(res) => {
        if (res.type !== 'qr') return;
        onScan(res.data);
      }}
      ref={camera}
      style={{ flex: 1 }}
      facing={CameraType.back}>
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Circle bg="black" p="$2" position="absolute" l="$4" t="$10">
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
