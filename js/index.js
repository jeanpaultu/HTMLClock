function getTime() {
   var d = new Date();
   var hour = d.getHours() <= 12 ? d.getHours() : d.getHours() - 12;
   var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
   var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
   var time = hour + ":" + minutes + ":" + seconds + (d.getHours() < 12 ? " am" : " pm");
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

function insertAlarm(time, alarmName, objectId) {
   var div = $("<div>");
   div.addClass("flexable alarmRow");

   div.append("<div class='alarm name'>" + alarmName + "</div>");
   div.append("<div class='alarm time'>" + time + "</div>");
   div.append("<input type='button' class='button deletebtn' onclick='deleteAlarm(this.id)' value='Delete' id='" + objectId + "'/>")

   $("#alarms").append(div);
}

function deleteAlarm(objectId) {
   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);

   query.get(objectId, {
      success: function(alarmObject) {
         alarmObject.destroy({
            success: function() {
               $("#"+objectId).parent().remove();
            },
            error: function() {
               alert("Could not delete the alarm!");
            }
         });
      },
      error: function(object, error) {
         alert("Could not delete the alarm!");
      }
   });
}

function addAlarm() {
   var hours = $("#hours option:selected").text();
   var mins = $("#mins option:selected").text();
   var ampm = $("#ampm option:selected").text();
   var alarmName = $("#alarmName").val();
   var time = hours + ":" + mins + " " + ampm;

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();

   alarmObject.save({"time": time,"alarmName": alarmName}, {
      success: function(object) {
         insertAlarm(time, alarmName, object.id);
         hideAlarmPopup();
         $("#noAlarms").remove();
      }
    });
}

function getAllAlarms(userID) {
   Parse.initialize("0Y4EPzSgC2NIELVKZ7MOLQVR2xcDDW8krI8JarGi", "joFkGrrXV5IcKKYc2FniZixY9gLazREExLaERkL0");

   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   
   query.find({
      success: function(results) {
         if (results.length > 0) {
            for (var i = 0; i < results.length; i++) 
               insertAlarm(results[i].get("time"), results[i].get("alarmName"), results[i].id);
         }
         else {
            $("#alarms").append("<div id='noAlarms' class='flexable'>No Alarms Set</div>")
         }
         
      }
   })
}

window.onload = function() {
   for (var hours = 1; hours <= 12; hours++) {
      $("#hours").append("<option>" + hours + "</option>");
   };

   for (var mins = 00; mins <= 59; mins++) {

      $("#mins").append("<option>" + (mins < 10 ? "0" + mins : mins) + "</option>");
   };

   getTime();
   getTemp();
   getAllAlarms();
}



















