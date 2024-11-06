import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { YStack } from 'tamagui';
import { Stack, Image } from 'tamagui';
import ActionSheet from './ActionSheet';
import { useVideoPlayer, VideoView } from 'expo-video';

const Video = ({ uri }: { uri: string }) => {
  const ref = useRef(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState(0);
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
    player.play();
  });

  const { data: thumbnail } = useQuery({
    queryKey: ['video', uri],
    queryFn: async () => {
      let res = await VideoThumbnails.getThumbnailAsync(uri);
      return res.uri;
    },
  });

  if (!thumbnail) return <></>;

  return (
    <YStack>
      <TouchableOpacity onPress={() => setIsSheetOpen(true)}>
        <Image
          position="relative"
          source={{ uri: thumbnail }}
          width={'100%'}
          height={'100%'}
          aspectRatio={1.778}
          resizeMode="contain"
        />
        <Stack p="$1" bg="black" position="absolute" l="$2" t="$2">
          <AntDesign color={'white'} name="playcircleo" size={24} />
        </Stack>
      </TouchableOpacity>
      <ActionSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        snapPoints={[100]}
        sheetPosition={sheetPosition}
        setSheetPosition={setSheetPosition}>
        <YStack bg="black" flex={1}>
          <VideoView allowsFullscreen={false} ref={ref} style={{ flex: 1 }} player={player} />
          <YStack position="absolute" l="$4" t="$10">
            <TouchableOpacity
              onPress={() => {
                setIsSheetOpen(false);
              }}>
              <Ionicons size={20} name="arrow-back" color="#fff" />
            </TouchableOpacity>
          </YStack>
        </YStack>
      </ActionSheet>
    </YStack>
  );
};

export default Video;
