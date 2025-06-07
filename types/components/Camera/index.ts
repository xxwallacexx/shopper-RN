export interface CameraProps {
  onBack: () => void;
  onPhotoChange: (uri: string) => void;
}

export interface CropImageParams {
  uri: string;
  height: number;
  width: number;
  originX: number;
  originY: number;
} 