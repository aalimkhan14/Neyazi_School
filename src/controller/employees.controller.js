const employee_model = require('../models/employees.model');
const employee_routes = require('../routes/employee.routes');
const { Op } = require("sequelize");


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

    const { count, rows } = await employee_model.findAndCountAll({
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
    console.error("Error fetching Employee data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      name,
      lname,
      fname,
      gfname,
      birth,
      idcard,
      phone,
      address,
      job,
      salary,
    } = req.body;

    const newEmployee = await employee_model.create({
      name,
      lname,
      fname,
      gfname,
      birth,
      idcard,
      phone,
      address,
      job,
      salary,
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await employee_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "کارمند موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Employee not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting Employee', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await employee_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedEmployee = await employee_model.findByPk(req.params.id);
            return res.status(200).json(updatedEmployee);
        }
        res.status(404).json({message: 'Employee not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating Employee', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Employee ID:", req.params.id); // ✅ debug

    const getone = await employee_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding Employee', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await employee_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};