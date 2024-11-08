import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SizableText, YStack, ScrollView, Separator, TextArea } from 'tamagui';
import { getFeedComment, editFeedComment, getSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import StarRating from 'react-native-star-rating-widget';
import { ImageCard, ImageInput } from '~/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledButton } from '~/tamagui.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import ActionSheet from '~/components/ActionSheet';

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
      let res = await getFeedComment(commentId);
      setPhotoObjects(res.photos);
      setComment(res.comment);
      return res;
    },
  });

  const { isPending: isEditCommentSubmitting, mutate: editCommentMutate } = useMutation({
    mutationFn: async () => {
      let formData = new FormData();
      for (const photoObject of photoObjects) {
        if (!photoObject._id) {
          const filename = photoObject.path.split('/').pop();
          if (!filename) return;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('photos', {
            uri: photoObject.path,
            name: filename,
            type: type,
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
      console.log(e);
      const error = e as Error;
      Toast.show({
        type: 'error',
        text1: t(error.message),
      });
    },
  });

  if (!commentData || !user) return <></>;

  const onImageInputChange = (value: string) => {
    let _photoObjects = [...photoObjects];
    _photoObjects.push({ path: value });
    setPhotoObjects(_photoObjects);
  };

  const onImageRemove = () => {
    if (selectedPhotoIndex == undefined) return;
    let _photoObjects = [...photoObjects];
    _photoObjects.splice(selectedPhotoIndex, 1);
    setPhotoObjects(_photoObjects);
    setIsActionSheetOpen(false);
  };

  return (
    <KeyboardAwareScrollView
      extraHeight={140}
      style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
      <ScrollView flex={1} space="$2" contentContainerStyle={{ alignItems: 'center' }}>
        <YStack w="100%" alignItems="center" space="$2">
          <Image
            resizeMode="contain"
            aspectRatio={1}
            source={{ uri: user?.avatar }}
            width={'20%'}
          />
          <SizableText>{user?.username}</SizableText>
        </YStack>
        <Separator width={'90%'} />
        <Separator width={'90%'} />
        <ScrollView
          w="100%"
          contentContainerStyle={{
            margin: 16,
            alignItems: 'flex-start',
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
        <Separator width={'90%'} />
        <TextArea
          autoCorrect={false}
          autoCapitalize="none"
          w="90%"
          size={'$4'}
          value={comment}
          onChangeText={(value) => {
            setComment(value);
          }}
        />
        <TouchableOpacity
          disabled={isEditCommentSubmitting || comment.length == 0}
          onPress={() => editCommentMutate()}>
          <StyledButton w="100%" disabled={isEditCommentSubmitting || comment.length == 0}>
            {t('confirm')}
          </StyledButton>
        </TouchableOpacity>
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
