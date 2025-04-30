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
const roleAuth = (roles) => {
  return (req, res, next) => {
    // console.log('Session user:', req.session.user);
    // console.log('Roles allowed:', roles);
  res.locals.user = req.session.user || null;

    if (req.session.user && roles.includes(req.session.user.role)) {
      next();
    } else {
      return res.render('login', { error: 'Access denied' });
    }
  };
};

module.exports = { roleAuth };
