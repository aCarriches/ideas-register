const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));

// Load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method-override middleware
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized:true
}))

// Flash middleware
app.use(flash());

// Global variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  console.log(res.locals)
  next();
})

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

// Idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      })
    })
})

// Add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
});

// Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea
      })
    })
});

// Process form
app.post('/ideas', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please, add a title.' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please, add some details.' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video idea added.');
        res.redirect('/ideas');
      })
  }
})

// Edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          res.redirect('/ideas');
        })
    })
})

// Delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Video idea removed.');
      res.redirect('/ideas');
  });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})



// // How middleware works
// app.use((req,res,next) => {
//   console.log(Date.now());
//   req.name = 'Alberto';
//   next();
// })