import express from "express";
import equipmentDb from "./equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser);
router.post("/", async (req, res) => {
 
  try {
    const { newEquipment } = req.body;
    const createdEquipment = await new equipmentDb(newEquipment).save();
    if (!createdEquipment) {
      return res.status(404).json({ success: false, message: "Could not create equipment" });
    }

    res.status(200).json({ success: true, response: createdEquipment });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;