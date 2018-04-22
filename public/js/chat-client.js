if (!window.WebSocket) {
	$("#errorModalNoneWS").modal();
}
var socketPort = 8081;
var socketServer = "localhost";
var socket = new WebSocket("ws://" + socketServer + ":" + socketPort + "/");

//var userMessages = [];
var userFriends = [];
var userNewFriends = [];
var user = {};
var currentFriendDialog = 0;
var activePage = "";
var my_id;

function now(){
  var date = new Date();
  date = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
  return date;
}

socket.onmessage = function(event) {
	//Обработка входящих сообщения
	var message = JSON.parse(event.data);
  	if (message["event"] == "authorizationSucces"){
  		authorizationSucces(message["userData"], message["userFriends"], message["userNewFriends"]);
  	}
  	if (message["event"] == "authorizationFailed"){
  		authorizationFailed(message);
  	}
  	if (message["event"] == "registrationSucces"){
  		alert("Вы успешно зарегистрировались");
  	}
  	if(message["event"] == "registrationFailed"){
  		registrationFailed(message);
  	}
  	if (message["event"] == "messageNew"){
  		//alert(message["text_message"]);
  		messageNew(message);
  	}
  	if (message["event"] == "friendOnline"){

  	}
  	if (message["event"] == "friendOfline"){

  	}
  	if (message["event"] == "searchFailed" ) {
  		searchFailed(message);
  	}
  	if (message["event"] == "SearchSucces") {
  		searchSucces(message);
  	}
  	if (message["event"] == "NoResult") {
  		noResultSearch(message);
  	}
  	if (message["event"] == "resending") {
  		resending(message);
  	}
  	if (message["event"] == "user_added") {
  		user_added(message);

  	}
};
 $('form').submit(function() {return false;});
 $('#sendMessageButton').click(function(){
 	var text = $('#textMessageArea').val();
 	if(text != ""){
 	$('#textMessageArea').val('');
 	var user_id = currentFriendDialog;
 		sendMessage(user_id, text);
 	}
 	var div = $("#messageBox");
	div.scrollTop(div.prop('scrollHeight') + 200);
 });
//Функция авторизации
function authorization(){
	var login = $("#inputEmail").val();
	var pass = $("#inputPassword").val();
	var data = {
		"action": "athorization",
		"login": login,
		"password": pass
	};
	socket.send(JSON.stringify(data));
	
}
function registration(){
	
	var email = $("#inputEmailReg").val();
	var name = $("#inputNameReg").val();
	var sur_name = $("#inputSurNameReg").val();
	var login = $("#inputLoginReg").val();
	var sex = $("#inputSexReg").val();
	var birth_day = $("#inputBDReg").val();
	var password = $("#inputPasswordReg").val();

	var dataRegObj = {
		"action": "registration",
		"email": email,
		"name": name,
		"sur_name": sur_name,
		"login": login,
		"sex": sex,
		"birth_day": birth_day,
		"password": password
	};
	socket.send(JSON.stringify(dataRegObj));
}
function sendMessage(user_id, text){//отправка сообщения другу
	var data = {
		"action": "sendMessage",
		"to_user_id": user_id,
		"text_message": text
	};
	var messageNewHtml = "<div class='message row'><div class='messageAvatar col-md-1'><img src='" + user.mini + "'></div><div class='messageText col-md-10'>" + text + "</div><div class='messageTime col-md-1'>" + now() + "</div></div>";
	$("#mbf" + currentFriendDialog).append(messageNewHtml);
	
	socket.send(JSON.stringify(data));	
}
//Смена страницы

$(".page-link").click(function(){
	var idLink = $(this).attr("id");
	idLink = idLink.substr(0, idLink.length - 4);
	tooglePage(idLink);
});

//Функция вызывается при успешной авторизации
function authorizationSucces(userData, uFriends, uNewFriends){
	activePage = "pageProfile";
	$("#" + activePage + "Link").addClass("currentPageLink");
	my_id = userData.id;
	user.id = userData.id;
	user.name = userData.name;
	user.sur_name = userData.sur_name;
	user.sex = userData.sex;
	user.birth_day = userData.birth_day.substr(0,10);
	if(user.sex == "1"){user.sexText = "мужской"}
	else{user.sexText = "женский"}
	user.avatar = userData.photo;
	user.mini = userData.photo_mini;
	userFriends = uFriends;
	userNewFriends = uNewFriends;
	if(userFriends != 0){
	toogleDialog(userFriends[0]["id"]);
	//alert(userFriends[2]["name"]);
	}
	//Формирование профиля юзера
	var profileHTML = "<img src='" + user.avatar + "'><p>Имя: " + user.name +"</p><p>Фамилия: " + user.sur_name +"</p><p>Пол: " + user.sexText + "</p><p>Дата рождения: " + user.birth_day + "</p>";
	$("#pageProfile").html(profileHTML);

	$("#authorizeModal").modal('hide');
	$("#main").removeClass("cHidden");
	//$("#startPage").addClass("cHidden");
	$("#startPage").remove();


	//Формирования списка друзей на странице друзья и странице сообщения
	var friendsHtmlpage = "";
	var friendsHtmlList = "";
	var messageBoxFriend = "";
	var newFriendsHtmlList = "";
	if(userFriends.length == 0){
		friendsHtmlList = "Вы наверное, Ларин? И у вас нет друзей";
		friendsHtmlpage = "Вы наверное, Ларин? И у вас нет друзей";
	}
	else{

	for(var i = 0; i < userFriends.length; i++){
		friendsHtmlpage = friendsHtmlpage + "<div class='row'><div class='col-md-2'><img class='avatar_Flist' src='" + userFriends[i].photo + "'></div><div class='col-md-10'>" + userFriends[i].name + " " + userFriends[i].sur_name + "</div><div class = 'user_friends_menu'><Button onclick='addToBlackList("+userFriends[i].id+")' class='btn btn-primary' id='btnAddBlackList"+userFriends[i].id+"'>Добавить в ЧС</Button></br></br><Button onclick='delFriend("+userFriends[i].id+")' class='btn btn-primary' id='btnDelF"+userFriends[i].id+"'>Удалить друга</Button></div></div><hr id='lineFriendList'>";
		friendsHtmlList = friendsHtmlList + "<li><a href='#' id='user" + userFriends[i].id + "' class='friendListLink'><img src='" + userFriends[i].photo_mini + "'>" + userFriends[i].name + " " + userFriends[i].sur_name + "</a></li>";
		messageBoxFriend = messageBoxFriend + "<div id='mbf" + userFriends[i].id + "' class='messageBoxFriend cHidden'></div>";
		
	}
	}
	$('#friendListUL').html(friendsHtmlList);
	$('#friendListBoxPage').html(friendsHtmlpage);
	$('#messageBox').html(messageBoxFriend);
	$("#messageEditorAvaUsers").html("<img src='" + user.mini + "' class='avatar64'>");
	if (userNewFriends.length != 0) {
		$('#notNFriends').empty();
		for (var i = 1; i < userNewFriends.length; i++){
			newFriendsHtmlList += "<div class='row'><div class='col-md-2'><img class='avatar64' src='" + userNewFriends[i].photo_mini + "'></div><div class='menu_new_fr'><div class='col-md-10'>" + userNewFriends[i].name + " " + userNewFriends[i].sur_name + "</div><Button onclick='addToFriend("+userNewFriends[i].id+")' class='btn btn-primary' id='btnAddToF"+userNewFriends[i].id+"'>Добавить в друзья</Button></div></div><hr id='lineFriendList'>";
			$('#Button_applications_to_friends').html('Заявки в друзья('+i+')');
		}
	}
	$('#newFriendsList').html(newFriendsHtmlList);
	$(".friendListLink").click(function(){
		var idLink = $(this).attr("id");
		

		if(currentFriendDialog != 0){
			$("#user" + currentFriendDialog).removeClass("currentFriendDialogLink");
		}
		$(this).addClass("currentFriendDialogLink");
		idLink = idLink.substr(4, idLink.length - 4);
		
		toogleDialog(idLink);
	});
	$(".Out").click(function(){ //событие организующее выход !!!!!!!!ДОДЕЛАТЬ!!!!!!!!!!

	});
	$("#signInButton").remove(); //закрываем кнопки "регистрация" и "войти"
	$("#regButton").remove();
}
//Смена диалога
function toogleDialog(id_friend){
	for(var i = 0; i < userFriends.length; i++){
		if(userFriends[i].id == id_friend){
			$(".currentDialogFname").html(userFriends[i].name + " " + userFriends[i].sur_name);		
		}
	}
	if(currentFriendDialog != 0){
		$("#mbf" + currentFriendDialog).addClass("cHidden");	
	}
	$("#mbf" + id_friend).removeClass("cHidden");
	currentFriendDialog = id_friend;
	///alert(userFriends[id_friend].photo_mini);
	$("#messageEditorAvaUsersFriendsImg").attr('src', ''+userFriends[2].photo_mini+'');//

}
//Смена страницы

function tooglePage(name_page){
	
	$("#"+ activePage).addClass("cHidden");
	$("#" + name_page).removeClass("cHidden");
	$("#" + activePage + "Link").removeClass("currentPageLink");
	$("#" + name_page + "Link").addClass("currentPageLink");
	activePage = name_page;
}
//Функция вызывается при неуспешной авторизации
function authorizationFailed(message){
	//alert("Ошибка! Вы не авторизованы!");
	$("#infoAuthorize").removeClass("cHidden");
	$("#infoAuthorize").html(message.details);
}
//функция вызывается при неудачной регистрации 
function registrationFailed(message){
	$("#infoRegistration").removeClass("cHidden");
	$("#infoRegistrationP").html(message.details);
}
function searchFailed(message) { //неправильно введены начальные данные
	$("#infoSearchFriends").removeClass("cHidden");
	$("#infoSearchFriends").html(message.details);
}
function noResultSearch(message){
	 //не найено пользователей по указанным критериям
	//$("#infoSearchFriends").removeClass("cHidden");
	$('#SearchList').html(message.details);
}
function messageNew(message){
	//Внесение сообщения в массив сообщений
	var messageNewHtml = "<div class='message row'><div class='messageAvatar col-md-1'><img src='./avatars/mini/user" + message.from_user_id + ".jpg'></div><div class='messageText col-md-10'>" + message.text_message + "</div><div class='messageTime col-md-1'>" + message.date_time + "</div></div>";
	$("#mbf" + message.from_user_id).append(messageNewHtml);
	var div = $("#messageBox");
	div.scrollTop(div.prop('scrollHeight') + 200);
	document.getElementById('audio').play();
}
function searchFriends(){ //функция для поиска по критериям
//сбор данных с формы
	var name = $("#inputNameSearch").val();
	var sur_name = $("#inputSurNameSearch").val();
	var sexm = $('input[name="sexm"]:checked').val();
	var sexzh = $('input[name="sexzh"]:checked').val();
	var searchOption = $('input[name="searchOption"]:checked').val();
	var login = $("#inputLoginSearch").val();
	var sex; //результат анализа критерия
	if (sexm == 'm') {
		sex = 1;
	}
	if (sexzh == 'zh') {
		sex = 0;
	}
	if ((sexm == 'm') && (sexzh == 'zh'))  {
		sex = undefined;
	}
	if (searchOption != 1) { //or или and
		searchOption = 0;
	}
	var dataSearchUserObj = { //сбор данных для отправки на сервер
		"action": "search_users", //тип события
		"name": name,
		"sur_name": sur_name,
		"login": login,
		"sex": sex,
		"searchOption": searchOption
	};
	SearchList = ''; //обнуление переменной
	$('#SearchList').empty(); // очищаем блок с предыдущими результатами поиска
	$('#searchModal').modal('hide'); //закрываем окно 
	
	socket.send(JSON.stringify(dataSearchUserObj)); //пересылка данных серверу
}
function searchFriendsByEmail(){
	var email = $("#inputEmailSearch").val();
	var dataSearchByEmail = {
		"action": "search_user_by_email",
		"email": email
	}
	SearchList = '';
	$('#SearchList').empty(); // очищаем блок с предыдущими результатами поиска
	$('#searchModalByEmail').modal('hide'); //закрываем окно 
	socket.send(JSON.stringify(dataSearchByEmail));
}
function searchSucces(message){ //выводим найденных пользователей пользователю
	
	//alert(message.name);
			//---------------------/*далее высылаем пользователю найденых пользователей и кнопки добавления в друзья*/
	SearchList = SearchList + "<div class='row'><div class='col-md-2'><img class='avatar_Flist' src='" + message.photo_mini + "'></div><div class='col-md-10'>" + message.name + " " + message.sur_name + "</div><Button onclick='addFriend("+message.id+")' class='btn btn-primary' id='btnAddF"+message.id+"'>Отправить заявку</Button></div><hr id='lineFriendList'>";
	
	$('#SearchList').html(SearchList);
	/*$('#searchPannel').html("<Button onclick='clearSearch()' id='clearSearch'>крестик</button>")*/
	
	
}
/*function clearSearch(){ //возможно реализую потом
	SearchList = '';
}*/
function addFriend(id){
	//alert(id);
	$("#btnAddF"+id+"").html("Заявка отправлена");// меняем текст на кнопке
	var dataAddFriend = {
		"action": "addFriend",
		"id_add_friend": id,
		"id_user": my_id
	}
	//alert(my_id);
	socket.send(JSON.stringify(dataAddFriend));
}
function resending(message){// обработка исключения, заявка была отправлена ранее, либо человек уже есть в списке друзей
	alert(message.details);
}
function delFriend(id){ // удаление друга
	$("#btnDelF"+id+"").html("Друг удален");// меняем текст на кнопке
	var dataAddFriend = {
		"action": "delFriend",
		"id_add_friend": id,
		"id_user": my_id
	}
	//alert(my_id);
	socket.send(JSON.stringify(dataAddFriend));
}
function addToBlackList(id){// внесение друга в черный список
	$("#btnAddBlackList"+id+"").html("Добавлен в ЧС");// меняем текст на кнопке
	var dataAddFriend = {
		"action": "addToBlackList",
		"id_add_friend": id,
		"id_user": my_id
	}
	//alert(my_id);
	socket.send(JSON.stringify(dataAddFriend));
}	
function addToFriend(id){ //добавление друга
	$("#btnAddToF"+id+"").html("Друг добавлен");// меняем текст на кнопке
	var dataAddFriend = {
		"action": "addToFriend",
		"id_add_friend": id,
		"id_user": my_id
	}
	//alert(my_id);
	socket.send(JSON.stringify(dataAddFriend));
}
function user_added(message){
	id_added = message.details;
	alert("друг с id "+id_added+" добавил вас в друзья");
}