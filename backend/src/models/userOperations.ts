import { Schema, Types, model } from "mongoose";
import { UserOperationRequest } from "../interfaces";

interface IUserOperation {
  txHash: string;
  opHash: string;
  user: Types.ObjectId;
  fee: number; // in eth
  opRequest: UserOperationRequest;
  status:
    | "CREATED"
    | "SIGNED"
    | "SIMULATED"
    | "BROADCASTED"
    | "CONFIRMED"
    | "FAILED";
  createdAt: string;
  updatedAt: string;
}

const UserOperationSchema = new Schema<IUserOperation>(
  {
    txHash: { type: String },
    user: {
      type: "ObjectId",
      required: true,
      ref: "UserModel",
    },
    fee: {
      type: Number,
    },
    opHash: { type: String },
    opRequest: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "CREATED",
    },
  },
  { timestamps: true }
);

export const userOperationModel = model<IUserOperation>(
  "UserOperationModel",
  UserOperationSchema
);
