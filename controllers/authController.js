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
const bcrypt = require('bcryptjs');
const Payroll = require("../models/PayrolModel");

exports.regView = (req, res) =>{
  const user = req.session.user || null;
  res.render('register', { error: null, user });
};
exports.validate = async(req, res) =>{
  const { password, year, month } = req.body;

  try {
    
    const userId = req.session.user?._id;

    if (!userId) {
      return res.json({ success: false, message: 'User not logged in.' });
    }

    
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ success: false, message: 'Incorrect password.' });
    }

    
    const filter = { year, month }; 
    const update = { pstatus: 'AP' }; 

    const result = await Payroll.updateMany(filter, update);

    if (result.matchedCount === 0) {
      return res.json({ success: false, message: 'No payroll records found for the given year and month.' });
    }

    res.json({ success: true, message: `${result.modifiedCount} payroll record(s) updated successfully.` });
  } catch (error) {
    console.error('Error updating payroll records:', error);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
 };

exports.unlock = async (req, res) => {
  const { password } = req.body;
  const usr = req.session.user || null;

  
  if (!usr || !usr.email) {
    req.flash('error', 'User session not found. Please log in again.');
    return res.redirect('/login');
  }

  const email = usr.email;

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User not found. Please log in again.');
      return res.redirect('/');
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      
      req.session.isLocked = false;
      return res.redirect('/main'); 
    } else {
      
      req.flash('error', 'Incorrect password. Please try again.');
      return res.redirect('/lock');
    }
  } catch (error) {
    console.error('Unlock error:', error);
    req.flash('error', 'An error occurred while unlocking. Please try again.');
    return res.redirect('/lock');
  }
};
exports.register = async (req, res) => {
  const { name, email, password, passwordConfirm, campus, role } = req.body;
  const user = req.session.user || null;
  
  if (password !== passwordConfirm) {
    return res.render('register', { error: 'Passwords do not match.' });
  }
  
  const passwordValidation = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
  };

  if (!passwordValidation(password)) {
    return res.render('register', { error: 'Password must meet the required criteria.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ name, email, password: hashedPassword, campus, role });
    await newUser.save();
    res.redirect('/');
  } catch (error) {
     if (error.code === 11000) {
      res.render('register', { error: 'Email is already registered.', user });
    } else {
      res.render('register', { error: 'An error occurred during registration.', user });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      
      req.session.user = { _id: user._id, email: user.email, role: user.role, campus: user.campus };
      
      
      if (user.role === 'cashier') {
        return res.redirect('/cashier');
      } else if (user.role === 'hr') {
        return res.redirect('/hr');
      } else if (user.role === 'chief') {
        return res.redirect('/chief');
      }else if(user.role ==='accounting'){
        return res.redirect('/acct');    
      }
      return res.redirect('/main');  
    } else {
      res.render('login', { error: 'Invalid email or password', user: null });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred, please try again.' });
  }
};



exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
