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
  pstatus: {
    type: String, 
    default: "" 
  },
  serviceRecordPosition: { 
    type: String, 
    default: "" 
  },
  tax:{
    type: String,
    default:""
  },
  pera:{
    type: String,
    default:""
  },
  gae:{
    type:String,
    defualt:""
  },
  deductions: {
    gsis: {
    
      lr: { type: String, default: "" },
      unpaidPremium: { type: String, default: "" },
      calamityEl: { type: String, default: "" },
      computerLoan: { type: String, default: "" },
      conso: { type: String, default: "" },
      plr: {  type: String, default: "" },
      uoli: { type: String, default: "" },
      elmpl: { type: String, default: "" },
      gfal: { type: String, default: "" },
      mplcpl: { type: String, default: "" }
    },
    hmdf: {
      premium: { type: String, default: "" },
      hdmfmpl: { type: String, default: "" }
    },
    philhealth: { type: String, default: "" },
    sss: { type: String, default: "" },
    lbpsl: { type: String, default: "" },
    lwop: { type: Number,  default: 0 }
  },
  totaldeductions:{ type: String, default: "" },
  fistHalf:{ type: String, default: "" },
  secondHalf:{ type: String, default: "" },
  salargGrade:{ type: String},
  salary: { type: String},
  month: { type: String, required: true },
  year: { type: String, required: true }
}, 
{ 
  timestamps: true  
});

module.exports = mongoose.model('Payroll', payrollSchema);