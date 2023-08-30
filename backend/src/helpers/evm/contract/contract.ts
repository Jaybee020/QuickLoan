import { BigNumber, PopulatedTransaction, providers } from "ethers";
import { EVMNodeInquirer } from "../provider/baseProvider";
import { Interface } from "ethers/lib/utils";
import { ABI } from "../../../interfaces";

export class EVMContract {
  address: string;
  abi: ABI;
  deployedBlock: number;

  constructor(address: string, abi: ABI, deployedBlock = 0) {
    this.abi = abi;
    this.address = address;
    this.deployedBlock = deployedBlock;
  }

  call<T>(
    nodeInquirer: EVMNodeInquirer,
    methodName: string,
    methodParams: any[] = [],
    blockTag?: providers.BlockTag,
    privateKey?: string,
    value?: BigNumber,
    gasPrice?: BigNumber,
    gasLimit?: BigNumber
  ) {
    return nodeInquirer.callContract<T>(
      this.address,
      this.abi,
      methodName,
      methodParams,
      blockTag,
      privateKey,
      value,
      gasPrice,
      gasLimit
    );
  }
  callStatic<T>(
    nodeInquirer: EVMNodeInquirer,
    methodName: string,
    methodParams: any[] = [],
    blockTag?: providers.BlockTag,
    privateKey?: string,
    value?: BigNumber,
    gasPrice?: BigNumber,
    gasLimit?: BigNumber
  ) {
    return nodeInquirer.callStatic<T>(
      this.address,
      this.abi,
      methodName,
      methodParams,
      blockTag,
      privateKey,
      value,
      gasPrice,
      gasLimit
    );
  }

  populateTransaction(
    nodeInquirer: EVMNodeInquirer,
    methodName: string,
    methodParams: any[] = [],
    blockTag?: providers.BlockTag,
    value?: BigNumber,
    gasPrice?: BigNumber,
    gasLimit?: BigNumber
  ) {
    return nodeInquirer.populateTransaction(
      this.address,
      this.abi,
      methodName,
      methodParams,
      blockTag,
      value,
      gasPrice,
      gasLimit
    ) as Promise<PopulatedTransaction>;
  }

  estimateFunctionGas(
    nodeInquirer: EVMNodeInquirer,
    methodName: string,
    methodParams: any[] = [],
    value?: BigNumber,
    privateKey?: string
  ) {
    return nodeInquirer.estimateContractCallGas(
      this.address,
      this.abi,
      methodName,
      methodParams,
      value,
      privateKey
    );
  }

  getLogsSinceDeployment(
    nodeInquirer: EVMNodeInquirer,
    eventName: string,
    topics: string[],
    toBlock: providers.BlockTag = "latest"
  ) {
    return nodeInquirer.getLogs(
      eventName,
      topics,
      this.abi,
      this.address,
      this.deployedBlock,
      toBlock
    );
  }

  getLogs(
    nodeInquirer: EVMNodeInquirer,
    eventName: string,
    topics: string[],
    fromBlock: number,
    toBlock: providers.BlockTag = "latest"
  ) {
    return nodeInquirer.getLogs(
      eventName,
      topics,
      this.abi,
      this.address,
      fromBlock,
      toBlock
    );
  }

  encodeFunctionData(methodName: string, methodParams?: any[]) {
    const contractIface = new Interface(this.abi);
    return contractIface.encodeFunctionData(methodName, methodParams);
  }
  decodeFunctionResult(methodName: string, methodResult: string) {
    const contractIface = new Interface(this.abi);
    return contractIface.decodeFunctionResult(methodName, methodResult);
  }
  decodeLogs(eventData: string, eventTopics: string[]) {
    const contractIface = new Interface(this.abi);
    return contractIface.parseLog({ data: eventData, topics: eventTopics });
  }
}
