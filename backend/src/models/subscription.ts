import { Schema, Types, model } from "mongoose";

export interface ISubscription {
  user: Types.ObjectId;
  paymentId?: string;
  paymentIntentId: string;
  amount: string;
  currency: "USD" | "ETH" | "BTC";
  ethAmount?: number; //settlementAmount is always ETH
  method: "CRYPTO" | "CARD";
  status: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED" | "CHARGEDBACK";
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: "ObjectId",
      ref: "UserModel",
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    ethAmount: {
      type: Number,
    },
    method: {
      type: String,
      enum: ["CRYPTO", "CARD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED", "CHARGEDBACK", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
  },
  { timestamps: true }
);

export const SubscriptionModel = model<ISubscription>(
  "SubscriptionModel",
  SubscriptionSchema
);
