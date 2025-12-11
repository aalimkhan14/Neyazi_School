const class_owner_model = require('../models/class_owner.model');
const class_owner_routes = require('../routes/class.owner.route');
const { Op, fn, col, where } = require('sequelize');


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

    const { count, rows } = await class_owner_model.findAndCountAll({
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
    console.error("Error fetching class owner data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      teacher,
      classe
    } = req.body;

    const newClass = await class_owner_model.create({
      teacher,
      classe
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating Class owner:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating Class', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await class_owner_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "نگران موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Class not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting class', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await class_owner_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedClassOwner = await class_owner_model.findByPk(req.params.id);
            return res.status(200).json(updatedClassOwner);
        }
        res.status(404).json({message: 'class owner not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating class owner', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested class owenr ID:", req.params.id); // ✅ debug

    const getone = await class_owner_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'class owner not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding class owner', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await class_owner_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
