import express from "express";
import getAdventures from "./getAdventures";
import addAdventure from "./addAdventure";
import deleteAdventure from "./deleteAdventure";
import completeAdventure from "./completeAdventure";

const router = express.Router();

router.use('/all', getAdventures);
router.use('/add', addAdventure);
router.use('/delete/:id', deleteAdventure);
router.use('/complete', completeAdventure );

export default router;