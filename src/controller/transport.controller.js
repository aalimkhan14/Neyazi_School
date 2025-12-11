const transport_model = require('../models/transport.model');
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
      whereClause.driver = {
        [Op.like]: `${search}%`   // contains search anywhere
      };
    }

    const { count, rows } = await transport_model.findAndCountAll({
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
    console.error("Error fetching transport data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    const { name, plate, company, driver } = req.body;

    const newTransport = await transport_model.create({
      name,
      plate,
      company,
      driver,
    });

    res.status(201).json(newTransport);
  } catch (error) {
    console.error("Error creating transport:", error);
    res.status(500).json({ message: 'Error creating transport', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await transport_model.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: "ترانسپورت موفقانه حذف شد" });
    }
    res.status(404).json({ message: 'Transport not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transport', error });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await transport_model.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTransport = await transport_model.findByPk(req.params.id);
      return res.status(200).json(updatedTransport);
    }
    res.status(404).json({ message: 'Transport not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transport', error });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const getone = await transport_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding transport', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await transport_model.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
