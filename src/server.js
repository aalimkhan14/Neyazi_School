require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');

// Models
const Student_model = require('./models/students.model');
const fee_model = require('./models/fee.model');
const Teacher_model = require('./models/teachers.model');
const Teacher_payment_model = require('./models/teachers.payment.model')
const Employee_model = require('./models/employees.model');
const Employee_payment_model = require('./models/employees.payment.model');
const Class_Registration_model = require('./models/class.registration.model');
const Class_Owner_model = require('./models/class_owner.model');
const Subject_Registration_model = require('./models/subject.registration.model');
const Time_Table_model = require('./models/timeTable.model');
const Transport_model = require('./models/transport.model');
const Spend_registration = require('./models/spend.model');
const Storage_registration_model = require('./models/storage.registration.model');
const Catagory_model = require('./models/catagory.model');
const Sell_model = require('./models/sell_model');
const upgradeClass_model = require('./models/upgradeClass.model');
const user_model = require('./models/user.model');


// Routes
const Student_routes = require('./routes/student.routes');
const Fee_routes = require('./routes/fee.routes');
const Teacher_routes = require('./routes/teacher.routes');
const Teacher_payment_routes = require('./routes/teacher.payment.routes');
const Employee_routes = require('./routes/employee.routes');
const Employee_payment_routes = require('./routes/employee.payment.routes');
const Class_Registration_routes = require('./routes/class.registration.routes');
const class_owner_routes = require('./routes/class.owner.route')
const Subject_Registration_routes = require('./routes/subject.registration.routes');
const Time_Table_routes = require('./routes/timeTable.routes');
const Transport_routes = require('./routes/transport.routes');
const Spend_registration_routes = require('./routes/spend.routes');
const Storage_registration_routes = require('./routes/storage.routes');
const Catagory_routes = require('./routes/catagory.routes'); 
const Sell_routes = require('./routes/sell.routes');
const Report_routes = require('./routes/report.routes');
const Teacher_report_routes = require('./routes/teacher.report.route');
const Employee_report_routes = require('./routes/employee.report.route');
const searchRoutes = require("./routes/meanSearch.routes");
const upgradeClass_routes = require('./routes/upgradeClass.routes');
const user_routes = require('./routes/user.route');
const user_login = require('./routes/normaluser.route');

const path = require('path');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use Routes
app.use('/students', Student_routes);
app.use('/fees', Fee_routes);
app.use('/teachers', Teacher_routes);
app.use('/teachers_payment', Teacher_payment_routes);
app.use('/employees', Employee_routes);
app.use('/employees_payment', Employee_payment_routes);
app.use('/classes', Class_Registration_routes);
app.use('/classOwner', class_owner_routes);
app.use('/subject', Subject_Registration_routes);
app.use('/time_table', Time_Table_routes);
app.use('/transport', Transport_routes);
app.use('/spend', Spend_registration_routes);
app.use('/storage',Storage_registration_routes)
app.use('/catagory', Catagory_routes);
app.use('/sell', Sell_routes);
app.use('/report', Report_routes);
app.use('/teacher_report', Teacher_report_routes);
app.use('/employee_report', Employee_report_routes);
app.use("/meanSearch", searchRoutes);
app.use('/upgradeClass',upgradeClass_routes);
app.use('/auser', user_routes);
app.use('/userLogin', user_login);





// define static address to access
app.use(express.static(path.join(__dirname,'..','public')));
// define the uploads foloder to save the data
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// when it need to be customized some tables
sequelize.sync({ alter: true }) 
  .then(() => console.log("Synced!"))
  .catch(err => console.log("Error syncing DB:", err));

// Start point of project in web
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
});

// Running the server on specified port
app.listen(3000, async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        await Student_model.sync();
    } catch (error) {
        console.log('Failed to connect to database: ',error);
    }
    console.log(`Server is running on http://localhost:3000`);
})
