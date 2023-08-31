import axios from "axios";
import * as dotenv from "dotenv";
import { Dictionary } from "./interfaces";

dotenv.config();

export const ALCHEMY_API_KEY = String(process.env.ALCHEMY_API_KEY);
export const uri = String(process.env.MONGO_URI);
export const MODE = String(process.env.MODE);
export const PORT: number = parseInt(process.env.PORT as string) || 8000;
export const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD);
export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_USERNAME = String(process.env.REDIS_USERNAME);
export const REDIS_PORT = Number(process.env.REDIS_PORT);
const CIRCLE_API_KEY = String(process.env.CIRCLE_API_KEY);
export const APP_EMAIL = String(process.env.APP_EMAIL);
export const APP_EMAIL_PASS = String(process.env.APP_EMAIL_PASS);
export const POLICY_ID = String(process.env.POLICY_ID);

export const CircleAPI = axios.create({
  baseURL: "https://api-sandbox.circle.com/",
  headers: { Authorization: `Bearer ${CIRCLE_API_KEY}` },
});

export const defillamaAPI = axios.create({
  baseURL: "https://coins.llama.fi/",
  headers: { accept: "application/json" },
});

export const GLOBAL_NETWORK = "mumbai";
export const WMATICTOKENADDR = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";

export const chainToWETH = {
  eth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  bsc: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  polygon: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  mumbai: "0xfec23a9E1DBA805ADCF55E0338Bf5E03488FC7Fb",
  arbitrum: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  optimism: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  avalanche: "",
  fantom: "",
  cronos: "",
};

export const chainTochainId = {
  mumbai: 80001,
  polygon: 137,
  eth: 1,
  bsc: 0,
  arbitrum: 0,
  optimism: 0,
  avalanche: 0,
  fantom: 0,
  cronos: 0,
};

const networkToSmartAccountFactory = {
  mumbai: "0x9406Cc6185a346906296840746125a0E44976454",
  polygon: "0x9406Cc6185a346906296840746125a0E44976454",
};
export const defaultEntrypointAddr =
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const defaultSmartAccountFactory =
  networkToSmartAccountFactory[GLOBAL_NETWORK];

export const tokenToDecimal: Dictionary<number> = {
  USDC: 6,
  DAI: 18,
  WETH: 18,
  WBTC: 8,
  WMATIC: 18,
};

const networkToSupportedTokens = {
  mumbai: {
    USDC: "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9",
    DAI: "0x4DAFE12E1293D889221B1980672FE260Ac9dDd28",
    WETH: "0xE1e67212B1A4BF629Bdf828e08A3745307537ccE",
    WBTC: "0x4B5A0F4E00bC0d6F16A593Cae27338972614E713",
    WMATIC: "0xfec23a9E1DBA805ADCF55E0338Bf5E03488FC7Fb",
  },
  polygon: {
    USDC: "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9",
    DAI: "0x4DAFE12E1293D889221B1980672FE260Ac9dDd28",
    WETH: "0xE1e67212B1A4BF629Bdf828e08A3745307537ccE",
    WBTC: "0x4B5A0F4E00bC0d6F16A593Cae27338972614E713",
    WMATIC: "0xfec23a9E1DBA805ADCF55E0338Bf5E03488FC7Fb",
  },
};

const networkToCompoundVariables = {
  mumbai: {
    comet: "",
    reward: "",
  },
};
