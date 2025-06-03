import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SizableText, YStack, ScrollView, Separator, TextArea } from 'tamagui';
import { createProductComment, getSelf } from '~/api';
import { useAuth, useLocale } from '~/hooks';
import StarRating from 'react-native-star-rating-widget';
import { ImageCard, ImageInput } from '~/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyledButton } from '~/tamagui.config';
import Toast from 'react-native-toast-message';

const CreateProductComment = () => {
  const queryClient = useQueryClient();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { t } = useLocale();
  const router = useRouter();
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  if (!token) return <></>;

  const { isPending: isCreateCommentSubmitting, mutate: createCommentMutate } = useMutation({
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
      return await createProductComment(token, productId, formData);
    },
    onSuccess: async (res) => {
      queryClient.resetQueries({ queryKey: ['productComments'] });
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

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });
  if (!user) return <></>;

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
      <ScrollView f={1} gap="$2" contentContainerStyle={{ ai: 'center' }}>
        <YStack w="100%" ai="center" gap="$2">
          <Image objectFit="contain" aspectRatio={1} source={{ uri: user?.avatar }} width={'20%'} />
          <SizableText>{user?.username}</SizableText>
        </YStack>
        <Separator w={'90%'} />
        <StarRating enableHalfStar={false} rating={rating} onChange={setRating} />
        <Separator w={'90%'} />
        <ScrollView
          w="100%"
          contentContainerStyle={{
            m: 16,
            ai: 'flex-start',
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
        <Separator w={'90%'} />
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
        <StyledButton
          onPress={() => createCommentMutate()}
          w="80%"
          disabled={isCreateCommentSubmitting || comment.length == 0}>
          {t('confirm')}
        </StyledButton>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};
export default CreateProductComment;
