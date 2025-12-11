const class_model = require('../models/class.registration.model');
const class_routes = require('../routes/class.registration.routes');
const { Op, fn, col, where } = require('sequelize');


exports.findAll = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        // If page & limit are provided → Pagination mode
        if (!isNaN(page) && !isNaN(limit)) {
            const offset = (page - 1) * limit;

            // Get total + rows for current page
            const { count, rows } = await class_model.findAndCountAll({
                limit,
                offset
            });

            return res.json({
                status: 'success',
                total: count,                     // total number of classes in DB
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                data: rows
            });
        }

        // If no page & limit → return all data
        const data = await class_model.findAll();
        res.json({
            status: 'success',
            total: data.length,
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Server error'
        });
    }
};



exports.create = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);  // 👈 check what is received

    const {
      classlevel,
      classmodify,
      classtime,
      order_no,
    } = req.body;

    const newClass = await class_model.create({
      classlevel,
      classmodify,
      classtime,
      order_no,
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating Class:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating Class', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await class_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "صنف موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Class not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting class', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await class_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedClass = await class_model.findByPk(req.params.id);
            return res.status(200).json(updatedClass);
        }
        res.status(404).json({message: 'class not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating class', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested class ID:", req.params.id); // ✅ debug

    const getone = await class_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'class not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding class', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await class_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
