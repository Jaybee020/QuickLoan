import { EVMContract } from "./contract";
import erc20Abi from "../abis/erc20Abi.json";
import { ERC4337Provider } from "../provider/erc4337Provider";
import { BigNumber, utils } from "ethers";

export class Erc20 {
  tokenAddr: string;
  nodeProvider: ERC4337Provider;
  constructor(tokenAddr: string, nodeProvider: ERC4337Provider) {
    this.tokenAddr = tokenAddr;
    this.nodeProvider = nodeProvider;
  }

  getERC20Contract() {
    return new EVMContract(this.tokenAddr, erc20Abi);
  }

  getERC20Decimal() {
    return this.getERC20Contract().call<BigNumber>(
      this.nodeProvider,
      "decimals"
    );
  }

  getERC20Approval(ownerAddr: string, spenderAddr: string) {
    return this.getERC20Contract().call<BigNumber>(
      this.nodeProvider,
      "allowance",
      [ownerAddr, spenderAddr]
    );
  }

  async encodeTransferFunction(recipient: string, value: string) {
    const decimals = (await this.getERC20Decimal()) as BigNumber;
    return this.getERC20Contract().populateTransaction(
      this.nodeProvider,
      "transfer",
      [recipient, utils.parseUnits(value, decimals)]
    );
  }
}
