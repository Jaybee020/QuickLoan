import mongoose from "mongoose";
import { uri } from "./config";
import { Wallet } from "ethers";
import { UserOperation } from "./services/userOperation";
import User from "./services/user";
import { sleep } from "./helpers/evm/utils";

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
  const user = await User.getByEmail("olayinkaganiyu1@gmail.com");
  console.log(user);
  const userOpService = new UserOperation();
  userOpService.generateOperationToBeSigned(user!.email, [
    {
      type: "SUPPLY",
      address: "",
      asset: "WMATIC",
      amount: "0.01",
    },
  ]);
}

main().catch((err) => console.log(err));
