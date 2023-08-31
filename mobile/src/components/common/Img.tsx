import {View} from '../ui/themed';
import FastImage from 'react-native-fast-image';
import useColorScheme from '@hooks/useColorScheme';
import {
  ColorValue,
  DimensionValue,
  Image,
  ImageSourcePropType,
  ViewProps,
} from 'react-native';

type Props = {
  uri?: string;
  rounded?: boolean;
  transparent?: boolean;
  size?: DimensionValue;
  width?: DimensionValue;
  height?: DimensionValue;
  background?: ColorValue;
  source?: ImageSourcePropType;
};

const Img = (props: Props & ViewProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    uri,
    size,
    width,
    height,
    source,
    rounded,
    style,
    transparent,
    background,
    ...otherprops
  } = props;

  return (
    <View
      style={[
        {
          overflow: 'hidden',
          width: width || size || 50,
          height: height || size || 50,
          backgroundColor: background
            ? background
            : transparent
            ? 'transparent'
            : isDark
            ? '#888'
            : '#ddd',
          borderRadius: rounded === false ? 0 : 1000,
        },
        style,
      ]}
      {...otherprops}>
      {(uri || source) && (
        <>
          {uri ? (
            <FastImage
              source={{
                uri,
                cache: FastImage.cacheControl.immutable,
              }}
              resizeMode={FastImage.resizeMode.cover}
              style={[{width: '100%', height: '100%'}]}
            />
          ) : (
            <Image
              resizeMode="cover"
              source={source || {uri}}
              style={[{resizeMode: 'cover', width: '100%', height: '100%'}]}
            />
          )}
        </>
      )}
    </View>
  );
};

export default Img;
