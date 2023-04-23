const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.use(express.json())

//should store in database or redis cache but i stor this locally as variable
let refreshTokens = []


app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken === null) {
    res.status(401).json('invalid token')
  }
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json('forbidden token')
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (err) return res.status(403).json('error occourd')
    const accessToken = generateAccessToken({name: user.name})
    res.json({accessToken: accessToken})
  })
})


app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
})


app.post('/login', (req, res) => {
  const username = req.body.username
  const user = {name: username}

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({accessToken: accessToken, refreshToken: refreshToken})
})


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.listen(5000)
