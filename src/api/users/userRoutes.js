import express from "express";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
import loginGuestUser from "./loginGuestUser";
import getUserProfile from "./getUserProfile";

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', loginUser);
router.use('/login/guest', loginGuestUser);
router.use('/user', getUserProfile);

export default router;