const Catagory = require('../models/catagory.model');
const Catagory_model = require('../models/catagory.model');
const Catagory_routes = require('../routes/catagory.routes');
const { Op, fn, col, where } = require('sequelize');


exports.findAll = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let name = req.query.name; // filter parameter

        let options = {};

        // Add filter if classlevel is provided
        if (name) {
            options.where = { name: name };
        }


        // Pagination case
        if (!isNaN(page) && !isNaN(limit)) {
            const offset = (page - 1) * limit;
            const { count, rows } = await Catagory_model.findAndCountAll({
                ...options,
                limit,
                offset
            });

            return res.json({
                status: 'success',
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                data: rows
            });
        }

        // No pagination → return all
        const data = await Catagory_model.findAll(options);
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
      name,
    } = req.body;

    const newSubject = await Catagory_model.create({
      name,
    });

    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error creating Class:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating Catagory', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await Catagory_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "کتگوری موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Catagory not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting Catagory', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await Catagory_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedCatagory = await Catagory_model.findByPk(req.params.id);
            return res.status(200).json(updatedCatagory);
        }
        res.status(404).json({message: 'Catagory not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating CAtagory', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested Catagory ID:", req.params.id); // ✅ debug

    const getone = await Catagory_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'catagory not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding catagory', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Catagory_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
