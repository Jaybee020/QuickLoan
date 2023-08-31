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

  //privateKey to be stored on mobile device
  const PRIVATE_KEY = String(process.env.PRIVATE_KEY);
  const wallet = new Wallet(PRIVATE_KEY);
  const custodialAddr = wallet.address;

  const email = "olayinkaganiyu1@gmail.com";
  await User.create(custodialAddr, email); //create user

  const user = await User.getByEmail("olayinkaganiyu1@gmail.com"); //get user details by id
  console.log(user);

  //generate user operation based on action
  const userOp = await UserOperation.generateCompoundOperationToBeSigned(
    user!.email,
    [
      {
        type: "SUPPLY",
        address: "",
        asset: "WMATIC",
        amount: "0.01",
      },
    ]
  );

  //to be done on mobile
  const val = utils.arrayify(userOp.opHash); //encode hash for sig
  const sig = await wallet.signMessage(utils.arrayify(val)); // sign on client with private key
  console.log(sig);
  console.log(utils.verifyMessage(val, sig));

  await UserOperation.signUserOperation(sig, userOp.id); // call sign endpoint on backend

  await UserOperation.simulateUserOperation(userOp.id); //simulates it to see if it is successful

  await UserOperation.broadcastUserOperation(userOp.id); //broadcasts it to the network
}

main().catch((err) => console.log(err));
