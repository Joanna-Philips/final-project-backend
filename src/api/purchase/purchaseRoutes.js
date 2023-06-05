import express from "express";
import buyEquipment from "./buyEquipment";

const router = express.Router();

router.use('/buy', buyEquipment);

export default router;