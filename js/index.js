// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
   console.log(response);
   // The response object is returned with a status field that lets the
   // app know the current login status of the person.
   // Full docs on the response object can be found in the documentation
   // for FB.getLoginStatus().
   if (response.status === 'connected') {
      // Logged into your app and Facebook.
      FB.api('/me', function(response) {
         console.log('Successful login for: ' + response.name + ' with id: ' + response.id);
         $("#loginStatus").empty();
         document.getElementById('loginStatus').innerHTML = '[<a href="" onmouseover="this.innerHTML = \"Log out\"" onmouseout="this.innerHTML = this.getAttribute(\"alt\")" alt="Logged in" onclick="logout()">Logged in</a> as ' + response.name + ']';
         $("#addAlarmBtn").show();
         $("#loginContainer").hide();
         getAllAlarms(response.id);
      });
   } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      $("#loginStatus").empty();
      document.getElementById('loginStatus').innerHTML = '[Not logged in]';
      $("#addAlarmBtn").hide();
      $("#loginContainer").show();
      $("#alarms").empty();
   } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      $("#loginStatus").empty();
      document.getElementById('loginStatus').innerHTML = '[Not logged in]';
      $("#addAlarmBtn").hide();
      $("#loginContainer").show();
      $("#alarms").empty();
   }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
   FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
   });
}

function logout() {
   FB.logout(function(response) {
      statusChangeCallback(response);
   });
}

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
   var userID = '';

   var AlarmObject = Parse.Object.extend("Alarm");
   var alarmObject = new AlarmObject();

   FB.getLoginStatus(function(response) {
      FB.api('/me', function(response) {
         if (response.status === 'connected') {
            userID = response.id;

            alarmObject.save({"time": time,"alarmName": alarmName, "userID": userID}, {
               success: function(object) {
                  insertAlarm(time, alarmName, object.id);
                  hideAlarmPopup();
                  $("#noAlarms").remove();
               }
             });
         }
         else 
            alert("Not logged in!");
      });
   });

   
}

function getAllAlarms(userID) {
   $("#alarms").empty();
   Parse.initialize("0Y4EPzSgC2NIELVKZ7MOLQVR2xcDDW8krI8JarGi", "joFkGrrXV5IcKKYc2FniZixY9gLazREExLaERkL0");

   var AlarmObject = Parse.Object.extend("Alarm");
   var query = new Parse.Query(AlarmObject);
   query.equalTo("userID", userID);
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

   $("#addAlarmBtn").hide();

   getTime();
   getTemp();
}



















