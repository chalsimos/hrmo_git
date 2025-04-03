const employee = require("../models/Employee");
const positionModel = require("../models/positionModel");
const Payroll = require("../models/PayrolModel");
const srecord = require("../models/ServiceRecord");
const Absent = require('../models/absent');
const lateentry = require('../models/lateEntry');
const Deduction = require('../models/DeductionModel');

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
    
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
const accounting = {
    payroll: async (req, res) => {
        try {
            const user = req.session.user || null;
            const { month, year } = req.query;
    
            // Parse month and year
            const y = parseInt(year, 10);
            const monthIndex = parseInt(month, 10) - 1;
            const startDateStr = `${y}-${('0' + (monthIndex + 1)).slice(-2)}-01`;
            const lastDay = new Date(y, monthIndex + 1, 0).getDate();
            const endDateStr = `${y}-${('0' + (monthIndex + 1)).slice(-2)}-${('0' + lastDay).slice(-2)}`;
    
            // Fetch late entries
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
    
            // Fetch absence records
            const absences = await Absent.aggregate([
                {
                    $match: {
                        date: { $gte: startDateStr, $lte: endDateStr },
                        campus: user.campus,
                    }
                },
                {
                    $group: {
                        _id: "$empno",
                        absencesCount: { $sum: 1 },
                        absenceDates: { $push: "$date" }
                    }
                }
            ]);
    
            // Fetch payroll data
            const permanent = await Payroll.find({ type: "PERMANENT", month, year });
            const cos = await Payroll.find({ type: "COS", month, year });
            const jobOrder = await Payroll.find({ type: "Job Order", month, year });
    
            // Fetch position data
            const positions = await positionModel.find();
    
            // Fetch service records
            const serviceRecords = await srecord.find().sort({ employee_id: 1, date_from: -1 });
    
            // Fetch deductions for all employees
          // Fetch deductions for all employees
const deductions = await Deduction.find(); // Fetch all deductions from the database

// Organize deductions by empno for quick lookup
const deductionsByEmpno = {};
deductions.forEach(deduction => {
    const empno = String(deduction.empno); // Ensure all empno values are strings
    if (!deductionsByEmpno[empno]) {
        deductionsByEmpno[empno] = [];
    }
    deductionsByEmpno[empno].push({
        deduction: deduction.deduction,
        avalue: parseFloat(deduction.avalue) || 0 // Convert avalue to a number
    });
});

// Log the deductionsByEmpno object for debugging
console.log('Deductions by empno:', deductionsByEmpno);

// Prepare the data object
const data = {
    permanent,
    cos,
    jobOrder,
    positions,
    serviceRecords,
    lateEntries,
    absences,
    deductionsByEmpno // Include deductions grouped by empno
};
            // Render the view
            res.render('accounting/payroll', {
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
        } catch (error) {
            console.error('Error fetching payroll data:', error);
            res.status(500).render('error', { message: 'An error occurred while fetching payroll data.' });
        }
    },
    index: async(req, res) =>{
        const user = req.session.user || null;
        const data = {
        permanent: await employee.find({ cat_type: "PERMANENT" }),
        cos: await employee.find({ cat_type: "COS" }),
        jobOrder: await employee.find({ cat_type: "JOBORDER" }),
        position: await positionModel.find(),
        };
            res.render('accounting/index', { data, months, years, user });
    }
};
module.exports = accounting;