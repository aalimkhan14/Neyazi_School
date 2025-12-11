const express = require('express');
const router = express.Router();
const Sell_model = require('../models/sell_model');
const Sell_controller = require('../controller/sell.controller');


// Route (GET /teachers/count)
router.get('/count', Sell_controller.count);
// Get all teachers
router.get('/', Sell_controller.findAll);
// Create a new teacher
router.post('/', Sell_controller.create);
// Update a teacher by id
router.put('/:id', Sell_controller.update);
// Delete a teacher by id
router.delete('/:id', Sell_controller.delete);
// Get data by specified time
router.get("/date", Sell_controller.findByDate);
// Get one by id
router.get('/:id', Sell_controller.findByPk);
// Get data by specified time



module.exports = router;
