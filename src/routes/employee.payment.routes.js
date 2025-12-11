const express = require('express');
const router = express.Router();
const employeePayment_model = require('../models/employees.payment.model');
const employeePayment_controller = require('../controller/employee.payment.controller');

// Get all payments
router.get('/', employeePayment_controller.findAll);
// Create a new payment
router.post('/', employeePayment_controller.create);
// Update a paymet by id
router.put('/:id', employeePayment_controller.update);
// Delete a payment by id
router.delete('/:id', employeePayment_controller.delete);
// Get one by id
router.get('/:id', employeePayment_controller.findByPk);


module.exports = router;