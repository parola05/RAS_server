var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class TransacaoDAO {

    subject = null 

    constructor(subject){
        this.subject = subject
        if (typeof(subject.registerObserver) == "function"){
            subject.registerObserver(this)
        }
    }

    async update(type,amount,userID){
        console.log("[INVOCAR] addTransaction()")
        await this.addTransaction(type,amount,userID)
    }

    async getTransactionsByUser(userID){
        const query1 = "SELECT type, date, amout FROM transaction WHERE user = "+userID+""
        
         try{
            const rows = await query(query1)
            return rows
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async addTransaction(transactionType,amount,userID){
        var query1 = "INSERT INTO transaction (user, type, amout) VALUES ("+userID+",'"+transactionType+"',"+amount+")" 
        
        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }
    }
}