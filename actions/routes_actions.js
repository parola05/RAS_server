var con = require('../config/db')
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken')
const util = require('util');
var async = require('async');
var helpers = require('./helpers')
var axios = require('axios');
const { read } = require('fs');

var routesActions = {
    signup: (req,res) =>{
        //console.log(req.body)
        var username = req.body.username 
        var password = req.body.password 
        var email = req.body.email 
        var nif = req.body.nif  
        var iban = req.body.iban 
        var birthday = req.body.birthday
        var credential = "u"

        var passwordHash=bcrypt.hashSync(password, 10);

        const query = "INSERT INTO user (username, password, email, nif, iban, birthday, credential) VALUES ('"+username+"','"+passwordHash+"','"+email+"','"+nif+"','"+iban+"','"+birthday+"','"+credential+"')"

        con.query(query, function (err, result) {
          if (err){
            console.log(err)
            res.status(400).json({msg:"Já existe utilizador com este nome"})
          }else{
            res.status(200).json({msg: "Sucesso ao adicionar utilizador"})  
          }
        });    
    },

    login: (req,res) =>{
        //console.log(req.body)
        var email = req.body.email 
        var password = req.body.password 

        const query="SELECT password, iduser from user where email=?"
        const params=[email]

        con.query(query,params, (err, rows) => {
          if (err){
              res.status(500).json({msg:"Erro no servidor"})
          }else{
              if (rows.length!=0){
                  
                  var password_hash=rows[0]["password"]
                  const verified = bcrypt.compareSync(password, password_hash)
                  
                  if(verified){
                      JWT.sign({userID: rows[0]["iduser"]}, "Rasbet", {algorithm: 'HS256', noTimestamp: true, expiresIn: '1h' }, function(err, token){
                          if(err){
                               res.status(500).json({ msg: "Token falhou"})
                          } else {
                              res.status(200).json({tokenType: "Bearer", token: token})
                          }
                       })
                  }else{
                      res.status(400).json({msg:"Senha incorreta"})
                  }
              }else{
                  res.status(400).json({msg:"Utilizador não encontrado"})
              }
          }
      })
    },

    createSoccerEvent: (req,res) =>{
        console.log(req.body)

        var team1Name =  req.body.team1Name
        var team2Name = req.body.team2Name
        var oddTeam1Wins = req.body.oddTeam1Wins
        var oddTeam2Wins = req.body.oddTeam2Wins
        var oddDraw = req.body.oddDraw
        var oddTeam1WinOrDraw = req.body.oddTeam1WinOrDraw
        var oddTeam2WinOrDraw = req.body.oddTeam2WinOrDraw
        var oddTeam1orTeam2 = req.body.oddTeam1orTeam2
        var oddBothScore = req.body.oddBothScore
        var oddBothNoScore = req.body.oddBothNoScore
        var oddTeam1WithoutDraw = req.body.oddTeam2WithoutDraw
        var oddTeam2WithoutDraw = req.body.oddTeam2WithoutDraw
        var oddMoreThan15 = req.body.oddMoreThan15
        var oddMoreThan25 = req.body.oddMoreThan25
        var date = req.body.date

        const query1 = "INSERT INTO event (date, state) VALUES ('"+date+"','op')"
        
        console.log("executando primeira query")

        con.query(query1, function (err, result) {
          if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao adicionar evento"})
          }else{
            let eventID = result.insertId

            const query2 = "INSERT INTO soccer_odds (team_1, team_2, team_1_win, team_2_win, draw, team_1_or_draw, team_2_or_draw, team_1_or_team_2, both_score_yes, both_score_no, team_1_without_draw, team_2_without_draw, total_goals_more_15, total_goals_more_25, soccer_event) VALUES ('"+team1Name+"','"+team2Name+"',"+oddTeam1Wins+","+oddTeam2Wins+","+oddDraw+","+oddTeam1WinOrDraw+","+oddTeam2WinOrDraw+","+oddTeam1orTeam2+","+oddBothScore+","+oddBothNoScore+","+oddTeam1WithoutDraw+","+oddTeam2WithoutDraw+","+oddMoreThan15+","+oddMoreThan25+","+eventID+")"  
          
            con.query(query2, function (err, result) {
                if (err){
                  console.log(err)
                  res.status(500).json({msg:"Erro ao adicionar odd de jogo de futebol"})
                }else{
                  res.status(200).json({msg: "Sucesso ao adicionar odd de jogo de futebol"})  
                }
              });    
        
          }
        });  
    },

    createBasketEvent: (req,res) =>{
      //console.log(req.body)

      var team1Name =  req.body.team1Name
      var team2Name = req.body.team2Name
      var oddTeam1Wins = req.body.oddTeam1Wins
      var oddTeam2Wins = req.body.oddTeam2Wins
      var totalPointsMore212 = req.body.totalPointsMore212
      var totalPointsMore222 = req.body.totalPointsMore222
      var totalPointsMore232 = req.body.totalPointsMore232
      var date = req.body.date

      const query1 = "INSERT INTO event (date, state) VALUES ('"+date+"','op')"
      
      //console.log("executando primeira query")

      con.query(query1, function (err, result) {
        if (err){
          console.log(err)
          res.status(500).json({msg:"Erro ao adicionar fornecimento"})
        }else{
          let eventID = result.insertId

          const query2 = "INSERT INTO basket_odds (team_1, team_2, team_1_win, team_2_win, total_points_more_212, total_points_more_222, total_points_more_232, basket_event) VALUES ('"+team1Name+"','"+team2Name+"',"+oddTeam1Wins+","+oddTeam2Wins+","+totalPointsMore212+","+totalPointsMore222+","+totalPointsMore232+","+eventID+")"  
        
          con.query(query2, function (err, result) {
              if (err){
                console.log(err)
                res.status(500).json({msg:"Erro ao adicionar odd de jogo de basquete"})
              }else{
                res.status(200).json({msg: "Sucesso ao adicionar odd de jogo de basquete"})  
              }
            });    
      
        }
      });  
    },

    getSoccerEvents: (req,res) =>{

      const query = "SELECT soccer_odds.idsoccer_odds, soccer_odds.team_1, soccer_odds.team_2, soccer_odds.team_1_win, soccer_odds.team_2_win, soccer_odds.draw, soccer_odds.team_1_or_draw, soccer_odds.team_2_or_draw, soccer_odds.team_1_or_team_2, soccer_odds.both_score_yes, soccer_odds.both_score_no, soccer_odds.team_1_without_draw, soccer_odds.team_2_without_draw, soccer_odds.total_goals_more_15, soccer_odds.total_goals_more_25, soccer_odds.soccer_event, event.date, event.state "+ 
      "FROM soccer_odds INNER JOIN event "+
      "ON soccer_odds.soccer_event = event.idevent"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({mes:"Erro no servidor"})
        }else{
            res.status(200).json({soccerEvents:rows})
        }
      })
    },

    getBasketEvents: (req,res) =>{

      const query = "SELECT basket_odds.idbasket_odds, basket_odds.team_1, basket_odds.team_2, basket_odds.team_1_win, basket.team_2_win, basket_odds.total_points_more_212, basket_odds.total_points_more_222, basket_odds.total_points_more_232 ,event.date, event.state "+ 
      "FROM basket_odds INNER JOIN event "+
      "ON basket_odds.basket_event = event.idevent"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({mes:"Erro ao selecionar eventos de basquete"})
        }else{
            res.status(200).json({basketEvents:rows})
        }
      })
    },

    createBuletin: (req,res) =>{
       //console.log(req.body)

       var bets = req.body.bets
       var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
       var gain = req.body.gain 
       var type = req.body.type 
       var amount = req.body.amount

       const query1 = "INSERT INTO buletin (amount, gain, type, user_buletin) VALUES ("+amount+","+gain+",'"+type+"',"+user.userID+")"

       // Cria o Boletim e todas as apostas relacionadas
       con.query(query1, function (err, result) {
        if (err){
          console.log(err)
          console.log("Erro ao criar Boletim")
          res.status(500).json({msg:"Erro ao criar Boletim"})
        }else{
          let buletinID = result.insertId

          var query2 = "INSERT INTO bet (odd_selected,evento,sport,buletin) VALUES "

          var iter = 1
          var betsSize = bets.length
          for (const bet of bets){
            var event = bet.event 
            var oddSelected = bet.oddSelected
            var sport = bet.sport

            if (iter == betsSize){
              query2 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+"); " 
            }else{
              query2 += "('"+oddSelected+"',"+event+",'"+sport+"',"+buletinID+"), " 
            }

            iter++
          }
          
          con.query(query2, function (err, result) {
            if (err){
              console.log(err)
              res.status(500).json({msg:"Erro ao criar Apostas"})
            }else{
              console.log("Sucesso ao criar apostas individuais")
            }
          })
        }
       })
       
       const query3 = "SELECT balance FROM user WHERE iduser = "+user.userID+""
      
       // create a bet transaction type and update user balance
       con.query(query3, (err, rows) => {
         if (err){
          console.log("Erro ao selecionar utilizador")
          res.status(500).json({msg:"Erro ao selecionar utilizador"})
         }else{
             if (rows.length!=0){
                 // Sucesso ao encontrar utilizador
 
                 var balance=rows[0]["balance"]
                 var newBalance = balance - amount
 
                 var query4 = "UPDATE user SET balance = "+newBalance+" WHERE iduser = "+user.userID+"" 
 
                 con.query(query4, (err, rows) => {
                   if (err){
                    console.log("Erro ao atualizar saldo do utilizador")
                    res.status(500).json({msg:"Erro ao atualizar saldo"})
                   }else{
                      // Sucesso ao atualizar saldo

                      var transactionType = "be"
                      var query5 = "INSERT INTO transaction (user, type, amout) VALUES ("+user.userID+",'"+transactionType+"',"+amount+")"
                     
                      con.query(query5, (err, rows) => {
                       if (err){
                        console.log("Erro ao criar transação")
                        res.status(500).json({msg:"Erro ao criar transação"})
                       }else{
                        // Sucesso ao criar transação
                        console.log("Sucesso ao criar transação")
                        res.status(200).json({msg: "Sucesso ao criar transação"})  
                       }
                     })
                   }
                 })
             }
         }
       })
    },

    getUserData: (req,res) =>{
      var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

      var query1 = "SELECT * FROM user WHERE iduser = "+user.userID+""  

      con.query(query1, (err, rows) => {
        if (err){
            res.status(500).json({msg:"Erro ao selecionar saldo do utilizador"})
        }else{
            if (rows.length!=0){
                // Sucesso ao encontrar utilizador

                var user=rows[0]
                res.status(200).json({user:user})
            }
        }
      })
    },

    deposit: (req,res) =>{

      var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
      var amount = req.body.amount 
      var type = "de"

      var query1 = "SELECT balance FROM user WHERE iduser = "+user.userID+""
      
      // Update user balance and create a new transaction
      con.query(query1, (err, rows) => {
        if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao selecionar utilizador"})
        }else{
            if (rows.length!=0){
                // Sucesso ao encontrar utilizador

                var balance=rows[0]["balance"]
                var newBalance = balance + amount

                var query2 = "UPDATE user SET balance = "+newBalance+" WHERE iduser = "+user.userID+"" 

                con.query(query2, (err, rows) => {
                  if (err){
                    console.log(err)
                    res.status(500).json({msg:"Erro ao atualizar saldo"})
                  }else{
                     // Sucesso ao atualizar saldo
                     var query3 = "INSERT INTO transaction (user, type, amout) VALUES ("+user.userID+",'"+type+"',"+amount+")"
                    
                     con.query(query3, (err, rows) => {
                      if (err){
                          console.log(err)
                          res.status(500).json({msg:"Erro ao criar transação"})
                      }else{
                         // Sucesso ao criar transação
                         console.log("Sucesso ao criar transação")
                         res.status(200).json({msg: "Sucesso ao criar transação"})  
                      }
                    })
                  }
                })
            }
        }
      })
    },

    raise: (req,res) =>{
      //console.log(req.body)

      var user = JWT.verify(req.header('authorization').substring(7), "Rasbet");
      var amount = req.body.amount 
      var type = "ra"

      var query1 = "SELECT balance FROM user WHERE iduser = "+user.userID+""
      
      // Update user balance and create a new transaction
      con.query(query1, (err, rows) => {
        if (err){
          console.log(err)
          res.status(500).json({msg:"Erro ao selecionar utilizador"})
        }else{
            if (rows.length!=0){
                // Sucesso ao encontrar utilizador

                var balance=rows[0]["balance"]
                var newBalance = balance - amount

                var query2 = "UPDATE user SET balance = "+newBalance+" WHERE iduser = "+user.userID+"" 

                con.query(query2, (err, rows) => {
                  if (err){
                      res.status(500).json({msg:"Erro au atualizar saldo"})
                  }else{
                     // Sucesso ao atualizar saldo
                     var query3 = "INSERT INTO transaction (user, type, amout) VALUES ("+user.userID+",'"+type+"',"+amount+")"
                    
                     con.query(query3, (err, rows) => {
                      if (err){
                        console.log(err)
                        res.status(500).json({msg:"Erro ao criar transação"})
                      }else{
                         // Sucesso ao criar transação
                         console.log("Sucesso ao criar transação")
                         res.status(200).json({msg: "Sucesso ao criar transação"})  
                      }
                    })
                  }
                })
            }
        }
      })
    },

    getUserTransactions: (req,res) =>{
      //console.log(req.body)
      var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 

      const query = "SELECT type, date, amout FROM transaction WHERE user = "+user.userID+""

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({mes:"Erro ao selecionar transações do utilizador"})
        }else{
            res.status(200).json({transactions:rows})
        }
      })  
    },

    getUserBuletinHistory: (req,res) =>{
      //console.log(req.body)
      var user = req.body.user

      const query = "SELECT idbuletin, amount, gain, type  FROM buletin WHERE user = "+user+""

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({mes:"Erro ao selecionar transações do utilizador"})
        }else{
            // Sucesso na seleção de todos os boletins criados pelo utilizador.
            // Agora para cada boletin devo coletar as informações necessárias
            // das suas apostas envolvidas.

            // TODO
            res.status(200).json({transactions:rows})
        }
      })  
    },

    createBetType: (req,res) =>{
     
      var betTypeName = req.body.betTypeName
      var oddNames = req.body.oddNames
      var sportsID = req.body.sportsID

      var query = "CREATE TABLE `ras_database`.`"+betTypeName+"` ("+
        "`id"+betTypeName+"` INT NOT NULL AUTO_INCREMENT, "

        oddNames.forEach((oddName) => {
          query = query + "`"+oddName["oddName"]+"` DECIMAL(3,2) NOT NULL, " 
        })

        query = query + "`evento_"+betTypeName+"` INT NOT NULL, "+
        "PRIMARY KEY (`id"+betTypeName+"`), "+
        "INDEX `evento_"+betTypeName+"_idx` (`evento_"+betTypeName+"` ASC) VISIBLE, "+
        "CONSTRAINT `evento_"+betTypeName+"` "+
          "FOREIGN KEY (`evento_"+betTypeName+"`) "+
          "REFERENCES `ras_database`.`evento` (`idevent`) "+
          "ON DELETE NO ACTION "+
          "ON UPDATE NO ACTION);"

      // Cria a tabela tipo de aposta
      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({mes:"Erro ao adicionar tipo de aposta"})
        }else{
            // Relaciona cada esporte selecionado com a tabela tipo de aposta
            var query2 = "INSERT INTO esportes_tipo_de_apostas (esporte,tipo_de_aposta) VALUES "
            var sportsSize = sportsID.length
            var i = 1

            sportsID.forEach((sportID) => {
              if (i == sportsSize)
                query2 += "("+sportID["sportID"]+",'"+betTypeName+"'); " 
              else 
                query2 += "("+sportID["sportID"]+",'"+betTypeName+"'), " 
              i++
            })    
            
            con.query(query2, (err, rows) =>{
              if (err){
                  console.log(err)
                  res.status(500).json({mes:"Erro ao relacionar esporte com tipo de aposta"})
              }else{
                  res.status(200).json({msg:"Sucesso ao criar tipo de aposta e relacionar esportes com o tipo de aposta"})
              }
            }) 
        }
      })  
    },

    createSport: (req,res) =>{
      var name = req.body.name 
      var type = req.body.type

      var query = "INSERT INTO esporte (nome, tipo) VALUES ('"+name+"','"+type+"')"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao criar esporte"})
        }else{
          res.status(200).json({msg:"Sucesso ao criar esporte"})
        }
      })  
    },

    getSports: (req,res) =>{
      const query = "SELECT idesporte, nome, tipo FROM esporte"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao listar esportes"})
        }else{
          res.status(200).json({esportes:rows})
        }
      })  
    },

    createEventColetive: (req,res) =>{

      var equipa1ID = req.body.equipa1ID
      var equipa2ID = req.body.equipa2ID 
      var desportoID = req.body.desportoID 
      var data = req.body.data 
      var tipoDeApostas = req.body.tipoDeApostas
      var eventID = -1

      // cria o evento para obter o id do evento para realizar a inserção 
      // das equipas e das odds já com o id do evento em mãos 
      var query1 = "INSERT INTO evento (date, state, esporte_e) VALUES ('"+data+"','o',"+desportoID+")"
      con.query(query1, function (err, result) {
        if (err){
          console.log(err)
          res.status(500).json({msg:"Erro ao criar Evento"})
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
                    res.status(500).json({msg:"Erro ao criar entrada na tabela de tipo de aposta"})
                  }else{
                    console.log("Sucesso ao criar entrada na tabela de tipo de aposta")
                  }
                })
              })

              res.status(200).json({msg:"Sucesso ao criar Evento!"})
            }
          })
        }
      })
    },

    getBetTypeStructureBySport: async (req,res) =>{
      var desportoID = req.body.desportoID
      if (!desportoID) desportoID = 1
      console.log(desportoID)
      //var resJson = '{ "estrutura": ['
      var listaTipoDeApostas = []

      // Selecionar todos os tipos de aposta do desporto
      var query1 = "SELECT tipo_de_aposta FROM esportes_tipo_de_apostas WHERE esporte = "+desportoID

      con.query(query1, async function(err,rows,fields){
        //var tamanhoRows = rows.length
        //var rowsIter = 1
        for (const tipoDeAposta of rows){
          var tipoDeApostaJson = {}
          var listaDeOddsJson = []
          var tipoDeApostaNome = tipoDeAposta["tipo_de_aposta"]
          tipoDeApostaJson["nome"] = tipoDeApostaNome
          //resJson = resJson + '{ "nome": "' + tipoDeApostaNome + '", "listaDeOdds": [ ' 

          var query2 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'"+tipoDeApostaNome+"'"
        
          var listaDeOdds = await helpers.writeOdd(query2)

          tipoDeApostaJson["listaDeOdds"] = listaDeOdds
          //resJson = resJson + json
            
          //if (tamanhoRows == rowsIter)
          //    resJson = resJson + ']}]'
          //else resJson = resJson = resJson + ']},'
          //rowsIter++
          listaTipoDeApostas.push(tipoDeApostaJson)
        }

        //resJson = resJson + ' }'
        res.status(200).json({estrutura: listaTipoDeApostas})      
      })
    },

    createTeam: (req,res) =>{
      var nome = req.body.equipa 

      var query = "INSERT INTO equipa (nome) VALUES ('"+nome+"')"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao criar equipa"})
        }else{
          res.status(200).json({msg:"Sucesso ao criar equipa"})
        }
      })  
    },

    createPlayer: (req,res) =>{
      var nome = req.body.jogador 

      var query = "INSERT INTO jogador (nome) VALUES ('"+nome+"')"

      con.query(query, (err, rows) =>{
        if (err){
            console.log(err)
            res.status(500).json({msg:"Erro ao criar jogador"})
        }else{
          res.status(200).json({msg:"Sucesso ao criar jogador"})
        }
      })  
    },

    getSportEventsColetive: async (req,res) => {
      var sportID = req.body.sportID 
      //console.log(req.body)
      if (!sportID) sportID = 1

      // Listar todos os eventos do desporto
      var eventos = await helpers.getEventosDoDesporto(sportID)
      console.log(eventos)

      // Listar tipos de aposta do desporto
      var tiposDeAposta = await helpers.getTiposDeApostaDoDesporto(sportID)
      //console.log(tiposDeAposta)

      // Listar equipas ou jogadores envolvidos no evento
      var equipasEventos = []
      for (var evento of eventos){
        equipasEventos.push(await helpers.getEquipasDoEventoColetivo(evento["idevent"]))
      }
      //console.log(equipasEventos)
      
      // Para cada evento, ir buscar as odds de cada tipo de aposta
      var tiposDeApostasComOddsDeCadaEvento = []
      for (var evento of eventos){
        var eventoID = evento["idevent"]
        //console.log("Indo buscar apostas do evento: "+ eventoID)
        var tiposDeApostasComOdds = []
        
        for (var tipoDeAposta of tiposDeAposta){
          tiposDeApostasComOdds.push(await helpers.getOddsTipoDeAposta(tipoDeAposta,eventoID))
        }
        //console.log(tiposDeApostasComOdds)
        tiposDeApostasComOddsDeCadaEvento.push(tiposDeApostasComOdds)
      }

      //console.log(tiposDeApostasComOddsDeCadaEvento)
      // construção da resposta
      var resJson = {}
      resJson["eventos"] = []
      var iter = 0
      for (var evento of eventos){
        var eventoID = evento["idevent"]
        var equipa1Nome = equipasEventos[iter]["equipa1Nome"]
        var equipa2Nome = equipasEventos[iter]["equipa2Nome"]
        var date = evento["date"]
        var state = evento["state"]

        var tiposDeApostaJson = []

        var iter2 = 0
        for (var tipoDeAposta of tiposDeApostasComOddsDeCadaEvento[iter]){
          var listaDeOdds = []

          for (var odd of tiposDeApostasComOddsDeCadaEvento[iter][iter2]){
            listaDeOdds.push({nome:odd["nome"],valor:odd["valor"]})
            //console.log(listaDeOdds)
          }

          tiposDeApostaJson.push({nome: tiposDeAposta[iter2], listaDeOdds:listaDeOdds})
          iter2++
        }
        
        var evento = {eventoID: eventoID, equipa1Nome: equipa1Nome, equipa2Nome: equipa2Nome, date: date, state: state, tipoDeApostas: tiposDeApostaJson}
        resJson["eventos"][iter] = evento

        iter++
      }
      
      res.status(200).json({eventos:resJson["eventos"]})
    },

    getEventsOthers: async (req,res)=>{
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

                for(var o of outcomes){
                  var odd = {}
                  odd["nome"] = o["name"]
                  odd["valor"] = o["price"]
                  tipoDeAposta["listaDeOdds"].push(odd)
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

      res.status(200).json({jsonResul})
    },

    eventsPopulate: async (req,res) =>{
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

    getBuletin: async (req,res) =>{
      var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
      
      var query = "SELECT * FROM buletin WHERE user_buletin = "+user.userID 

      con.query(query, (err, rows) =>{
        if (err){
          console.log("Erro ao listar eventos do utilizador")
          console.log(err)
          res.status(500).json({msg:"Erro ao listar eventos do utilizador"})
        }else{
          res.status(200).json({boletins: rows})
        }
      })
    },

    getBetsByBuletin: async (req,res)=>{
      //var user = JWT.verify(req.header('authorization').substring(7), "Rasbet"); 
      var buletinID = req.body.buletinID

      var apostasDoBoletim = await helpers.getApostasDoBoletim(buletinID)
      
      var resJson = []

      for (var aposta of apostasDoBoletim){
        var apostaJson = {}
        apostaJson["oddSelected"] = aposta["odd_selected"]
        apostaJson["evento"] = await helpers.getEquipasDoEventoColetivo(aposta["evento"]) 
      
        resJson.push(apostaJson)
      }

      res.status(200).json({apostas:resJson})
    },
}

module.exports = routesActions