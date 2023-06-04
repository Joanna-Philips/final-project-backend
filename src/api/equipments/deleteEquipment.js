import express from "express";
import equipmentDb from "./equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.delete("/", authenticateUser);
router.delete("/", async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const deletedEquipment = await equipmentDb.findOneAndDelete({_id: equipmentId});

    if (!deletedEquipment) {
      return res.status(404).json({ success: false, message: "Could not delete equipment" });
    }

    res.status(200).json({ success: true, response: deletedEquipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export default router;