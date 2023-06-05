import express from "express";
import adventureDb from "./adventureDb";
import authenticateUser from "../users/authenticateUser";
const router = express.Router();

router.post("/",authenticateUser);
router.post("/", async (req, res) => {
  try {
    const { newAdventure } = req.body;
    console.log("new", newAdventure);
    const createdAdventure = await adventureDb.create(newAdventure);
    /* const createdAdventure = await new adventureDb({ newAdventure: newAdventure }).save(); */
    console.log("created", createdAdventure);
    if (!createdAdventure) {
      return res.status(404).json({ success: false, message: "Could not create adventure" });
    }

    res.status(200).json({success: true, response: createdAdventure});
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server Error" });
  }
});

export default router;