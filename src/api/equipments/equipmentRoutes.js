import express from "express";
import getEquipments from "./getEquipments";
import addEquipment from "./addEquipment";
import deleteEquipment from "./deleteEquipment";

const router = express.Router();

router.use('/', getEquipments);
router.use('/', addEquipment);
router.use('/:id', deleteEquipment);

export default router;