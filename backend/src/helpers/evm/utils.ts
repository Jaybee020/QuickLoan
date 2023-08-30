import { AbiCoder, keccak256 } from "ethers/lib/utils";
import { UserOperationRequest } from "../../interfaces";

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw Error(message || "Assertion failed");
  }
}

export function packUserOperation(request: UserOperationRequest) {
  const hashedInitCode = keccak256(request.initCode);
  const hashedCalldata = keccak256(request.callData);
  const hashedPaymasterAndData = keccak256(request.paymasterAndData);

  return new AbiCoder().encode(
    [
      "address",
      "uint256",
      "bytes32",
      "bytes32",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "bytes32",
    ],
    [
      request.sender,
      BigInt(request.nonce),
      hashedInitCode,
      hashedCalldata,
      BigInt(request.callGasLimit),
      BigInt(request.verificationGasLimit),
      BigInt(request.preVerificationGas),
      BigInt(request.maxFeePerGas),
      BigInt(request.maxPriorityFeePerGas),
      hashedPaymasterAndData,
    ]
  );
}

export function getUserOperationHash(
  request: UserOperationRequest,
  entryPointAddress: string,
  chainId: bigint
): string {
  const encoded = new AbiCoder().encode(
    ["bytes32", "address", "uint256"],
    [keccak256(packUserOperation(request)), entryPointAddress, chainId]
  );
  //   const encoded = encodeAbiParameters(
  //     [{ type: "bytes32" }, { type: "address" }, { type: "uint256" }],
  //     [keccak256(packUo(request)), entryPointAddress, chainId]
  //   ) as `0x${string}`;

  return keccak256(encoded);
}
