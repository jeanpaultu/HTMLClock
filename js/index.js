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

   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCity);
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

function getCity(position) {
   var geocoder = new google.maps.Geocoder();
   var loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   geocoder.geocode({'latLng': loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         console.log(results);
         if(results[1]) {
            var city = results[0][2].long_name;
            var state = results[0][4].short_name;
            $("#cityLabel").html(city+", "+state);
         } 
      } 
   });
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