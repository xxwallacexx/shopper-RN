import { AntDesign } from "@expo/vector-icons"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

const Spinner = ({ size = 12, color = "#fff" }: { size?: number, color?: string }) => {
  const rotation = useSharedValue(0);
  rotation.value = withRepeat(withTiming(360, { duration: 6000 }), -1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[{ height: size, width: size }, animatedStyle]}>
      <AntDesign color={color} size={size} name="loading1" />
    </Animated.View>
  )
}

export default Spinner
