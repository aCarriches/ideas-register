const path = require('path');
const express = require('express'); // Create the node server and helps with petitions
const exphbs = require('express-handlebars'); // Template system
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose'); // Helps with mongoDB

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//DB config
const db = require('./config/database');

// Passport config
require('./config/passport')(passport);

// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));



//////////////////////////////////
///////// MIDDLEWARE /////////////
//////////////////////////////////

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method-override middleware
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized:true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})


///////////////////////////////////////
///////////// ROUTERS /////////////////
///////////////////////////////////////

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// Index router
app.get('/', (req, res) => {
  const title = "Welcome";
  res.render('index', {
    title
  });
})

// About router
app.get('/about', (req, res) => {
  res.render('about');
})


////////////////////////////////////////////
////////////// SERVER STUFF ////////////////
////////////////////////////////////////////

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})