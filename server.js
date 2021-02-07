const express = require('express')
const bodyparser = require('body-parser')
const apiRouters = require('./routes/APIroutes')
const app = express()

app.use(bodyparser.urlencoded())
app.use(bodyparser.json())

app.use('/',apiRouters)


app.listen(process.env.PORT || 3000,()=>console.log('listening'))