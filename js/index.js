function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
   var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
   var time = hour + ":" + minutes + ":" + seconds;
   document.getElementById("clock").innerHTML = time;
   setTimeout(getTime, 1000);
}

function getTemp() {
   $.getJSON('http://api.forecast.io/forecast/f20cf5043de9552fca19307b45e486f9/35.300399,-120.662362', function(data) {
      var label = data['daily']['summary'];
      console.log(label);
   });
}

window.onload = function() {
   getTime();
   getTemp();
}