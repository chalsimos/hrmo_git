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
const Book = require("../models/Book");
const TModel = require("../models/Time");
const employee = require("../models/Employee");
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
  deduction: async (req, res) => {
    try {
      const employees = await employee.find().lean();
      const deductions = await deduct.find().lean();
      employees.forEach(employee => {
        const empDeductions = deductions.filter(deduction => deduction.empno === employee.empno);
        employee.deductions = empDeductions;
        employee.itemizedDeductions = empDeductions.length > 0
        ? empDeductions
            .map(deduction => `${deduction.deduction}: ₱${Number(deduction.avalue).toFixed(2)}`)
            .join(", ") 
        : "No Deductions"; 
      });

    
    res.render('hr/deductions', { employees, months, years });
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