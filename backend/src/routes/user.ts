import { Request, Response, Router } from "express";
import User from "../services/user";
const router = Router();

router.get("/:email", async function (req: Request, res: Response) {
  try {
    const email = req.params.email;
    const user = await User.getByEmail(email);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("", async function (req: Request, res: Response) {
  try {
    const { email, custodialAddress } = req.body;
    const user = await User.create(custodialAddress, email);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get(
  "/subscriptions/:email",
  async function (req: Request, res: Response) {
    try {
      const email = req.params.email;
      const subs = await User.getSubscriptions(email);
      res.status(200).json({ data: subs });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

router.get("/smartWallet/:email", async function (req: Request, res: Response) {
  try {
    const email = req.params.email;
    const user = await User.getByEmail(email);
    const wallet = await User.getSmartAccountWallet(user?.id);
    res.status(200).json({ data: wallet });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export const user = router;
