import styles from './txndetails.styles';
import Colors from 'constants/Colors';
import {X} from 'lucide-react-native';
import useColorScheme from 'hooks/useColorScheme';
import {BdText, Text} from 'components/ui/typography';
import {TouchableOpacity, View} from 'components/ui/themed';

const TxnDetails = () => {
  const theme = useColorScheme();

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <View style={[styles.header_inner]}>
          <BdText style={[styles.header_title]}>Transaction details</BdText>
          <Text
            style={[
              styles.header_subtitle,
              {
                color: Colors[theme].neutral600,
              },
            ]}>
            Review the transaction details to proceed.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.close_btn,
            {
              backgroundColor: Colors[theme].neutral400,
            },
          ]}>
          <X size={16} color={Colors[theme].invert} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <View style={[styles.details]}>
        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>From this network</Text>
          <View style={[styles.token]}>
            <View
              style={[
                styles.token_image,
                {backgroundColor: Colors[theme].neutral500},
              ]}></View>
            <Text style={[styles.token_name]}>Ethereum</Text>
          </View>
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>To this network</Text>
          <View style={[styles.token]}>
            <View
              style={[
                styles.token_image,
                {backgroundColor: Colors[theme].neutral500},
              ]}></View>
            <Text style={[styles.token_name]}>Linear</Text>
          </View>
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>You’ll send</Text>
          <Text style={[styles.token_name]}>250 USDT</Text>
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>You’ll receive</Text>
          <Text style={[styles.token_name]}>247.663847 USDT</Text>
        </View>
      </View>

      <View style={[styles.price_info]}>
        <Text
          style={[
            styles.block_title,
            {
              fontSize: 15,
              color: Colors[theme].neutral600,
            },
          ]}>
          Total (Amount + Gas)
        </Text>
        <BdText style={[styles.block_title]}>$5.9230</BdText>
        <Text style={[styles.subtext, {color: Colors[theme].neutral600}]}>
          Includes a 2.5% Bridgebloc fee
        </Text>
      </View>

      <TouchableOpacity
        lightColor="#000"
        darkColor="#fff"
        style={[styles.button]}>
        <BdText lightColor="#fff" darkColor="#000" style={[styles.button_text]}>
          Confirm
        </BdText>
      </TouchableOpacity>

      <View style={[styles.footer]}>
        <Text style={[styles.footer_text]}>
          By submitting, you agree to Bridgebloc’s{' '}
          <Text
            style={{
              color: Colors[theme].primary,
            }}>
            Terms of Use
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default TxnDetails;
