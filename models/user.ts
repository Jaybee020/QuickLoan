import { Schema, Types, model } from "mongoose";

interface IUser {
  email?: string;
  custodialAddress: string;
  smartAccountAddress: string;
  userOperations: Types.ObjectId[];
  subscriptions: Types.ObjectId[];
  feeBalance: number;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
    },
    custodialAddress: {
      type: String,
      required: true,
      unique: true,
    },
    smartAccountAddress: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptions: [
      {
        type: "ObjectId",
        ref: "SubscriptionModel",
      },
    ],
    feeBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    userOperations: [
      {
        type: "ObjectId",
        ref: "UserOperationModel",
      },
    ],
  },

  { timestamps: true }
);

export const UserModel = model<IUser>("UserModel", UserSchema);
