import express from "express";
import avatarDb from "./avatarDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.get("/", authenticateUser);
router.get("/", async (req, res) => {
  try {
    const avatars = await avatarDb.find();

    if (!avatars.length > 0) {
      return res.status(404).json({ success: false, message: "Avatars not found" });
    }

    res.status(200).json({success: true, response: avatars});
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;