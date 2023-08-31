import { SmartAccount } from "../helpers/evm/account/smartAccount";
import { SmartAccountProvider } from "../helpers/evm/account/smartAccountProvider";
import { UserModel } from "../models/user";
import subscription from "./subscription";

class User {
  model: typeof UserModel;
  constructor() {
    this.model = UserModel;
  }

  getById(id: string) {
    return this.model.findById(id);
  }

  async getSmartAccountWallet(id: string) {
    const user = await this.getById(id);
    if (!user) {
      throw Error("User not found");
    }
    const smartAccount = new SmartAccount(
      user.custodialAddress,
      user.smartAccountAddress
    );
    const smartAccountProvider = new SmartAccountProvider(smartAccount);
    const balance = await smartAccountProvider.getTokenBalance();
    return {
      balance,
      addr: await smartAccount.getAddress(),
    };
  }

  getByEmail(email: string) {
    return this.model.findOne({ email });
  }

  async getSubscriptions(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw Error("User not found");
    }
    return subscription.getByUser(user?.id);
  }

  create(custodialAddress: string, email: string) {
    return this.model.create({
      custodialAddress,
      email,
    });
  }

  getBalance() {}
}

export default new User();
