import React, { useCallback, useImperativeHandle } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import {theme} from "../../styles/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 400;
const NORMAL_POSITION = 300;

type AudioBottomSheetProps = {
  children?: React.ReactNode;
};

export type AudioBottomSheetRefProps = {
  scrollTo: (close: number) => void;
  isActive: () => boolean;
};

const AudioBottomSheet = React.forwardRef<AudioBottomSheetRefProps, AudioBottomSheetProps>(({ children }, ref) => {
  const translateY = useSharedValue(-NORMAL_POSITION); // The number that is used at the beginning
  const active = useSharedValue(true);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive]);

  const context = useSharedValue({ y: 500 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      if (event.y > 55) return;
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value >= -300) {
        translateY.value = withSpring(- NORMAL_POSITION, { damping: 50 });
        scrollTo(- NORMAL_POSITION);
      }
      else if (translateY.value < -300) {
        scrollTo(MAX_TRANSLATE_Y);
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 50],
      Extrapolation.CLAMP
    );
    return {
      borderRadius,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

export default AudioBottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: theme.background.secondary,
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 20,
    paddingBottom: 350,
    shadowColor: 'rgba(137, 169, 170, 0.25)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 8
  }
});
