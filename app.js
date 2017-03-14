// importing modules
const express = require ('express'),
      sequelize = require ('sequelize'),
      fs = require ('fs'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      session = require ('express-session');


// setting up express app
const app = express();

app.use(session({
  secret: 'secure',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// connecting to databse
const db = require(__dirname + '/modules/database');

// requiring register route
const register = require(__dirname + '/routes/register'),
      addPost = require(__dirname + '/routes/posts'),
      logIn = require(__dirname + '/routes/log-in');

// setting view engine and folder
app.set('view engine', 'pug');
app.set( 'views', __dirname + '/views' );

app.use('/', express.static( __dirname + '/public') );
// using logger
app.use(morgan('dev'));

// mounting the routes to '/'

app.use('/', register);
app.use('/', addPost);
app.use('/', logIn);


app.use(bodyParser.urlencoded({ extended: false }));



// rendering all posts in database
app.get('/', (req, res) => {
  db.Post.findAll( {
    include: [
      { model: db.Comment, include: [db.User] },
      { model: db.User }
    ]
  }).then( (posts) => {
    console.log(posts);
    res.render('index', {
      posts: posts,
      user: req.session.user
    });
  });
});



app.listen(4001, (req, res) => {
  console.log('Server running on port 4001');
});
