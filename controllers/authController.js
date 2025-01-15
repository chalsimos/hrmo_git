// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.regView = (req, res) =>{
  const user = req.session.user || null;
  res.render('register', { error: null, user });
};
exports.unlock =async (req, res) =>{
  const { password } = req.body;
  const usr = req.session.user || null;
  const counter = 0;
  const email = usr.email;
  const user = await User.findOne({ email });
  try{
    if (user && (await bcrypt.compare(password, usr.password))) {
      req.session.isLocked = false; 
          res.redirect('/main'); 
    }else{
      req.flash('error', 'Incorrect password. Try again.');
    res.redirect('/lock'); 
    }
  }catch(error){
    req.flash('error', 'Incorrect password. Try again.');
    res.redirect('/lock'); 
  }
},
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
    const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password
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
      // Store essential user data in the session
      req.session.user = { _id: user._id, email: user.email, role: user.role, campus: user.campus };
      
      // Redirect based on user role
      if (user.role === 'cashier') {
        return res.redirect('/cashier');
      } else if (user.role === 'hr') {
        return res.redirect('/hr');
      } else if (user.role === 'chief') {
        return res.redirect('/chief');
      }
      return res.redirect('/main');  // Default redirect for unspecified roles
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
