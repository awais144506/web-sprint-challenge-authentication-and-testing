const db = require('../../data/dbConfig')
async function getUser(id) {
    return await
        db('users')
            .where('id', id)
            .first()
}
async function insert(user) {
    return await
        db('users')
            .insert(user)
            .then(([id]) => {
                return getUser(id)
            })
}
async function checkUserName(filter) {
    return await
        db('users')
            .where(filter)
}

module.exports = {
    insert,
    checkUserName
}