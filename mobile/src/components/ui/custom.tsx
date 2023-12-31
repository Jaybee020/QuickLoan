import {
  View,
  ViewProps,
  ScrollView,
  ThemeProps,
  SafeAreaView as DefaultSafeArea,
} from './themed';
import {
  SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export function SafeAreaView(props: SafeAreaViewProps & ThemeProps) {
  const {style, lightColor, darkColor, ...otherProps} = props;

  return (
    <DefaultSafeArea
      style={[{paddingTop: 0}, style]}
      lightColor={lightColor}
      darkColor={darkColor}
      {...otherProps}>
      <ScrollView
        bounces={false}
        darkColor={darkColor}
        lightColor={lightColor}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        {props.children}
      </ScrollView>
    </DefaultSafeArea>
  );
}

export function Container(
  props: ViewProps & {
    paddingTop?: number;
  },
) {
  const insets = useSafeAreaInsets();
  const {style, lightColor, darkColor, paddingTop, ...otherProps} = props;

  return (
    <View
      {...otherProps}
      darkColor={darkColor}
      lightColor={lightColor}
      transparent={false}
      style={[
        {
          flex: 1,
          paddingHorizontal: 20,
          flexDirection: 'column',
          paddingTop: insets.top + (paddingTop ?? 30),
        },
        style,
      ]}>
      {props.children}
    </View>
  );
}
