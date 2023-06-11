import express from "express";
import buyEquipment from "./buyEquipment";
import sellEquipment from "./sellEquipment";

const router = express.Router();

router.use('/buy', buyEquipment);
router.use('/sell', sellEquipment);

export default router;