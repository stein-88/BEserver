const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()
const { isPass, getfile, getUserById } = require('../../utils')
const pathuser = path.join(__dirname, '../../../build/users.json')
const { PAR0001, PAR0002, PAS0001, DEN0001, WRO0001 } = require('../../constants/reserror')
const { CHANGE_PASS, UPDATE, DEL } = require('../../constants/paths')
const { handleAuth } = require('../../auth')

const editDelUser = async (editobj, isDel) => {
    try {
        if (!editobj) throw PAR0001
        const { userId, modUsers } = editobj || {}
        if (!userId || !modUsers) throw DEN0001
        const allfiles = await getfile() || []
        let newfile = allfiles.filter(ele => ele.userId !== userId)
        if (!isDel) newfile = allfiles.map(ele => ele.userId === userId ? { ...ele, ...modUsers } : ele)
        fs.writeFileSync(pathuser, JSON.stringify(newfile, null, '\t'))
        return true
    } catch (error) {
        throw error
    }
}

router.post(CHANGE_PASS, async (req, res) => {
    try {
        const auth = await handleAuth(req.userInfo)
        const { userId, password } = auth
        const { oldPass, newPass } = req.body || {}
        if (!oldPass || !newPass) return res.status(400).json({ error: PAR0002 })
        if (oldPass !== password) return res.status(401).json({ error: DEN0001 })
        if (!isPass(newPass)) return res.status(400).json({ error: PAS0001 })
        await editDelUser({ modUsers: { password: newPass }, userId })
        return res.json({ success: true })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post(UPDATE, async (req, res) => {
    try {
        const auth = await handleAuth(req.userInfo)
        const { userId } = auth
        const { firstName, lastName } = req.body || {}
        if (!firstName || !lastName) return res.status(400).json({ error: PAR0002 })
        if (!userId) return res.status(401).json({ error: DEN0001 })
        await editDelUser({ modUsers: { firstName, lastName }, userId })
        return res.json({ success: true })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.post(DEL, async (req, res) => {
    try {
        const auth = await handleAuth(req.userInfo)
        const { userId } = auth
        if (!userId) return res.status(401).json({ error: DEN0001 })
        await editDelUser({ userId, modUsers: {} }, true)
        return res.json({ success: true })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router
