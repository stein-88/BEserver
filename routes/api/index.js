const { Router } = require('express')
const router = Router()

const titles = require('./titles')
const sign = require('./sign')
const account = require('./account')

router.use('/titles', titles)
router.use('/sign', sign)
router.use('/account', account)

module.exports = router
