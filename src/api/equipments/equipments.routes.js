import express from "express";
import equipmentHandler from "./equipments";

const router = express.Router();

router.use('/equip', equipmentHandler);

export default router;