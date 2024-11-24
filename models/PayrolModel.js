const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  employeeId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: Number,
    // ref: 'Employee', 
    required: true,
  },
  name:{
    type:String,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    sss: {
      type: Number,
      default: 0,
    },
    philhealth: {
      type: Number,
      default: 0,
    },
    pagibig: {
      type: Number,
      default: 0,
    },
    gsis: {
      type: Number,
      default: 0,
    },
    loans: {
      type: Number,
      default: 0,
    },
    leaveWithoutPay: {
      type: Number,
      default: 0,
    },
    totalDeductions: {
      type: Number,
      default: function () {
        // Calculate the total deductions
        return (
          this.deductions.sss +
          this.deductions.philhealth +
          this.deductions.pagibig +
          this.deductions.gsis +
          this.deductions.loans +
          this.deductions.leaveWithoutPay
        );
      },
    },
  },
  netPay: {
    type: Number,
    required: true,
  },
  payrollDate: {
    type: Date,
    default: Date.now,
  },
  payPeriod: {
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Pending',
  },
});

PayrollSchema.pre('save', function (next) {
  // Calculate net pay before saving
  this.netPay = this.basicSalary + this.allowances - this.deductions.totalDeductions;
  next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);
