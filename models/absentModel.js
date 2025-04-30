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
const mongoose =  require("mongoose");
const absentSchema = new mongoose.Schema({
    empno:{type:String, required:true},
    date:{
        type:String, 
        required:true,
        // validate:{
        //     validator:function(value){
        //         const date = new Date(value);
        //         const day = date.getDay();
        //         return day !== 0 &&  day !== 6;
        //     },
        //     message: "unable to insert saturday and sunday for absent"
        // }
    },
    campus: {type:String, required:true},
    
});
absentSchema.index({empno:1,date:1}, {unique:true});

module.exports = mongoose.model("absent", absentSchema);