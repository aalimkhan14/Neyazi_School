const { Op } = require("sequelize");
const student_model = require("../models/students.model");
const teacher_model = require("../models/teachers.model");
const employee_model = require("../models/employees.model");

// ---- Student Search ----
const searchStudents = async (req, res) => {
  try {
    const search = req.query.name?.trim() || "";
    console.log("Searching students for:", search);

    const students = await student_model.findAll({
      where: { name: { [Op.like]: `${search}%` } },
      attributes: ["id", "name", "fname"] // now includes father's name
    });

    res.json({ success: true, data: students });
  } catch (err) {
    console.error("Student search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ---- Teacher Search ----
const searchTeachers = async (req, res) => {
  try {
    const search = req.query.name?.trim() || "";
    console.log("Searching teachers for:", search);

    const teachers = await teacher_model.findAll({
      where: { name: { [Op.like]: `${search}%` } },
      attributes: ["id", "name", "lname"]
    });

    res.json({ success: true, data: teachers });
  } catch (err) {
    console.error("Teacher search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---- Employee Search ----
const searchEmployees = async (req, res) => {
  try {
    const search = req.query.name?.trim() || "";
    console.log("Searching employees for:", search);

    const employees = await employee_model.findAll({
      where: { name: { [Op.like]: `${search}%` } },
      attributes: ["id", "name", "lname"]
    });

    res.json({ success: true, data: employees });
  } catch (err) {
    console.error("Employee search error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  searchStudents,
  searchTeachers,
  searchEmployees
};
