const express = require('express');
const router = express.Router();
const upgradeClass_controller = require('../controller/upgradeClass.controller');

// ---------------------- Routes ----------------------

// Get all upgrade class records
router.get('/', upgradeClass_controller.findAll);

// Get one by primary key (sid)
router.get('/sid/:sid', upgradeClass_controller.findBySid);


// Create new upgrade records
router.post('/', upgradeClass_controller.create);

// Delete by id
router.delete('/:id', upgradeClass_controller.delete);

module.exports = router;
