const express = require('express');
const mongoose = require('mongoose');
const ping = require("ping");
// const bodyParser = require('body-parser');
const bodyParser = require("body-parser");
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;




mongoose.connect(  'mongodb+srv://krizchan31:uQTLHq325t%2Dky2b@cluster0.ws7un.mongodb.net/hrmo?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost:27017/hrmo', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


app.use(express.urlencoded({ extended: true }));  // <-- Add this
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(express.json());
app.set('view engine', 'ejs');


app.use(session({
  secret: '6f66ba9ab604252d9f433cbc0b1d524056bb0cdc524bce2209e0f76c68689d149071b181b4d4700b6c504da3b16e5976aa226fe740ca9f160dc2f715c61947c6',
  resave: false,
  saveUninitialized: true
}));


app.use(flash());


app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

function checkLock(req, res, next) {
  if (req.session.isLocked && req.path !== '/lock' && req.path !== '/unlock') {
    return res.redirect('/lock'); 
  }
  next(); 
}
app.use(checkLock);

const routes = require('./routes/index');
app.use('/', routes);
app.get('/lock', (req, res) => {
  req.session.isLocked = true;
  // res.sendFile(path.join(__dirname, 'views/lock.ejs')); 
  const user = req.session.user || null;
  console.log(user);
  res.render('lock', {user});
});

// app.post('/unlock', (req, res) => {
//   const { password } = req.body;
  
//   if (password === 'correctPassword') { 
//     req.session.isLocked = false; 
//     res.redirect('/main'); 
//   } else {
//     req.flash('error', 'Incorrect password. Try again.');
//     res.redirect('/lock'); 
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
