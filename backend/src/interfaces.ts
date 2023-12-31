import { BigNumberish } from "ethers";

export interface Dictionary<T> {
  [key: string]: T;
}
export type EVMSupportedChains =
  | "eth"
  | "bsc"
  | "polygon"
  | "arbitrum"
  | "optimism"
  | "avalanche"
  | "fantom"
  | "cronos"
  | "mumbai";

export type supportedChains = EVMSupportedChains;
export type ABI = Record<string, any>[];

export type NodeObject = {
  [key in SUPPORTED_NODES]?: string;
};

export type SUPPORTED_NODES = "ALCHEMY" | "ETHERSCAN" | "INFURA" | "RPC";

export interface UserOperationCallData {
  /* the target of the call */
  target: string;
  /* the data passed to the target */
  data: string;
  /* the amount of native token to send to the target (default: 0) */
  value?: BigNumberish;
}

export type BatchUserOperationCallData = UserOperationCallData[];

export interface UserOperationRequest {
  /* the origin of the request */
  sender: string;
  /* nonce (as hex) of the transaction, returned from the entrypoint for this Address */
  nonce: string;
  /* the initCode for creating the sender if it does not exist yet, otherwise "0x" */
  initCode: string;
  /* the callData passed to the target */
  callData: string;
  /* Gas value (as hex) used by inner account execution */
  callGasLimit: string;
  /* Actual gas (as hex) used by the validation of this UserOperation */
  verificationGasLimit: string;
  /* Gas overhead (as hex) of this UserOperation */
  preVerificationGas: string;
  /* Maximum fee per gas (similar to EIP-1559 max_fee_per_gas) (as hex)*/
  maxFeePerGas: string;
  /* Maximum priority fee per gas (similar to EIP-1559 max_priority_fee_per_gas) (as hex)*/
  maxPriorityFeePerGas: string;
  /* Address of paymaster sponsoring the transaction, followed by extra data to send to the paymaster ("0x" for self-sponsored transaction) */
  paymasterAndData: string;
  /* Data passed into the account along with the nonce during the verification step */
  signature: string;
}

export interface UserOperationRequestWithHash {
  hash: string;
}

export interface UserOperationStruct {
  /* the origin of the request */
  sender: string;
  /* nonce of the transaction, returned from the entrypoint for this Address */
  nonce: BigNumberish;
  /* the initCode for creating the sender if it does not exist yet, otherwise "0x" */
  initCode: string | "0x";
  /* the callData passed to the target */
  callData: string;
  /* Value used by inner account execution */
  callGasLimit?: BigNumberish;
  /* Actual gas used by the validation of this UserOperation */
  verificationGasLimit?: BigNumberish;
  /* Gas overhead of this UserOperation */
  preVerificationGas?: BigNumberish;
  /* Maximum fee per gas (similar to EIP-1559 max_fee_per_gas) */
  maxFeePerGas?: BigNumberish;
  /* Maximum priority fee per gas (similar to EIP-1559 max_priority_fee_per_gas) */
  maxPriorityFeePerGas?: BigNumberish;
  /* Address of paymaster sponsoring the transaction, followed by extra data to send to the paymaster ("0x" for self-sponsored transaction) */
  paymasterAndData: string | "0x";
  /* Data passed into the account along with the nonce during the verification step */
  signature: string;
}

export interface UserOperationResponse extends UserOperationRequest {
  /* the address of the entry point contract that executed the user operation */
  entryPoint: string;
  /* the block number the user operation was included in */
  blockNumber: BigNumberish;
  /* the hash of the block the user operation was included in */
  blockHash: string;
  /* the hash of the transaction that included the user operation */
  transactionHash: string;
}

export interface UserOperationReceipt {
  /* The request hash of the UserOperation. */
  userOpHash: string;
  /* The entry point address used for the UserOperation. */
  entryPoint: string;
  /* The account initiating the UserOperation. */
  sender: string;
  /* The nonce used in the UserOperation. */
  nonce: BigNumberish;
  /* The paymaster used for this UserOperation (or empty). */
  paymaster?: string;
  /* The actual amount paid (by account or paymaster) for this UserOperation. */
  actualGasCost: BigNumberish;
  /* The total gas used by this UserOperation (including preVerification, creation, validation, and execution). */
  actualGasUsed: BigNumberish;
  /* Indicates whether the execution completed without reverting. */
  success: boolean;
  /* In case of revert, this is the revert reason. */
  reason?: string;
  /* The logs generated by this UserOperation (not including logs of other UserOperations in the same bundle). */
  logs: string[];
  /* The TransactionReceipt object for the entire bundle, not only for this UserOperation. */
  receipt: UserOperationReceiptObject;
}

export interface UserOperationReceiptObject {
  /* 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log */
  blockHash: string;
  /* The block number where this log was in. null when its pending. null when its pending log. */
  blockNumber: BigNumberish;
  /* The index of the transaction within the block. */
  transactionIndex: BigNumberish;
  /* 32 Bytes - hash of the transaction. null when its pending. */
  transactionHash: string;
  /* 20 Bytes - address of the sender */
  from: string;
  /* 20 Bytes - address of the receiver. null when its a contract creation transaction */
  to: string;
  /* The total amount of gas used when this transaction was executed in the block. */
  cumulativeGasUsed: BigNumberish;
  /* The amount of gas used by this specific transaction alone */
  gasUsed: BigNumberish;
  /* 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null */
  contractAddress: string;
  logs: UserOperationReceiptLog[];
  /* 256 Bytes - Bloom filter for light clients to quickly retrieve related logs */
  logsBloom: string;
  /* 32 bytes of post-transaction stateroot. (pre Byzantium hard fork at block 4,370,000) */
  root: string;
  /* Either 1 (success) or 0 (failure). (post Byzantium hard fork at block 4,370,000) */
  status: number;
  /* The cumulative gas used in the block containing this UserOperation. */
  effectiveGasPrice: BigNumberish;
  /* The type of the recipt object */
  type: string;
}

export interface UserOperationReceiptLog {
  /* The hash of the block where the given transaction was included. */
  blockHash: string;
  /* The number of the block where the given transaction was included. */
  blockNumber: BigNumberish;
  /* The index of the transaction within the block. */
  transactionIndex: BigNumberish;
  /* 20 Bytes - address from which this log originated. */
  address: string;
  /* Integer of the log index position in the block. null when its pending log. */
  logIndex: BigNumberish;
  /* Contains one or more 32 Bytes non-indexed arguments of the log. */
  data: string;
  /* true when the log was removed, due to a chain reorganization. false if its a valid log. */
  removed: boolean;
  /* Array of zero to four 32 Bytes DATA of indexed log arguments. */
  topics: string[];
  /* hash of the transaction */
  transactionHash: string;
}

export interface PayMasterAndGasData {
  paymasterAndData: string;
  callGasLimit: string;
  verificationGasLimit: string;
  preVerificationGas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  error?: {
    message: string;
  };
}

export function isValidRequest(
  request: UserOperationStruct
): request is UserOperationRequest {
  // These are the only ones marked as optional in the interface above
  return (
    !!request.callGasLimit &&
    !!request.maxFeePerGas &&
    request.maxPriorityFeePerGas != null &&
    !!request.preVerificationGas &&
    !!request.verificationGasLimit
  );
}
