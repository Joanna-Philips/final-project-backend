import express from "express";
import userDb from "./userDb";

const router = express.Router();

router.post("/", async (req, res) => {
    const guestUser = await userDb.findOne({ username: "guest" });
    if (guestUser) {
      res.status(200).json({
        success: true,
        response: {
          username: guestUser.username,
          id: guestUser._id,
          accessToken: guestUser.accessToken,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Guest login failed",
      });
    }
  });

export default router;