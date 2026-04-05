//на дом компе в браузере вводится местное время почему-то
// не utc


const R_EARTH = 6371e3;
const g = 9.81
//const G = 6.67430e-11
//const M_EARTH = 5.9722e24

function rad2deg(rad) { return rad * 180 / Math.PI; }
function deg2rad(deg) { return deg * Math.PI / 180; }
function magnitude(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }

function angularSeparation(ra1, dec1, ra2, dec2) {
    x = Math.cos(dec1) * Math.sin(dec2) - Math.sin(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    y = Math.cos(dec2) * Math.sin(ra2 - ra1);
    z = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra2 - ra1);
    d = Math.atan2(Math.sqrt(x * x + y * y), z);
    return d;
}

function calculateLST(longitude, JD, T) {
    GMST = 280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T * T - T * T * T / 38710000
    GMST = GMST % 360
    LST = GMST + longitude
    LST = (LST % 360 + 360) % 360
    return LST
}

function observerVector(latDeg, lstDeg) {
    const lat = deg2rad(latDeg);
    const lst = deg2rad(lstDeg);
    return {
        x: R_EARTH * Math.cos(lst) * Math.cos(lat),
        y: R_EARTH * Math.sin(lst) * Math.cos(lat),
        z: R_EARTH * Math.sin(lat)
    };
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function angleBetween(a, b) {
    const cos = dot(a, b) / (magnitude(a) * magnitude(b));
    return Math.acos(cos); // в радианах
}

function sub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
}

//расчитывает единичный или полный вектор
function direction(raDeg, decDeg, length = 1) {
    const ra = deg2rad(raDeg);
    const dec = deg2rad(decDeg);
    return {
        x: length * Math.cos(ra) * Math.cos(dec),
        y: length * Math.sin(ra) * Math.cos(dec),
        z: length * Math.sin(dec)
    };
}

function calculateDistance(observationDate, observation) {
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    T = (JD - 2451545.0) / 36525
    parallax = angularSeparation(deg2rad(observation[0].ra), deg2rad(observation[0].dec), deg2rad(observation[1].ra), deg2rad(observation[1].dec))
    lst1 = calculateLST(observation[0].lon, JD, T)
    lst2 = calculateLST(observation[1].lon, JD, T)
    const rL1 = observerVector(observation[0].lat, lst1);
    const rL2 = observerVector(observation[1].lat, lst2);
    const rL2L1 = sub(rL2, rL1);
    const chord = magnitude(rL2L1);
    //Now that vector rL2L1 is determined, the directional vector rM needs to be calculated
    const rM = direction(observation[1].ra, observation[1].dec);
    //Now use the dot product method for computing angle between rM and rL2L1:
    const beta = angleBetween(rL2L1, rM);
    baseline = chord * Math.sin(beta)
    distance = baseline / Math.sin(parallax)

    objVector = direction(observation[0].ra, observation[0].dec, distance)
    
    objectXYZ = {
        x: (rL1.x + objVector.x),
        y: (rL1.y + objVector.y),
        z: (rL1.z + objVector.z),
    }
    orbitRadius = magnitude(objectXYZ)
    orbitG = g / ((orbitRadius / R_EARTH) ** 2);

    period = Math.sqrt(4 * Math.PI * Math.PI * orbitRadius / orbitG) / 60
    periodString = ''
    periodDays = Math.floor(period / 1440)
    if (periodDays > 0) {
        periodString += periodDays + ' сут '
        period -= periodDays * 1440
    }
    periodHours = Math.floor(period / 60)
    if (periodHours > 0) {
        periodString += periodHours + ' час '
        period -= periodHours * 60
    }
    periodString += Math.floor(period) + ' мин'
    
    document.getElementById('result').innerHTML = `<tr><td>Расстояние:</td><td>${Math.floor(distance / 1000)} км</td></tr>
    <tr><td>Высота орбиты:</td><td>${Math.round((orbitRadius - R_EARTH) / 1000)} км</td></tr>
    <tr><td>Период обращения:</td><td>${periodString}</td></tr>
    <tr><td>Расстояние между наблюдателями:</td><td>${Math.floor(chord / 1000)} км</td></tr>
    <tr><td>Базис:</td><td>${Math.floor(baseline / 1000)} км</td></tr>
    <tr><td>Параллакс:</td><td>${Math.round(rad2deg(parallax) * 100) / 100} градусов</td></tr>
    `
    document.getElementById('extra').innerHTML =`
    Наблюдение 1: ${JSON.stringify(observation[0])}
    Наблюдение 2: ${JSON.stringify(observation[1])}
    LST1: ${lst1} LST2: ${lst2}
    rL1 ${JSON.stringify(rL1)}
    rL2 ${JSON.stringify(rL2)}
    rL2L1 ${JSON.stringify(rL2L1)}
    `
}
