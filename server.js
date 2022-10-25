const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/index')

const app = express()

app.use(cors({origin: ['http://localhost:8080'],}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(routes)

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})