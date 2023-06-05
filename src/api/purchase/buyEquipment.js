import express from "express";
import userDb from "../users/userDb";
import equipmentDb from "../equipments/equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

// 0. Post Get equipmentID
// 1. Get the cost of equipment from equipment Db
// 2. Get userCoins from userDb
// 3. Calculate userCoins - EquipmentCost
// 4. if result = > 0 add equipment to userWeapon/ (purchase successful)
// 5. Subtract equipment.cost from userCoins/
// 6. else not enough coins/ purchase failed

router.post("/",authenticateUser);
router.post("/", async (req, res) => {
  try {
    const {equipmentId } = req.body;
    const purchasedEquipment = await equipmentDb.findOne({ _id: equipmentId })
    if (!purchasedEquipment) {
      return res.status(404).json({ success: false, error: "Could not find weapon" });
    }

    const accessToken = req.header("Authorization");
    const user = await userDb.findOne({ accessToken: accessToken });
    const updatedUserCoins = user.userCoins - equipmentDb.cost;
    if (updatedUserCoins >= 0) {
        await userDb.userWeapons.updateOne(purchasedEquipment);
        await userDb.userCoins.updateOne(updatedUserCoins);
    } else {
        return res.status(404).json({ success: false, error: "Not enough coins" });
    };

    res.status(200).json({success: true, response: user.userCoins, purchasedEquipment: purchasedEquipment });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;