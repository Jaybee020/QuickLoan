import { Request, Response, Router } from "express";
import { CryptoPayment } from "../helpers/circle/crypto/interface";
import axios from "axios";
import Queue from "bull";
import { MODE, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../config";
import Subscription from "../services/subscription";
import User from "../services/user";
import { emailQueue } from "../helpers/mail/sendMail";
type notificationType = "payments" | "payouts" | "paymentIntents";
const router = Router();

var paymentQueue: Queue.Queue;
if (MODE == "PRODUCTION") {
  console.log(MODE, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_PASSWORD);
  paymentQueue = new Queue("payment", {
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_PASSWORD,
    },
  });
} else {
  paymentQueue = new Queue("payment", "redis://127.0.0.1:6379");
}

async function handleCryptoSubscription(paymentData: CryptoPayment) {
  const subscription = await Subscription.getByPaymentIntent(
    paymentData.paymentIntentId
  );
  if (!subscription) {
    return;
  }
  console.log(
    "Started processing payment of data",
    paymentData.paymentIntentId
  );
  console.log(paymentData);
  if (paymentData.status == "paid") {
    if (subscription.status != "PENDING") {
      return; // only update pending subscirptions
    }
    await Subscription.confirmSubscription(
      subscription.id,
      paymentData.amount.amount,
      paymentData.amount.currency,
      paymentData.id,
      Number(paymentData.settlementAmount.amount)
    );
    const user = await User.getById(subscription.user.toString());
    if (!user) {
      return;
    }
    user.feeBalance += Number(
      (0.97 * Number(paymentData.settlementAmount.amount)).toFixed(2)
    );
    if (user.email) {
      emailQueue.add({
        email: user.email,
        title: "BRIDGEBLOC SUBSCRIPTION CONFRIMED",
        message: `Your subscription of ${paymentData.amount.amount} ${paymentData.amount.currency} has been confirmed.`,
      });
    }
    await user.save();
  } else if (paymentData.status == "failed") {
    await Subscription.rejectSubscription(subscription.id);
    const user = await User.getById(subscription.user.toString());
    if (!user) {
      return;
    }
    if (user.email) {
      emailQueue.add({
        email: user.email,
        title: "BRIDGEBLOC SUBSCRIPTION FAILED",
        message: `Your subscription of ${paymentData.amount.amount} ${paymentData.amount.currency} failed.`,
      });
    }
  }
}

paymentQueue.process(async function (job: {
  data: CryptoPayment; // CardPayment; add support for card
}) {
  const paymentData = job.data;

  //payments are usually for donations

  if (paymentData.type == "payment") {
    if (paymentData.source) {
      //   await handleCardPayments(paymentData as CardPayment);
    } else {
      await handleCryptoSubscription(paymentData as CryptoPayment);
    }
    //   } else if (paymentData.type == "refund") {
    //     if (paymentData.source) {
    //       await handleCardRefund(paymentData as CardPayment);
    //     } else {
    //       await handleCryptoRefund(paymentData as CryptoPayment);
    //     }
  }
});

router.head("/notification", async (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(`HEAD request for ${req.url}`);
  console.log("Reached Head request");
  return;
});

router.post("/notification", async (req: Request, res: Response) => {
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", async () => {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    const envelope = JSON.parse(body);
    if (envelope.Type == "SubscriptionConfirmation") {
      try {
        await axios.get(envelope.SubscribeURL);
        console.log("Successfully subscribed");
      } catch (error: any) {
        console.log("Could not subscribe");
      }
    } else if (envelope.Type == "Notification") {
      console.log("Notification received");
      const data: {
        notificationType: notificationType;
        payment: CryptoPayment;
        // payout: CryptoPayout;
      } = JSON.parse(envelope.Message);
      const { notificationType, ...payload } = data;
      if (notificationType == "payments") {
        console.log(notificationType);

        const paymentData = payload.payment;
        if (paymentData.type == "payment") {
          if (paymentData.source) {
            //   await handleCardPayments(paymentData as CardPayment);
          } else {
            await handleCryptoSubscription(paymentData as CryptoPayment);
          }
          //   } else if (paymentData.type == "refund") {
          //     if (paymentData.source) {
          //       await handleCardRefund(paymentData as CardPayment);
          //     } else {
          //       await handleCryptoRefund(paymentData as CryptoPayment);
          //     }
        }

        // paymentQueue.add(payload.payment);
      }
      //handle payout
      //   else if (notificationType == "payouts") {
      //     payoutQueue.add(payload.payout);
      //   }
      res.end(`POST req for ${req.url}`);
    }
  });
});

export const webhook = router;
