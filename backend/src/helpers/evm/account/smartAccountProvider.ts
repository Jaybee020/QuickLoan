import { BigNumber, providers } from "ethers";
import {
  POLICY_ID,
  chainTochainId,
  defaultEntrypointAddr,
} from "../../../config";
import {
  BatchUserOperationCallData,
  EVMSupportedChains,
  UserOperationCallData,
  UserOperationReceipt,
  UserOperationRequest,
  UserOperationRequestWithHash,
  UserOperationResponse,
  isValidRequest,
} from "../../../interfaces";
import { ERC4337Provider } from "../provider/erc4337Provider";
import { SmartAccount } from "./smartAccount";
import { getUserOperationHash } from "../utils";
import { hexValue } from "ethers/lib/utils";

export interface SmartAccountProviderOpts {
  /**
   * The maximum number of times to try fetching a transaction receipt before giving up (default: 5)
   */
  txMaxRetries?: number;

  /**
   * The interval in milliseconds to wait between retries while waiting for tx receipts (default: 2_000n)
   */
  txRetryIntervalMs?: number;

  /**
   * The mulitplier on interval length to wait between retries while waiting for tx receipts (default: 1.5)
   */
  txRetryMulitplier?: number;

  /**
   * used when computing the fees for a user operation (default: 100_000_000n)
   */
  minPriorityFeePerBid?: bigint;
}

export class SmartAccountProvider {
  rpcProvider: ERC4337Provider;
  entryPointAddress: string;
  policyId: string = POLICY_ID;
  chain: EVMSupportedChains;
  account?: SmartAccount;
  opts?: SmartAccountProviderOpts;
  constructor(
    account?: SmartAccount,
    chain?: EVMSupportedChains,
    entryPointAddr?: string,
    options?: SmartAccountProviderOpts
  ) {
    this.chain = chain ? chain : "mumbai";
    this.entryPointAddress = entryPointAddr
      ? entryPointAddr
      : defaultEntrypointAddr;
    this.rpcProvider = new ERC4337Provider(
      this.chain,
      options?.txMaxRetries,
      options?.txRetryIntervalMs,
      options?.txRetryMulitplier
    );
    this.account = account;
  }

  getAddress() {
    if (!this.account) {
      throw new Error("account not connected!");
    }

    return this.account.getAddress();
  }

  getUserOperationByHash = (hash: string): Promise<UserOperationResponse> => {
    return this.rpcProvider.getUserOperationByHash(hash);
  };

  getUserOperationReceipt = (hash: string): Promise<UserOperationReceipt> => {
    return this.rpcProvider.getUserOperationReceipt(hash);
  };

  getTransaction = (
    hash: string
  ): Promise<providers.TransactionResponse> | undefined => {
    return this.rpcProvider.getTransactionByHash(hash);
  };

  async buildUserOperationFromTx(request: providers.TransactionRequest) {
    if (!request.to) {
      throw new Error("transaction is missing to address");
    }

    return this.buildUserOperationWithHash({
      target: request.to,
      data: (request.data ?? "0x") as string,
      value: hexValue(request.value ?? 0),
    });
  }

  async buildUserOperationsFromMultipleTxs(
    requests: providers.TransactionRequest[]
  ) {
    const batch = requests.map((request) => {
      if (!request.to) {
        throw new Error(
          "one transaction in the batch is missing a target address"
        );
      }

      return {
        target: request.to,
        data: (request.data ?? "0x") as string,
        value: hexValue(request.value ?? 0),
      };
    });

    return this.buildUserOperationWithHash(batch);
    // const bigIntMax = (...args: bigint[]) => {
    //   if (!args.length) {
    //     return undefined;
    //   }

    //   return args.reduce((m, c) => (m > c ? m : c));
    // };

    // const maxFeePerGas = bigIntMax(
    //   ...requests
    //     .filter((x) => x.maxFeePerGas != null)
    //     .map((x) => fromHex(x.maxFeePerGas!, "bigint"))
    // );

    // const maxPriorityFeePerGas = bigIntMax(
    //   ...requests
    //     .filter((x) => x.maxPriorityFeePerGas != null)
    //     .map((x) => fromHex(x.maxPriorityFeePerGas!, "bigint"))
    // );
    // const overrides: UserOperationOverrides = {};
    // if (maxFeePerGas != null) {
    //   overrides.maxFeePerGas = maxFeePerGas;
    // }

    // if (maxPriorityFeePerGas != null) {
    //   overrides.maxPriorityFeePerGas = maxPriorityFeePerGas;
    // }

    // const { hash } = await this.sendUserOperation(batch, overrides);

    // return await this.waitForUserOperationTransaction(hash as Hash);
  }

  async buildUserOperation(
    data: UserOperationCallData | BatchUserOperationCallData
    // usePaymaster: boolean = true uses PayMaster by default
    // overrides?: UserOperationOverrides //no overrides
  ): Promise<any> {
    if (!this.account) {
      throw new Error("account not connected!");
    }
    const initCode = await this.account.getInitCode();
    const [sender, nonce] = await Promise.all([
      this.getAddress(),
      this.account.getNonce() as Promise<BigNumber>,
    ]);
    const callData = Array.isArray(data)
      ? this.account.encodeBatchExecute(data)
      : this.account.encodeExecute(data.target, data.value ?? 0, data.data);
    let baseUserOperation = {
      initCode,
      sender,
      nonce: hexValue(nonce.toHexString()),
      callData: callData,
    };

    const paymasterAndGasData = await this.rpcProvider.getGasAndPaymasterData(
      this.policyId,
      this.entryPointAddress,
      this.account.getDummySignature(),
      baseUserOperation
    );
    console.log(paymasterAndGasData);
    if (paymasterAndGasData.error) {
      throw new Error(paymasterAndGasData.error.message);
    }
    return {
      ...baseUserOperation,
      ...paymasterAndGasData,
      signature: this.account.getDummySignature(),
    };
  }

  async buildUserOperationWithHash(
    data: UserOperationCallData | BatchUserOperationCallData
  ): Promise<UserOperationRequestWithHash> {
    const userOperation = await this.buildUserOperation(data);
    if (!isValidRequest(userOperation)) {
      // this pretty prints the uo
      throw new Error(
        `Request is missing parameters. All properties on UserOperationStruct must be set. uo: ${JSON.stringify(
          userOperation,
          null,
          2
        )}`
      );
    }
    const hash = getUserOperationHash(
      userOperation,
      this.entryPointAddress,
      BigInt(chainTochainId[this.chain])
    );
    return { ...userOperation, hash };
  }

  async simulateUserOperation(request: UserOperationRequest) {
    const beneficiary = "0x9831d6f598729bF41055A0AF96396CEa91Eab18B";
    // this.entryPointAddress
    const data = this.account?.entrypoint.encodeFunctionData("handleOps", [
      [request],
      beneficiary,
    ]);

    const res =
      await this.rpcProvider.callFunctionSpecficToCertainProvider<any>(
        "ALCHEMY",
        "alchemy_simulateExecution",
        [
          {
            from: beneficiary,
            to: this.entryPointAddress,
            data: request.callData,
          },
        ]
      );
    return res;
  }

  async simulateSmartAccountTxn(request: UserOperationRequest) {
    const res =
      await this.rpcProvider.callFunctionSpecficToCertainProvider<any>(
        "ALCHEMY",
        "alchemy_simulateAssetChanges",
        [
          {
            from: this.entryPointAddress,
            to: request.sender,
            data: request.callData,
          },
        ]
      );
    return res;
  }

  async sendUserOperation(request: UserOperationRequest) {
    return this.rpcProvider.sendUserOperation(request, this.entryPointAddress);
  }
}
