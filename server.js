const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  // if we have auth header then get the token from it
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) {
    return res.sendStatus(401)
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      res.sendStatus(403)
    }
    req.user = user
    console.log('req.user is: ', req.user)
    next()
  })
}

const posts = [
  {
    username: 'ali',
    title: 'POST 1',
  },
  {
    username: 'gholi',
    title: 'POST 2',
  },
]

app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user)
  res.json(posts.filter((post) => post.username === req.user.name))
})

app.listen(3000)
