var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    user: "parola",
    password: "30052001Hp",
    database: "ras_database"
})

module.exports = connection