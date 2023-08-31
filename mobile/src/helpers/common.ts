import AsyncStorage from '@react-native-async-storage/async-storage';

function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const getAllAsync = async (storage_Keys: string[]) => {
  const qArray = await AsyncStorage.multiGet(storage_Keys);

  const dataObj: {[key: string]: any} = {};
  qArray.map(([key, value]) => {
    dataObj[key] = value;
  });
  return dataObj;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatIpfsLink = (url: string) => {
  return url.includes('ipfs://')
    ? 'https://ipfs.io/ipfs/' + url.split('ipfs://')[1]
    : url;
};

const constrictAddress = (address: string, range1 = 5, range2 = 5) => {
  return address
    ? `${address?.slice(0, range1)}...${address?.slice(-range2)}`
    : '';
};

export {delay, constrictAddress, getAllAsync, capitalize, formatIpfsLink};
