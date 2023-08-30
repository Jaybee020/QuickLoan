import { PopulatedTransaction } from "ethers";
import { SmartAccount } from "../helpers/evm/account/smartAccount";
import { SmartAccountProvider } from "../helpers/evm/account/smartAccountProvider";
import { Compound, CompoundAction } from "../helpers/evm/compound/compound";
import { UserOperationRequest } from "../interfaces";
import { userOperationModel } from "../models/userOperations";
import User from "./user";
import { id, verifyMessage } from "ethers/lib/utils";
import { assert } from "../helpers/evm/utils";

export class UserOperation {
  model = userOperationModel;
  compound = new Compound(); //uses the default

  constructor() {}

  get(id: string) {
    return this.model.findById(id);
  }

  async generateOperationToBeSigned(email: string, actions: CompoundAction[]) {
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
    console.log(userOpWithoutHash, hash);
    // const createdUserOpDoc = this.model.create({
    //   user: user.id,
    //   opRequest: userOpWithoutHash,
    //   opHash: hash,
    // });
    // console.log(createdUserOpDoc);
    // return createdUserOpDoc; //frontend should sign opRequest
  }

  async simulateUserOperation(userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("No userOp of id found");
    }
    assert(
      userOp.status == "CREATED" || userOp.status == "SIMULATED",
      "User operation status should be created or simulated"
    );
    const smartAccountProvider = new SmartAccountProvider();
    const simulate = await smartAccountProvider.simulateUserOperation(
      userOp.opRequest
    );

    console.log(simulate);
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
      userOp.status == "CREATED" || userOp.status == "SIMULATED",
      "User operation status should be created or simulated"
    );
    await this.model.findByIdAndDelete(userOp.id);
  }

  async broadcastSignedUserOperation(signature: string, userOpId: string) {
    const userOp = await this.get(userOpId);
    if (!userOp) {
      throw Error("No userOp of id found");
    }
    assert(
      userOp.status == "SIMULATED",
      "User operation status should be created or simulated"
    );
    const owner = verifyMessage(userOp.opHash, signature);
    const sender = await User.getById(userOp.id);
    assert(owner.toLowerCase() == sender!.custodialAddress.toLowerCase());
    const smartAccountProvider = new SmartAccountProvider();
    const userOpRequest = userOp.opRequest;
    const validUserOp: UserOperationRequest = {
      ...userOpRequest,
      signature: signature,
    };
    const hash = await smartAccountProvider.sendUserOperation(validUserOp);
    userOp.opHash = hash;
    userOp.opRequest = validUserOp;
    userOp.status = "SIGNED";
    if (!sender!.smartAccountAddress) {
      sender!.smartAccountAddress = validUserOp.sender;
      await sender!.save();
    }
    await userOp.save();
    return userOp;
  }
}
