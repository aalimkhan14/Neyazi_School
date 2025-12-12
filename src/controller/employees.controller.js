const employee_model = require('../models/employees.model');
const employee_routes = require('../routes/employee.routes');
const { Op, fn, col, where } = require('sequelize');
const fs = require('fs');
const path = require('path');


exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "name";

    const whereClause = {};
    if (search && (filterBy === "id" || filterBy === "name")) {
      whereClause[filterBy] = {
        [Op.like]: `${search}%`
      };
    }

    const { count, rows } = await employee_model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({
      data: rows,      // ✅ This matches frontend's forEach
      total: count     // ✅ Used for pagination
    });
  } catch (err) {
    console.error("Error fetching Employee data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      name,
      lname,
      fname,
      gfname,
      birth,
      idcard,
      phone,
      address,
      job,
      salary,
      agreement,
      diplomaLetter,
      idCardLetter
    } = req.body;

    const agreementFile = req.files?.agreementFile?.[0]?.filename || agreementFile || null;
    const diplomaFile = req.files?.diplomaFile?.[0]?.filename || diplomaFile || null;
    const idCardFile = req.files?.idCardFile?.[0]?.filename || idCardFile || null;

    const newEmployee = await employee_model.create({
      name,
      lname,
      fname,
      gfname,
      birth,
      idcard,
      phone,
      address,
      job,
      salary,
      agreement: agreementFile,
      diplomaLetter : diplomaFile,
      idCardLetter: idCardFile
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const employee = await employee_model.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (employee.agreement) {
      const agreementPath = path.join(__dirname, '..', '..', 'uploads', employee.agreement);
      if (fs.existsSync(agreementPath)) fs.unlinkSync(agreementPath);
    }
    if (employee.diplomaLetter) {
      const diplomaPath = path.join(__dirname, '..', '..', 'uploads', employee.diplomaLetter);
      if (fs.existsSync(diplomaPath)) fs.unlinkSync(diplomaPath);
    }
    if (employee.idCardLetter) {
      const idCardPath = path.join(__dirname, '..', '..', 'uploads', employee.idCardLetter);
      if (fs.existsSync(idCardPath)) fs.unlinkSync(idCardPath);
    }

    await employee.destroy();
    res.status(200).json({ message: "کارمند موفقانه حذف شد" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await employee_model.findByPk(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 🟢 Helper function to delete old file
    const deleteOldFile = (fileName) => {
      if (!fileName) return;
      const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    // 🟢 Handle agreement file update
    if (req.files?.agreementFile?.[0]) {
      deleteOldFile(employee.agreement);
      employee.agreement = req.files.agreementFile[0].filename;
    }

    // 🟢 Handle diploma letter update
    if (req.files?.diplomaFile?.[0]) {
      deleteOldFile(employee.diplomaLetter);
      employee.diplomaLetter = req.files.diplomaFile[0].filename;
    }

    // 🟢 Handle ID card letter update
    if (req.files?.idCardFile?.[0]) {
      deleteOldFile(employee.idCardLetter);
      employee.idCardLetter = req.files.idCardFile[0].filename;
    }

    // 🟡 Update all text fields
    Object.assign(employee, req.body);

    await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });

  } catch (error) {
    console.error("Error updating Employee:", error);
    res.status(500).json({
      message: "Error updating Employee",
      error: error.message,
    });
  }
};

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Employee ID:", req.params.id); // ✅ debug

    const getone = await employee_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding Employee', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await employee_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};