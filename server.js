const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/index')
const userRoutes = require('./routes/UserRoutes')
const eventRoutes = require('./routes/EventRoutes')
const db = require('./config/db.js')

const app = express()

// Database connection
db.connect((err) => {
    if (err) {
      console.log("Error occurred", err);
    } else {
      console.log("Connected to MySQL Server");
    }
});

app.use(cors({origin: ['http://localhost:8080'],}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(routes)
app.use('/user',userRoutes)
app.use('/event',eventRoutes)

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})