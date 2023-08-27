import { CircleAPI } from "../config";
import { CircleCryptoPayment } from "../helpers/circle/crypto/cryptoPayment";
import {
  CreatePaymentIntentPayload,
  SupportedChains,
  SupportedCurrencies,
} from "../helpers/circle/crypto/interface";
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

  getCount() {
    return this.model.count({});
  }

  getUserCount(userId: string) {
    return this.model.count({ user: userId });
  }

  getById(id: string) {
    return this.model.findById(id);
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
        amount: String(subscriptionPayload.amount),
        currency: subscriptionPayload.currency,
      },
      settlementCurrency: "ETH",
      paymentMethods: [
        {
          chain: subscriptionPayload.chain,
          type: "blockchain",
        },
      ],
    };
    const paymentIntent = await circlePayment.createPaymenIntent(payload);
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
