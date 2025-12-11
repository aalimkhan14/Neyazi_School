const Sell_model = require('../models/sell_model');
const { Op } = require('sequelize');
const jalaali = require("jalaali-js");

exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "customer"; // field to search in (default: customer)
    const category = req.query.category || "";          // exact category match

    // Build where clause
    const whereClause = {};

    // ✅ Search in selected field (customer or goods)
    if (search) {
      if (filterBy === "goods" || filterBy === "customer") {
        whereClause[filterBy] = { [Op.like]: `%${search}%` };
      }
    }

    // ✅ Filter by category
    if (category) {
      whereClause.catagory = category; // exact match
    }

    const { count, rows } = await Sell_model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({
      data: rows,
      total: count,
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
        customer,
        catagory,
        goods,
        price,
        quantity,
    } = req.body;

    const newSell = await Sell_model.create({
        customer,
        catagory,
        goods,
        price,
        quantity,
    });

    res.status(201).json(newSell);
  } catch (error) {
    console.error("Error creating storage:", error);
    res.status(500).json({ message: 'Error creating storage', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Sell_model.destroy({
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
    const [updated] = await Sell_model.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSell = await Sell_model.findByPk(req.params.id);
      return res.status(200).json(updatedSell);
    }
    res.status(404).json({ message: 'storage not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating storage', error });
  }
};

exports.findByPk = async (req, res) => {
  try {
    const getone = await Sell_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'storage not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error finding storage', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Sell_model.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// 📌 Get sales data based on time (today, this week, this month)
exports.findByDate = async (req, res) => {
  try {
    const dateFilter = req.query.date || ""; // today | week | month | year
    if (!dateFilter) {
      return res.status(400).json({ error: "Please provide a date filter" });
    }

    const now = new Date();
    const jNow = jalaali.toJalaali(now); // ← convert current date to Jalali
    let startDate, endDate;

    if (dateFilter === "today") {
      const g = jalaali.toGregorian(jNow.jy, jNow.jm, jNow.jd);
      startDate = new Date(g.gy, g.gm - 1, g.gd, 0, 0, 0, 0);
      endDate = new Date(g.gy, g.gm - 1, g.gd, 23, 59, 59, 999);

    } else if (dateFilter === "month") {
      const gStart = jalaali.toGregorian(jNow.jy, jNow.jm, 1);
      const monthLen = jalaali.jalaaliMonthLength(jNow.jy, jNow.jm);
      const gEnd = jalaali.toGregorian(jNow.jy, jNow.jm, monthLen);

      startDate = new Date(gStart.gy, gStart.gm - 1, gStart.gd, 0, 0, 0, 0);
      endDate = new Date(gEnd.gy, gEnd.gm - 1, gEnd.gd, 23, 59, 59, 999);

    } else if (dateFilter === "year") {
      const gStart = jalaali.toGregorian(jNow.jy, 1, 1);
      const gEnd = jalaali.toGregorian(jNow.jy, 12, jalaali.jalaaliMonthLength(jNow.jy, 12));

      startDate = new Date(gStart.gy, gStart.gm - 1, gStart.gd, 0, 0, 0, 0);
      endDate = new Date(gEnd.gy, gEnd.gm - 1, gEnd.gd, 23, 59, 59, 999);

    } else if (dateFilter === "week") {
      // Jalali week: Saturday to Friday
      let dayOfWeek = now.getDay(); // Gregorian 0=Sun … 6=Sat
      const startJ = jalaali.toJalaali(new Date(now.setDate(now.getDate() - ((dayOfWeek + 1) % 7))));
      const endJ = jNow;

      const gStart = jalaali.toGregorian(startJ.jy, startJ.jm, startJ.jd);
      const gEnd = jalaali.toGregorian(endJ.jy, endJ.jm, endJ.jd);

      startDate = new Date(gStart.gy, gStart.gm - 1, gStart.gd, 0, 0, 0, 0);
      endDate = new Date(gEnd.gy, gEnd.gm - 1, gEnd.gd, 23, 59, 59, 999);

    } else {
      return res.status(400).json({ error: "Invalid filter (use today, week, month, year)" });
    }

    const data = await Sell_model.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      order: [["id", "DESC"]],
    });

    res.json({ filter: dateFilter, total: data.length, data });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
