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
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const session = require('express-session'); 


const main ={
    uploadFile: (req, res) => {
        upload(req, res, (err) => {
          if (err) {
            return res.send(`Error: ${err.message}`);
          }
          if (!req.file) {
            return res.send('Please upload a .txt file');
          }
          res.send(`File uploaded successfully: ${req.file.filename}`);
        });
      },
    viewlogin:(req, res) =>{

        res.render('login', {error: null});
    },
    login:async(req, res) =>{
        const { username, password } = req.body; 
        try {
            const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user_id = user._id; 
            req.session.campus = user.campus; 

            
            return res.redirect('/');
        } else {
            
            req.flash('error', 'Invalid username or password.'); 
            return res.redirect('/login'); 
        }
    } catch (err) {
        console.error(err); 
        return res.status(500).send('Server error'); 
    }
    }

};
module.exports = main;