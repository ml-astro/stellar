 //defaults
 var longitude = 25.02
 var latitude = 59.5

 function toRadians(degree) {
     return degree * Math.PI / 180.0;
 }

 function toDegrees(rad) {
     return rad * 180 / Math.PI
 }
 function addFractionalDaysOld(date, days) {
     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
     return date;
 }
 function addFractionalDays(date, days) {
     tempDate = new Date(date);
     tempDate.setTime(tempDate.getTime() + days * 24 * 60 * 60 * 1000);
     return tempDate;
 }
 function roundup10(n) {
     return Math.round(n * 10) / 10.0;
 }
 function displayTime(date) {
     return new Date(date).toLocaleTimeString();
 }
 function dayLength(length) {
     const hrs = Math.floor(length);
     const mins = Math.round((length - hrs) * 60);
     return (hrs + ' ч ' + mins + ' мин');
 }

 function findMe(callback) {
     navigator.geolocation.getCurrentPosition(
         (position) => {
             latitude = position.coords.latitude;
             longitude = position.coords.longitude;
             console.log("Координаты получены:", latitude, longitude);
             if (callback) callback();
         },
         () => {
             calcluate(latitude, longitude)
         }
     );
 }
 // Используем координаты после их получения
 findMe(() => {
     calcluate(latitude, longitude);
     // Здесь можно делать дальнейшие вычисления
 });
 const referenceDate = new Date(2000, 0, 1, 15);
 // Julian date offset
 var now = new Date()
 const n = Math.ceil((now - referenceDate) / 86400000);

 function calcluate(latitude, longitude) {
     // Mean solar time
     const J_ = n + 0.0009 - longitude / 360.0;

     // Solar mean anomaly
     const M = (357.5291 + 0.98560028 * J_) % 360;
     // Equation of the center
     const C = 1.9148 * Math.sin(toRadians(M)) + 0.0200 * Math.sin(2 * toRadians(M)) + 0.0003 * Math.sin(3 * toRadians(M));
     // Ecliptic longitude
     const lambda = (M + C + 180 + 102.9372) % 360;
     //roundup10(lambda)+"&deg;"();
     document.getElementById('lambda').innerHTML = roundup10(lambda) + "&deg;"
     // Solar transit time
     const J_transit = 2451545.0 + J_ + 0.0053 * Math.sin(toRadians(M)) - 0.0069 * Math.sin(2 * toRadians(lambda));
     document.getElementById('J_transit').innerHTML = displayTime(addFractionalDays(referenceDate, (J_transit - 2451545)));


     // Declination of the Sun
     const sin_d = Math.sin(toRadians(lambda)) * Math.sin(toRadians(23.4397));
     const cos_d = Math.cos(Math.asin(sin_d));
     document.getElementById('sin_d').innerHTML = roundup10(sin_d) + "&deg;";
     document.getElementById('hMax').innerHTML = roundup10(90 - latitude + toDegrees(sin_d)) + "&deg;";
     // Hour angle, no refraction
     const some_cos = (Math.sin(toRadians(-0.833) - Math.sin(toRadians(latitude)) * sin_d)) / ((Math.cos(toRadians(latitude)) * cos_d));
     const hourAngle = Math.acos(some_cos) * 180.0 / Math.PI;
     document.getElementById('hourAngle').innerHTML = roundup10(hourAngle) + "&deg;";
     // Sunrise
     const j_rise = J_transit - hourAngle / 360.0;
     const sunrise = j_rise - 2451545.0
     let sunriseDate = addFractionalDays(referenceDate, sunrise);
     document.getElementById('sunriseDate').innerHTML = displayTime(sunriseDate);
     // Sunset
     const j_set = J_transit + hourAngle / 360.0;
     const sunset = j_set - 2451545.0
     let sunsetDate = addFractionalDays(referenceDate, sunset);
     document.getElementById('sunsetDate').innerHTML = displayTime(sunsetDate);
     // Day length
     const length = (sunsetDate - sunriseDate) / 1000.0 / 3600.0
     document.getElementById('dayLength').innerHTML = dayLength(length);
 }