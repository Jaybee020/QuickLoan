import mongoose from "mongoose";
import { CircleAPI, uri } from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { CircleCryptoPayment } from "./helpers/circle/crypto/cryptoPayment";
import { webhook } from "./routes/webhook";

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
  const existingSubscriptions = await circlePayment.getSubscriptions();
  // await circlePayment.createSubscription("");
  // await circlePayment.removeSubcsription(
  //   "24e37410-b867-4392-b9ea-fa0117c50341"
  // );
  console.log(existingSubscriptions);
})();

app.use(json());
app.use(cors());
app.use("/webhook", webhook);
app.get("", async (req: Request, res: Response) => {
  res.status(200).send("Pinged Server");
});

app.listen(8000, () => {
  console.log("Started listening on port 8000");
});
