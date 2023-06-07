import express from "express";
import avatarDb from "./avatarDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser);
router.post("/", async (req, res) => {
 
  try {
    const { newAvatar } = req.body;
    console.log(newAvatar)
    const createAvatar = await new avatarDb(newAvatar).save();
    if (!createAvatar) {
      return res.status(404).json({ success: false, message: "Could not create avatar" });
    }

    res.status(200).json({ success: true, response: createAvatar });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;