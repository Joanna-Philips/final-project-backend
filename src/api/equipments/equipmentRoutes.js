import express from "express";
import getEquipments from "./getEquipments";
import addEquipment from "./addEquipment";
import deleteEquipment from "./deleteEquipment";

const router = express.Router();

router.use('/equipments', getEquipments);
router.use('/equipments', addEquipment);
router.use('/equipments/:id', deleteEquipment);

export default router;