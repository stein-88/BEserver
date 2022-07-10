const axios = require('axios')
const { EMAIL_REGEX, PASSWORD_REGEX } = require('../constants')
const { PAR0002, PAR0001 } = require('../constants/reserror')

const isEmail = (em) => EMAIL_REGEX.test(em)
const isPass = (pas) => PASSWORD_REGEX.test(pas)

const validChar = (wordName) => {
    if (!wordName || typeof wordName !== 'string') return false
    return !!(wordName !== '' && wordName.trim() !== '')
}

const validArrayChar = (wordArrays) => {
    if (!wordArrays || !wordArrays.length) return false
    return !(wordArrays.filter((cv) => validChar(cv) === false).length > 0)
}

const getfile = async () => {
    try {
        //a url tem que estar dentro da constante e vir do .env
        const users = await axios.get(`http://localhost:4545/users.json?${new Date().getTime()}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        })
        return Array.isArray(users && users.data) ? users.data : []
    } catch (error) {
        return []
    }
}

const getUser = async (email, pass) => {
    try {
        if (!email || !pass) throw PAR0002
        const cred = await getfile()
        return cred.filter(ele => ele.email === email && ele.password === pass)[0]
    } catch (error) {
        throw error
    }
}

const getUserById = async (userId) => {
    try {
        if (!userId) throw PAR0002
        const cred = await getfile()
        return cred.filter(ele => ele.userId === userId)[0]
    } catch (error) {
        throw error
    }
}

const hasUser = async (email) => {
    try {
        if (!email) throw PAR0001
        const cred = await getfile()
        return cred.filter(ele => ele.email === email)[0]
    } catch (error) {
        throw error
    }
}

/* const deletarArquivo = () => {
    try {
        fs.unlinkSync('./qual.json')
        console.log('arquivo deletado com sucesso')
    } catch (error) {
        console.log('nao consegui achar o arquivo')
    }
}
*/

module.exports = {
    validChar,
    validArrayChar,
    hasUser,
    isEmail,
    isPass,
    getfile,
    getUser,
    getUserById
}