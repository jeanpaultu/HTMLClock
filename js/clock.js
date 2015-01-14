function getTime() {
   var d = new Date();
   var hour = d.getHours();
   var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
   var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
   var time = hour + ":" + minutes + ":" + seconds;
   document.getElementById("clock").innerHTML = time;
   setTimeout(getTime, 1000);
}

window.onload = function() {
   getTime();
}