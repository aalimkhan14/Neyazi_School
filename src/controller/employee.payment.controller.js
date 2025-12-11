const employee_payment_model = require('../models/employees.payment.model');
const employee_payment_routes = require('../routes/employee.payment.routes');
const { Op } = require("sequelize");


exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "name";

    const whereClause = {};
    if (search && (filterBy === "epid" || filterBy === "name")) {
      whereClause[filterBy] = {
        [Op.like]: `${search}%`
      };
    }

    const { count, rows } = await employee_payment_model.findAndCountAll({
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
    console.error("Error fetching Employee payment data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      epid,
      month,
      name,
      payablea,
      payeda,
      r_p,
    } = req.body;

    const newEmployeePayment = await employee_payment_model.create({
      epid,
      month,
      name,
      payablea,
      payeda,
      r_p,
    });

    res.status(201).json(newEmployeePayment);
  } catch (error) {
    console.error("Error creating employee payment:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating employee payment', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await employee_payment_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "معاش کارمند موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Employee payment not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting employee payment', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await employee_payment_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedEmployeePayment = await employee_payment_model.findByPk(req.params.id);
            return res.status(200).json(updatedEmployeePayment);
        }
        res.status(404).json({message: 'employee payment not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating employee payment', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Employee ID:", req.params.id); // ✅ debug

    const getone = await employee_payment_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Employee payment not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding Employee payment', error });
  }
};