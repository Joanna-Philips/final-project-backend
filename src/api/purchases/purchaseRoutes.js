import express from "express";
import buyEquipment from "./buyEquipment";

const router = express.Router();

router.use('/buy', buyEquipment);
router.use('/sell', buyEquipment);

export default router;