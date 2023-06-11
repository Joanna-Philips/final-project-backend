import express from "express";
import adventureDb from "./adventureDb";
import userDb from "../users/userDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

// 1. Post adventure ID and accessToken
// 2. Find adventure in adventureDb using adventure_id
// 3. Find user using accessToken
// 4. Add rewardCoins from adventure to userCoins
// 5. Return success/false

router.post("/",authenticateUser);
router.post("/", async (req, res) => {
  try {
    const { adventureId } = req.body;
    const completedAdventure = await adventureDb.findOne({ _id: adventureId })
    if (!completedAdventure) {
      return res.status(404).json({ success: false, error: "Could not find completed adventure" });
    }

    const accessToken = req.header("Authorization");
    const user = await userDb.findOne({ accessToken: accessToken });
    console.log("user: ", user);
    user.userCoins += parseInt(completedAdventure.rewardCoins);
    await user.save();

    res.status(200).json({success: true, response: user.userCoins});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
});

export default router;