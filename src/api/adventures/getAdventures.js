import express from "express";
import adventureDb from "./adventureDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.get("/", authenticateUser);
router.get("/", async (req, res) => {
  try {
    const adventures = await adventureDb.find();

    if (!adventures.length > 0) {
      return res.status(404).json({ success: false, message: "Adventures not found" });
    }

    res.status(200).json({success: true, response: adventures});
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server Error" });
  }
});

export default router;