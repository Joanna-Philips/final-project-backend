import express from "express";
import getEquipments from "./getEquipments";
import addEquipment from "./addEquipment";
import deleteEquipment from "./deleteEquipment";

const router = express.Router();

router.use('/all', getEquipments);
router.use('/add', addEquipment);
router.use('/delete/:id', deleteEquipment);

export default router;