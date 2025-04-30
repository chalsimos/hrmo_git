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
const leaveSchema = new mongoose.Schema({
    empno: { type: String},
    name:{type:String},
    from: { type: String},
    to: { type: String},
    reason: { type: String},
    others: { type: String},
    status: { type: String, default: "Pending"},
});
module.exports = mongoose.model("leave", leaveSchema);
