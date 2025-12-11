const subject_model = require('../models/subject.registration.model');
const subject_routes = require('../routes/subject.registration.routes');
const { Op, fn, col, where } = require('sequelize');


exports.findAll = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let classlevel = req.query.classlevel; // filter parameter

        let options = {};

        // Add filter if classlevel is provided
        if (classlevel) {
            options.where = { classselection: classlevel };
        }


        // Pagination case
        if (!isNaN(page) && !isNaN(limit)) {
            const offset = (page - 1) * limit;
            const { count, rows } = await subject_model.findAndCountAll({
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
        const data = await subject_model.findAll(options);
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
      catagory,
      classselection,
    } = req.body;

    const newSubject = await subject_model.create({
      name,
      catagory,
      classselection,
    });

    res.status(201).json(newSubject);
  } catch (error) {
    console.error("Error creating Class:", error);  // 👈 log real error
    res.status(500).json({ message: 'Error creating Class', error: error.message });
  }
};


exports.delete = async (req, res)=>{
    try {
        const deleted = await subject_model.destroy({
            where: {id: req.params.id}
        });
        if (deleted) {
            return res.status(200).json({ message: "مضمون موفقانه حذف شد" });
        }
        res.status(404).json({message: 'Subject not found'})
    } catch (error) {
        res.status(500).json({message: 'Error deleting subject', error})
    }
}

exports.update = async (req, res)=>{
    try {
        const[updated] = await subject_model.update(req.body,{
            where: {id:req.params.id}
        });
        if(updated){
            const updatedSubject = await subject_model.findByPk(req.params.id);
            return res.status(200).json(updatedSubject);
        }
        res.status(404).json({message: 'subject not found'});
    } catch (error) {
        res.status(500).json({message: 'Error updating subject', error})
    }
}

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested class ID:", req.params.id); // ✅ debug

    const getone = await subject_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'subject not found' });
    }
    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding subject', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await subject_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
