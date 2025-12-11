const express = require('express');
const router = express.Router();
const fee_controller = require('../controller/fee.controller');

// -----------------------------
// Fee Routes
// -----------------------------

// Create a new fee
router.post('/', fee_controller.create);

// Get all fees
router.get('/', fee_controller.findAll);

// Get fee by student ID (specific route first!)
router.get('/sid/:sid', fee_controller.findBySid);

// Get data by specified time (date filter)
router.get('/date', fee_controller.findByDate);

// Get one fee by ID
router.get('/:id', fee_controller.findByPk);

// Update a fee by ID
router.put('/:id', fee_controller.update);

// Delete a fee by ID
router.delete('/:id', fee_controller.delete);

module.exports = router;
