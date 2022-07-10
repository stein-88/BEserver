const jwt = require('jsonwebtoken')
const { SECRET } = require('../constants/semlugar')
const { DEN0001 } = require('../constants/reserror')
const { getUserById } = require('../utils')

const userAuth = (userId) => {
    return jwt.sign({ userId: userId }, SECRET, { expiresIn: '1d' })
}

const decodeUser = (token) => {
    try {
        return jwt.verify(token, SECRET)
    } catch (error) {
        throw error
    }
}

const authUser = (auth) => {
    try {
        if (!auth) return {}
        const token = auth.split(' ')[1]
        if (!token) return {}
        const user = decodeUser(token)
        if (!user) return {}
        return user
    } catch (error) {
        return {}
    }
}

const handleAuth = async (user) => {
    try {
        if (!user || !user.userId) throw DEN0001
        const finalUser = await getUserById(user.userId)
        if (!finalUser) throw DEN0001
        return finalUser
    } catch (error) {
        throw error
    }
}

module.exports = {
    userAuth,
    decodeUser,
    handleAuth,
    authUser
}
