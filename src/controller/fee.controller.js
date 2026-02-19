const fee_model = require('../models/fee.model');
const { Op } = require("sequelize");

// ✅ Get all fees with pagination & search
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "name";

    const whereClause = {};
    if (search && (filterBy === "sid" || filterBy === "name")) {
      whereClause[filterBy] = { [Op.like]: `${search}%` };
    }

    const { count, rows } = await fee_model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({ data: rows, total: count });
  } catch (err) {
    console.error("Error fetching fee data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create fee(s) with duplicate check
exports.create = async (req, res) => {
  try {
    const {
      sid,
      name,
      fname,
      fclass,
      f_payable,
      f_payed,
      t_payable,
      t_payed,
      r_f,
      r_t,
      comment,
      academicYear,
      months // array of selected months
    } = req.body;

    if (!Array.isArray(months) || months.length === 0) {
      return res.status(400).json({ message: 'No months selected.' });
    }

    const createdRecords = [];
    const duplicateMonths = [];

    for (const month of months) {
      const existingFee = await fee_model.findOne({
        where: { sid, month, academicYear }
      });

      if (existingFee) {
        duplicateMonths.push(month);
        continue;
      }

      const newFee = await fee_model.create({
        sid, name, fname, fclass, month,
        f_payable, f_payed, t_payable, t_payed,
        r_f, r_t, comment, academicYear
      });

      createdRecords.push(newFee);
    }

    res.status(201).json({
      message: 'Fee processing completed.',
      created: createdRecords,
      duplicates: duplicateMonths
    });

  } catch (error) {
    console.error("Error creating fee:", error);
    res.status(500).json({ message: 'Error creating fee', error: error.message });
  }
};

// ✅ Update fee with duplicate check
exports.update = async (req, res) => {
  try {
    const { sid, month, academicYear } = req.body;

    // 🔍 Check duplicate (exclude current record)
    const existingFee = await fee_model.findOne({
      where: {
        sid,
        month,
        academicYear,
        id: { [Op.ne]: req.params.id }
      }
    });

    if (existingFee) {
      return res.status(400).json({
        message: "Duplicate fee record for this student, month and academic year"
      });
    }

    const [updated] = await fee_model.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated) {
      const updatedFee = await fee_model.findByPk(req.params.id);
      return res.status(200).json(updatedFee);
    }

    res.status(404).json({ message: 'Fee not found' });
  } catch (error) {
    console.error("Error updating fee:", error);
    res.status(500).json({ message: 'Error updating fee', error });
  }
};

// ✅ Delete fee
exports.delete = async (req, res) => {
  try {
    const deleted = await fee_model.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: "فیس ثبت شده موفقانه حذف شد" });
    }
    res.status(404).json({ message: 'Fee not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Fee', error });
  }
};

// ✅ Find by PK
exports.findByPk = async (req, res) => {
  try {
    const getone = await fee_model.findByPk(req.params.id);
    if (!getone) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding fee', error });
  }
};

// ✅ Find by student ID
exports.findBySid = async (req, res) => {
  try {
    const { sid } = req.params;
    const studentFees = await fee_model.findAll({ where: { sid } });

    if (!studentFees || studentFees.length === 0) {
      return res.status(404).json({ status: 'error', message: 'دانش‌آموز یافت نشد' });
    }

    res.json({ status: 'success', data: studentFees });
  } catch (err) {
    console.error('Error in findBySid:', err);
    res.status(500).json({ status: 'error', message: 'خطای سرور هنگام دریافت معلومات', error: err.message });
  }
};

// ✅ Find fees by date (today/week/month/year)
exports.findByDate = async (req, res) => {
  try {
    const dateFilter = req.query.date || "";
    if (!dateFilter) return res.status(400).json({ error: "Please provide a date filter (today, week, month, year)" });

    const now = new Date();
    let startDate, endDate;

    if (dateFilter === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (dateFilter === "week") {
      const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
      startDate = new Date(firstDay.setHours(0, 0, 0, 0));
      endDate = new Date();
    } else if (dateFilter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (dateFilter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
      return res.status(400).json({ error: "Invalid date filter. Use today, week, month, or year" });
    }

    const data = await fee_model.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      order: [["id", "DESC"]],
    });

    res.json({ filter: dateFilter, total: data.length, data });

  } catch (error) {
    console.error("Error fetching fees by date:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
