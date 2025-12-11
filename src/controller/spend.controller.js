const spend_model = require('../models/spend.model');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";

    // ✅ Only search by driver
    const whereClause = {};
    if (search) {
      whereClause.details = {
        [Op.like]: `${search}%`   // contains search anywhere
      };
    }

    const { count, rows } = await spend_model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({
      data: rows,
      total: count
    });
  } catch (err) {
    console.error("Error fetching spend data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    const { 
        details,
        quantity,
        price,
    } = req.body;

    const newSpend = await spend_model.create({
        details,
        quantity,
        price,
    });

    res.status(201).json(newSpend);
  } catch (error) {
    console.error("Error creating spend:", error);
    res.status(500).json({ message: 'Error creating spend', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await spend_model.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: "مصرف موفقانه حذف شد" });
    }
    res.status(404).json({ message: 'spend not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting spend', error });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await spend_model.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSpend = await spend_model.findByPk(req.params.id);
      return res.status(200).json(updatedSpend);
    }
    res.status(404).json({ message: 'Spend not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating spend', error });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const getone = await spend_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'spend not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding transport', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await spend_model.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
