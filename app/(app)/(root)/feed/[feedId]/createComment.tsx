import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { TextArea } from 'tamagui';
import { SizableText, YStack } from 'tamagui';
import { Image } from 'tamagui';
import { Separator } from 'tamagui';
import { ScrollView } from 'tamagui';
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
    <KeyboardAwareScrollView
      extraHeight={140}
      style={{ backgroundColor: 'white', flex: 1, width: '100%' }}>
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

export default CreateFeedComment;
