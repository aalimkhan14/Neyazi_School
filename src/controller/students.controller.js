const { Op } = require('sequelize');
const Student_model = require('../models/students.model');
const router = require('../routes/student.routes');
const fs = require('fs');
const path = require('path');


exports.findAll = async (req, res) => {
  const { search = '', filterBy = 'name', classFilter = '' } = req.query;

  try {
    const whereClause = {};

    // Search by name, phone, baseno, etc.
    if (search && filterBy) {
      whereClause[filterBy] = { [Op.like]: `${search}%` };
    }

    // Filter by class
    if (classFilter) {
      whereClause.current_class = classFilter;
    }

    const students = await Student_model.findAll({ where: whereClause });

    res.json({ data: students });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: error.message });
  }
};




exports.create = async (req, res) => {
  try {
    const {
      name,
      last_name,
      fname,
      gfname,
      baseno,
      birth,
      gender,
      idcard_no,
      native_language,
      mean_location,
      current_location,
      phone1,
      phone2,
      relatives,
      relatives_name,
      current_class,
      entry_way,
      yearly_fee,
      transport_fee,
      q_o_month,
      free,
      attachment2,
      attachment3,
    } = req.body;

    // Get uploaded files (if any)
    const picture = req.files?.picture?.[0]?.filename || 'default.png';
    const attachment = req.files?.attachment?.[0]?.filename || null;
    const attachment2File = req.files?.attachment2?.[0]?.filename || attachment2 || null;
    const attachment3File = req.files?.attachment3?.[0]?.filename || attachment3 || null;

    // 1️⃣ Create the student
    const student = await Student_model.create({
      name,
      last_name,
      fname,
      gfname,
      baseno,
      birth,
      gender,
      idcard_no,
      native_language,
      mean_location,
      current_location,
      phone1,
      phone2,
      relatives,
      relatives_name,
      picture,
      current_class,
      entry_way,
      attachment,
      yearly_fee,
      transport_fee,
      q_o_month,
      free,
      attachment2: attachment2File,
      attachment3: attachment3File,
    });

    res.status(201).json(student); // return full student info
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create student" });
  }
};

exports.deleteStudent = async (req,res)=>{
  try {
    const id = req.params.id;
    const student = await Student_model.findByPk(id);
    if(!student){
      return res.status(404).json('متعلم به این نام پیدا نشد');
    }
    const {picture, attachment} = student;

    if(picture && picture !== 'default.png'){
      const picturePath = path.join(__dirname,'..','..','uploads',picture);
      console.log('deleting picture at: ', picturePath)
      if(fs.existsSync(picturePath)){
        fs.unlinkSync(picturePath);
        console.log('picture deleted')
      }else{
        console.log('picture file not found')
      }
    }

    if(attachment){
      const attachmentPath = path.join(__dirname,'..','..','uploads',attachment);

      console.log('deleting attachment at: ', attachmentPath);

      if(fs.existsSync(attachmentPath)){
        fs.unlinkSync(attachmentPath);
        console.log('attachment deleted')
      }else{
        console.log('attachment file not found')
      }
    }

    const deleted = await Student_model.destroy({where:{id}});
    if(deleted === 0){
      return res.status(404).json({message: "متعلم پیدا نشد"})
    }
    res.status(200).json({message: 'متعلم موفقانه حذف شد'});
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

// put data
exports.updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      last_name,
      fname,
      gfname,
      baseno,
      birth,
      gender,
      idcard_no,
      native_language,
      mean_location,
      current_location,
      phone1,
      phone2,
      relatives,
      relatives_name,
      current_class,
      entry_way,
      yearly_fee,
      transport_fee,
      q_o_month,
      free,
      attachment2,
      attachment3,
    } = req.body;

    const student = await Student_model.findByPk(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Handle picture update if a new file uploaded
    if (req.files && req.files.picture && req.files.picture[0]) {
      if (student.picture && student.picture !== 'default.png') {
        const oldPicPath = path.join(__dirname, '..', '..', 'uploads', student.picture);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      student.picture = req.files.picture[0].filename; // note: use req.files.picture[0], not req.file
    }

    // Handle attachment update if new file uploaded
    if (req.files && req.files.attachment && req.files.attachment[0]) {
      if (student.attachment) {
        const oldAttachmentPath = path.join(__dirname, '..', '..', 'uploads', student.attachment);
        if (fs.existsSync(oldAttachmentPath)) {
          fs.unlinkSync(oldAttachmentPath);
        }
      }
      student.attachment = req.files.attachment[0].filename;
    }

    // Handle attachment2 update if new file uploaded
    if (req.files && req.files.attachment2 && req.files.attachment2[0]) {
      if (student.attachment2) {
        const oldAttachment2Path = path.join(__dirname, '..', '..', 'uploads', student.attachment2);
        if (fs.existsSync(oldAttachment2Path)) {
          fs.unlinkSync(oldAttachment2Path);
        }
      }
      student.attachment2 = req.files.attachment2[0].filename;
    }

    // Handle attachment3 update if new file uploaded
    if (req.files && req.files.attachment3 && req.files.attachment3[0]) {
      if (student.attachment3) {
        const oldAttachment3Path = path.join(__dirname, '..', '..', 'uploads', student.attachment3);
        if (fs.existsSync(oldAttachment3Path)) {
          fs.unlinkSync(oldAttachment3Path);
        }
      }
      student.attachment3 = req.files.attachment3[0].filename;
    }

    // Update other fields
    student.name = name;
    student.last_name = last_name;
    student.fname = fname;
    student.gfname = gfname;
    student.baseno = baseno;
    student.birth = birth;
    student.gender = gender;
    student.idcard_no = idcard_no;
    student.native_language = native_language;
    student.mean_location = mean_location;
    student.current_location = current_location;
    student.phone1 = phone1;
    student.phone2 = phone2;
    student.relatives = relatives;
    student.relatives_name = relatives_name;
    student.current_class = current_class;
    student.entry_way = entry_way;
    student.yearly_fee = yearly_fee;
    student.transport_fee = transport_fee;
  student.q_o_month = q_o_month;
  // if files were uploaded above, those values are already set; otherwise use body values
  student.attachment2 = student.attachment2 || attachment2;
  student.attachment3 = student.attachment3 || attachment3;

    // Normalize free checkbox value: save 'رایگان' if checked, else empty string
    student.free = free === 'رایگان' ? 'رایگان' : '';

    await student.save();

    res.json({ message: "Student updated", student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.findByPk = async (req, res) => {
  try {
    console.log("Requested student ID:", req.params.id); // ✅ debug

    const getone = await Student_model.findByPk(req.params.id);

    if (!getone) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Optional: handle empty 'free' value
    if (!getone.free || getone.free.trim() === '') {
      getone.free = '';
    }

    res.status(200).json(getone);
  } catch (error) {
    res.status(500).json({ message: 'Error Finding student', error });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Student_model.count(); // Sequelize
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



exports.findAll1 = async (req, res) => {
  const { search = '', filterBy = 'name', classFilter = '' } = req.query;

  try {
    const whereClause = {};
    console.log('its working')
    // Handle search by name, phone, etc.
    if (search && filterBy) {
      whereClause[filterBy] = {
        [Op.like]: `%${search}%` // <- Notice the wildcards
      };
    }

    // Handle class filtering
    if (classFilter) {
      whereClause.current_class = classFilter;
    }

    const students = await Student_model.findAll({ where: whereClause });

    res.json({ data: students });
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: error.message });
  }
};






