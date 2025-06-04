import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Image, SizableText, YStack, ScrollView, Separator, TextArea } from 'tamagui';

import { getFeedComment, editFeedComment, getSelf } from '~/api';
import { ImageCard, ImageInput, ActionSheet } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const EditComment = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const { token } = useAuth();
  const [photoObjects, setPhotoObjects] = useState<{ _id?: string; path: string }[]>([]);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [actionSheetPosition, setActionSheetPosition] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>();

  if (!token) return <></>;
  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });
  const { data: commentData } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: async () => {
      const res = await getFeedComment(commentId);
      setPhotoObjects(res.photos);
      setComment(res.comment);
      return res;
    },
  });

  const { isPending: isEditCommentSubmitting, mutate: editCommentMutate } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      for (const photoObject of photoObjects) {
        if (!photoObject._id) {
          const filename = photoObject.path.split('/').pop();
          if (!filename) return;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('photos', {
            uri: photoObject.path,
            name: filename,
            type,
          });
        }
      }

      const removePhotos =
        commentData?.photos.filter((p) => {
          return !photoObjects
            .map((po) => {
              return po._id;
            })
            .includes(p._id);
        }) || [];
      for (const removePhoto of removePhotos) {
        formData.append('removePhotos[]', removePhoto._id);
      }

      formData.append('comment', comment);
      return await editFeedComment(token, commentId, formData);
    },
    onSuccess: async (res) => {
      queryClient.resetQueries({ queryKey: ['feedComments'] });
      router.back();
    },
    onError: (e) => {
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  if (!commentData || !user) return <></>;

  const onImageInputChange = (value: string) => {
    const _photoObjects = [...photoObjects];
    _photoObjects.push({ path: value });
    setPhotoObjects(_photoObjects);
  };

  const onImageRemove = () => {
    if (selectedPhotoIndex == undefined) return;
    const _photoObjects = [...photoObjects];
    _photoObjects.splice(selectedPhotoIndex, 1);
    setPhotoObjects(_photoObjects);
    setIsActionSheetOpen(false);
  };

  return (
    <KeyboardAwareScrollView
      extraHeight={140}
      style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
      <ScrollView f={1} space="$2" contentContainerStyle={{ ai: 'center' }}>
        <YStack w="100%" ai="center" space="$2">
          <Image objectFit="contain" aspectRatio={1} source={{ uri: user?.avatar }} w="20%" />
          <SizableText>{user?.username}</SizableText>
        </YStack>
        <Separator w="90%" />
        <ScrollView
          w="100%"
          contentContainerStyle={{
            m: 16,
            ai: 'flex-start',
            gap: 16,
          }}
          horizontal>
          {photoObjects.map((p, index) => {
            return (
              <ImageCard
                key={index.toString() + p}
                imageUri={p.path}
                onPhotoPress={() => {
                  setSelectedPhotoIndex(index);
                  setIsActionSheetOpen(true);
                }}
              />
            );
          })}
          {photoObjects.length < 6 ? <ImageInput onChange={onImageInputChange} /> : null}
        </ScrollView>
        <Separator w="90%" />
        <TextArea
          autoCorrect={false}
          autoCapitalize="none"
          w="90%"
          size="$4"
          value={comment}
          onChangeText={(value) => {
            setComment(value);
          }}
        />
        <StyledButton
          onPress={() => editCommentMutate()}
          w="80%"
          my="$2"
          disabled={isEditCommentSubmitting || comment.length == 0}>
          {t('confirm')}
        </StyledButton>
      </ScrollView>
      <ActionSheet
        isSheetOpen={isActionSheetOpen}
        setIsSheetOpen={setIsActionSheetOpen}
        sheetPosition={actionSheetPosition}
        snapPoints={[40]}
        setSheetPosition={setActionSheetPosition}>
        <ScrollView space="$4">
          <StyledButton onPress={onImageRemove}>{t('remove')}</StyledButton>
        </ScrollView>
      </ActionSheet>
    </KeyboardAwareScrollView>
  );
};

export default EditComment;
