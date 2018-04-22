if (!window.WebSocket) {
  document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}
var soundOn = true;
var currentDialog = null;
var socketPort = 8081;
var socketServer = "195.209.70.122";
var socket = new WebSocket("ws://" + socketServer + ":" + socketPort + "/");

$(document).ready(function() {
    $(".friends").click(function() {
        var idCurrentFriend = $(this).attr("id");
        idCurrentFriend = idCurrentFriend.substr(1);
        $('.change-dialogs').removeClass("change-dialogs");
        $(this).addClass("change-dialogs");
        currentDialog = idCurrentFriend;
    });
});

document.forms.publish.onsubmit = function() {
  var textMess = this.textMessage.value;
  if(textMess != ""){
      $('#textMessage').val('');      
      var query = {"controller":"message","action":"send","to":currentDialog,"text":textMess};
      query = JSON.stringify(query);
      socket.send(query);
    }
  return false;
};

document.forms.authorize.onsubmit = function() {
  var email = this.email.value;
  var password = this.pass.value;
  if((email != "") && (password != "")){
      authorize(email, password);
      $('#hello').remove();
    }
  return false;
};

function authorize(email, password){
  var query = {"controller":"user","action":"authorize","email":email,"password":password};
  query = JSON.stringify(query);
  socket.send(query);
}

function showMessage(message) {
  var messageElem = document.createElement('div');
  $(messageElem).addClass("messages");
  $(messageElem).append("<div class='row'><div class='col-md-1'><img src='avatars/h5Bu1Vm868Y.jpg' class='ava2'></div><div class='col-md-9'><h5>Денис Клименко</h5>" + message + "</div><div class='col-md-1'>17:31:15</div></div>");
  document.getElementById('messagesAll').appendChild(messageElem);
  var div = $("#messagesAll");
	div.scrollTop(div.prop('scrollHeight') + 200);

}
function showError(message) {
  var messageElem = document.createElement('div');
  $(messageElem).addClass("messages");
  $(messageElem).append("<div class='row'><div class='col-md-12'>" + message + "</div></div>");
  document.getElementById('messagesAll').appendChild(messageElem);
  var div = $("#messagesAll");
  div.scrollTop(div.prop('scrollHeight') + 200);

}

socket.onmessage = function(event) {
  var incomingMessage = event.data;
  incomingMessage = JSON.parse(incomingMessage);
  if (incomingMessage["type"] == "message"){
    showMessage(incomingMessage["text"]);
    if(soundOn == true){
    document.getElementById('audio').play();
  }
  }
  else if (incomingMessage["type"] == "error"){
   showError(incomingMessage["text"]);
  }
  

};
