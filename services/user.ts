import { UserModel } from "../models/user";

class User {
  model: typeof UserModel;
  constructor() {
    this.model = UserModel;
  }

  getById(id: string) {
    return this.model.findById(id);
  }

  create(custodialAddr: string) {
    const smartAccountAddr = ""; //generate smartAccountAddr
    return this.model.create({
      custodialAddress: custodialAddr,
      smartAccountAddress: smartAccountAddr,
    });
  }
}

export default new User();
