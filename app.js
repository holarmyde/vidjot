const express = require("express");
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


//Map-global promise - get rid of warning
mongoose.Promise = global.Promise;



//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser:true
})

.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));


// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');


// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'));

// How middleware works
//app.use(function(req, res, next){
  // console.log(Date.now());
  // req.name ='Femi Aremu';
  // next();

//});

// Index Route
app.get('/', (req, res) =>{
    const title = 'Welcome';
    res.render('index', {
        title:title
    });
    console.log(req.name);
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');

});

//Idea Index Page
app.get('/ideas', (req, res) => {
        Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas,
            });
        });
    
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');

});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    })
});

// Process Form
app.post('/ideas/:id', (req, res) => {
    //console.log(req.body);
   // res.send('ok');
   let errors =[];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }

    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
         errors: errors,
        title: req.body.title,
        details: req.body.details
        });

        } else {
        //res.send('passed');
        const newUser = {

            title:req.body.title,
            details:req.body.details,
            user:req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea =>{
                res.redirect('/ideas');
            })
    }
});

//Edit Form Process
app.put('/ideas/:id', (req, res) => {
    //res.send('PUT');
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
          .then(idea => {
              res.redirect('/ideas');
          })
    });
});

// Delete Idea
app.delete('/ideas/delete/:id', (req, res) => {
    console.log("this url is working")
    res.send('DELETE');
});

const port = 5000;

app.listen(port, () =>{
   console.log(`sever running on ${port}`)

});
