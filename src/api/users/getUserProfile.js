import express from "express";
import userDb from "./userDb";
import authenticateUser from "./authenticateUser";

const router = express.Router();

router.get("/", authenticateUser);
router.get("/", async (req, res) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await userDb.findOne({ accessToken: accessToken });
    if (!user) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }
    res.status(200).json({ success: true, response: {
      userCoins: user.userCoins,
      userWeapons: user.userWeapons,
      equippedWeapon: user.equippedWeapon,
      userAvatar: user.userAvatar 
    }, });
  } catch (error) {
    res.status(500).json({ success: false, error: error});
  }
});

export default router;