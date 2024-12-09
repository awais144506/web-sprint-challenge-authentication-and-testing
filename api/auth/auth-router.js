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
    res.status(201).json(newUser)
  }
  catch (error) {
    res.status(500).json({ message: 'There is an Error' })
  }
});

router.post('/login',checkValidNewUser,(req, res) => {
  let { username, password } = req.body

  User.checkUserName({ username })
    .then(([user]) => {
      const token = buildToken(user)
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `welcome, ${user.username}`,token})
      } else {
        res.status(404).json({ message: 'invalid credentials' })
      }
    })
    .catch(err => {
      res.status(404).json({ message: 'invalid credentials' })
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

module.exports = router;
