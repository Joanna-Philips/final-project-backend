import express from "express";
import adventureHandler from './adventures'
const router = express.Router();

router.use('/hello', adventureHandler);

export default router;