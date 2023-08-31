import 'react-native-get-random-values';
import '@ethersproject/shims';
import './shim';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {Providers} from 'context/Providers';

AppRegistry.registerComponent(appName, () => Providers);
