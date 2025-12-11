const timeTable_model = require('../models/timeTable.model');
const timeTable_routes = require('../routes/timeTable.routes');
const { Op, fn, col, where } = require('sequelize');


exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "name";

    // 🔹 Build where conditions
    const whereClause = {};

    // ✅ Search logic (if needed)
    if (search && (filterBy === "id" || filterBy === "name")) {
      whereClause[filterBy] = {
        [Op.like]: `${search}%`
      };
    }

    // ✅ Filtering logic (all act like checkboxes with AND condition)
    if (req.query.day) {
      whereClause.day = req.query.day;
    }
    if (req.query.lessonOrder) {
      whereClause.lessonOrder = req.query.lessonOrder;
    }
    if (req.query.classe) {
      whereClause.classe = req.query.classe;
    }

    const { count, rows } = await timeTable_model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({
      data: rows,      // ✅ matches frontend forEach
      total: count     // ✅ used for pagination
    });

  } catch (err) {
    console.error("Error fetching timeTable data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      day,
      lessonOrder,
      classe,
      subjectkind,
      subject,
      teacher,
      startTime,
      endTime,
    } = req.body;

    const newtimeTable = await timeTable_model.create({
      day,
      lessonOrder,
      classe,
      subjectkind,
      subject,
      teacher,
      startTime,
      endTime,
    });

    res.status(201).json(newtimeTable);
  } catch (error) {
    console.error("Error creating timeTable:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating timeTable', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await timeTable_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "تقسیم اوقات موفقانه حذف شد" });
        }
        res.status(404).json({message: 'timeTable not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting timeTable', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await timeTable_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedtimeTable = await timeTable_model.findByPk(req.params.id);
            return res.status(200).json(updatedtimeTable);
        }
        res.status(404).json({message: 'timeTable not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating timeTable', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested timeTable ID:", req.params.id); // ✅ debug

    const getone = await timeTable_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'timeTable not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding class owner', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await timeTable_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
