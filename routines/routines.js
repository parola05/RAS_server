var helpers = require('./helpers')
var con = require('../config/db')
var axios = require('axios');

module.exports = {
    eventsPopulate: async () =>{
        var events = await axios.get("http://ucras.di.uminho.pt/v1/games/")
        
        var houses = []
        var iter = 0 
        for(var event of events.data){
          if (iter == 0){
            var bookMarker = event["bookmakers"]
            for (var house of bookMarker){
              houses.push(house["key"])
            }
          }
          iter++
        }
  
        var jsonResul = []
        for (var house of houses){
          var eventHouse = {}
          eventHouse["casa"] = house 
          eventHouse["eventos"] = []
  
          for(var event of events.data){
            var evento = {}
            evento["equipa1Nome"] = event["awayTeam"]
            evento["equipa2Nome"] = event["homeTeam"]
  
            var tipoDeApostaL = []
            var tipoDeAposta = {}
            tipoDeAposta["nome"] = "apostaAPI"
            tipoDeAposta["listaDeOdds"] = []
            evento["tipoDeApostas"] 
            var bookMarker = event["bookmakers"]
            
            for (var bm of bookMarker){
              if(bm["key"] == house){
                var markets = bm["markets"]
                for (var m of markets){
                  var outcomes = m["outcomes"]
  
                  var nomes = ["equipa1","equipa2","empate"]
                  var i = 0
                  for(var o of outcomes){
                    var odd = {}
                    odd["nome"] = nomes[i]
                    odd["valor"] = o["price"]
                    tipoDeAposta["listaDeOdds"].push(odd)
                    i++
                  }
                }
              }
            }
  
            tipoDeApostaL.push(tipoDeAposta)
            evento["tipoDeApostas"] = tipoDeApostaL
            eventHouse["eventos"].push(evento)
          } 
          jsonResul.push(eventHouse)
        }
  
        var house = req.body.casa
        
        for (var casa of jsonResul){
          if (casa["casa"] == house){
            for (var evento of casa["eventos"]){
              var equipa1 = evento["equipa1Nome"]
              var equipa2 = evento["equipa2Nome"]
  
              var existeEquipa1 = await helpers.checkIfTeamExist(equipa1)
              var existeEquipa2 = await helpers.checkIfTeamExist(equipa2)
  
              if (existeEquipa1 == null){
                existeEquipa1 = await helpers.createTeam(equipa1)
              }
  
              if (existeEquipa2 == null){
                existeEquipa2 = await helpers.createTeam(equipa2)
              }
  
              var equipa1ID = existeEquipa1
              var equipa2ID = existeEquipa2
              var desportoID = 1
              var data = "2022-10-14 20:15:14" // TODO: ver o que fazer com isto já que a API não fornece a data do jogo
              var tipoDeApostas = evento["tipoDeApostas"]
              var eventID = -1
              
              // cria o evento para obter o id do evento para realizar a inserção 
              // das equipas e das odds já com o id do evento em mãos 
              var query1 = "INSERT INTO evento (date, state, esporte_e) VALUES ('"+data+"','o',"+desportoID+")"
              con.query(query1, function (err, result) {
                if (err){
                  console.log(err)
                  //res.status(500).json({msg:"Erro ao criar Evento"})
                }else{
                  eventID = result.insertId
                  console.log("Sucesso ao criar evento. ID do evento:",eventID)
  
                  // adiciona as equipas adversárias com referência ao evento
                  var query2 = "INSERT INTO esporte_coletivo_adversarios (equipa1, equipa2, evento_c) VALUES ("+equipa1ID+","+equipa2ID+","+eventID+")"
  
                  con.query(query2, function (err, result) {
                    if (err){
                      console.log(err)
                      res.status(500).json({msg:"Erro ao criar equipas adversárias"})
                    }else{
                      console.log("Sucesso ao criar equipas adversárias")
                      
                      // para cada tipo de aposta, é adicionada uma entrada em sua tabela
                      // respetiva juntamente com o ide do evento
                      tipoDeApostas.forEach((tipoDeAposta) => {
                        var nomeTipoDeAposta = tipoDeAposta["nome"]
                        var listaDeOdds = tipoDeAposta["listaDeOdds"]
  
                        var listaDeOddsNomes = "("
                        var listaDeOddsValores = "("
                        listaDeOdds.forEach((odd) =>{
                            listaDeOddsNomes = listaDeOddsNomes + odd["nome"] + ","
                            listaDeOddsValores = listaDeOddsValores + odd["valor"] + ","
                        })
                        listaDeOddsNomes = listaDeOddsNomes + "evento_" + nomeTipoDeAposta + ")"
                        listaDeOddsValores = listaDeOddsValores + + eventID + ")"
  
                        var query3 = "INSERT INTO `"+nomeTipoDeAposta+"` "+listaDeOddsNomes+" VALUES "+listaDeOddsValores
                
                        con.query(query3, function (err, result) {
                          if (err){
                            console.log(err)
                            //res.status(500).json({msg:"Erro ao criar entrada na tabela de tipo de aposta"})
                          }else{
                            console.log("Sucesso ao criar entrada na tabela de tipo de aposta")
                          }
                        })
                      })
  
                      //res.status(200).json({msg:"Sucesso ao criar Evento!"})
                      console.log("Sucesso ao criar evento!")
                    }
                  })
                }
              }) 
          }
        }
      }
      },
}