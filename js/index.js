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
   var weatherURL = 'https://api.forecast.io/forecast/f20cf5043de9552fca19307b45e486f9/';
   var latLon;

   if (navigator.geolocation) {
      latLon = navigator.geolocation.getCurrentPosition(getCoordinates);
   }
   else {
      latLon = '35.300399,-120.662362';
   }

   $.ajax ({
      url: weatherURL + '35.300399,-120.662362',
      dataType: 'jsonp',
      success: function(data) {
         var label = data['daily']['data'][0]['summary'];
         var icon = data['daily']['data'][0]['icon'];
         var temp = data['daily']['data'][0]['temperatureMax'];

         $("#forecastLabel").html(label);
         $("#forecastIcon").attr("src", "img/"+icon+".png");
         $("body").addClass(getTempClass(temp));
      }
   });
}

function getCoordinates(position) {
   console.log(position.coords.latitude);
   console.log(position.coords.longitude);
   return position.coords.latitude + ',' + position.coords.longitude;
}

function getTempClass(temp) {
   if (temp < 60)
      return 'cold';
   else if (temp < 70)
      return 'chilly';
   else if (temp < 80)
      return 'nice';
   else if (temp < 90)
      return 'warm';
   else
      return 'hot';
}

window.onload = function() {
   getTime();
   getTemp();
}