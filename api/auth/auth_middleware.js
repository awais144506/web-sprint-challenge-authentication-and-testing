const User = require('../users/users-model')
async function checkValidNewUser(req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ message: 'username and password required' })
    }
    else {
        next()
    }
}
async function checkAvailable(req, res, next) {
    const user = await User.checkUserName({ username: req.body.username })
    if (user.length) {
        res.send('username taken')
    }
    else {
        next()
    }
}


module.exports = {
    checkValidNewUser,
    checkAvailable
}