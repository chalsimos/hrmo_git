const firebase = require("firebase/app");
require("firebase/firestore");
const mongoose = require('mongoose');

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs,updateDoc, doc, } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA1-QuakN6Q32dWIzkBPzG8SEWhLIltICU",
  authDomain: "minsu-d6ae4.firebaseapp.com",
  projectId: "minsu-d6ae4",
  storageBucket: "minsu-d6ae4.firebasestorage.app",
  messagingSenderId: "338350609658",
  appId: "1:338350609658:web:cf2c90c6389f2a5fe62543",
};
const Book = require("../models/Book");
const TModel = require("../models/Time");
const employee = require("../models/Employee");
const signatories = require("../models/signatories");
const salary = require("../models/salary");
const srecord = require("../models/ServiceRecord");
const positionModel = require("../models/positionModel");
const leaveModel = require("../models/leaveModel");
const deduct = require("../models/DeductionModel");
const absentmodel = require("../models/absentModel");
const multer = require("multer");
const csvParser = require("csv-parser");
const locatorModel = require("../models/locatorModel");
const userModel = require("../models/User");
const payrol = require('../models/PayrolModel');
const devices = require('../models/devices');
const flash = require("connect-flash");
const filedLocator = require('../models/filedLocator');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { log } = require("console");
const { mongo } = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === ".dat" || ext ===".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only .dat files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const months = Array.from({ length: 12 }, (v, i) => {
  const monthNumber = (i + 1).toString().padStart(2, "0");
  const monthName = new Date(2020, i).toLocaleString("default", {
    month: "long",
  });
  return { value: monthNumber, name: monthName };
});

const currentYear = new Date().getFullYear();
const years = [];
for (let year = 2019; year <= currentYear; year++) {
  years.unshift(year);
}
  // Helper function to check for leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
const bookers = {
  
  saveEncoded: async(req, res) =>{
    const { locatorNo, empname, empno, location, purpose, departure, arrival } = req.body;
    const newLocator = new filedLocator({ locatorNo, empname, empno, location, purpose, departure, arrival, status: 'incomplete' });
    try {
      await newLocator.save();
      req.flash("success", "success on filing locator");
    } catch (error) {
      req.flash(
        "error",
        "there was an error on filing leave. pls contact xian ca",
        error
      );
    }
    const referer = req.headers.referer || "/";
    res.redirect(referer);
  },
  findEmployee: async(req, res) =>{
    const query = req.query.query;
    try {
    const employees = await employee.find({
      $or: [
        { fname: { $regex: query, $options: 'i' } },
        { lname: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    const results = employees.map((employee) => ({
      empno: employee.empno,
      name: `${employee.fname} ${employee.lname}`
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
},
locatorValidator: async(req, res) =>{
  try {
    const employeesCollection = collection(db, "locator");
    const employeesSnapshot = await getDocs(employeesCollection);
    const firebaseEmployeeData = employeesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        text: data.text, 
        locatorID: data.locatorID,  
        locationName: data.locationName,
        dateTime: data.dateTime.toDate(), 
      };
    });
    const mongoRecords = await filedLocator.find();
    const mongoRecordLookup = mongoRecords.reduce((acc, record) => {
      acc[record.locatorNo] = record;
      return acc;
    }, {});
    const matchedEmployees = await Promise.all(
      firebaseEmployeeData.map(async (firestoreEmp) => {
        
        const mongoEmp = mongoRecordLookup[firestoreEmp.locatorID];

        if (mongoEmp) {
          
          await filedLocator.updateOne(
            { _id: mongoEmp._id },  
            { $set: { status: 'completed' } }  
          );

          
          return {
            empno: mongoEmp.empno,
            empName: mongoEmp.fname + " " + mongoEmp.lname,
            locatorID: firestoreEmp.locatorID,
            campus: mongoEmp.campus,
            locationName: firestoreEmp.locationName,
            dateTime: firestoreEmp.dateTime.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            }), 
          };
        }

        return null; 
      })
    );

    
    const filteredMatchedEmployees = matchedEmployees.filter(Boolean);

    
    req.flash("success", "success on validating queries from firebase -> migration to mongodb");
    res.redirect('/locator');
  } catch (error) {
    
  }
},
  modify_employee: async (req, res) => {
    const cmp = req.session.user || null;
    const id = req.params.id;
    try {
      const {
        lname,
        fname,
        mname,
        birthdate,
        birthplace,
        cat_type,
        area,
        empno,
        deduction,
        avalue,
        schedule
      } = req.body;
      const campus = cmp.campus;
      const status = "active";
      const updatedEmployee = await employee.findOneAndUpdate(
        { empno: id },
        {
          lname,
          fname,
          mname,
          birthdate,
          birthplace,
          cat_type,
          area,
          empno,
          status,
          campus,
          schedule
        },
        { new: true, runValidators: true }
      );
      if (!updatedEmployee) {
        return res.status(404).send("Employee not found.");
      }
      
      
      
      
      
      
      const updatedDeduction = await deduct.findOneAndUpdate(
        { empno: id, deduction: deduction }, 
        { $set: { avalue: avalue } },        
        { 
          new: true,  
          upsert: false 
        }
      );

if (updatedDeduction) {
  console.log("Deduction updated:", updatedDeduction);
} else {
  console.log("No matching record found to update.");
}


      const referrer = req.headers.referer;
      res.redirect(referrer);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`Duplicate Employee ID: ${req.body.empno} already exists.`);
        res
          .status(400)
          .send(
            "Employee ID already exists. Please use a different Employee ID."
          );
      } else {
        console.log(err);
        res.status(500).send("An error occurred while updating the employee.");
      }
    }
  },
  modifyEmployee: async (req, res) => {
    const user = req.session.user || null;
    const success = req.flash("success");
    const employeeData = await employee.findOne({ empno: req.params.id });
    

    const data = {
      emp: employeeData,
      deductions: await deduct.find({ empno: req.params.id }),
    };

    res.render("hr/modify_employee", {
      data,
      months,
      years,
      user,
      messages: { success },
    });
},

  systemAccounts: async (req, res) => {
    const user = req.session.user || null;

    const data = {
      users: await userModel.find(),
    };

    res.render("hr/users", { data, months, years, user });
  },
  generateLocator: async (req, res) => {
    const campus = req.session.user || null;
    const user = req.session.user || null;
    const quantity = parseInt(req.body.quantity, 10);
    const slipsData = [];

    const data = {
      signatory: await signatories.findOne({ status: "active" }),
    };

    const campusLocator = await locatorModel.findOne({ campus: campus.campus });
    let startingNumber = 1;

    if (campusLocator) {
      startingNumber = campusLocator.count + 1;
      campusLocator.count += quantity;
      await campusLocator.save();
    } else {
      await locatorModel.create({ campus: campus.campus, count: quantity });
      startingNumber = 1;
    }

    for (let i = 0; i < quantity; i++) {
      slipsData.push({
        id: startingNumber + i,
        encodedId: Buffer.from((startingNumber + i).toString()).toString(
          "base64"
        ),
      });
    }

    res.render("hr/locatorPrint", { slipsData, data, user, campus });
  },
  approveLocator: async (req, res) =>{
      const locatorId = req.params.id; 
  try {
    
    const locatorDocRef = doc(db, "locators", locatorId);

    
    await updateDoc(locatorDocRef, {
      status: "approved",
    });

    res.send(`Locator with ID ${locatorId} has been successfully approved.`);
    res.redirect("/olacator");
  } catch (error) {
    console.error("Error updating locator status:", error);
    res.status(500).send("An error occurred while approving the locator.");
  }
  },
olacator: async (req, res) => {
const user = req.session.user || null;
  const campus = req.session.campus || null;
  try {
    const employeesCollection = collection(db, "locators");
    const employeesSnapshot = await getDocs(employeesCollection);

    const firebaseEmployeeData = employeesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id:doc.id,
        user: data.userName,
        locatorID: data.locatorID,
        locationName: data.locationName,
        departure: data.departureTime,
        arrival: data.returnTime,
        purpose: data.reason,
        dateTime: data.date,
        status: data.status,
      };
    });
    
    
    res.render("hr/olocator", {
      months,
      years,
      user,
      campus,
      matchedEmployees: firebaseEmployeeData,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).send("Server error");
  }
},
 locator: async (req, res) => {
  const user = req.session.user || null;
  const campus = req.session.campus || null;
  const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const employeesCollection = collection(db, "locator");
    const employeesSnapshot = await getDocs(employeesCollection);

    const firebaseEmployeeData = employeesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        text: data.text,
        locatorID: data.locatorID,
        locationName: data.locationName,
        dateTime: data.dateTime.toDate(), 
      };
    });

    const mongoRecords = await employee.find();
    
    const matchedEmployees = firebaseEmployeeData
      .map((firestoreEmp) => {
        const mongoEmp = mongoRecords.find(
          (mongoRecord) => mongoRecord.empno === firestoreEmp.text
        );
        return mongoEmp
          ? {
              empno: mongoEmp.empno,
              empName: mongoEmp.fname + " " + mongoEmp.lname,
              locatorID: firestoreEmp.locatorID,
              campus: mongoEmp.campus,
              locationName: firestoreEmp.locationName,
              dateTime: firestoreEmp.dateTime.toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              }), 
            }
          : null;
      })
      .filter(Boolean);
      const stats = 'incomplete';
      const empl = await filedLocator.find({
        createdAt: {
          $gte: startOfDay,  
          $lt: endOfDay      
        },
      status: stats

      });
      const completed = await filedLocator.find({ status: 'completed' });
      
    res.render("hr/locator", {
      months,
      years,
      user,
      campus,
      matchedEmployees,
      empl,
      completed
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).send("Server error");
  }
},

  leaveReport: async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    
    const onleave = await leaveModel.find({
      from: { $gte: startOfMonth.toISOString() },
      to: { $lte: endOfMonth.toISOString() },
    });

    const upcomingLeaves = await leaveModel
      .find({ from: { $gte: currentDate.toISOString() } })
      .sort({ from: 1 });

    const pastLeave = await leaveModel
      .find({ to: { $lt: currentDate.toISOString() } })
      .sort({ to: -1 }); 

    
    const user = req.session.user || null;
    res.render("hr/leave", {
      month: currentMonth + 1,
      year: currentYear,
      onleave,
      months,
      years,
      upcomingLeaves,
      pastLeave,
      user,
    });
  } catch (error) {
    console.error("Error fetching leave data:", error);
    res.status(500).send("An error occurred while fetching leave data.");
  }
},


  fileFeave: async (req, res) => {
    const { empno, name, from, to, reason, others } = req.body;
    const newLeave = new leaveModel({ empno, name, from, to, reason, others });
    try {
      await newLeave.save();
      req.flash("success", "success on filing leave");
    } catch (error) {
      req.flash(
        "error",
        "there was an error on filing leave. pls contact xian ca",
        error
      );
    }
    const referer = req.headers.referer || "/";
    res.redirect(referer);
  },
  addPosition: async (req, res) => {
    const { position } = req.body;
    const newPosition = new positionModel({ name: position });
    try {
      await newPosition.save();
      req.flash("success", `Position "${position}" added successfully!`);
    } catch (error) {
      req.flash("error", "Failed to add position.  pls contact xian ca");
    }

    res.redirect("/position");
  },
  position: (req, res) => {
    res.render("hr/position");
  },
  addserviceRecord: async (req, res) => {
    const {
      empno,
      empname,
      position,
      start,
      end,
      salaryGrade,
      tranch,
      salary,
      station,
      branch,
      type,
    } = req.body;
    const newService = new srecord({
      empno,
      empname,
      position,
      start,
      end,
      salaryGrade,
      tranch,
      salary,
      station,
      branch,
      type,
    });
    

    await newService.save();
    res.redirect("/main");
  },
  printServiceRecord: async (req, res) => {
    const id = req.params.id;
    const serviceRecords = await srecord.find({ empno: id });
    const employeeDetails = await employee.findOne({ empno: id });
    const serviceWithLeaves = [];
    for (let record of serviceRecords) {
      const startDate = new Date(record.start);
      const endDate = new Date(record.end);
      const leaves = await leaveModel.find({
        empno: id,
        from: { $gte: startDate.toISOString() },
        to: { $lte: endDate.toISOString() },
      });
      let totalLeaveDays = 0;
      leaves.forEach((leave) => {
        const leaveStart = new Date(leave.from);
        const leaveEnd = new Date(leave.to);
        const leaveDuration =
          Math.ceil((leaveEnd - leaveStart) / (1000 * 60 * 60 * 24)) + 1;
        totalLeaveDays += leaveDuration;
      });
      serviceWithLeaves.push({
        ...record._doc,
        leaves: leaves,
        totalLeaveDays,
      });
    }
    const data = {
      records: serviceWithLeaves,
      name: employeeDetails,
    };

    res.render("hr/print-service-record", { data });
  },
  serviceRecord: async (req, res) => {
    const id = req.params.id;
    const serviceRecords = await srecord.find({ empno: id });
    const employeeDetails = await employee.findOne({ empno: id });
    const serviceWithLeaves = [];
    for (let record of serviceRecords) {
      const startDate = new Date(record.start);
      const endDate = new Date(record.end);
      const leaves = await leaveModel.find({
        empno: id,
        from: { $gte: startDate.toISOString() },
        to: { $lte: endDate.toISOString() },
      });
      let totalLeaveDays = 0;
      leaves.forEach((leave) => {
        const leaveStart = new Date(leave.from);
        const leaveEnd = new Date(leave.to);
        const leaveDuration =
          Math.ceil((leaveEnd - leaveStart) / (1000 * 60 * 60 * 24)) + 1;
        totalLeaveDays += leaveDuration;
      });
      serviceWithLeaves.push({
        ...record._doc,
        leaves: leaves,
        totalLeaveDays,
      });
    }
    const data = {
      records: serviceWithLeaves,
      name: employeeDetails,
    };
    const user = req.session.user || null;
    res.render("hr/servicerecord", { data, months, years, user });
  },

  update_time: async (req, res) => {
    const { amTimeIn, amTimeOut, pmTimeIn, pmTimeOut, embedID } = req.body;
    try {
      await TModel.findByIdAndUpdate(embedID, {
        am_time_in: amTimeIn,
        am_time_out: amTimeOut,
        pm_time_in: pmTimeIn,
        pm_time_out: pmTimeOut,
      });
      req.flash("success", "Attendance modified without error");
    } catch (error) {
      req.flash("error", "Failed to add position, pls contact xian ca", error);
      console.error("Error updating time:", error);
      res.status(500).send("Error updating time.");
    }
    const referer = req.headers.referer || "/";
    res.redirect(referer);
  },
  dtrperemp: async(req, res) =>{
  
   try {
    // Validate and convert sid to ObjectId
    const { sid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sid)) {
      return res.status(400).send("Invalid Employee ID");
    }

    // Fetch the employee using findById
    const employeee = await employee.findById(sid);

    if (!employeee) {
      return res.status(404).send("Employee not found");
    }

    // Pass employee to the template
    res.render('hr/singleprint', { employeee });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  },
  filteryear: async (req, res) => {
    const empNo = req.query.empno;
    const year = req.query.year;
    const month = req.query.month;
    const employees = await employee.find();
    const dataset = await TModel.find();
    const filteredDataset = dataset.filter((d) => {
      const date = new Date(d.date);
      const dataYear = date.getFullYear();
      const dataMonth = date.getMonth() + 1;

      return (
        d.sid === empNo &&
        dataYear === parseInt(year) &&
        (!month || dataMonth === parseInt(month))
      );
    });
    const events = filteredDataset.map((d) => {
      return {
        title: `${d.am_time_in}<br>${d.am_time_out}`,
        start: d.date,
        extendedProps: {
          embedID: d._id,
          amTimeIn: d.am_time_in,
          amTimeOut: d.am_time_out,
          pmTimeIn: d.pm_time_in,
          pmTimeOut: d.pm_time_out,
        },
      };
    });

    const data = {
      employees,
      dataset: filteredDataset,
      year,
      month,
      events,
    };

    res.render("hr/time-edit", { data, months, years, empNo });
  },

  addsalary: async (req, res) => {
    const { sg, tranch, amount } = req.body;
    const sal = new salary({ sg, tranch, amount });
    await sal.save();
    res.redirect("/salary");
  },
  salary: async (req, res) => {
    const data = {
      salary: await salary.find(),
    };
    const user = req.session.user || null;
    res.render("hr/salary", { data, months, years, user });
  },

  HrIndex: async (req, res) => {
    const user = req.session.user || null;
    const data = {
      permanent: await employee.find({ cat_type: "PERMANENT" }),
      cos: await employee.find({ cat_type: "COS" }),
      jobOrder: await employee.find({ cat_type: "JOBORDER" }),
      position: await positionModel.find(),
      devices: await devices.find({ campus: user.campus})
    };
    
    res.render("hr/index", { data, months, years, user });
  },



 export: async (req, res) => {
    const cmp = req.session.user || null;    
    const { emptype, month, year, mdeduct } = req.body;
    const campus = cmp.campus;
   
    try {
      const employees = await employee.find({campus: campus});
      
      // Determine the number of days in the month
      const one = ["01", "03", "05", "07", "08", "10", "12"];
      const num = one.includes(month) ? 31 : (month === "02" ? (isLeapYear(year) ? 29 : 28) : 30); // Handle February for leap year

      const allServiceRecords = await srecord.find().sort({ end: -1 });
      const serviceRecordMap = new Map();
      allServiceRecords.forEach((record) => {
        if (!serviceRecordMap.has(record.empno)) {
          serviceRecordMap.set(record.empno, record.salary);
        }
      });

      const employeesWithSalaries = await Promise.all(
        employees.map(async (emp) => {
          emp.amount = serviceRecordMap.get(emp.empno) || 0;
          if (mdeduct) {
            const deductions = await deduct.find({ empno: emp.empno });
            emp.deductions = deductions.map((deduction) => ({
              name: deduction.deduction,
              value: parseFloat(deduction.avalue),
            }));
          }
          return emp;
        })
      );

      if (mdeduct) {
        const payrollRecords = employeesWithSalaries.map((emp) => {
          const totalDeductions = emp.deductions
            ? emp.deductions.reduce((sum, ded) => sum + ded.value, 0)
            : 0;
          const deductions = emp.deductions.reduce(
            (dedObj, ded) => {
              dedObj[ded.name.toLowerCase()] = ded.value;
              return dedObj;
            },
            {
              sss: 0,
              philhealth: 0,
              pagibig: 0,
              gsis: 0,
              loans: 0,
              leaveWithoutPay: 0,
            }
          );
          return {
            employeeId: emp.empno,
            name: `${emp.fname} ${emp.lname}`,
            basicSalary: emp.amount,
            allowances: 0,
            deductions: {
              ...deductions,
              totalDeductions: totalDeductions,
            },
            netPay: emp.amount - totalDeductions,
            payPeriod: { month, year },
            status: "Pending",
          };
        });
        await payrol.insertMany(payrollRecords);
      }

      const dataset = await TModel.find({ month, year });
      const absentEntries = [];
      // determine if employee schedule is 7am or 8am or 9am
      // if schedule is 7, time out in lunch is 12 and time in is 1pm, time out in afternoon is 4pm
      // if 9am, 9-1, 2-6
      // else 8-12, 1-5
      // identify the number of minutes late, the deduction for late is rate / 8hours / 60 * actual minute
      employees.forEach((employee) => {
        for (let i = 1; i <= num; i++) {
          
          
          const dates = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          const dayOfWeek = new Date(year, month - 1, i).getDay();
          let hasData = false;
          // console.log(dates);
          if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
          
          
          const dayData = dataset.find((d) => d.date === dates && d.sid === employee.empno);
          // const dayData = dataset.find(d => d.date === date && d.sid === employee.empno);
          // If no matching record found for the day, add the absence entry
          
          // console.log(dayData);
          
          if (dayData) {
          //   hasData = true;
          //   console.log(`Employee  - Record: ${employee.empno}, Date: ${date}`);
          //   // absentEntries.push({ empno: employee.empno, date: date }); // Only save absence entry, no date saved
          }else{
            // console.log(`No Record - Employee: ${employee.empno}, Date: ${dates}`);
            // console.log(dates);
          }
        }
      });

      // Save absences to the database
      if (absentEntries.length > 0) {
        try {
          await absentmodel.insertMany(absentEntries);
          console.log("Absences saved successfully.");
        } catch (error) {
          console.error("Error saving absences:", error);
        }
      }

      const data = {
        year,
        month,
        ftype: emptype,
        employees: employeesWithSalaries,
        dataset: await TModel.find(),
        absentEntries,
        signatory: await signatories.findOne({ status: "active" }),
      };
      res.render("hr/print", data);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).send("Failed to export data.");
    }
  },


  addEmployee: (req, res) => {
    const user = req.session.user || null;
    const success = req.flash("success");
    res.render("hr/add_employee", {
      months,
      years,
      user,
      messages: { success },
    });
  },

  signatories: async (req, res) => {
    const sign = await signatories.find();
    const user = req.session.user || null;
    res.render("hr/signatories", { sign, months, years, user });
  },
  employees: async (req, res) => {
    const employees = await employee.find();
    res.render("hr/employee_list", { employees, months, years });
  },
  addSignatory: async (req, res) => {
    const { name, position, campus } = req.body;
    const status = "active";
    const signatory = new signatories({ name, position, status, campus });
    await signatory.save();
  },
  add_employee: async (req, res) => {
    const cmp = req.session.user || null;
    try {
      const {
        lname,
        fname,
        mname,
        birthdate,
        birthplace,
        cat_type,
        area,
        empno,
      } = req.body;
      const status = "active";
      const campus = cmp.campus;
      const newEmployee = new employee({
        lname,
        fname,
        mname,
        birthdate,
        birthplace,
        cat_type,
        area,
        empno,
        status,
        campus,
      });
      await newEmployee.save();
      const referrer = req.headers.referer;
      res.redirect(referrer);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`Duplicate Employee ID: ${req.body.empno} already exists.`);
        res
          .status(400)
          .send(
            "Employee ID already exists. Please use a different Employee ID."
          );
      } else {
        res.status(500).send("An error occurred while adding the employee.". err);
      }
    }
  },
  batch: async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: "File upload error", details: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).send({ error: "No file provided" });
      }

      const filePath = req.file.path;
      const data = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          data.push(row);
        })
        .on("end", async () => {
          try {
            await employee.insertMany(data);
            fs.unlinkSync(filePath);
            res.status(200).send({ message: "CSV data uploaded successfully" });
          } catch (dbError) {
            fs.unlinkSync(filePath);
            res.status(500).send({ error: "Database error", details: dbError.message });
          }
        })
        .on("error", (csvError) => {
          fs.unlinkSync(filePath);
          res.status(500).send({ error: "Error parsing CSV", details: csvError.message });
        });
    } catch (error) {
      res.status(500).send({ error: "Error processing file", details: error.message });
    }
  });
},


  uploadFile: (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.send(`Error: ${err.message}`);
      }
      if (!req.file) {
        return res.send("Please upload a .dat file");
      }

      const filePath = path.join(req.file.destination, req.file.filename);
      const stream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      try {
        for await (const line of rl) {
          if (line.trim() === "") continue;
          const comp = line.trim().split(/\s+/);

          const sid = comp[0].trim();
          const date = comp[1].trim();
          const time = comp[2].trim();

          const existingRecord = await TModel.findOne({
            sid,
            date,
            am_time_in: { $ne: "-" },
          });

          if (existingRecord) {
            let updateData = {};

            if (!existingRecord.am_time_out) {
              updateData.am_time_out = time;
            } else if (!existingRecord.pm_time_in) {
              updateData.pm_time_in = time;
            } else if (!existingRecord.pm_time_out) {
              updateData.pm_time_out = time;
            } else if (!existingRecord.ot_time_in) {
              updateData.ot_time_in = time;
            } else if (!existingRecord.ot_time_out) {
              updateData.ot_time_out = time;
            }

            if (Object.keys(updateData).length > 0) {
              await TModel.updateOne({ sid, date }, { $set: updateData });
            }
          } else {
            const newRecord = new TModel({
              sid,
              date,
              am_time_in: time,
            });
            await newRecord.save();
          }
        }

        const incompleteRecords = await TModel.find({
          $or: [
            { am_time_out: null },
            { pm_time_in: null },
            { pm_time_out: null },
            { ot_time_in: null },
            { ot_time_out: null },
          ],
        });

        for (let record of incompleteRecords) {
          const updateData = {};

          if (!record.am_time_out) {
            updateData.am_time_out = "-";
          }
          if (!record.pm_time_in) {
            updateData.pm_time_in = "-";
          }
          if (!record.pm_time_out) {
            updateData.pm_time_out = "-";
          }
          if (!record.ot_time_in) {
            updateData.ot_time_in = "-";
          }
          if (!record.ot_time_out) {
            updateData.ot_time_out = "-";
          }

          if (Object.keys(updateData).length > 0) {
            await TModel.updateOne({ _id: record._id }, { $set: updateData });
          }
        }

        if (req.body.uptype === "half") {
          const latestRecord = await TModel.findOne().sort({ date: -1 });
          if (latestRecord) {
            await TModel.deleteOne({ _id: latestRecord._id });
          }
        }

        res.send(
          `File uploaded and processed successfully: ${req.file.filename}`
        );
      } catch (error) {
        console.error("Error processing file:", error);
        res.send("There was an error processing your file.");
      }
    });
  },

  getAllBooks: async (req, res) => {
    const books = await Book.find();
    const dtr = await TModel.find();
    res.render("index", { books, dtr });
  },

  createBook: async (req, res) => {
    const { title, author, publishedDate } = req.body;
    const newBook = new Book({ title, author, publishedDate });
    await newBook.save();
    res.redirect("/");
  },

  getBookById: async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render("edit", { book });
  },

  updateBook: async (req, res) => {
    const { title, author, publishedDate } = req.body;
    await Book.findByIdAndUpdate(req.params.id, {
      title,
      author,
      publishedDate,
    });
    res.redirect("/");
  },

  deleteBook: async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/");
  },
};

module.exports = bookers;