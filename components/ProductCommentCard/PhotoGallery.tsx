import React from 'react';
import { FlatList } from 'react-native';
import { ProductCommentCardProps } from './types';
import { PhotoItem } from './PhotoItem';

type PhotoGalleryProps = Pick<ProductCommentCardProps, 'photos' | 'onPhotoPress'>;

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onPhotoPress }) => (
  <FlatList
    data={photos}
    horizontal
    contentContainerStyle={{ gap: 16 }}
    keyExtractor={(item) => item}
    renderItem={({ item }) => <PhotoItem uri={item} onPress={onPhotoPress} />}
  />
);
