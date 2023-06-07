import express from "express";
import getAvatars from "./getAvatars";
import addAvatar from "./addAvatar";
import updateUserAvatar from "./updateUserAvatar";

const router = express.Router();

router.use('/all', getAvatars);
router.use('/add', addAvatar);
router.use('/update', updateUserAvatar);

export default router;