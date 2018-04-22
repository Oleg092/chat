var http = require('http');
var Static = require('node-static');
var mysql = require('mysql') ;

var WebSocketServer = new require('ws');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'stalker',
  database : 'chat'
});

connection.connect();

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
function now(){
  var date = new Date();
  date = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
  return date;
}
function fulldate(){
  var fulldate = new Date();
  var Month = fulldate.getMonth() + 1;
  fulldate = fulldate.getFullYear() + "-" + Month + "-" + fulldate.getDate() + " " + fulldate.getHours() + ":" + fulldate.getMinutes() + ":" + fulldate.getSeconds();
  return fulldate;
}

var clients = {};
var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws){

  var id = Math.random();
  var idConection = id;
  clients[id] = [];
  clients[id][idConection] = ws; 
  
 
  
  console.log(now() + " Новое соединение: ID = " + id + ", IDConection  = " + idConection);

  ws.on('message', function(message) {
    
    message = JSON.parse(message);
    
    if(message["action"] == "registration" && id < 1){
      var regData = {
        "email": message["email"],
        "name": message["name"],
        "sur_name": message["sur_name"],
        "login": message["login"],
        "birth_day": message["birth_day"],
        "sex": "1",
        "password": message["password"]
      };
      var uniqRegSqlEmail = "SELECT * FROM user WHERE email='" + regData.email + "';";
      connection.query(uniqRegSqlEmail, function(err, rows, fields){
        if(!err){
          if(rows.length == 0){
            var uniqRegSqlLogin = "SELECT * FROM user WHERE login='" + regData.login + "';";
            connection.query(uniqRegSqlLogin, function(err, rows, fields){
              if(!err){
                if(rows.length == 0){
                  var sqlRegistration = "INSERT INTO user (login, email, pass, sex, berd_date, name, sur_name) VALUES ('" + regData.login + "', '" + regData.email + "', '" + regData.password + "', '" + regData.sex + "', '" + regData.birth_day + "', '" + regData.name + "', '" + regData.sur_name + "');";
                  connection.query(sqlRegistration, function(err, rows, fields){
                    if (!err){
                      var messageClient = {
                        "event": "registrationSucces"
                      };
                      console.log(now() + " Регистрация успешная: " + regData.email);
                      clients[id][idConection].send(JSON.stringify(messageClient));
                    }
                    else{
                      console.log('Error while performing Query. 1');
                      var messageClient = {
                        "event": "registrationFailed",
                        "details": "Ошибка регистрации. Проверьте данные"
                      };
                      clients[id][idConection].send(JSON.stringify(messageClient));
                      //
                    }
                  });
                }
                else{
                  var messageClient = {
                    "event": "registrationFailed",
                    "details": "Пользователь с данным логином уже зарегистрирован."
                  };
                  console.log(now() + " Данный логин есть в базе");
                  clients[id][idConection].send(JSON.stringify(messageClient));

                }
              }
              else{
                var messageClient = {
                  "event": "registrationFailed",
                  "details": "Ошибка сервера."
                };
                console.log(now() + " Registration: Error while performing Query.5");
                clients[id][idConection].send(JSON.stringify(messageClient));
              }
            });
          }
          else{
              var messageClient = {
                "event": "registrationFailed",
                "details": "Пользователь с данным E-mail уже зарегистрирован."
              };
              console.log(now() + " такой email есть базе");
              clients[id][idConection].send(JSON.stringify(messageClient));
            }
        }
        else{
          console.log(now() + " Registration: Error while performing Query.6");
          var messageClient = {
              "event": "registrationFailed",
              "details": "Ошибка сервера."
            };
              clients[id][idConection].send(JSON.stringify(messageClient));
            
        }
      });      
    }
    if(message["action"] == "athorization" && id < 1){

        console.log(now() + ' Попытка авторизации: ID = ' + id);
          var dbQuery = "SELECT * from user WHERE email='" + message["login"] + "'";
          var params = [];
            params["id"] = id;
            params["login"] = message["login"];
            params["password"] = message["password"];
          connection.query(dbQuery, params, function(err, rows, fields){
            if (!err){
              if(rows.length > 0){

                if(rows[0]["pass"] == params["password"]){
                  console.log(now() + " Пользователь залогинился:");
                   console.log("--**--**-- ID: " + params["id"]);
                   console.log("--**--**-- E-mail: " + params["login"]);
                   console.log("--**--**-- Password: " + params["password"]);
                   //Есть ли уже залогиненые устройсива для этого аккаунта
                   if(clients[rows[0]["id"]] == undefined){
                    //var randomID = randomInteger(0, 100);
                    clients[rows[0]["id"]] = []; 
                    clients[rows[0]["id"]][0] = clients[id][idConection];
                    idConection = 0;
                    delete clients[id];
                    id = rows[0]["id"];
                    console.log("нет залогиненыx");                    
                  }
                  else{
                    newIdConection = clients[rows[0]["id"]].length;
                    clients[rows[0]["id"]][newIdConection] = clients[id][idConection];
                    idConection = newIdConection;
                    delete clients[id];
                    id = rows[0]["id"];
                    console.log("Есть залогиненые");
                  }

                  var messClient = {
                    "event": "authorizationSucces",
                    "userData": {
                      "id": rows[0]["id"],
                      "name": rows[0]["name"],
                      "sur_name": rows[0]["sur_name"],
                      "sex": rows[0]["sex"],
                      "birth_day": rows[0]["berd_date"],
                      "photo":rows[0]["photo"],
                      "photo_mini":rows[0]["photo_mini"]
                    }                    
                  };

                  //Ищем друзей юзера
                  var resultFriends = [];
                 
                  function resultFriendsSender(){ //-----------отправляем клиенту список друзей
                      
                      messClient["userFriends"] = resultFriends;
                    // console.log("отправили" , resultFriends);
                      clients[id][idConection].send(JSON.stringify(messClient));
                  }
                   
                  var userID = rows[0]["id"];
                  var dbQuery = "SELECT * FROM friend WHERE (friend_1='" + userID + "' OR friend_2='" + userID + "') AND status='1';";
                  connection.query(dbQuery, function(err, rows, fields){
                    if (!err){
                      var friendID = '';
                      if(rows.length != 0){
                      rows.forEach(function(item, i, arr) {
                        if (item["friend_1"] != item["friend_2"]){
                          if(item["friend_1"] == userID){
                            friendID = item["friend_2"];
                          }
                          else{
                            friendID = item["friend_1"];
                          }
                        }
                        var length = arr.length;

                        var dbQuery = "SELECT * FROM user WHERE id='" + friendID + "';";
                        connection.query(dbQuery, length, function(err, rows, fields){
                          if (!err){
                            resultFriends.push(rows[0]);
                            if(resultFriends.length == length){
                              resultFriendsSender();
                              
                            }
                          }
                          else{
                            console.log('Error while performing Query.');
                          }
                        });
                      });
                      }
                      else{
                        resultFriendsSender();
                      }
                    }
                    else{
                      console.log('Error while performing Query.');
                    }
                  });
                  //clients[params["id"]].send(JSON.stringify(messClient));
                  var resultNewFriends = [];
                  function resultNewFriendsSender(){ //-----------отправляем клиенту список заявок
                      console.log("вызов функции");
                      messClient["userNewFriends"] = resultNewFriends;
                      //console.log(resultNewFriends); тест
                      clients[id][idConection].send(JSON.stringify(messClient));
                  }
                  var userID = rows[0]["id"];
                  var dbQuery = "SELECT * FROM friend WHERE (friend_2='" + userID + "') AND status='0';";//достаем только входящие заявки
                  connection.query(dbQuery, function(err, rows, fields){
                    if (!err){
                      var friendID = '';
                      if(rows.length != 0){
                      rows.forEach(function(item, i, arr) {
                        if (item["friend_2"] != item["friend_1"]){
                          if(item["friend_1"] == userID){
                            friendID = item["friend_2"];
                          }
                          else{
                            friendID = item["friend_1"];
                          }
                        }
                        var length = arr.length;

                        var dbQuery = "SELECT * FROM user WHERE id='" + friendID + "';"; //получаем список людей, отправивщих заявку
                        connection.query(dbQuery, length, function(err, rows, fields){
                          if (!err){
                            resultNewFriends.push(rows[0]);
                            if(resultNewFriends.length == length){ 
                              resultNewFriendsSender();
                              
                            }
                          }
                          else{
                            console.log('Error while performing Query.');
                          }
                        });
                      });
                      }
                      else{
                        resultFriendsSender();
                      }
                    }
                    else{
                      console.log('Error while performing Query.');
                    }
                  });
                  //clients[params["id"]].send(JSON.stringify(messClient));
                }
                else{
                   console.log(now() + " Пользователь ввел не верный пароль:");
                   console.log("--**--**-- ID: " + params["id"]);
                   console.log("--**--**-- E-mail: " + params["login"]);
                   console.log("--**--**-- Password: " + params["password"]);
                   var messClient = {
                    "event": "authorizationFailed",
                    "details": "Неверный пароль"
                  };
                  clients[id][idConection].send(JSON.stringify(messClient));
                }
              }
              else{
                console.log("user not found");
                var messClient = {
                    "event": "authorizationFailed",
                    "details": "Пользователь не найден"
                  };
                  clients[id][idConection].send(JSON.stringify(messClient));
              }          
    
            }   
            else{    
              console.log('Error while performing Query.');
            }

          });
    }
    if(message["action"] == "sendMessage"){               //новое сообщение
        if(clients[message["to_user_id"]] != undefined){
          var dataOutToClient = {
            "event": "messageNew",
            "from_user_id": id,
            "text_message": message["text_message"],
            "date_time": now()
          };
         

          clients[message["to_user_id"]].forEach(function(item, i, arr){
            item.send(JSON.stringify(dataOutToClient));
            console.log(i);

          });
        }
          /*далее блок для работы с диалогами и сообщениями*/
       //  var dbQuery1 = "SELECT * FROM dialogue WHERE id_1 ='" + id + "' AND id_2 ='" + message["to_user_id"] + "' OR id_1 ='" + id + "' AND id_2 ='" + message["to_user_id"] + "'; ";

            /*запрос 1 - анализ наличия диалога, получение id диалога*/

       //  var dbQuery3 = "INSERT INTO `dialogue` (`id_1`, `id_2`) VALUES ('" + id + "', '" + message["to_user_id"] + "');";
          
            /*запрос 3 - создание нового диалога в случае, если он не создан*/
       /* connection.query(dbQuery1, function(err, rows, fields){  //проверка наличия диалога
          if(!err){
            if (rows.length == 0){
              console.log(err);
              connection.query(dbQuery3, function(err, rows, fields){ //внесение нового диалога в таблицу
                console.log(err);
                if (!err){
                  console.log("добавлен новый диалог");
                  connection.query(dbQuery1, function(err, rows, fields){//здесь диалог уже точно есть, поэтому достаем его из таблицы
                    console.log(err);
                    if (!err){
                      if (rows.lenght != 0){
                        rows.forEach(function(item, i, arr) {
                          var dialogue = item["id_dialogue"]; //получаем id диалога
                         dialogue = parseInt(dialogue, 10);
                         console.log("работаем с диалогом", dialogue);
                           var dbQuery2 = "INSERT INTO message (text_message, id_dialogue, date_time_msg) VALUES ('" + message["text_message"] + "', '" + dialogue + "', '" + fulldate() + "')";
          
                                /*запрос 2 - внесение нового сообщения в таблицу*/
        
                        /*  connection.query(dbQuery2, function(err, rows, fields){ //внесение сообщения в таблицу
                            console.log(err);
                            if(!err){
                              console.log("добавлено новое сообщение от пользователя с id = ", id);  
                            }
                          });
                        });
                      }
                    }
                  });
                }
              }); 
            }
          }  
        });
        connection.query(dbQuery1, function(err, rows, fields){//здесь диалог уже точно есть, поэтому достаем его из таблицы
          console.log(err);
          if (!err){
            if (rows.lenght != 0){
              rows.forEach(function(item, i, arr) {
                var dialogue = item["id_dialogue"];//получаем id диалога
                dialogue = parseInt(dialogue, 10);
                console.log("работаем с диалогом", dialogue);
                console.log(fulldate());
                 var dbQuery2 = "INSERT INTO message (text_message, id_dialogue, date_time_msg) VALUES ('" + message["text_message"] + "', '" + dialogue + "', '" + fulldate() + "')";

                      /*запрос 2 - внесение нового сообщения в таблицу*/

                /*connection.query(dbQuery2, function(err, rows, fields){ //внесение сообщения в таблицу
                  console.log(err);
                  if(!err)
                    console.log("добавлено новое сообщение от пользователя с id = ", id);
                });
              });
            }
          }
        });*/
        console.log(message["text_message"] + " " + message["to_user_id"] +" "+ id);
    }    
    if (message["action"] == "search_users") { //------------------------------------------// поиск друзей
      console.log('пользователь захотел найти себе товарища');
      var searchData = {
        "name": message["name"],
        "sur_name": message["sur_name"],
        "login": message["login"],
        "sex": message["sex"],
        "searchOption": message["searchOption"]
      };
      //console.log(message["name"] + " " + message["sur_name"] +" "+ message["login"]);
      if ((searchData.name != '') && (searchData.sur_name != '') && (searchData.login != '')) {
        var searchOption;
        var sex = ';';
        var query;
        if (searchData.searchOption == 1) { //проверям способ поиска
          searchOption = 'AND';
        }
        else {
          searchOption = 'OR';
        }

        if (searchData.sex != undefined) { 
          if (searchData.sex == 1) {
            sex = ""+searchOption+" sex = '1';";
          }
          else {
           sex = ""+searchOption+" sex =  '0';";
          }
        }
        searchData.name = "'"+searchData.name+"'";        //-------------/* каждый критерий поиска внесем в одинарные ковычки */
        searchData.sur_name = "'"+searchData.sur_name+"'";
        searchData.login = "'"+searchData.login+"'";
        /*формируем 2ю часть запроса*/
        query = "WHERE name = "+searchData.name+" "+searchOption+ " sur_name = "+searchData.sur_name+" "+searchOption+ " login = "+searchData.login+" "+sex+"";
        query = "SELECT * FROM user " + query + "";
      }
      else{
            var messageClient = {
            "event": "searchFailed",
            "details": "Заполните форму до конца."
            };
            //console.log(now() + " заполните форму до конца");
            clients[id][idConection].send(JSON.stringify(messageClient));
          }    
      //console.log(query);
      connection.query(query, function(err, rows, fields){
        if (!err){
          if (rows.length != 0) {  
            var messageClient;   
            rows.forEach(function(item, i, arr) {
              //console.log(item);
              messageClient = {
                "event": "SearchSucces",
                "id": item["id"],
                "name": item["name"],
                "sur_name": item["sur_name"],
                "city": item["city"],
                "berd_date": item["berd_date"],
                "login": item["login"],
                "university": item["university"],
                "photo_mini": item["photo_mini"]
              }
              clients[id][idConection].send(JSON.stringify(messageClient));
             // console.log(messageClient); 
            });
              
          }
          else{
            messageClient = {
              "event": "NoResult",
              "details": "Нет пользователей с введенными данными, попробуйте не точный поиск"
            }
            clients[id][idConection].send(JSON.stringify(messageClient));
          }
        }
        else{
          console.log('Error while performing Query.');
        }
      });
   } //-----------------------------------------------------------конец функции поиска друзей 
   if (message["action"] == "search_user_by_email") {//----------------------поиск по email
      var searchData = {
        "email": message["email"]
      };
      dbQuery = "SELECT * FROM user WHERE email = '"+searchData.email+"';";
      connection.query(dbQuery, function(err, rows, fields) {
        if(!err){
          if (rows.length != 0) {
            var messageClient;
            rows.forEach(function(item, i, arr){
              messageClient = {
                "event": "SearchSucces",
                "id": item["id"],
                "name": item["name"],
                "sur_name": item["sur_name"],
                "city": item["city"],
                "berd_date": item["berd_date"],
                "login": item["login"],
                "university": item["university"],
                "photo_mini": item["photo_mini"]
              }
              clients[id][idConection].send(JSON.stringify(messageClient));
            }  
            );
          }
          else{
            messageClient = {
              "event": "NoResult",
              "details": "Пользователь с данным Email не найден"
            }
            clients[id][idConection].send(JSON.stringify(messageClient));
          }
        }
        else{
          console.log(err);
        }
      }
      );
   }  
  if (message["action"] == "addFriend") {//--------------------------нажата кнопка "добавить в друзья"
      console.log("запрос на добавление в друзья");
      var to_user_id = "'"+message["id_add_friend"]+"'";
      var user_id = "'"+message["id_user"]+"'"; 
      var query = "SELECT * from friend WHERE friend_1 = "+to_user_id+" AND friend_2 = "+user_id+" OR friend_1 = "+user_id+" AND friend_2 = "+ to_user_id+";";
      connection.query(query, function(err, rows, fields){
        if (!err) {
          if (rows.length != 0) {
            //console.log("строки есть");
            messageClient = {
              "event": "resending",
              "details": "предложение о дружбе отправлено ранее"
            }
            clients[id][idConection].send(JSON.stringify(messageClient));
          }
          else{
            query = "INSERT INTO friend (friend_1, friend_2, status) VALUES ("+user_id+", "+to_user_id+", '0');"
            connection.query(query, function(err, rows, fields){
              if (!err) {
                console.log("заявка в друзья отправлена");
              }
            });
          }
        }
      });  
   }
   if (message["action"] == "addToFriend") { //положительный ответ на заявку
    console.log("положительный ответ на заявку")
    var to_user_id = "'"+message["id_add_friend"]+"'";
    var user_id = "'"+message["id_user"]+"'"; 
    var query = "UPDATE `friend` SET `status`=1 WHERE friend_1 = "+to_user_id+" AND friend_2 = "+user_id+" OR friend_1 = "+user_id+" AND friend_2 = "+ to_user_id+";";
    connection.query(query, function(err, rows, fields){
        if (!err) {
          console.log("друг добавлен");
           messageClient = {
              "event": "user_added",
              "details": user_id
            }
            clients[id][idConection].send(JSON.stringify(messageClient));
        }
        else{
          console.log(err);
        }
    });    
   }
    if (message["action"] == "addToBlackList") { //добавление пользователя в черный список
    console.log("отправляем друга в чс")
    var to_user_id = "'"+message["id_add_friend"]+"'";
    var user_id = "'"+message["id_user"]+"'"; 
    var query = "INSERT INTO black_list (id_own, id_block) VALUES ("+user_id+", "+to_user_id+");";
    connection.query(query, function(err, rows, fields){
      if(!err){
        console.log("пользователь внесен в черный список");
      }
    });
   } 
    if (message["action"] == "delFriend") { //удаление из друзей
    console.log("удаляем друга из друзей")
    var to_user_id = "'"+message["id_add_friend"]+"'";
    var user_id = "'"+message["id_user"]+"'"; 
    var query = "DELETE FROM friend WHERE friend_1 = "+to_user_id+" AND friend_2 = "+user_id+" OR friend_1 = "+user_id+" AND friend_2 = "+ to_user_id+";";
    connection.query(query, function(err, rows, fields){
      if(!err){
        console.log("пользователь удален");
      }
    });
   }
  });
  ws.on('close', function() {
    console.log(now() + ' Cоединение закрыто: ID = ' + id + ', IDConection = ' + idConection);
    delete clients[id][idConection];
    console.log(clients[id]);
  });
});

var fileServer = new Static.Server('public');
http.createServer(function (req, res) {
  
  fileServer.serve(req, res);

}).listen(8080);
console.log(now() + "Сервер запущен на портах 8080");
