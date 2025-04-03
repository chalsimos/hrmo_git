const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  empno: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    default: "" 
  },
  pstatus:{
    type: String, 
    default: "" 
  },
  serviceRecordPosition: { 
    type: String, 
    default: "" 
  },
  salary:{
    type: String,
  },
  month: { 
    type: String, 
    required: true 
  },
  year: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Payroll', payrollSchema);
