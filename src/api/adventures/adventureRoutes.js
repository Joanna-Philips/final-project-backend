import express from "express";
import getAdventures from "./getAdventures";
import addAdventure from "./addAdventure";
import deleteAdventure from "./deleteAdventure";

const router = express.Router();

router.use('/adventures', getAdventures);
router.use('/adventures', addAdventure);
router.use('/adventures/:id', deleteAdventure);

export default router;