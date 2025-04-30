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
const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  lname: { type: String, required: true },
  fname: { type: String, required: true },
  mname: { type: String },
  birthdate:{type: String, required:true },
  birthplace:{type:String, required:true},
  cat_type: { type: String },
  area:{ type:String },
  empno: { type: String, required: true, unique: true },
  schedule: { type: String },
  // sg: { type: String, required: true },
  // tranch: { type: String, required: true },
  // amount: { type: String, required: true },
  status: { type: String, required: true },
  campus: { type: String, required: true },
});
module.exports = mongoose.model("employee", employeeSchema);
