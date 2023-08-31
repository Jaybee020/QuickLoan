import styles from './home.styles';
import Colors from 'constants/Colors';
import {Container} from 'components/ui/custom';
import {ChevronDown} from 'lucide-react-native';
import useColorScheme from 'hooks/useColorScheme';
import {useNavigation} from '@react-navigation/native';
import ConnectedAccount from 'components/account/ConnectedAccount';
import {TouchableOpacity, View} from 'components/ui/themed';
import {BdText, Input, RgText, Text} from 'components/ui/typography';

const Home = () => {
  const navigation = useNavigation();
  const theme = useColorScheme();
  const grey = Colors[theme].grey;
  const darken = Colors[theme].darken;

  return (
    <Container paddingTop={20} style={[styles.container]}>
      <ConnectedAccount />

      <View accent style={[styles.home]}>
        <View style={[styles.header]}>
          <BdText style={[styles.header_title]}>Bridge Tokens</BdText>
          <RgText grey style={[styles.header_subtitle]}>
            Transfer your tokens from one network to the other. If you
            experience any issues, kindly.
          </RgText>
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>From this network</Text>

          <TouchableOpacity
            style={[styles.select, {borderColor: Colors[theme].neutral500}]}>
            <View style={[styles.token]}>
              <View
                style={[
                  styles.token_image,
                  {backgroundColor: Colors[theme].neutral500},
                ]}></View>
              <Text style={[styles.token_name]}>Ethereum</Text>
            </View>

            <ChevronDown size={20} color={grey} />
          </TouchableOpacity>
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>To this network</Text>
          <TouchableOpacity
            style={[
              styles.select,
              {
                borderColor: Colors[theme].neutral500,
              },
            ]}>
            <View style={[styles.token]}>
              <View
                style={[
                  styles.token_image,
                  {backgroundColor: Colors[theme].neutral500},
                ]}></View>
              <Text style={[styles.token_name]}>Linear</Text>
            </View>

            <ChevronDown size={20} color={grey} />
          </TouchableOpacity>
        </View>

        <View style={[styles.block]}>
          <Text
            style={[
              styles.block_title,
              {
                marginTop: 10,
              },
            ]}>
            Select token
          </Text>
          {true ? (
            <View
              style={[
                styles.select,
                {
                  borderColor: Colors[theme].neutral500,
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.token,
                  {borderRightWidth: 1, borderRightColor: grey},
                ]}>
                <View
                  style={[
                    styles.token_image,
                    {
                      backgroundColor: Colors[theme].neutral500,
                    },
                  ]}></View>
                <Text style={[styles.token_name]}>USDT</Text>
                <ChevronDown size={18} color={grey} />
              </TouchableOpacity>

              <Input
                value={'20'}
                keyboardType="numeric"
                placeholder="Enter an amount"
                style={[styles.token_input]}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.select,
                {
                  borderColor: Colors[theme].neutral500,
                },
              ]}>
              <View style={[styles.token]}>
                <View
                  style={[
                    styles.token_image,
                    {backgroundColor: Colors[theme].neutral500},
                  ]}></View>
                <Text style={[styles.token_name]}>Select a token</Text>
              </View>

              <ChevronDown size={20} color={grey} />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.block]}>
          <Text style={[styles.block_title]}>You will receive</Text>

          <View
            style={[
              styles.select,
              {
                backgroundColor: darken,
                borderColor: Colors[theme].neutral500,
              },
            ]}>
            {true ? (
              <>
                <Text style={[styles.token_value]}>19.8250 USDT</Text>
                <Text grey style={[styles.token_estimate]}>
                  ≈ $19.99
                </Text>
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        lightColor="#000"
        darkColor="#fff"
        style={[styles.button]}
        onPress={() => {
          navigation.navigate('Modal', {
            data: {},
          });
        }}>
        <BdText lightColor="#fff" darkColor="#000" style={[styles.button_text]}>
          Continue
        </BdText>
      </TouchableOpacity>
    </Container>
  );
};

export default Home;
