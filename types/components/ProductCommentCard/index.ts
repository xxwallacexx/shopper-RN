export interface ProductCommentCardProps {
  username: string;
  userAvatar: string;
  isSelf?: boolean;
  rating: number;
  photos: string[];
  comment: string;
  createdAt: Date;
  onPhotoPress: (uri: string) => void;
  onActionPress: () => void;
}

export interface PhotoItemProps {
  uri: string;
  onPress: (uri: string) => void;
}
