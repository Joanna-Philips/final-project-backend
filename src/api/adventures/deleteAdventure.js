import express from "express";
import adventureDb from "./adventureDb";
import authenticateUser from "../users/authenticateUser";
const router = express.Router();

router.delete("/", authenticateUser);
router.delete("/", async (req, res) => {
  try {
    const adventureId = req.params.id;
    const deletedAdventure = await adventureDb.findOneAndDelete({_id: adventureId});

    if (!deletedAdventure) {
      return res.status(404).json({ success: false, message: "Could not delete adventure" });
    }

    res.status(200).json({ success: true, response: deletedAdventure });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
