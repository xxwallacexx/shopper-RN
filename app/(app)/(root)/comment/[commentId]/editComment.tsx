import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SizableText, YStack, ScrollView, Separator, TextArea } from 'tamagui';
import { getProductComment, editProductComment, getSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import StarRating from 'react-native-star-rating-widget';
import { ImageCard, ImageInput } from '~/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledButton } from '~/tamagui.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const EditComment = () => {
  const { t } = useLocale();
  const router = useRouter();
  const { commentId } = useLocalSearchParams<{ commentId: string }>();
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

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
      let res = await getProductComment(commentId);
      setRating(res.rating);
      setPhotos(
        res.photos.map((p) => {
          return p.path;
        })
      );
      setComment(res.comment);
      return res;
    },
  });

  const { isPending: isEditCommentSubmitting, mutate: editCommentMutate } = useMutation({
    mutationFn: async () => {
      let formData = new FormData();
      for (const photo of photos) {
        const filename = photo.split('/').pop();
        if (!filename) return;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('photos', {
          uri: photo,
          name: filename,
          type: type,
        });
      }
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      return await editProductComment(token, commentId, formData);
    },
    onSuccess: async (res) => {
      queryClient.resetQueries({ queryKey: ['productComments'] });
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
    let _photos = [...photos];
    _photos.push(value);
    setPhotos(_photos);
  };

  const onImageRemove = (index: number) => {
    let _photos = [...photos];
    _photos.splice(index, 1);
    setPhotos(_photos);
  };

  return (
    <KeyboardAwareScrollView extraHeight={140} style={{ flex: 1, width: '100%' }}>
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
        <StarRating enableHalfStar={false} rating={rating} onChange={setRating} />
        <Separator width={'90%'} />
        <ScrollView
          w="100%"
          contentContainerStyle={{
            margin: 16,
            alignItems: 'flex-start',
            gap: 16,
          }}
          horizontal>
          {photos.map((p, index) => {
            return (
              <ImageCard
                key={index.toString() + p}
                imageUri={p}
                onRemove={() => {
                  onImageRemove(index);
                }}
              />
            );
          })}
          {photos.length < 6 ? <ImageInput onChange={onImageInputChange} /> : null}
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
        <TouchableOpacity disabled={isEditCommentSubmitting} onPress={() => editCommentMutate()}>
          <StyledButton w="100%" disabled={isEditCommentSubmitting}>
            {t('confirm')}
          </StyledButton>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default EditComment;
