var con = require('../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = {
    async addBuletin(amount,gain,type,userID){
        const query1 = "INSERT INTO buletin (amount, gain, type, user_buletin) VALUES ("+amount+","+gain+",'"+type+"',"+userID+")" 

        try{
            var result = await query(query1)
            return result.insertId
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async addBetsFromBuletin(bets,buletinID,buletinType){
        var query1 = ""

        if(buletinType == "m"){
            query1 = "INSERT INTO bet (odd_selected,evento,sport,buletin) VALUES "

            var iter = 1
            var betsSize = bets.length
            for (const bet of bets){
                var event = bet.event 
                var oddSelected = bet.oddSelected
                var sport = bet.sport

                if (iter == betsSize){
                    query1 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+"); " 
                }else{
                    query1 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+"), " 
                }

                iter++
            }
        }else{
            query1 = "INSERT INTO bet (odd_selected,evento,sport,buletin,amount,gain) VALUES "

            var iter = 1
            var betsSize = bets.length
            for (const bet of bets){
                var event = bet.event 
                var oddSelected = bet.oddSelected
                var sport = bet.sport
                var gain = bet.gain 
                var amount = bet.amount

                if (iter == betsSize){
                    query1 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+","+amount+","+gain+"); " 
                }else{
                    query1 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+","+amount+","+gain+"), " 
                }

                iter++
            }
        }
          
        try{
            await query(query1)
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getBuletinsFromUser(userID){      
        var query1 = "SELECT * FROM buletin WHERE user_buletin = "+userID 

        try{
            var rows = await query(query1)
            return rows
        }catch(err){
            console.log(err)
            throw Error("Erro em conectar com base de dados") 
        }
    },

    async getBetsFromBuletin(buletinID){
        var query1 = "SELECT * FROM bet WHERE buletin = "+buletinID
        try{
            var rows = await query(query1)
            return rows
        } catch(err){
            console.log(err)
        }
    }
}