var mysql = require('mysql') ;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'stalker',
  database : 'chat'
});

connection.connect();
var resultFriends = [];
function resultFriendsSender(){
	console.log(resultFriends);
}
var userID = 1;
var dbQuery = "SELECT * FROM friends WHERE friend_1='" + userID + "' OR friend_2='" + userID + "';";
connection.query(dbQuery, function(err, rows, fields){
    if (!err){    	
    	var friendID = '';
    	rows.forEach(function(item, i, arr) {
  			if(item["friend_1"] == userID){
  				friendID = item["friend_2"];
  			}
  			else{
  				friendID = item["friend_1"];
  			}
  			console.log("Друг: " + friendID);
  			  			
  			var length = arr.length;			

  			var dbQuery = "SELECT * FROM users WHERE id='" + friendID + "';";
  			connection.query(dbQuery, length, function(err, rows, fields){
  				if (!err){
  					resultFriends.push(rows);
  					if(resultFriends.length == length){
  						sender();
  						console.log("ВЫзов");
  					}
  				}
  				else{
  					console.log('Error while performing Query.');
  				}
  			});
		});    
    }   
    else{    
        console.log('Error while performing Query.');
    }
});
console.log("end");