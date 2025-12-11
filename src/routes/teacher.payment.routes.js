const express = require('express');
const router = express.Router();
const teacherPayment_model = require('../models/teachers.payment.model');
const teacherPayment_controller = require('../controller/teacher.paymetn.controller');

// Get all payments
router.get('/', teacherPayment_controller.findAll);
// Create a new payment
router.post('/', teacherPayment_controller.create);
// Update a paymet by id
router.put('/:id', teacherPayment_controller.update);
// Delete a payment by id
router.delete('/:id', teacherPayment_controller.delete);
// Get one by id
router.get('/:id', teacherPayment_controller.findByPk);


module.exports = router;