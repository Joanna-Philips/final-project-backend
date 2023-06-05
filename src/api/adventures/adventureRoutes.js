import express from "express";
import getAdventures from "./getAdventures";
import addAdventure from "./addAdventure";
import deleteAdventure from "./deleteAdventure";
import completedAdventure from "./completeAdventure";

const router = express.Router();

router.use('/', getAdventures);
router.use('/', addAdventure);
router.use('/:id', deleteAdventure);
router.use('/:id', completedAdventure );

export default router;