import express from "express";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
import loginGuestUser from "./loginGuestUser";
import getUserProfile from "./getUserProfile";
import equipWeapon from "./equipWeapon";

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', loginUser);
router.use('/login/guest', loginGuestUser);
router.use('/profile', getUserProfile);
router.use('/equip', equipWeapon);

export default router;