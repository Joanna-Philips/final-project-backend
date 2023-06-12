import express from "express";
import userDb from "./userDb";
import equipmentDb from "../equipments/equipmentDb";
import authenticateUser from "./authenticateUser";

const router = express.Router();

router.post("/", authenticateUser);
router.post("/", async (res,req) => {
    
    try{
        const { equipmentId } = req.body;
        const weaponToEquip = await equipmentDb.findOne({ _id: equipmentId });
        if (!weaponToEquip) {
            return res
              .status(404)
              .json({ success: false, error: "Could not find weapon in database" });
          }

          const accessToken = req.header("Authorization");
          const user = await userDb.findOne({ accessToken: accessToken });
          if (!(user.userWeapons.includes(weaponToEquip._id))) {
            return res
              .status(500)
              .json({ success: false, error: "Equipment not in inventory" });
          }
        
            user.equippedWeapon = weaponToEquip._id;
            await user.save();
      
          res
            .status(200)
            .json({
              success: true,
              response: user.equippedWeapon,
              weaponToEquip: weaponToEquip,
            });
        } catch (error) {
          res.status(500).json({ success: false, error: error });
        }
      });

export default router;