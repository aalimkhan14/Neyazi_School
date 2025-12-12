const express = require('express');
const router = express.Router();
const employee_model = require('../models/employees.model');
const employee_controller = require('../controller/employees.controller');

//🟢 Multer setup
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

router.get('/count', employee_controller.count);

// CREATE employee (all 3 optional files)
router.post('/', fileFields, employee_controller.create);

// UPDATE employee (replace any file)
router.put('/:id', fileFields, employee_controller.update);

// DELETE employee
router.delete('/:id', employee_controller.delete);

// GET ALL employees
router.get('/', employee_controller.findAll);

// GET employee by ID
router.get('/:id', employee_controller.findByPk);

// 📥 Download agreement
router.get('/download/:id/agreement', async (req, res) => {
  try {
    const employee = await employee_model.findByPk(req.params.id);
    if (!employee || !employee.agreement) return res.status(404).json({ message: 'Agreement not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', employee.agreement);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, employee.agreement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// 📥 Download diploma letter
router.get('/download/:id/diploma', async (req, res) => {
  try {
    const employee = await employee_model.findByPk(req.params.id);
    if (!employee || !employee.diplomaLetter) return res.status(404).json({ message: 'Diploma not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', employee.diplomaLetter);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, employee.diplomaLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

// 📥 Download ID card letter
router.get('/download/:id/idcard', async (req, res) => {
  try {
    const employee = await employee_model.findByPk(req.params.id);
    if (!employee || !employee.idCardLetter) return res.status(404).json({ message: 'ID card not found' });

    const filePath = path.join(__dirname, '..', '..', 'uploads', employee.idCardLetter);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath, employee.idCardLetter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Download failed', error: error.message });
  }
});

module.exports = router;


module.exports = router;