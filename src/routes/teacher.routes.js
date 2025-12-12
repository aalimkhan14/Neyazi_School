const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const teacher_model = require('../models/teachers.model');
const teacher_controller = require('../controller/teachers.controller');

// 🟢 Multer setup
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 🟢 File fields (FOR CREATE + UPDATE)
const fileFields = upload.fields([
  { name: 'agreementFile', maxCount: 1 },
  { name: 'diplomaFile', maxCount: 1 },
  { name: 'idCardFile', maxCount: 1 }
]);

// 🟡 Routes (correct order!)

router.get('/count', teacher_controller.count);

// CREATE teacher (all 3 optional files)
router.post('/', fileFields, teacher_controller.create);

// UPDATE teacher (replace any file)
router.put('/:id', fileFields, teacher_controller.update);

// DELETE teacher
router.delete('/:id', teacher_controller.delete);

// GET ALL teachers
router.get('/', teacher_controller.findAll);

// GET teacher by ID
router.get('/:id', teacher_controller.findByPk);

// 📥 Download agreement
router.get('/download/:id/agreement', async (req, res) => {
  try {
    const teacher = await teacher_model.findByPk(req.params.id);
    if (!teacher || !teacher.agreement) return res.status(404).json({ message: 'Agreement not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', teacher.agreement);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, teacher.agreement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// 📥 Download diploma letter
router.get('/download/:id/diploma', async (req, res) => {
  try {
    const teacher = await teacher_model.findByPk(req.params.id);
    if (!teacher || !teacher.diplomaLetter) return res.status(404).json({ message: 'Diploma not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', teacher.diplomaLetter);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, teacher.diplomaLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// 📥 Download ID card letter
router.get('/download/:id/idcard', async (req, res) => {
  try {
    const teacher = await teacher_model.findByPk(req.params.id);
    if (!teacher || !teacher.idCardLetter) return res.status(404).json({ message: 'ID card not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', teacher.idCardLetter);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, teacher.idCardLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

module.exports = router;
