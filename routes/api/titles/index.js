const { Router } = require('express')
const router = Router()
const { getUser } = require('../../utils')


//VOU DELETAR AQUI CARMA AI



router.get('/', (_, res) => {
    res.json({
        title: 'tituloaq',
        subtitle: 'sub title aqui mais ou menos'
    })
})

router.post('/', async (req, res) => {
    try {
        const { senha, email } = req.body || {}
        if (!email || !senha) {
            return res.status(400).json({ error: 'É necessário o preenchimento de todos os parâmetros' })
        }
        const user = await getUser(email, senha)
        if (!user) return res.status(401).json({ error: 'Usuario ou senha invalido.' })
        return res.json({
            jwtToken: 'newJKOFDHLJKFSJKBFLK3**&_7593480tnjfklgfjdgn_fnasdflgnldkm'
        })
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router
