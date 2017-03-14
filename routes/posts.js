const express = require ('express')
const sequelize = require ('sequelize')
const router = express.Router()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// connecting to databse
const db = require('../modules/database')

// setting router sub app to use bodyparser
router.use(bodyParser.urlencoded({ extended: false }))

router.use(methodOverride( (req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}))

// setting up route ro register page
router.get('/add-post', (req, res) => {
  res.render('add-post', {
    user: req.session.user
  })
})

//show 1 post the unique id
router.get('/show-1-post/:id', (request, response) => {
  console.log('Checking for post with id ' + request.params.id)
  db.Post.findOne({
    where: {
      id: request.params.id
    },
    include: [
      { model: db.Comment, include: [db.User] },
      { model: db.User }
    ]
  }).then( thepost => {
    console.log( 'Found the post ', thepost.get({plain: true}) )
    response.render('show-1-post', { post: thepost, user: request.session.user })
  })
})

// posting new message to database
router.post('/add-post', (req, res) => {
  const newPost = {
    title: req.body.title,
    body: req.body.body,
    userId: req.session.user.id
  }
  console.log(req.body)
  db.Post.create(newPost).then()
  console.log(newPost)
  res.redirect('/')
})

// comment on post

router.post('/add-comment', (req, res) => {
  const newComment = {
    body: req.body.body,
    userId: req.session.user.id,
    postId: req.body.currentpostId
  }
  db.Comment.create(newComment).then( newcomment => {
    res.redirect('/')
  })
})

// trying to make a delete funtion
router.get('/delete/:id', (req, res) => {
  console.log(req.params.id);
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/profile')
  })
})

// route for edit page
router.get('/edit/:id', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then((post) => {
    res.render('edit', { post: post, user: req.session.user })
  })
})

// edit functionality
router.put('/edit/:id', (req, res) => {
  db.Post.update(req.body, {
    where: {
      id: req.params.id,
    }
  }).then((post) => {
    res.redirect('/')
  })
})

module.exports = router
