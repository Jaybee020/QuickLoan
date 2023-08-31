import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';

export function hapticFeedback(type: HapticFeedbackTypes) {
  HapticFeedback.trigger(type ?? 'impactLight');
}
