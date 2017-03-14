
const express = require ('express'),
      sequelize = require ('sequelize'),
      bodyParser = require('body-parser'),
      router = express.Router();


// connecting to databse
const db = require('../modules/database');

// setting router sub app to use bodyparser
router.use(bodyParser.urlencoded({ extended: false }));

// setting up route ro register page
router.get('/register', (req, res) => {
  res.render('register');
});

// posting new user to database
router.post('/register', (req, res) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };
  //console.log(req.body);
  db.User.create(newUser).then();
  //console.log(newUser);
  res.redirect('/');
});

module.exports = router;
