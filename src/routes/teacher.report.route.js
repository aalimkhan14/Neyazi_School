const express = require('express');
const router = express.Router();
const teacher_pament_model = require('../models/teachers.payment.model');
const teacher_report_controller = require('../controller/teacher_report.controller')

router.get("/", teacher_report_controller.getReport);

module.exports = router;