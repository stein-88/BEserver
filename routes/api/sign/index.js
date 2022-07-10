const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()
const { hasUser, isEmail, getfile, isPass, getUser } = require('../../utils')
const { USE0002, USE0003, PAR0003, PAR0002, USE0004 } = require('../../constants/reserror')
const { UP, IN } = require('../../constants/paths')
const { v4 } = require('uuid')
const { userAuth } = require('../../auth')

const escreverUser = async (obj) => {
    try {
        if (!obj) throw PAR0003
        const { email } = obj || {}
        const hUser = await hasUser(email)
        if (hUser) throw USE0003
        const allfiles = await getfile() || []
        fs.writeFileSync(path.join(__dirname, '../../../build/users.json'), JSON.stringify([...allfiles, { ...obj }], null, '\t'))
        return true
    } catch (error) {
        throw error
    }
}

router.post(UP, async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNum } = req.body || {}
        if (!firstName || !lastName || !email || !password || !contactNum) {
            return res.status(400).json({ error: PAR0002 })
        }
        if (!isEmail(email) || !isPass(password)) {
            return res.status(400).json({ error: USE0004 })
        }
        await escreverUser({ firstName, lastName, email, password, contactNum, userId: v4() })
        return res.json({ success: true })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post(IN, async (req, res) => {
    try {
        const { email, password } = req.body || {}
        if (!email || !password) return res.status(400).json({ error: PAR0002 })
        const user = await getUser(email, password)
        if (!user) return res.status(401).json({ error: USE0002 })
        const { userId } = user
        const token = userAuth(userId)
        return res.json({ user, token })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router
