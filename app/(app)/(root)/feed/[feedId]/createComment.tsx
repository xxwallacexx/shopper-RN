import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { SizableText, YStack, Image, Separator, ScrollView, TextArea } from 'tamagui';

import { createFeedComment, getSelf } from '~/api';
import { ImageCard, ImageInput } from '~/components';
import { useAuth, useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const CreateFeedComment = () => {
  const queryClient = useQueryClient();
  const { feedId } = useLocalSearchParams<{ feedId: string }>();
  const { t } = useLocale();
  const router = useRouter();
  const { token } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  if (!token) return <></>;

  const { isPending: isCreateCommentSubmitting, mutate: createCommentMutate } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      for (const photo of photos) {
        const filename = photo.split('/').pop();
        if (!filename) return;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('photos', {
          uri: photo,
          name: filename,
          type,
        });
      }
      formData.append('comment', comment);
      return await createFeedComment(token, feedId, formData);
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

  const { data: user } = useQuery({
    queryKey: ['profile', token],
    queryFn: async () => {
      return await getSelf(token);
    },
  });
  if (!user) return <></>;

  const onImageInputChange = (value: string) => {
    const _photos = [...photos];
    _photos.push(value);
    setPhotos(_photos);
  };

  const onImageRemove = (index: number) => {
    const _photos = [...photos];
    _photos.splice(index, 1);
    setPhotos(_photos);
  };

  return (
    <KeyboardAwareScrollView
      extraHeight={140}
      style={{ backgroundColor: 'white', flex: 1, width: '100%' }}>
      <ScrollView f={1} contentContainerStyle={{ ai: 'center' }}>
        <YStack w="100%" ai="center" gap="$2">
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
          {photos.map((p, index) => {
            return (
              <ImageCard
                key={index.toString() + p}
                imageUri={p}
                onPhotoPress={() => {
                  console.log(p);
                }}
              />
            );
          })}
          {photos.length < 6 ? <ImageInput onChange={onImageInputChange} /> : null}
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
          onPress={() => createCommentMutate()}
          w="80%"
          my="$2"
          disabled={isCreateCommentSubmitting || comment.length == 0}>
          {t('confirm')}
        </StyledButton>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default CreateFeedComment;
