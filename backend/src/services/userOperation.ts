import { PopulatedTransaction, utils } from "ethers";
import { SmartAccount } from "../helpers/evm/account/smartAccount";
import { SmartAccountProvider } from "../helpers/evm/account/smartAccountProvider";
import { Compound, CompoundAction } from "../helpers/evm/compound/compound";
import { UserOperationRequest } from "../interfaces";
import { userOperationModel } from "../models/userOperations";
import User from "./user";
import { id, recoverAddress, verifyMessage } from "ethers/lib/utils";
import { assert } from "../helpers/evm/utils";
import { Erc20 } from "../helpers/evm/contract/erc20";

export interface tokenOperation {
  to: string;
  tokenAddress: string;
  value: string;
}

class UserOperation {
  model = userOperationModel;
  compound = new Compound(); //uses the default

  constructor() {}

  get(id: string) {
    return this.model.findById(id);
  }

  getByUser(userId: string) {
    return this.model.find({ user: userId });
  }

  async generateSendOperationToBeSigned(
    email: string,
    actions: PopulatedTransaction
  ) {
    const user = await User.getByEmail(email);
    if (!user) {
      throw Error("User not found");
    }

    const smartAccount = new SmartAccount(
      user.custodialAddress,
      user.smartAccountAddress
    );

    const smartAccountProvider = new SmartAccountProvider(smartAccount);
    const smartAcountAddr = await smartAccountProvider.getAddress();

    const { hash, ...userOpWithoutHash } =
      await smartAccountProvider.buildUserOperationFromTx(actions);

    const simulate = await smartAccountProvider.simulateUserOperation(
      userOpWithoutHash as UserOperationRequest
    );

    const createdUserOpDoc = await this.model.create({
      user: user.id,
      opRequest: userOpWithoutHash,
      opHash: hash,
    });
    return createdUserOpDoc; //frontend should sign opRequest
  }

  async generateTokenSendOperationToBeSigned(
    email: string,
    actions: tokenOperation[]
  ) {
    const user = await User.getByEmail(email);
    if (!user) {
      throw Error("User not found");
    }

    const smartAccount = new SmartAccount(
      user.custodialAddress,
      user.smartAccountAddress
    );

    const smartAccountProvider = new SmartAccountProvider(smartAccount);
    const smartAcountAddr = await smartAccountProvider.getAddress();
    let transferTxns = await Promise.all(
      actions.map((action) => {
        return new Erc20(
          action.tokenAddress,
          smartAccountProvider.rpcProvider
        ).encodeTransferFunction(action.to, action.value);
      })
    );

    const { hash, ...userOpWithoutHash } =
      transferTxns.length == 1
        ? await smartAccountProvider.buildUserOperationFromTx(transferTxns[0])
        : await smartAccountProvider.buildUserOperationsFromMultipleTxs(
            transferTxns
          );

    const simulate = await smartAccountProvider.simulateUserOperation(
      userOpWithoutHash as UserOperationRequest
    );

    const createdUserOpDoc = await this.model.create({
      user: user.id,
      opRequest: userOpWithoutHash,
      opHash: hash,
    });
    return createdUserOpDoc; //frontend should sign opRequest
  }

  async generateCompoundOperationToBeSigned(
    email: string,
    actions: CompoundAction[]
  ) {
    const user = await User.getByEmail(email);
    if (!user) {
      throw Error("User not found");
    }

    const smartAccount = new SmartAccount(
      user.custodialAddress,
      user.smartAccountAddress
    );

    const smartAccountProvider = new SmartAccountProvider(smartAccount);
    const smartAcountAddr = await smartAccountProvider.getAddress();

    let compoundTransactions: PopulatedTransaction[] =
      await this.compound.generateTxnsFromCompoundActions(
        actions.map((action) => ({ ...action, address: smartAcountAddr }))
      );

    const { hash, ...userOpWithoutHash } =
      compoundTransactions.length == 1
        ? await smartAccountProvider.buildUserOperationFromTx(
            compoundTransactions[0]
          )
        : await smartAccountProvider.buildUserOperationsFromMultipleTxs(
            compoundTransactions
          );
    const simulate = await smartAccountProvider.simulateUserOperation(
      userOpWithoutHash as UserOperationRequest
    );

    const createdUserOpDoc = await this.model.create({
      user: user.id,
      opRequest: userOpWithoutHash,
      opHash: hash,
    });
    return createdUserOpDoc; //frontend should sign opRequest
  }

  async simulateUserActions(email: string, actions: CompoundAction[]) {
    const user = await User.getByEmail(email);
    if (!user) {
      throw Error("User not found");
    }

    const smartAccount = new SmartAccount(
      user.custodialAddress,
      user.smartAccountAddress
    );
    const smartAccountProvider = new SmartAccountProvider(smartAccount);
    const smartAcountAddr = await smartAccountProvider.getAddress();

    let compoundTransactions: PopulatedTransaction[] =
      await this.compound.generateTxnsFromCompoundActions(
        actions.map((action) => ({ ...action, address: smartAcountAddr }))
      );
  }

  async simulateUserOperation(userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("No userOp of id found");
    }
    // assert(
    //   userOp.status == "SIGNED",
    //   "User operation status should be created or simulated"
    // );
    const smartAccountProvider = new SmartAccountProvider();
    const simulate = await smartAccountProvider.simulateUserOperation(
      userOp.opRequest
    );
    //also update based on fee of simulated
    await this.model.findByIdAndUpdate(userOpId, { status: "SIMULATED" });
    return simulate;
  }

  async deleteUserOperation(userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("No userOp of id found");
    }
    assert(
      userOp.status == "CREATED" ||
        userOp.status == "SIGNED" ||
        userOp.status == "SIMULATED",
      "User operation status should be created or simulated"
    );
    await this.model.findByIdAndDelete(userOp.id);
  }

  async signUserOperation(signature: string, userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("No userOp of id found");
    }
    assert(
      userOp.status == "CREATED",
      "User operation status should be created"
    );
    const hex = utils.arrayify(userOp.opHash);
    const owner = utils.verifyMessage(hex, signature);
    const sender = await User.getById(userOp.user.toString());
    assert(
      owner.toLowerCase() == sender!.custodialAddress.toLowerCase(),
      "Unauthorised signer"
    );
    const userOpRequest = userOp.opRequest;
    const validUserOp: UserOperationRequest = {
      ...userOpRequest,
      signature: signature,
    };
    userOp.opRequest = validUserOp;
    userOp.status = "SIGNED";
    await userOp.save();
    return userOp;
  }

  async broadcastUserOperation(userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("User op not found");
    }
    const sender = await User.getById(userOp.user.toString());
    const smartAccountProvider = new SmartAccountProvider();
    const userOpRequest = userOp.opRequest;
    assert(
      userOp.status == "SIGNED" || userOp.status == "SIMULATED",
      "User operation status should be gined"
    );
    const hash = await smartAccountProvider.sendUserOperation(userOpRequest);
    userOp.opHash = hash;
    userOp.status = "BROADCASTED";
    if (!sender?.smartAccountAddress) {
      sender!.smartAccountAddress = userOpRequest.sender;
      await sender!.save();
    }
    await userOp.save();
    return userOp;
  }
}

export default new UserOperation();
