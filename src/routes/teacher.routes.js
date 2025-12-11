const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const teacher_model = require('../models/teachers.model');
const teacher_controller = require('../controller/teachers.controller');

// 🟢 Multer setup for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder for storing files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 🟡 Routes

// Get total count
router.get('/count', teacher_controller.count);

// Get all teachers
router.get('/', teacher_controller.findAll);

// Create teacher (with agreement file)
router.post('/', upload.fields([{ name: 'agreementFile', maxCount: 1 }]), teacher_controller.create);

// Update teacher (with optional new agreement file)
router.put('/:id', upload.fields([{ name: 'agreementFile', maxCount: 1 }]), teacher_controller.update);

// Delete teacher
router.delete('/:id', teacher_controller.delete);

// Get one by ID
router.get('/:id', teacher_controller.findByPk);

// 📥 Download teacher agreement
router.get('/download/:id/agreement', async (req, res) => {
  try {
    const teacher = await teacher_model.findByPk(req.params.id);
    if (!teacher || !teacher.agreement) {
      return res.status(404).json({ message: 'Agreement not found' });
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', teacher.agreement);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, teacher.agreement);
  } catch (error) {
    console.error('Error downloading agreement:', error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

module.exports = router;
