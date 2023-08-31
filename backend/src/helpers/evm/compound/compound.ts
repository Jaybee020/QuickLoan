import { Dictionary, EVMSupportedChains } from "../../../interfaces";
import { EVMContract } from "../contract/contract";
import compoundAbi from "../abis/compoundAbi.json";
import erc20Abi from "../abis/erc20Abi.json";
import rewardAbi from "../abis/compundRewardAbi.json";
import { ERC4337Provider } from "../provider/erc4337Provider";
import { BigNumber, BigNumberish, PopulatedTransaction } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { tokenToDecimal } from "../../../config";

export interface CompoundAction {
  type: "WITHDRAW" | "SUPPLY" | "CLAIM";
  asset: string;
  amount: string;
  address: string;
}

export class Compound {
  chain: EVMSupportedChains;
  cometAddress: string;
  rewardAddress: string;
  supportedDepositTokens: Dictionary<string>;
  cometContract: EVMContract;
  rewardContract: EVMContract;
  nodeProvider: ERC4337Provider;
  constructor(
    chain?: EVMSupportedChains,
    cometAddress?: string,
    rewardAddress?: string,
    supportedDepositTokens?: any
  ) {
    this.chain = chain ?? "mumbai";
    this.cometAddress =
      cometAddress ?? "0xF09F0369aB0a875254fB565E52226c88f10Bc839";
    this.supportedDepositTokens = supportedDepositTokens ?? {
      USDC: "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9",
      DAI: "0x4DAFE12E1293D889221B1980672FE260Ac9dDd28",
      WETH: "0xE1e67212B1A4BF629Bdf828e08A3745307537ccE",
      WBTC: "0x4B5A0F4E00bC0d6F16A593Cae27338972614E713",
      WMATIC: "0xfec23a9E1DBA805ADCF55E0338Bf5E03488FC7Fb",
    };
    this.rewardAddress =
      rewardAddress ?? "0x0785f2AC0dCBEDEE4b8D62c25A34098E9A0dF4bB";
    this.cometContract = new EVMContract(this.cometAddress, compoundAbi);
    this.rewardContract = new EVMContract(this.rewardAddress, rewardAbi);
    this.nodeProvider = new ERC4337Provider(this.chain);
  }

  getERC20Contract(tokenAddr: string) {
    return new EVMContract(tokenAddr, erc20Abi);
  }

  getERC20Decimal(tokenAddr: string) {
    return this.getERC20Contract(tokenAddr).call<BigNumber>(
      this.nodeProvider,
      "decimals"
    );
  }

  getERC20Approval(tokenAddr: string, ownerAddr: string, spenderAddr: string) {
    return this.getERC20Contract(tokenAddr).call<BigNumber>(
      this.nodeProvider,
      "allowance",
      [ownerAddr, spenderAddr]
    );
  }

  generateERC20ApproveTxn(
    tokenAddr: string,
    spenderAddr: string,
    approvalAmount: BigNumberish
  ) {
    return this.getERC20Contract(tokenAddr).populateTransaction(
      this.nodeProvider,
      "approve",
      [spenderAddr, approvalAmount]
    );
  }

  async gneratesupplyCollateralTxns(
    supplyAsset: string,
    amount: string,
    ownerAddr: string
  ) {
    const supplyAssetTokenAddr =
      this.supportedDepositTokens[supplyAsset.toUpperCase()];
    if (!supplyAssetTokenAddr) {
      throw Error("Inputed Token not supported");
    }
    const txns: PopulatedTransaction[] = [];

    const amountIn = parseUnits(
      amount,
      tokenToDecimal[supplyAsset.toUpperCase()]
    );

    //approval Transaction
    const approvedAmount = (await this.getERC20Approval(
      supplyAssetTokenAddr,
      ownerAddr,
      this.cometAddress
    )) as BigNumber;

    if (approvedAmount.lt(amountIn)) {
      const approveTx = await this.generateERC20ApproveTxn(
        supplyAssetTokenAddr,
        this.cometAddress,
        amountIn
      );
      txns.push(approveTx);
    }

    const collateralTxn = await this.cometContract.populateTransaction(
      this.nodeProvider,
      "supply",
      [supplyAssetTokenAddr, amountIn]
    );
    txns.push(collateralTxn);

    return txns;
  }

  async generateClaimRewardTxn(address: string) {
    const claimable = await this.rewardContract.call<BigNumber>(
      this.nodeProvider,
      "getRewardOwed",
      [this.cometAddress, address]
    );
    const txns: PopulatedTransaction[] = [];
    if (claimable?.gt(0)) {
      const claimtxn = await this.rewardContract.populateTransaction(
        this.nodeProvider,
        "claim",
        [this.cometAddress, address, true]
      );
      txns.push(claimtxn);
    }
    return txns;
  }

  async generateTakeLoanTxn(
    loanAsset: string,
    amount: string,
    ownerAddr: string
  ) {
    const loanAssetTokenAddr =
      this.supportedDepositTokens[loanAsset.toUpperCase()];
    if (!loanAssetTokenAddr) {
      throw Error("Inputed Token not supported");
    }

    const txns: PopulatedTransaction[] = [];

    const amountIn = parseUnits(
      amount,
      tokenToDecimal[loanAsset.toUpperCase()]
    );

    const loanTxn = await this.cometContract.populateTransaction(
      this.nodeProvider,
      "withdraw",
      [loanAssetTokenAddr, amountIn]
    );
    txns.push(loanTxn);

    return txns;
  }

  async generateTxnsFromCompoundActions(actions: CompoundAction[]) {
    const totalTxns: PopulatedTransaction[] = [];
    for (let index = 0; index < actions.length; index++) {
      const element = actions[index];
      if (element.type == "WITHDRAW") {
        const txns = await this.generateTakeLoanTxn(
          element.asset,
          element.amount,
          element.address
        );
        totalTxns.push(...txns);
      } else if (element.type == "SUPPLY") {
        const txns = await this.gneratesupplyCollateralTxns(
          element.asset,
          element.amount,
          element.address
        );
        totalTxns.push(...txns);
      } else if (element.type == "CLAIM") {
        const txns = await this.generateClaimRewardTxn(element.address);
        totalTxns.push(...txns);
      }
    }
    return totalTxns;
  }
}

//loan is withdraw
// collateral is supply
