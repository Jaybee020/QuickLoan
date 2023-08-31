import { CircleAPI } from "../config";
import { CircleCryptoPayment } from "../helpers/circle/crypto/cryptoPayment";
import {
  CreatePaymentIntentPayload,
  SupportedChains,
  SupportedCurrencies,
} from "../helpers/circle/crypto/interface";
import crypto from "crypto";
import { ISubscription, SubscriptionModel } from "../models/subscription";
import User from "./user";

class Subscription {
  model: typeof SubscriptionModel;

  constructor() {
    this.model = SubscriptionModel;
  }

  get(limit = 100, offset = 0) {
    return this.model.find({}).skip(offset).limit(limit);
  }

  getByUser(id: string) {
    return this.model.find({ user: id });
  }

  getCount() {
    return this.model.count({});
  }

  getUserCount(userId: string) {
    return this.model.count({ user: userId });
  }

  async getById(id: string) {
    const subscription = await this.model.findById(id).lean();
    if (!subscription) {
      throw Error("Subscription not found");
    }
    var paymentIntent;
    const circlePayment = new CircleCryptoPayment(CircleAPI);
    if (subscription.paymentIntentId) {
      paymentIntent = await circlePayment.getPaymentIntentById(
        subscription.paymentIntentId
      );
    }
    return { ...subscription, paymentIntent };
  }

  getByPaymentIntent(paymentIntentId: string) {
    return this.model.findOne({ paymentIntentId });
  }

  updateById(subscriptionId: string, params: Partial<ISubscription>) {
    return this.model.findByIdAndUpdate(subscriptionId, params);
  }
  confirmSubscription(
    subscriptionId: string,
    amount: string,
    currency: SupportedCurrencies,
    paymentId: string,
    ethAmount: number
  ) {
    return this.updateById(subscriptionId, {
      paymentId,
      ethAmount,
      status: "CONFIRMED",
      amount,
      currency,
    });
  }
  rejectSubscription(subscriptionId: string) {
    return this.updateById(subscriptionId, {
      status: "FAILED",
      ethAmount: 0,
    });
  }

  async subscribeViaCrypto(
    subscriptionPayload: Pick<ISubscription, "user" | "amount" | "currency"> & {
      chain: SupportedChains;
    }
  ) {
    const user = await User.getById(subscriptionPayload.user.toString());
    if (!user) {
      throw Error("User not found");
    }
    const circlePayment = new CircleCryptoPayment(CircleAPI);
    const payload: CreatePaymentIntentPayload = {
      idempotencyKey: crypto.randomUUID(),
      amount: {
        amount: String(Number(subscriptionPayload.amount).toFixed(2)),
        currency: subscriptionPayload.currency,
      },
      settlementCurrency: "USD",
      paymentMethods: [
        {
          chain: subscriptionPayload.chain,
          type: "blockchain",
        },
      ],
    };
    const paymentIntent =
      //@ts-ignore
      (await circlePayment.createPaymenIntent(payload)).data;
    const subscriptionDoc = await this.model.create({
      ...subscriptionPayload,
      method: "CRYPTO",
      paymentIntentId: paymentIntent.id,
    });
    user.subscriptions.push(subscriptionDoc.id);
    await user.save();
    return subscriptionDoc;
  }
  //TODO
  subscribeViaCard() {}
}
export default new Subscription();
