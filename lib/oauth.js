var client_id;
var type;
var callback_function;

function init(data) {
   client_id = data['client_id'];
   type = data['type'];
   callback_function = data['callback_function'];
}

function login() {
   var url = "https://api.imgur.com/oauth2/authorize?";
   var newURL = url + "client_id=" + client_id + "&response_type=" + type;
   
   window.open(newURL);
}


