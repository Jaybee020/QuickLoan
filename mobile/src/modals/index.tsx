import Animated, {
  Easing,
  runOnJS,
  withTiming,
  Extrapolate,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
} from 'react-native-reanimated';
import Layout from '@constants/Layout';
import {ModalScreenProps} from 'types';
import {Container} from '@components/ui/custom';
import BottomSheet from './components/BottomSheet';
import useColorScheme from '@hooks/useColorScheme';
import {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import TxnDetails from './txnDetails/txnDetails';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ModalScreen({route}: ModalScreenProps) {
  // const {data} = route?.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const backdropOpacity = isDark ? 0.4 : 0.22;

  const active = useSharedValue(false);
  const translateY = useSharedValue(0);
  const [shouldClose, setShouldClose] = useState(false);

  const SCREEN_HEIGHT = Layout.window.height - insets.top - 14;
  const MAX_TRANSLATE_Y = -530;

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withTiming(destination, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const closeModal = useCallback(() => {
    scrollTo(0);
  }, []);

  useEffect(() => {
    if (shouldClose) {
      navigation.goBack();
    }
  }, [shouldClose]);

  useAnimatedReaction(
    () => {
      return !active.value && translateY.value === 0;
    },
    status => {
      if (status) {
        runOnJS(setShouldClose)(true);
      }
    },
  );

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y],
      [0, backdropOpacity],
      Extrapolate.CLAMP,
    ),
  }));

  return !shouldClose ? (
    <GestureHandlerRootView>
      <Container style={[styles.container]}>
        <AnimatedTouchable
          activeOpacity={backdropOpacity}
          onPress={() => {
            closeModal();
          }}
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
            backdropAnimatedStyle,
          ]}
        />

        <BottomSheet
          scrollTo={scrollTo}
          translateY={translateY}
          SCREEN_HEIGHT={SCREEN_HEIGHT}
          MAX_TRANSLATE_Y={MAX_TRANSLATE_Y}>
          <TxnDetails />
        </BottomSheet>
      </Container>
    </GestureHandlerRootView>
  ) : (
    <></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  backdrop: {
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: '#000',
    width: Layout.window.width,
    height: Layout.window.height,
  },
});
