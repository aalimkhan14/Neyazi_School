const teacher_model = require('../models/teachers.model');
const teacher_routes = require('../routes/teacher.routes');
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

    const { count, rows } = await teacher_model.findAndCountAll({
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
    console.error("Error fetching Teacher data:", err);
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
      educatelevel,
      educateunit,
      graduatedate,
      graduateplace,
      job,
      salary,
      formcode,
      agreement,
      diplomaLetter,
      idCardLetter
    } = req.body;

      const agreementFile = req.files?.agreementFile?.[0]?.filename || agreementFile || null;
      const diplomaFile = req.files?.diplomaFile?.[0]?.filename || diplomaFile || null;
      const idCardFile = req.files?.idCardFile?.[0]?.filename || idCardFile || null;

    const newTeacher = await teacher_model.create({
      name,
      lname,
      fname,
      gfname,
      birth,
      idcard,
      phone,
      address,
      educatelevel,
      educateunit,
      graduatedate,
      graduateplace,
      job,
      salary,
      formcode,
      agreement: agreementFile,
      diplomaLetter : diplomaFile,
      idCardLetter: idCardFile
    });

    res.status(201).json(newTeacher);
  } catch (error) {
    console.error("Error creating teacher:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating teacher', error: error.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const teacher = await teacher_model.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    if (teacher.agreement) {
      const agreementPath = path.join(__dirname, '..', '..', 'uploads', teacher.agreement);
      if (fs.existsSync(agreementPath)) fs.unlinkSync(agreementPath);
    }
    if (teacher.diplomaLetter) {
      const diplomaPath = path.join(__dirname, '..', '..', 'uploads', teacher.diplomaLetter);
      if (fs.existsSync(diplomaPath)) fs.unlinkSync(diplomaPath);
    }
    if (teacher.idCardLetter) {
      const idCardPath = path.join(__dirname, '..', '..', 'uploads', teacher.idCardLetter);
      if (fs.existsSync(idCardPath)) fs.unlinkSync(idCardPath);
    }

    await teacher.destroy();
    res.status(200).json({ message: "معلم موفقانه حذف شد" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting teacher', error });
  }
};


exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await teacher_model.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 🟢 Helper function to delete old file
    const deleteOldFile = (fileName) => {
      if (!fileName) return;
      const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    // 🟢 Handle agreement file update
    if (req.files?.agreementFile?.[0]) {
      deleteOldFile(teacher.agreement);
      teacher.agreement = req.files.agreementFile[0].filename;
    }

    // 🟢 Handle diploma letter update
    if (req.files?.diplomaFile?.[0]) {
      deleteOldFile(teacher.diplomaLetter);
      teacher.diplomaLetter = req.files.diplomaFile[0].filename;
    }

    // 🟢 Handle ID card letter update
    if (req.files?.idCardFile?.[0]) {
      deleteOldFile(teacher.idCardLetter);
      teacher.idCardLetter = req.files.idCardFile[0].filename;
    }

    // 🟡 Update all text fields
    Object.assign(teacher, req.body);

    await teacher.save();

    res.status(200).json({
      message: "Teacher updated successfully",
      teacher,
    });

  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      message: "Error updating teacher",
      error: error.message,
    });
  }
};



exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Teacher ID:", req.params.id); // ✅ debug

    const getone = await teacher_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding Teacher', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await teacher_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
