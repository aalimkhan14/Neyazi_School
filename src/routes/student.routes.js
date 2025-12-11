const express = require('express');
const router = express.Router();
const Student_model = require('../models/students.model');
const Student_controller = require('../controller/students.controller');
const multer = require('multer');
const path = require('path');

// Multer storage config with Date.now() in filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
// Route (GET /students/count)
router.get('/count', Student_controller.count);

router.get('/search', Student_controller.findAll1);

// GET all students
router.get('/', Student_controller.findAll);

// POST create student (with file upload)
router.post('/', upload.fields([
  { name: 'picture', maxCount: 1 },
  { name: 'attachment', maxCount: 1 },
  { name: 'attachment2', maxCount: 1 },
  { name: 'attachment3', maxCount: 1 }
]), Student_controller.create);

// DELETE student
router.delete('/:id', Student_controller.deleteStudent);

// GET student by id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student_model.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update student (with single file upload for picture)
router.put('/:id', upload.fields([
  {name: 'picture', maxCount: 1},
  {name: 'attachment', maxCount: 1},
  {name: 'attachment2', maxCount: 1},
  {name: 'attachment3', maxCount: 1}
]), Student_controller.updateStudent);


// Get one by id
router.get('/:id', Student_controller.findByPk);






module.exports = router;
