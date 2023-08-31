import { Request, Response, Router } from "express";
import User from "../services/user";
import UserOperation from "../services/userOperation";
import subscription from "../services/subscription";
const router = Router();

router.post("", async function (req: Request, res: Response) {
  try {
    const { email, payload } = req.body;
    const user = await User.getByEmail(email);
    console.log(user);
    if (!user) {
      throw Error("User not found");
    }
    const sub = await subscription.subscribeViaCrypto({
      user: user!.id,
      ...payload,
    });
    res.status(200).json({ data: sub });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get("/user/:email", async function (req: Request, res: Response) {
  try {
    const email = req.params.email;
    const subs = await User.getSubscriptions(email);
    res.status(200).json({ data: subs });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const sub = await subscription.getById(id);
    res.status(200).json({ data: sub });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

export const subscirption = router;
