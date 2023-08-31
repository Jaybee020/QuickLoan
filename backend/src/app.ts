import mongoose from "mongoose";
import { CircleAPI, PORT, uri } from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { CircleCryptoPayment } from "./helpers/circle/crypto/cryptoPayment";
import { webhook } from "./routes/webhook";
import { user } from "./routes/user";
import { operation } from "./routes/operations";
import { subscirption } from "./routes/subscription";

mongoose
  .connect(uri, { maxPoolSize: 100 })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
    console.error("Could not connect to database");
  });

const app = express();

(async function run() {
  const circlePayment = new CircleCryptoPayment(CircleAPI);
  // const existingSubscriptions = await circlePayment.getSubscriptions();
  // await circlePayment.createSubscription(
  //   "https://quickloan.fly.dev/webhook/notification"
  // );
  // await circlePayment.removeSubcsription(
  //   "24e37410-b867-4392-b9ea-fa0117c50341"
  // );
  // console.log(existingSubscriptions);
})();

app.use(json());
app.use(cors());
app.use("/webhook", webhook);
app.use("/operation", operation);
app.use("/subscription", subscirption);
app.use("/user", user);

app.get("", async (req: Request, res: Response) => {
  res.status(200).send("Pinged Server");
});

console.log(PORT);

app.listen(PORT, () => {
  console.log("Started listening on port ", PORT);
});
