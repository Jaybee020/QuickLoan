import { formatUnits, hexValue } from "ethers/lib/utils";
import { ALCHEMY_API_KEY, defaultEntrypointAddr } from "../../../config";
import {
  EVMSupportedChains,
  PayMasterAndGasData,
  UserOperationReceipt,
  UserOperationRequest,
  UserOperationResponse,
  UserOperationStruct,
} from "../../../interfaces";
import { EVMNodeInquirer } from "./baseProvider";
import { BigNumber } from "ethers";

export interface TokenMetadata {
  token_address: string;
  decimals: number;
  name: string;
  symbol: string;
  logo?: string;
}

export class ERC4337Provider extends EVMNodeInquirer {
  private txMaxRetries: number;
  private txRetryIntervalMs: number;
  private txRetryMulitplier: number;
  constructor(
    chain?: EVMSupportedChains,
    txMaxRetries?: number,
    txRetryIntervalMs?: number,
    txRetryMultiplier?: number
  ) {
    super(chain ?? "mumbai", {
      ALCHEMY: ALCHEMY_API_KEY,
    });
    this.txMaxRetries = txMaxRetries ?? 5;
    this.txRetryIntervalMs = txRetryIntervalMs ?? 2000;
    this.txRetryMulitplier = txRetryMultiplier ?? 2;
  }

  async sendUserOperation(request: UserOperationRequest, entrypoint: string) {
    return this.callFunctionSpecficToCertainProvider<string>(
      "ALCHEMY",
      "eth_sendUserOperation",
      [request, entrypoint]
    );
  }

  getUserOperationByHash(hash: string) {
    return this.callFunctionSpecficToCertainProvider<UserOperationResponse>(
      "ALCHEMY",
      "eth_getUserOperationByHash",
      [hash]
    );
  }

  getUserOperationReceipt(hash: string) {
    return this.callFunctionSpecficToCertainProvider<UserOperationReceipt>(
      "ALCHEMY",
      "eth_getUserOperationReceipt",
      [hash]
    );
  }

  getSupportedEntryPoints(hash: string) {
    return this.callFunctionSpecficToCertainProvider<string[]>(
      "ALCHEMY",
      "eth_supportedEntryPoints",
      [hash]
    );
  }

  estimateUserOperationGas(
    userOperation: Pick<
      UserOperationRequest,
      "sender" | "nonce" | "initCode" | "callData"
    >
  ) {
    const dummyPayMaster = this.getDummyPayMaster();
    var op = {
      ...userOperation,
      paymasterAndData: dummyPayMaster,
      signature:
        "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };

    const entrypoint = defaultEntrypointAddr;

    return this.callFunctionSpecficToCertainProvider<PayMasterAndGasData>(
      "ALCHEMY",
      "eth_estimateUserOperationGas",
      [op, entrypoint]
    );
  }

  getGasAndPaymasterData(
    policyId: string,
    entryPoint: string,
    dummySignature: string,
    userOperation: Pick<
      UserOperationRequest,
      "sender" | "nonce" | "initCode" | "callData"
    >
  ) {
    const { sender, nonce, initCode, callData } = userOperation;
    return this.callFunctionSpecficToCertainProvider<PayMasterAndGasData>(
      "ALCHEMY",
      "alchemy_requestGasAndPaymasterAndData",
      [
        {
          policyId,
          entryPoint,
          dummySignature,
          userOperation: {
            sender,
            nonce,
            initCode,
            callData,
          },
        },
      ]
    );
  }

  waitForUserOperationTransaction = async (
    hash: string
  ): Promise<string | undefined> => {
    for (let i = 0; i < this.txMaxRetries; i++) {
      const txRetryIntervalWithJitterMs =
        this.txRetryIntervalMs * Math.pow(this.txRetryMulitplier, i) +
        Math.random() * 100;

      await new Promise((resolve) =>
        setTimeout(resolve, txRetryIntervalWithJitterMs)
      );
      const receipt = await this.getUserOperationReceipt(hash as `0x${string}`)
        // TODO: should maybe log the error?
        .catch(() => null);
      if (receipt) {
        return this.getTransactionByHash(receipt.receipt.transactionHash)?.then(
          (x) => x.hash
        );
      }
    }
    throw new Error("Failed to find transaction for User Operation");
  };

  async getTokenBalanceOfAddr(ownerAddr: string) {
    var data = await this.callFunctionSpecficToCertainProvider<{
      pageKey: string | undefined;
      tokenBalances: { contractAddress: string; tokenBalance: string }[];
    }>("ALCHEMY", "alchemy_getTokenBalances", [ownerAddr, "erc20"]);
    if (!data) {
      return [];
    }
    let tokens = [];
    tokens.push(
      ...data.tokenBalances
        .filter(
          (tokenBalanceInfo) =>
            tokenBalanceInfo.tokenBalance != "0x" &&
            tokenBalanceInfo.tokenBalance != "0x0"
        ) //token Balance returns 0x if self destruct has been called on contract
        .map((tokenBalanceInfo: any) => {
          return {
            token_address: tokenBalanceInfo.contractAddress as string,
            balance: BigNumber.from(tokenBalanceInfo.tokenBalance),
            token_id: BigNumber.from(0),
          };
        })
    );

    var tokenWithMetadata = await Promise.all(
      tokens.map(async (token) => {
        const metadata = await this.getTokenMetadata(token.token_address);
        return {
          ...metadata,
          ...token,
          balance: formatUnits(token.balance, metadata.decimals),
        };
      })
    );

    return tokenWithMetadata;
  }

  async getTokenMetadata(tokenAddr: string) {
    const data = await this.callFunctionSpecficToCertainProvider<TokenMetadata>(
      "ALCHEMY",
      "alchemy_getTokenMetadata",
      [tokenAddr]
    );
    return {
      ...data,
      token_address: tokenAddr,
      logo: data?.logo,
    };
  }

  async feeData(struct: any) {
    const feeData = await this.providerMapping.ALCHEMY!.getFeeData();
    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      throw new Error(
        "feeData is missing maxFeePerGas or maxPriorityFeePerGas"
      );
    }

    // add 33% to the priorty fee to ensure the transaction is mined
    let maxPriorityFeePerGasBid =
      (feeData.maxPriorityFeePerGas.toBigInt() * 4n) / 3n;
    // if (maxPriorityFeePerGasBid < this.minPriorityFeePerBid) {
    //   maxPriorityFeePerGasBid = this.minPriorityFeePerBid;
    // }

    const maxFeePerGasBid =
      feeData.maxFeePerGas.toBigInt() -
      feeData.maxPriorityFeePerGas.toBigInt() +
      maxPriorityFeePerGasBid;

    struct.maxFeePerGas = hexValue(maxFeePerGasBid);
    struct.maxPriorityFeePerGas = hexValue(maxPriorityFeePerGasBid);

    return struct;
  }

  getDummyPayMaster() {
    return "0xC03Aac639Bb21233e0139381970328dB8bcEeB67fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
  }
}
