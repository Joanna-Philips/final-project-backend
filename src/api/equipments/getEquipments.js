import express from "express";
import equipmentDb from "./equipmentDb";
import authenticateUser from "../users/authenticateUser";

const router = express.Router();

router.get("/", authenticateUser);
router.get("/", async (req, res) => {
  try {
    const equipments = await equipmentDb.find();

    if (!equipments.length > 0) {
      return res.status(404).json({ success: false, message: "Equipments not found" });
    }
    
    res.status(200).json({ success: true, response: equipments });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;