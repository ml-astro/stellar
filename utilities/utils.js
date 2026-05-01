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
function rad2deg(form) {
    rad = form.radians.value
    form.degreesFromRadians.value = rad * 180 / Math.PI;
}
function deg2rad(form) {
    deg = form.degrees.value
    form.radiansFromDegrees.value = deg * Math.PI / 180;
}


//угловое расстояние
function toRadians(value) {
    return value * Math.PI / 180;
}
function angularSeparation(angleForm) {
    ra1 = toRadians(toDecimalDegrees(angleForm.ra1.value, true))
    ra2 = toRadians(toDecimalDegrees(angleForm.ra2.value, true))
    dec1 = toRadians(toDecimalDegrees(angleForm.dec1.value))
    dec2 = toRadians(toDecimalDegrees(angleForm.dec2.value))
    console.log(ra1, ra2, dec1, dec2);
    x = Math.cos(dec1) * Math.sin(dec2) - Math.sin(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    y = Math.cos(dec2) * Math.sin(ra2 - ra1);
    z = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    d = Math.atan2(Math.sqrt(x * x + y * y), z);
    document.getElementById("angle").value = d * 180 / Math.PI;
}

//часы в градусы
function toDecimalDegrees(value, ra = false) {
    if (isNaN(value)) {
        degArray = value.split(":")
        seconds = 0
        if (degArray.length == 3) {
            seconds = degArray[2] / 3600
        }
        if (degArray[0] < 0) {
            if (ra) {
                return 15 * (parseInt(degArray[0]) - degArray[1] / 60 - seconds)
            }
            else return parseInt(degArray[0]) - degArray[1] / 60 - seconds
        }
        if (ra) {
            return 15 * (parseInt(degArray[0]) + degArray[1] / 60 + seconds)
        }
        else return parseInt(degArray[0]) + degArray[1] / 60 + seconds
    }
    else return value
}

function refraction(form) {
    var alt = parseFloat(form.altHor.value);
    if (alt < 0) {
        form.ref.value = 'Ниже горизонта';
    }
    else if (alt > 80) {
        form.ref.value = 0 + "'";
    }
    else if (alt > 15 && alt <= 80) {
        alt = alt / 57.29577951308232;
        var refraction = 271.2 / (283 * Math.tan(alt));
        form.ref.value = refraction + "'";
    }
    else {
        subRef = 283 * (1.0 + 0.505 * alt + 0.0845 * alt * alt);
        refraction = 60000 * (0.1594 + 0.0196 * alt + 0.00002 * alt * alt) / subRef;
        form.ref.value = refraction + "'";
    }
    var ok = true;
    var height = form.altHor.value;
    var v = form.altObs.value;
    if (height < 0) {
        form.extinction.value = 'Ниже горизонта';
        ok = false;
    }
    if (height > 90) {
        height = 90 - (90 - height);
        ok = false;
    }
    if (ok) {
        var x1 = 0;
        x1 = (1 / (Math.cos((90 - height) * 0.01745329251) + 0.025 * Math.exp(-11 * Math.cos((90 - height) * 0.01745329251))));
        x2 = (0.1451 * Math.exp(-v * 0.001 / 7.996)) * x1;
        x3b = (0.12 * Math.exp(-v * 0.001 / 1.5)) * x1;
        x4 = 0.016 * x1;
        form.extinction.value = (x2 + x3b + x4) + 'm';
    }
}


function time2degrees(form) {
    timeArray = form.time.value.split(":")
    seconds = 0
    if (timeArray.length == 3) {
        seconds = timeArray[2] / 3600
    }
    result = parseInt(timeArray[0]) + timeArray[1] / 60 + seconds
    form.degreesFromTime.value = result
}

function degrees2time(form) {
    decimal = form.degrees.value
    hour = Math.floor(decimal)
    decimal = (decimal - hour) * 60
    minute = Math.floor(decimal)
    decimal = (decimal - minute) * 60
    second = decimal
    form.timeFromDegrees.value = hour +':'+minute+':'+second
}

//parallax = angularSeparation(deg2rad(observation[0].ra), deg2rad(observation[0].dec), deg2rad(observation[1].ra), deg2rad(observation[1].dec))