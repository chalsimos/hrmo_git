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

const serviceRecordSchema = new mongoose.Schema({
  empno: { type: String, required: true }, // Remove unique: true
  empname: { type: String, required: true },
  position: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, default: null },
  salaryGrade: { type: String, default: null },
  tranch: { type: String, default: null },
  salary: { type: Number, required: true },
  station: { type: String, required: true },
  branch: { type: String, required: true },
  type: { type: String, enum: ["PERMANENT", "COS", "Job Order"], required: true },
  campus: {
    type: String,
    enum: ["Calapan", "Main", "Bongabong"],
    required: true,
  },
});

module.exports = mongoose.model("ServiceRecord", serviceRecordSchema);