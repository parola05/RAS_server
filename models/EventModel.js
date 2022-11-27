var con = require('../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = {
    async setEventState(state,eventID){
        const query1 = "UPDATE evento SET state = '"+state+"' WHERE idevent = '"+eventID+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addSport(name,type){
        const query1 = "INSERT INTO esporte (nome, tipo) VALUES ('"+name+"','"+type+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addTeam(name){
        const query1 = "INSERT INTO equipa (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addPlayer(name){
        const query1 = "INSERT INTO jogador (nome) VALUES ('"+name+"')"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }
}