var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "ras_database"
})

module.exports = connection