const upgradeClass_model = require('../models/upgradeClass.model');
const { Op } = require('sequelize');

// ---------------------- Find All ----------------------
exports.findAll = async (req, res) => {
  try {
    const { page, limit, classs, name, academicYear } = req.query;
    const whereCondition = {};

    if (academicYear && academicYear !== 'all') whereCondition.academicYear = parseInt(academicYear);
    if (classs && classs.trim() !== '') whereCondition.classs = classs.trim();
    if (name && name.trim() !== '') whereCondition.name = { [Op.like]: `${name.trim()}%` };

    if (page && limit) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { count, rows } = await upgradeClass_model.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset
      });

      return res.json({
        status: 'success',
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        data: rows
      });
    }

    const data = await upgradeClass_model.findAll({ where: whereCondition });
    res.json({ status: 'success', total: data.length, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error', error: err.message });
  }
};

// ---------------------- Find by Primary Key ----------------------
exports.findBySid = async (req, res) => {
  try {
    const { sid } = req.params;
    const student = await upgradeClass_model.findOne({ where: { sid } });

    if (!student) {
      return res.status(404).json({ status: 'error', message: 'دانش‌آموز یافت نشد' });
    }

    res.json({ status: 'success', data: student });
  } catch (err) {
    console.error('Error in findBySid:', err);
    res.status(500).json({ status: 'error', message: 'خطای سرور هنگام دریافت معلومات', error: err.message });
  }
};


// ---------------------- Create ----------------------
exports.create = async (req, res) => {
  try {
    const data = Array.isArray(req.body.data) ? req.body.data : [];
    if (data.length === 0) {
      return res.status(400).json({ status: 'error', message: 'هیچ معلوماتی برای ارتقا ارسال نشده است' });
    }

    // normalize incoming payload: accept either `classs` or `toClass`
    const students = data.map((student) => ({
      sid: student.sid,
      name: student.name,
      fname: student.fname,
      fee: student.fee,
      classs: (student.classs && String(student.classs).trim()) || (student.toClass && String(student.toClass).trim()) || null,
      academicYear: student.academicYear ? parseInt(student.academicYear) : null,
      q_o_month: student.q_o_month || null,
    }));

    // Validate required fields before attempting bulkCreate to get clearer errors
    const missingClassRecords = students.filter((s) => !s.classs);
    if (missingClassRecords.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'یک یا چند رکورد فاقد صنف هدف است (classs / toClass).',
        missing: missingClassRecords.map((r) => ({ sid: r.sid, name: r.name })),
      });
    }

    const created = await upgradeClass_model.bulkCreate(students, { validate: true });
    res.status(201).json({
      status: 'success',
      message: `${created.length} متعلم(ها) موفقانه ارتقا شدند`,
      data: created,
    });
  } catch (err) {
    console.error("Error in /upgradeClass POST:", err);
    res.status(500).json({ status: 'error', message: 'خطا هنگام ارتقا دانش‌آموزان', error: err.message });
  }
};

// ---------------------- Delete ----------------------
exports.delete = async (req, res) => {
  try {
    const deleted = await upgradeClass_model.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
