import { useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useLocale } from './useLocale';

interface UseCameraWithPermissionsResult {
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: ReturnType<typeof useCameraPermissions>[1];
  openCameraSettings: () => Promise<void>;
  hasPermission: boolean;
  canAskAgain: boolean;
}

export const useCameraWithPermissions = (): UseCameraWithPermissionsResult => {
  const [permission, requestPermission] = useCameraPermissions();
  const { t } = useLocale();

  const openCameraSettings = async () => {
    await Linking.openSettings();
  };

  return {
    permission,
    requestPermission,
    openCameraSettings,
    hasPermission: permission?.granted ?? false,
    canAskAgain: permission?.canAskAgain ?? true,
  };
};
