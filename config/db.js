var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    user: "parola",
    password: "",
    database: "ras_database"
})

module.exports = connection