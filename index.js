const express = require('express')
const app = express()
const path = require('path')
const routes = require('./routes')
const fullPath = path.join(__dirname, 'build')
const { authUser } = require('./routes/auth')

app.use(express.static(fullPath))
app.use(express.json())

app.use((req, _, next) => {
    req.userInfo = authUser(req.headers && req.headers.authorization)
    next()
})

app.use('/', routes)
app.get('*', (_, res) => {
    res.sendFile(path.join(fullPath, 'index.html'))
})

app.listen(4545)

console.log(`🚀  App is listening on http://localhost:4545`)