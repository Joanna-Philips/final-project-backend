import express from "express";
import getAdventures from "./getAdventures";
import addAdventure from "./addAdventure";
import deleteAdventure from "./deleteAdventure";

const router = express.Router();

router.use('/', getAdventures);
router.use('/', addAdventure);
router.use('/:id', deleteAdventure);

export default router;