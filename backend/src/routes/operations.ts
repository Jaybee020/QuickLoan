import { Request, Response, Router } from "express";
import User from "../services/user";
import UserOperation from "../services/userOperation";
import { assert } from "../helpers/evm/utils";
const router = Router();

router.get("/:id", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const op = await UserOperation.get(id);
    res.status(200).json({ data: op });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/user/:email", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const op = await UserOperation.get(id);
    res.status(200).json({ data: op });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/", async function (req: Request, res: Response) {
  try {
    const { email, actions, type } = req.body;
    assert(
      type == "COMPOUND" || type == "TRANSFER" || type == "TOKEN",
      "Wrong operation type provided"
    );
    var op;
    if (type == "COMPOUND") {
      op = await UserOperation.generateCompoundOperationToBeSigned(
        email,
        actions
      );
    } else if (type == "TOKEN") {
      op = await UserOperation.generateTokenSendOperationToBeSigned(
        email,
        actions
      );
    } else {
      op = await UserOperation.generateSendOperationToBeSigned(email, {
        to: actions[0].to,
        value: actions[0].value,
      });
    }
    res.status(200).json({ data: op });
  } catch (error) {
    res.status(400).json({ error });
  }
});
// 0x00daeb7c98231a6e32c3b0ef3d5d67e5a3d320de530a2edf8d4797b608b3528a

router.post("/simulate/:id", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const simulation = await UserOperation.simulateUserOperation(id);
    if (simulation.error) {
      throw Error("Simulation vailed with " + simulation.error.message);
    }
    res.status(200).json({ data: simulation });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/sign/:id", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { signature } = req.body;
    const broadcast = await UserOperation.signUserOperation(signature, id);
    res.status(200).json({ data: broadcast });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/broadcast/:id", async function (req: Request, res: Response) {
  try {
    const id = req.params.id;
    const broadcast = await UserOperation.broadcastUserOperation(id);
    res.status(200).json({ data: broadcast });
  } catch (error) {
    res.status(400).json({ error });
  }
});

export const operation = router;
