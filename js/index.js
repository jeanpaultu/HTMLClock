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

   $.getJSON(weatherURL + '35.300399,-120.662362?callback=?', displayData);
}

function displayData(data) {
   var label = data['daily']['data'][0]['summary'];
   var icon = data['daily']['data'][0]['icon'];
   var temp = data['daily']['data'][0]['temperatureMax'];

   $("#forecastLabel").html(label);
   $("#forecastIcon").attr("src", "img/"+icon+".png");
   $("body").addClass(getTempClass(temp));
}

function getCity(position) {
   var geocoder = new google.maps.Geocoder();
   var loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   geocoder.geocode({'latLng': loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         console.log(results);
         if(results[1]) {
            var city = results[0].address_components[2].long_name;
            var state = results[0].address_components[4].short_name;
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

function showAlarmPopup() {
   $("#mask").removeClass("hide");
   $("#popup").removeClass("hide");
}

function hideAlarmPopup() {
   $("#mask").addClass("hide");
   $("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName) {
   var div = $("<div>");
   div.addClass("flexable");

   div.append("<div class='alarm name'>" + alarmName + "</div>");
   div.append("<div class='alarm time'>" + hours + ":" + mins + ampm + "</div>");

   $("#alarms").append(div);
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();

   insertAlarm(hours, mins, ampm, alarmName);
   hideAlarmPopup();
}

window.onload = function() {
   getTime();
   getTemp();

   for (var hours = 1; hours <= 12; hours++) {
      $("#hours").append("<option>" + hours + "</option>");
   };

   for (var mins = 00; mins <= 59; mins++) {

      $("#mins").append("<option>" + (mins < 10 ? "0" + mins : mins) + "</option>");
   };
}

















