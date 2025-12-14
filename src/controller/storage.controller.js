const Storage_model = require('../models/storage.registration.model');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || ""; // category filter

    // Build where clause
    const whereClause = {};

    // ✅ Search by name (fuzzy)
    if (search) {
      whereClause.name = { [Op.like]: `${search}%` };
    }

    // ✅ Filter by category
    if (filterBy) {
      whereClause.catagory = filterBy; // exact match like timetable
    }

    const { count, rows } = await Storage_model.findAndCountAll({
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
    console.error("❌ Error fetching storage data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {

  console.log("Incoming body:", req.body);
  try {
    const { 
        catagory,
        name,
        quantity,
        buyamount,
        sellamount,
        barcode,
    } = req.body;

    const newSpend = await Storage_model.create({
        catagory,
        name,
        quantity,
        buyamount,
        sellamount,
        barcode,
    });

    res.status(201).json(newSpend);
  } catch (error) {
    console.error("Error creating storage:", error);
    res.status(500).json({ message: 'Error creating storage', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Storage_model.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: "جنس موفقانه حذف شد" });
    }
    res.status(404).json({ message: 'spend not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting storage', error });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Storage_model.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedStorage = await Storage_model.findByPk(req.params.id);
      return res.status(200).json(updatedStorage);
    }
    res.status(404).json({ message: 'storage not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating storage', error });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const getone = await Storage_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'storage not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding storage', error });
  }
};
exports.findByBarcode = async (req, res) => {
  try {
    const getone = await Storage_model.findByPk(req.params.barcode);

    if (!getone) {
      return res.status(404).json({ message: 'product not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding storage', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Storage_model.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
