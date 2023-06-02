const express = require("express");
const router = express.Router();

router.use('/ping', require('./equipments'));
router.use('/transactions', require('./adventures'));
router.use('/accounts', require('./users'));

module.exports = router;
