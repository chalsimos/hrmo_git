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
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LateEntrySchema = new Schema(
  {
    empno: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    totalLateMinutes: {
      type: Number,
      default: 0,
    },
    
    status: {
      type: String,
      enum: ["late", "pending", "approved", "rejected"],
      default: "late",
    },
    campus:{
      type:String,
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create compound index for empno and date to ensure uniqueness
LateEntrySchema.index({ empno: 1, date: 1 }, { unique: true })

// Add a method to calculate deduction if needed
LateEntrySchema.methods.calculateDeduction = function (hourlyRate) {
  return (hourlyRate / 60) * this.totalLateMinutes
}

module.exports = mongoose.model("LateEntry", LateEntrySchema)

