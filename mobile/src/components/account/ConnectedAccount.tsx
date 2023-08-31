import {useApp} from 'context/AppContext';
import {Text} from 'components/ui/typography';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {constrictAddress} from 'helpers/common';
import NetworkIndicator from 'components/common/NetworkIndicator';

const ConnectedAccount = () => {
  const {address, email} = useApp();

  return (
    <View style={[styles.container]}>
      <View style={[styles.avatar]}>
        <FastImage
          source={require('@assets/images/avatar.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={[{width: '100%', height: '100%'}]}
        />
      </View>

      <View style={[styles.info]}>
        <Text style={[styles.address]} numberOfLines={1}>
          {constrictAddress(address)}
        </Text>
        {email && (
          <Text grey style={[styles.ens]} numberOfLines={1}>
            {email}
          </Text>
        )}
      </View>

      <NetworkIndicator />
    </View>
  );
};

export default ConnectedAccount;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection: 'row',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#999',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  address: {
    fontSize: 16,
  },
  ens: {
    fontSize: 14,
  },
});
