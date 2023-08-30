import { BigNumber, BigNumberish } from "ethers";
import { AbiCoder, Interface, hexConcat, hexValue } from "ethers/lib/utils";
import simpleAccountABI from "../abis/simpleAccountAbi.json";
import simpleAccountFactoryABI from "../abis/simpleAccountFactoryAbi.json";
import simpleAccountFactoryMumbaiABI from "../abis/simpleAccountFactoryMumbaiAbi.json";
import entrypointABI from "../abis/entrypointAbi.json";
import {
  BatchUserOperationCallData,
  supportedChains,
} from "../../../interfaces";
import { ERC4337Provider } from "../provider/erc4337Provider";
import { EVMContract } from "../contract/contract";
import {
  defaultEntrypointAddr,
  defaultSmartAccountFactory,
} from "../../../config";

export enum DeploymentState {
  UNDEFINED = "0x0",
  NOT_DEPLOYED = "0x1",
  DEPLOYED = "0x2",
}

export class SmartAccount {
  deploymentState: DeploymentState = DeploymentState.UNDEFINED;
  chain: supportedChains;
  ownerAddr: string;
  factoryAddress: string;
  entrypointAddr: string;
  index: number;
  nodeProvider: ERC4337Provider;
  entrypoint: EVMContract;
  accountAddr?: string;
  constructor(
    ownerAddr: string,
    accountAddr?: string,
    factoryAddr?: string,
    entrypointAddr?: string,
    chain?: supportedChains,
    index = 1
  ) {
    this.chain = chain ?? "mumbai";
    this.ownerAddr = ownerAddr;
    this.factoryAddress = factoryAddr ?? defaultSmartAccountFactory;
    this.entrypointAddr = entrypointAddr ?? defaultEntrypointAddr;
    this.index = index;
    this.nodeProvider = new ERC4337Provider(this.chain);
    this.accountAddr = accountAddr;
    this.entrypoint = new EVMContract(this.entrypointAddr, entrypointABI);
  }

  async getNonce() {
    if (!(await this.isAccountDeployed())) {
      return BigNumber.from(0);
    }
    const address = await this.getAddress();
    return this.entrypoint.call<BigNumber>(this.nodeProvider, "getNonce", [
      address,
      0,
    ]);
  }

  async getAddress() {
    if (!this.accountAddr) {
      const initCode = this.getAccountInitCode();
      console.log(`Initcode is ${initCode}`);
      try {
        await this.entrypoint.callStatic(
          this.nodeProvider,
          "getSenderAddress",
          [initCode]
        );
      } catch (err: any) {
        if (err.errorName == "SenderAddressResult") {
          this.accountAddr = err.errorArgs[0];
          console.log(err.errorArgs[0]);
          return this.accountAddr as string;
        }
      }
      throw new Error("getCounterFactualAddress failed");
    }
    return this.accountAddr;
  }

  async getInitCode() {
    if (this.deploymentState === DeploymentState.DEPLOYED) {
      return "0x";
    }
    const contractCode = await this.nodeProvider.getCode(
      await this.getAddress()
    );

    if ((contractCode?.length ?? 0) > 2) {
      this.deploymentState = DeploymentState.DEPLOYED;
      return "0x";
    } else {
      this.deploymentState = DeploymentState.NOT_DEPLOYED;
    }

    return this.getAccountInitCode();
  }

  getDummySignature(): string {
    return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
  }

  encodeExecute(target: string, value: BigNumberish, data: string) {
    const smartAccountInterface = new Interface(simpleAccountABI);
    return smartAccountInterface.encodeFunctionData("execute", [
      target,
      value,
      data,
    ]);
  }

  encodeBatchExecute(txns: BatchUserOperationCallData) {
    const smartAccountInterface = new Interface(simpleAccountABI);
    const [targets, datas] = txns.reduce(
      (accum, curr) => {
        accum[0].push(curr.target);
        accum[1].push(curr.data);

        return accum;
      },
      [[], []] as [string[], string[]]
    );
    return smartAccountInterface.encodeFunctionData("executeBatch", [
      targets,
      datas,
    ]);
  }

  getAccountInitCode(): string {
    //slight difference in ABI for mumbai chain(uses bytes for salt and not uint)
    const smartAccountFactoryInterface = new Interface(
      this.chain == "mumbai"
        ? simpleAccountFactoryMumbaiABI
        : simpleAccountFactoryABI
    );
    return hexConcat([
      this.factoryAddress,
      smartAccountFactoryInterface.encodeFunctionData("createAccount", [
        this.ownerAddr,
        this.index,
      ]),
    ]);
  }

  async isAccountDeployed(): Promise<boolean> {
    return (await this.getDeploymentState()) === DeploymentState.DEPLOYED;
  }

  async getDeploymentState(): Promise<DeploymentState> {
    if (this.deploymentState === DeploymentState.UNDEFINED) {
      const initCode = await this.getInitCode();
      return initCode === "0x"
        ? DeploymentState.DEPLOYED
        : DeploymentState.NOT_DEPLOYED;
    } else {
      return this.deploymentState;
    }
  }
}
