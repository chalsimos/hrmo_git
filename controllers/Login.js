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