const user_model = require('../models/user.model');
const { Op } = require('sequelize');

exports.findAll = async (req, res) => {
  try {
    const users = await user_model.findAll({
      order: [["id", "DESC"]],
    });

    res.json({
      data: users
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
    	username,
		  password,
		  email,
		  role,
		  resetToken, 
		  resetTokenExpiry 
	} = req.body;

    const newTransport = await user_model.create({
      	username,
		password,
		email,
		role,
		resetToken, 
		resetTokenExpiry 
    });

    res.status(201).json(newTransport);
  } catch (error) {
    console.error("Error creating transport:", error);
    res.status(500).json({ message: 'Error creating transport', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await user_model.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: " موفقانه حذف شد" });
    }
    res.status(404).json({ message: 'Transport not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transport', error });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await user_model.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedModel = await user_model.findByPk(req.params.id);
      return res.status(200).json(updatedModel);
    }
    res.status(404).json({ message: 'Transport not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transport', error });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const getone = await user_model.findByPk(req.params.id);

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
    const count = await user_model.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
