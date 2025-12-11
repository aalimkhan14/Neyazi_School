const teacher_payment_model = require('../models/teachers.payment.model');
const teacher_payment_routes = require('../routes/teacher.payment.routes');
const { Op } = require("sequelize");


exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const filterBy = req.query.filterBy || "name";

    const whereClause = {};
    if (search && (filterBy === "tpid" || filterBy === "name")) {
      whereClause[filterBy] = {
        [Op.like]: `${search}%`
      };
    }

    const { count, rows } = await teacher_payment_model.findAndCountAll({
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
    console.error("Error fetching Teacher payment data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      tpid,
      month,
      name,
      payablea,
      payeda,
      r_p,
    } = req.body;

    const newTeacherPayment = await teacher_payment_model.create({
      tpid,
      month,
      name,
      payablea,
      payeda,
      r_p,
    });

    res.status(201).json(newTeacherPayment);
  } catch (error) {
    console.error("Error creating teacher payment:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating teacher payment', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await teacher_payment_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "معاش معلم موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Teacher payment not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting Teacher payment', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await teacher_payment_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedTeacherPayment = await teacher_payment_model.findByPk(req.params.id);
            return res.status(200).json(updatedTeacherPayment);
        }
        res.status(404).json({message: 'Teacher payment not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating Teacher payment', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Teacher ID:", req.params.id); // ✅ debug

    const getone = await teacher_payment_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Teacher payment not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding Teacher payment', error });
  }
};