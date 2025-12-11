const express = require('express');
const router = express.Router();
const employee_pament_model = require('../models/employees.payment.model');
const employee_report_controller = require('../controller/teacher_report.controller')

router.get("/", employee_report_controller.getReport);

module.exports = router;