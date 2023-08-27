import mongoose from "mongoose";
import { uri } from "./config";
import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";

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

app.use(json());
app.use(cors());

app.get("", async (req: Request, res: Response) => {
  res.status(200).send("Pinged Server");
});

app.listen(8000, () => {
  console.log("Started listening on port 8000");
});
