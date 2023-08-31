import mongoose from "mongoose";
import { uri } from "./config";
import { Wallet, utils } from "ethers";
import UserOperation from "./services/userOperation";
import User from "./services/user";
import { sleep } from "./helpers/evm/utils";
import { SmartAccountProvider } from "./helpers/evm/account/smartAccountProvider";

async function main() {
  mongoose
    .connect(uri, { maxPoolSize: 100 })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log(err);
      console.error("Could not connect to database");
    });

  await sleep(2);

  const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
  const wallet = new Wallet(PRIVATE_KEY);
  const val = utils.arrayify(
    "0xe58673f05884a5d1144090e54b284077263771c07c699fce69f0fa79b1cc60e9"
  );
  const sig = await wallet.signMessage(utils.arrayify(val));
  console.log(sig);

  // const user = await User.getByEmail("olayinkaganiyu1@gmail.com");
  // console.log(user);
  // const userOp = UserOperation.generateCompoundOperationToBeSigned(
  //   user!.email,
  //   [
  //     {
  //       type: "SUPPLY",
  //       address: "",
  //       asset: "WMATIC",
  //       amount: "0.01",
  //     },
  //   ]
  // );

  const smartAccountProvider = new SmartAccountProvider();
}
// 0x05ad9389a3bb3364218778569215129be06d45ba1373b3ee74805834d8e761cf0f3cfa35034a17a3dfd49aa80a960e5ee883f1b6acb32ba3237bc8500fe739b71b
main().catch((err) => console.log(err));
