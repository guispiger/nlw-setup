import { useEffect } from "react";
import { View } from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

interface Props {
    progress?: number;
};

export function Progressbar({progress = 0}: Props) {
    const sharedProgess = useSharedValue(progress);

    const style = useAnimatedStyle(() => {
        return {
            width: `${sharedProgess.value}%`
        };
    });

    useEffect(() => {
        sharedProgess.value = withTiming(progress);
    },[progress]);

    return (
        <View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
            <Animated.View  
                className=" h-3 rounded-xl bg-violet-600"
                style={style}
            />
        </View>
    )
}