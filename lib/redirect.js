function redirect_init() {
   console.log("HELLO!");
   // First, parse the query string
   var params = {}; 
   var queryString = location.hash.substring(1);
   var regex = /([^&=]+)=([^&]*)/g; 
   var m;
   while (m = regex.exec(queryString)) {
     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
   }
   console.log(params);
   
   window.localStorage.setItem('access_token', params['access_token']);

   window.close();
}