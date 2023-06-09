import express from "express";
import avatarDb from "./avatarDb";
import userDb from "../users/userDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

// 1. Post avatar ID and accessToken
// 2. Find avatar details in avaatrDb using _id
// 3. Find user using accessToken
// 4. update avatar id to userDb (userAVatar) 
// 5. Return success/false

router.post("/",authenticateUser);
router.patch("/", async (req, res) => {
  try {
    const { avatarId } = req.body;
    const chosenAvatar = await avatarDb.findOne({ _id: avatarId })
    if (!chosenAvatar) {
      return res.status(404).json({ success: false, error: "Could not find chosen avatar" });
    }

    const accessToken = req.header("Authorization");
    const user = await userDb.findOne({ accessToken: accessToken });
    console.log("user: ", user);
    user.userAvatar = chosenAvatar._id;
    await user.save();

    res.status(200).json({success: true, response: user.userAvatar});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
});

export default router;