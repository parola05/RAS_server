var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class BetDAO {
    async addBetsFromBuletin(bets,buletinID,buletinType){
        var query1 = ""

        if(buletinType == "m"){
            console.log("[INVOCAR] query1 with s")
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
            console.log("[INVOCAR] query1 with s")
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
    }

    async getBetsFromBuletin(buletinID){
        console.log("[INVOCAR] query1")
        var query1 = "SELECT * FROM bet WHERE buletin = "+buletinID
        try{
            var rows = await query(query1)
            return rows
        } catch(err){
            console.log(err)
        }
    }

    async getBetsWaitingFromEvent(eventID){
        var query1 = "SELECT * FROM bet WHERE state = 'a' AND evento = "+eventID

        try{
            var rows = await query(query1)
            return rows
        }catch(error){
            console.log(err)
        }
    }

    async setBetState(betID,state){
        const query1 = "UPDATE bet SET state = '"+state+"' WHERE idbet = '"+betID+"';"

        try{
            await query(query1)
        }catch(err){
            throw Error("Erro em conectar com base de dados") 
        }    
    }

    async checkIfBuletinMSuccess(buletinID){
        var success = true  
        var query1 = "SELECT state FROM bet WHERE buletin = "+buletinID

        try{
            var rows = await query(query1)
            for(const row of rows){
                if (row.state != "h"){
                    success = false
                }
            }

            return success
        }catch(error){
            console.log(err)
        }    
    }
}