import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import Colors from '@constants/Colors';
import {View} from '@components/ui/themed';
import {ColorSchemeName} from 'react-native';
import {BdText} from '@components/ui/typography';
import useColorScheme from '@hooks/useColorScheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  RootTabParamList,
  RootStackParamList,
  RootTabScreenProps,
} from '@typings/index';

import Modal from 'modals';
import Home from 'screens/home';
import Activity from '@screens/activity';
import Settings from '@screens/settings';
import {House} from 'phosphor-react-native';
import Icons from '@components/common/Icons';

// NAVIGATION CONTAINER
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

//  ROOT NAVIGATOR
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Group>
        <Stack.Screen name="Root" component={BottomTabNavigator} />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: 'containedTransparentModal',
          animation: 'fade',
          animationDuration: 10,
        }}>
        <Stack.Screen name="Modal" component={Modal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

// BOTTOM TAB NAVIGATOR
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 94,
          paddingTop: 15,
          borderTopWidth: 1,
          paddingBottom: insets.bottom + 8,
          backgroundColor: Colors[colorScheme].tabBackground,
        },
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
      }}>
      <BottomTab.Screen
        name="home"
        component={Home}
        options={({navigation}: RootTabScreenProps<'home'>) => ({
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                paddingTop: 5,
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <House size={25} color={color} weight="fill" />
              <BdText
                style={{
                  color,
                  fontSize: 10,
                  marginTop: 11,
                  lineHeight: 10,
                }}>
                Home
              </BdText>
            </View>
          ),
        })}
      />

      {/* <BottomTab.Screen
        name="activity"
        component={Activity}
        options={({navigation}: RootTabScreenProps<'activity'>) => ({
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                paddingTop: 5,
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <Icons.Activity size={20} color={color} />
              <BdText
                style={{
                  color,
                  fontSize: 10,
                  marginTop: 11,
                  lineHeight: 10,
                }}>
                Activity
              </BdText>
            </View>
          ),
        })}
      /> */}

      <BottomTab.Screen
        name="settings"
        component={Settings}
        options={({navigation}: RootTabScreenProps<'settings'>) => ({
          tabBarIcon: ({color, focused}) => (
            <View
              style={{
                paddingTop: 5,
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}>
              <Icons.Settings size={21} color={color} />
              <BdText
                style={{
                  color,
                  fontSize: 10,
                  marginTop: 11,
                  lineHeight: 10,
                }}>
                Settings
              </BdText>
            </View>
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
