const express = require('express');
const router = express.Router();
const fee_model = require('../models/fee.model');
const report_controller = require('../controller/report.controller')

router.get("/", report_controller.getReport);

module.exports = router;