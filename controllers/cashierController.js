/**
 * ================================================
 *  Project Name : MinSU-HRMO
 *  Description  : Mindoro State University HR-Management System
 *  Author       : Christian Cabrera
 *  Email        : christian.cabrera@minsu.edu.ph
 *  Date Created : October 05, 2024
 *  Version      : 1.7.2
 *  Environment  : Node.js v20+
 * ================================================
 *  © 2025 Christian Cabrera. All rights reserved.
 *  
 *  This project is the intellectual property of the author.
 *  No part of this codebase may be copied, modified, distributed,
 *  or used in any form without the explicit written permission 
 *  of Christian Cabrera.
 * 
 *  Unauthorized use is strictly prohibited.
 * ================================================
 */
const firebase = require("firebase/app");
require("firebase/firestore");

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA1-QuakN6Q32dWIzkBPzG8SEWhLIltICU",
  authDomain: "minsu-d6ae4.firebaseapp.com",
  projectId: "minsu-d6ae4",
  storageBucket: "minsu-d6ae4.firebasestorage.app",
  messagingSenderId: "338350609658",
  appId: "1:338350609658:web:cf2c90c6389f2a5fe62543",
};
const Absent = require('../models/absent');
const Book = require("../models/Book");
const TModel = require("../models/Time");
const employee = require("../models/Employee");
const devices = require('../models/devices');
const lateentry = require('../models/lateEntry');
const signatories = require("../models/signatories");
const salary = require("../models/salary");
const srecord = require("../models/ServiceRecord");
const positionModel = require("../models/positionModel");
const leaveModel = require("../models/leaveModel");
const deduct = require("../models/DeductionModel");
const multer = require("multer");
const csv = require("csv-parser");
const locatorModel = require("../models/locatorModel");
const userModel = require("../models/User");
const flash = require("connect-flash");
const Payroll = require("../models/PayrolModel");
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
  if (ext === ".dat") {
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
const cashier = {
  
  hrPayroll: async (req, res) => {
      const user = req.session.user || null;
      const { month, year } = req.query;
  
      // Parse month and year from query parameters
      const y = parseInt(year, 10);
      const monthIndex = parseInt(month, 10) - 1;    
      const startDateStr = `${y}-${('0' + (monthIndex + 1)).slice(-2)}-01`;
      const lastDay = new Date(y, monthIndex + 1, 0).getDate();
      const endDateStr = `${y}-${('0' + (monthIndex + 1)).slice(-2)}-${('0' + lastDay).slice(-2)}`;
  
      // Fetch late entries (if needed)
      const lateEntries = await lateentry.aggregate([
          {
              $match: {
                  date: { $gte: startDateStr, $lte: endDateStr },
                  campus: user.campus,
              }
          },
          {
              $addFields: { 
                  totalLateMinutesInt: { $toInt: "$totalLateMinutes" } 
              }
          },
          {
              $group: {
                  _id: "$empno",
                  totalLateMinutes: { $sum: "$totalLateMinutesInt" }
              }
          }
      ]);
  
      // Fetch absence records for the specified month and year
      const absences = await Absent.aggregate([
          {
              $match: {
                  date: { $gte: startDateStr, $lte: endDateStr }, // Match dates within the range
                  campus: user.campus,
              }
          },
          {
              $group: {
                  _id: "$empno",                                  // Group by employee ID
                  absencesCount: { $sum: 1 },                    // Count the number of absences
                  absenceDates: { $push: "$date" }              // Collect the dates of absences
              }
          }
      ]);
  
      
      const data = {
          permanent: await Payroll.find({ type: "PERMANENT", month:month, year:year }),
          cos: await Payroll.find({ type: "COS", month:month, year:year }),
          jobOrder: await Payroll.find({ type: "Job Order" , month:month, year:year}),
          position: await positionModel.find(),
          devices: await devices.find({ campus: user.campus }),
          serviceRecords: await srecord.find().sort({ employee_id: 1, date_from: -1 }),
          lateEntries,                                          // Pass late entries
          absences                                              // Pass absences data
      };
      
      res.render('hr/payroll', { 
          months, 
          years, 
          month, 
          year, 
          user, 
          data,
          helpers: {
              formatNumber: (num) => num ? Number(num).toLocaleString() : 'N/A',
              formatCurrency: (num) => num ? Number(num).toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP'
              }) : 'N/A'
          } 
      });
  },
  payrollEmployee :async(req, res) =>{
    const id = req.params.id;
    const data = {
      records: await Payroll.findOne({employeeId: id})
    };
    
    
    
  },  
  addPayroll: async (req, res) => {
   try {
    
    const { employeeId, name, basicSalary, allowances, deductions, payPeriod } = req.body;
    if (!employeeId || !basicSalary || !payPeriod || !payPeriod.year || !payPeriod.month) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    
    const totalDeductions = (
      (deductions.sss || 0) +
      (deductions.philhealth || 0) +
      (deductions.pagibig || 0) +
      (deductions.gsis || 0) +
      (deductions.loans || 0) +
      (deductions.leaveWithoutPay || 0)
    );
    const netPay = basicSalary + (allowances || 0) - totalDeductions;
    const payroll = new Payroll({
      employeeId: employeeId,
      name: name,
      basicSalary,
      allowances,
      deductions,
      netPay,
      totalDeductions,
      payPeriod,
      status: 'Pending', 
    });    
    await payroll.save();

    res.status(201).json({ message: 'Payroll created successfully', payroll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payroll', error });
  }
  },
  payroll: async(req, res) =>{
    const data = {
      employee: await Payroll.find(),
    };
    res.render('cashier/payroll', {months, years, data });
  },
  delete_deduction:async(req, res) =>{
    const { empno, deductionName } = req.body;
    try {
      await deduct.deleteOne({ empno, deduction: deductionName });
      res.status(200).json({ message: "Deduction deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete deduction." });
    }
  },
  add_deduction: async(req, res) =>{
    try {
      const { empno, name, avalue } = req.body;
      if (!empno || !name || !avalue) {
        return res.status(400).send("Missing required fields");
      }
      const newDeduction = new deduct({ empno, deduction: name, avalue });
      await newDeduction.save();

      res.status(200).json(newDeduction);
    } catch (error) {
      console.error("Error adding deduction:", error);
      res.status(500).send("An error occurred while adding the deduction.");
    }
  },
 upDeduction: async (req, res) => {
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
            await deduct.insertMany(data);
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

 deduction: async (req, res) => {
  const user = req.session.user || null;
  
  
  try {
    const employees = await employee.find({campus:user.campus}).lean();
    const deductions = await deduct.find().lean();

    employees.forEach(employee => {
      const empDeductions = deductions.filter(deduction => deduction.empno === employee.empno);
      employee.deductions = empDeductions;
      employee.itemizedDeductions = empDeductions.length > 0
        ? empDeductions.map(deduction => ({
            name: deduction.deduction,
            value: `₱${Number(deduction.avalue).toFixed(2)}`
          }))
        : [];
    });
    if(user.role === 'accounting'){
      res.render('accounting/deductions', { employees, months, years });
    }else{
      res.render('hr/deductions', { employees, months, years });
    }
     
  } catch (error) {
    console.error("Error fetching deductions:", error);
    res.status(500).send("An error occurred while fetching deductions.");
  }
},
  salary: async (req, res) =>{

  },
  payslip: async (req, res)=>{

  },
  index: async(req, res)=>{
      res.render('cashier/index', { months, years });        
      
        
  }   
};

module.exports = cashier;