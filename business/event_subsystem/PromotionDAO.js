var con = require('../../config/db')
const util = require('util');
const query = util.promisify(con.query).bind(con);

module.exports = class PromotionDAO {

    observers = []

    registerObserver(observer){
        console.log("[INVOCAR] this.observers.push with " + observer)
        this.observers.push(observer)
    }

    removeObserver(observer){
        this.observers.splice(this.observers.findIndex(observer),1)
    }

    async notifyAll(users, title, description){
        console.log("[INVOCAR] for (o of this.observers) with " + this.observers.length)
        for (const o of this.observers){
            console.log("[INVOCAR] typeof(o.update) == function")
            if (typeof(o.update) == "function"){
                console.log("[INVOCAR] update()")
                await o.update(users, title, description)
            }
        }
    }

    async addPromotion(minAmount,expDate,perElevation,eventID){
        console.log("[INVOCAR] this.addPromotion_")
        this.addPromotion_(minAmount,expDate,perElevation,eventID)
        
        const userAll = [1]
        
        console.log("[INVOCAR]  this.notifiyAll")
        this.notifyAll( 
            userAll,
            "Promoção",
            "Para apostas com um montante mínimo de " + minAmount + " no evento " +
            eventID + " os seus ganhos podem ser multiplicados por " + perElevation + "!" +
            " Válida até " + expDate + ".")
    }

    async addPromotion_(minAmount,expDate,perElevation,eventID){
        console.log("[INVOCAR] query1")
        var query1 = "INSERT INTO promotion (minAmount, expDate, perElevation, eventIDPromotion) VALUES ("+minAmount+",'"+expDate+"',"+perElevation+","+eventID+")" 
        
        try{
           await query(query1)
        }catch(err){
            console.log(err) 
            throw Error("Erro em conectar com base de dados") 
        }
    }

    async getEventPromotion(eventID){
        console.log("[INVOCAR] query1")
        const query1 = "SELECT * FROM promotion WHERE eventIDPromotion = "+eventID
        
        try{
           const rows = await query(query1)
           return rows[0]
       }catch(err){
           throw Error("Erro em conectar com base de dados") 
       }    
    }
}