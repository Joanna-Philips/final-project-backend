import express from "express";
import userDb from "../users/userDb";
import equipmentDb from "../equipments/equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser);
router.post("/", async (req, res) => {
  try {
    const { equipmentId } = req.body;
    const accessToken = req.header("Authorization");
    const user = await userDb.findOne({ accessToken: accessToken });
    if (!user.userWeapons.includes(equipmentId)) {
      return res
        .status(404)
        .json({ success: false, error: "Could not find weapon in player inventory" });
    }

    const soldEquipment = await equipmentDb.findOne({_id: equipmentId});
    user.userWeapons.splice(user.userWeapons.indexOf(equipmentId), 1);
    user.userCoins += soldEquipment.cost;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        response: user.userCoins,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;
