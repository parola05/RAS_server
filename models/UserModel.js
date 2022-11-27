var con = require('../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = {
    async getUsers(){
        var query1 = "SELECT email,credential FROM user;"  

        try{
            var rows = await query(query1)
            if (rows.length!=0){
                return rows;
            }else{
                throw Error("Não há utilizadores no sistema")
            }
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async setUserAdmin(userEmail){

        const query1 = "UPDATE user SET credential = 'a' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async setUserSpe(userEmail){

        const query1 = "UPDATE user SET credential = 's' WHERE email = '"+userEmail+"';"

        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },
}