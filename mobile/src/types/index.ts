import {
  NavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type ModalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Modal'
>;

export type RootTabParamList = {
  home: undefined;
  activity: undefined;
  settings: undefined;
};

export type RootStackParamList = {
  Modal: {
    data: any;
  };
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AppNavigationProp = NavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
