import { Types } from "mongoose";

interface IUserOperation {
  type: "LOAN" | "BORROW";
  amount: number;
  currency: string;
  txHash: string;
  user: Types.ObjectId;
  fee: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
}
