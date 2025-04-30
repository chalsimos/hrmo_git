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
module.exports = {
    getDaysInMonth: function(month, year) {
        const one = ["01", "03", "05", "07", "08", "10", "12"];
        return one.includes(month) ? 31 : (month === "02" ? (isLeapYear(year) ? 29 : 28) : 30);
    },
    
    isLeapYear: function(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },
    
    getScheduledTime: function(schedule) {
        switch (schedule) {
            case '7AM': return new Date('1970-01-01T07:00:00');
            case '9AM': return new Date('1970-01-01T09:00:00');
            default: return new Date('1970-01-01T08:00:00');
        }
    }
};