const express = require('express');

const server = express();

const userRouter = require('./users/userRouter.js')

//sanity check
server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users', logger, userRouter)

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} with body ${req.body} at ${new Date().toISOString()}`);
  next();
}

module.exports = server;
