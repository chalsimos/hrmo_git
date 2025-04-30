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
const signatorySchema = new mongoose.Schema({
    name:{type:String, require},
    position: { 
        type: String, 
        required: true, 
        enum:['CAMPUS EXECUTIVE DIRECTOR', 'HRMO I', 'ADMINISTRATIVE OFFICER I', 'ADMINISTRATIVE OFFICER II', 'ADMINISTRATIVE OFFICER III', 'ADMINISTRATIVE OFFICER IV', 'ADMINISTRATIVE OFFICER V', 'ACCOUNTANT'] 
    },
    docs: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    campus:{type:String, required:true, enum: ['Calapan', 'Main', 'Bongabong']},
});
module.exports =mongoose.model('signatorie', signatorySchema);