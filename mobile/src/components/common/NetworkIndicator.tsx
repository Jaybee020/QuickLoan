import Colors from 'constants/Colors';
import {StyleSheet} from 'react-native';
import {Globe} from 'lucide-react-native';
import {View} from 'components/ui/themed';
import useColorScheme from 'hooks/useColorScheme';
import {useNetInfo} from '@react-native-community/netinfo';

const NetworkIndicator = () => {
  const netInfo = useNetInfo();
  const theme = useColorScheme();
  const invert = Colors[theme].invert;
  const bgColor = Colors[theme].background;

  return (
    <View
      style={{
        height: 20,
        marginLeft: 20,
        position: 'relative',
      }}>
      <Globe size={20} color={invert} />
      <View
        style={{
          bottom: -2,
          right: -4,
          width: 12,
          height: 12,
          borderWidth: 3,
          borderRadius: 10,
          borderColor: bgColor,
          position: 'absolute',
          backgroundColor: netInfo.isConnected ? '#28a745' : '#fff',
        }}
      />
    </View>
  );
};

export default NetworkIndicator;

const styles = StyleSheet.create({});
