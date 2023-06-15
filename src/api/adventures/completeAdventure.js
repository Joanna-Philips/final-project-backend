import express from "express";
import adventureDb from "./adventureDb";
import userDb from "../users/userDb";
import equipmentDb from "../equipments/equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

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

    const equippedWeapon = await equipmentDb.findOne({ _id: user.equippedWeapon });
    let questWon = false;
    if(equippedWeapon.damage > completedAdventure.difficulty){
      user.userCoins += completedAdventure.rewardCoins;
      questWon = true;
    } else {
      user.userCoins -= completedAdventure.rewardCoins;
    }
   
    await user.save();

    res.status(200).json({
      success: true, 
      response:{
        userCoins: user.userCoins,
        questWon: questWon
      } 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
});

export default router;