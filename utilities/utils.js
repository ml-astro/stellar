document.getElementById('datetimeLST').value = new Date();

//местное звездное время и юлианская дата
function calculateLST(LSTform) {
    const rawDate = LSTform.datetimeLST.value;
    longitude = parseFloat(LSTform.lon.value)
    const [datePart, timePart] = rawDate.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const observationDate = new Date(year, month - 1, day, hour, minute);
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    T = (JD - 2451545.0) / 36525
    GMST = 280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T * T - T * T * T / 38710000
    GMST = GMST % 360
    LST = GMST + longitude
    LST = (LST % 360 + 360) % 360
    document.getElementById("LST").innerHTML = `
    Местное звездное время:
                            ${LST}&#176;
    или                     ${LST / 360 * 24} ч

    Юлианская дата:         ${JD}`
}

//градусы и радианы
function rad2deg(radForm) {
    rad = radForm.radians.value
    document.getElementById('degreesFromRadians').value = rad * 180 / Math.PI;
}
function deg2rad(degForm) {
    deg = degForm.degrees.value
    document.getElementById('radiansFromDegrees').value = deg * Math.PI / 180;
}


//угловое расстояние
function toRadians(value){
    return value * Math.PI / 180;
}
function angularSeparation(angleForm) {
    ra1 = toRadians(toDecimalDegrees(angleForm.ra1.value,true))
    ra2 = toRadians(toDecimalDegrees(angleForm.ra2.value,true))
    dec1 = toRadians(toDecimalDegrees(angleForm.dec1.value))
    dec2 = toRadians(toDecimalDegrees(angleForm.dec2.value))
    console.log(ra1,ra2,dec1,dec2);
    x = Math.cos(dec1) * Math.sin(dec2) - Math.sin(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    y = Math.cos(dec2) * Math.sin(ra2 - ra1);
    z = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    d = Math.atan2(Math.sqrt(x * x + y * y), z);
    document.getElementById("angle").value = d * 180 / Math.PI;
}

//часы в градусы
function toDecimalDegrees(value,ra=false) {
    if (isNaN(value)) {
        degArray = value.split(":")
        seconds = 0
        if (degArray.length == 3) {
            seconds = degArray[2] / 3600
        }
        if (degArray[0] < 0) {
            if(ra){
                return 15*(parseInt(degArray[0]) - degArray[1] / 60 - seconds)
            }
            else return parseInt(degArray[0]) - degArray[1] / 60 - seconds
        }
        if(ra){
            return 15*(parseInt(degArray[0]) + degArray[1] / 60 + seconds)
        }
        else  return parseInt(degArray[0]) + degArray[1] / 60 + seconds
    }
    else return value
}

//parallax = angularSeparation(deg2rad(observation[0].ra), deg2rad(observation[0].dec), deg2rad(observation[1].ra), deg2rad(observation[1].dec))