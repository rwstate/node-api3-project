const express = require('express');
const db = require('./userDb.js');
const posts = require('../posts/postDb.js')

const router = express.Router();

router.use(express.json())

// add new user
router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json({errMsg: 'error adding user'}))
});

//add new post to user with specified id
router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
  posts.insert({...req.body, user_id: req.user.id})
    .then(newPost => res.status(201).json(newPost))
    .catch(err => res.status(500).json({errMsg: 'error adding post'}))
});

//get all users
router.get('/', (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({errMsg: 'error getting users'}))
});

//get user by id
router.get('/:id', validateUserId, (req, res) => {
  db.getById(req.user.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({errMsg: 'error getting user'}))
});

//get posts by user id
router.get('/:id/posts',validateUserId, (req, res) => {
  db.getUserPosts(req.user.id)
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({errMsg: 'error getting posts'}))
});

//delete user
router.delete('/:id',express.json(),validateUserId, (req, res) => {
  db.remove(req.user.id)
    .then(userId => res.status(200).json(req.user))
    .catch(err => res.status(500).json({errMsg: 'error removing user'}))
});

//edit user info
router.put('/:id',validateUserId, validateUser, (req, res) => {
  db.update(req.user.id, req.body)
    .then(resp => {
      db.getById(req.user.id)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json({errMsg: 'error retrieving updated user'}))
    })
    .catch(err => res.status(500).json({errMsg: 'error updating user'}))
});

//custom middleware

//verify user exists
function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user
        next()
      } else {
        res.status(404).json({errMsg: 'user not found'})
      }
    })
    .catch(err => res.status(500).json({errMsg: 'error validating user id'}))
}

// verify request body exists and has required keys (name)
function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({errMsg: 'missing user info'})
  } else if (!req.body.name) {
    res.status(400).json({errMsg: `name field is required`})
  } else {
    next()
  }
}

// verify request body exists and has required keys (text)
function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({errMsg: 'missing user info'})
  } else if (!req.body.text) {
    res.status(400).json({errMsg: `text field is required`})
  } else {
    next()
  }
}

module.exports = router;
