const express = require("express");
const path = require('path');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// DB COnfig
const db = require('./config/database');

// Passport Config
require('./config/passport')(passport);

//Map-global promise - get rid of warning
mongoose.Promise = global.Promise;



//connect to mongoose
mongoose.connect(db.mongoURI, {
    //useMongoClient:true
    useNewUrlParser:true
})

.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));





// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Method Override Middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  // Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());


//GLobal variables
app.use(function(req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
   next();

});
// Index Route
app.get('/', (req, res) =>{
    const title = 'Welcome';
    res.render('index', {
        title:title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// use routes
app.use('/ideas', ideas);
app.use('/users', users);
const port = process.env.PORT || 5000;

app.listen(port, () =>{
    console.log(`sever running on ${port}`)
});
