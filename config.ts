import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
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

export const CircleAPI = axios.create({
  baseURL: "https://api-sandbox.circle.com/",
  headers: { Authorization: `Bearer ${CIRCLE_API_KEY}` },
});

export const chainToWETH = {
  eth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  bsc: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  polygon: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  mumbai: "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
  arbitrum: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  optimism: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  avalanche: "",
  fantom: "",
  cronos: "",
};
