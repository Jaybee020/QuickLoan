import axios from 'axios';
import {RALLY_API_KEY_TESTNET} from '@env';
import {getAllAsync} from 'helpers/common';
import Loader from 'components/common/Loader';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect, useContext, createContext} from 'react';

import {
  RlyMumbaiNetwork,
  Network,
  createAccount,
} from '@rly-network/mobile-sdk';

const rlyNetwork: Network = RlyMumbaiNetwork;
rlyNetwork.setApiKey(RALLY_API_KEY_TESTNET);

interface IUser {
  email: string;
  feeBalance: number;
  subscriptions: string[];
  userOperations: string[];
  custodialAddress: string;
  smartAccountAddress?: string;
}

interface AppProvider {
  children: React.ReactElement | React.ReactElement[];
}

interface AppContext {
  user: IUser;
  email: string;
  address: string;
  disconnect: () => Promise<void>;
  setEmail: (value: string) => void;
  createUser: (email: string) => Promise<void>;
}

const AppContext = createContext<AppContext>({} as AppContext);
export const useApp = (): AppContext => useContext(AppContext);

const AppProvider = ({children}: AppProvider) => {
  const netInfo = useNetInfo();
  const [user, setUser] = useState({} as IUser);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize states
  const initialize = async () => {
    const {address, user} = await getAllAsync(['address', 'user']);
    if (address) setAddress(address);
    if (user) setUser(JSON.parse(user));

    setLoading(false);
  };

  const createUser = async (email: string) => {
    const addr = await createAccount();
    if (addr) {
      setAddress(addr);
      await AsyncStorage.setItem('address', addr);
    }

    const userData = await axios
      .post('https://quickloan.fly.dev/user', {
        email,
        custodialAddress: addr,
      })
      .then(res => res?.data?.data);

    if (userData) {
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const disconnect = async () => {
    setAddress('');
    setUser({} as IUser);
    await AsyncStorage.multiRemove(['address', 'user']);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        email,
        address,
        setEmail,
        createUser,
        disconnect,
      }}>
      {loading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export default AppProvider;
