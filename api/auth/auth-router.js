const router = require('express').Router();
const { checkValidNewUser, checkAvailable } = require('./auth_middleware')
const User = require('../users/users-model');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/index')
router.post('/register', checkValidNewUser, checkAvailable, async (req, res) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const newUser = await User.insert({ username, password: hash })
    await res.status(201).json(newUser)
  }
  catch (error) {
    res.status(500).json({ message: 'There is an Error' })
  }
});

router.post('/login', (req, res) => {
  let { username, password } = req.body

  User.checkUserName({ username })
    .then(([user]) => {
      const token = buildToken(user)
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `welcome, ${user.username}`,token})
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    })
    .catch(err => {
      res.json({ message: 'Internal Error' })
    })
})

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload,JWT_SECRET,options)
}
/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.

  1- In order to log into an existing account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel",
      "password": "foobar"
    }

  2- On SUCCESSFUL login,
    the response body should have `message` and `token`:
    {
      "message": "welcome, Captain Marvel",
      "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
    }

  3- On FAILED login due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
    the response body should include a string exactly as follows: "invalid credentials".
*/


module.exports = router;
