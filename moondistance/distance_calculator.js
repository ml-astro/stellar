//на дом компе в браузере вводится местное время почему-то
// не utc


const R_EARTH = 6371e3;
const g = 9.81
//const G = 6.67430e-11
//const M_EARTH = 5.9722e24

function toDegrees(rad) { return rad * 180 / Math.PI; }
function toRadians(deg) { return deg * Math.PI / 180; }
function vectorMagnitude(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }

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
    const lat = toRadians(latDeg);
    const lst = toRadians(lstDeg);
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
    const cos = dot(a, b) / (vectorMagnitude(a) * vectorMagnitude(b));
    return Math.acos(cos); // в радианах
}

function sub(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
}

function direction(raDeg, decDeg, length = 1) {
    const ra = toRadians(raDeg);
    const dec = toRadians(decDeg);
    return {
        x: length * Math.cos(ra) * Math.cos(dec),
        y: length * Math.sin(ra) * Math.cos(dec),
        z: length * Math.sin(dec)
    };
}

function calculateDistance(observationDate, observation) {
    console.log('observation 1', observation[0]);
    console.log('observation 2', observation[1]);
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    T = (JD - 2451545.0) / 36525
    parallax = angularSeparation(toRadians(observation[0].ra), toRadians(observation[0].dec), toRadians(observation[1].ra), toRadians(observation[1].dec))
    lst1 = calculateLST(observation[0].lon, JD, T)
    lst2 = calculateLST(observation[1].lon, JD, T)
    hours = (lst2) / 360 * 24
    console.log('lst1', lst1, 'lst2', lst2);
    const rL1 = observerVector(observation[0].lat, lst1);
    const rL2 = observerVector(observation[1].lat, lst2);
    const rL2L1 = sub(rL2, rL1);
    const chord = vectorMagnitude(rL2L1);
    
    //Now that vector rL2L1 is determined, the directional vector rM needs to be calculated
    //расчитывает единичный или полный вектор
    const rM = direction(observation[1].ra, observation[1].dec);
    console.log('rL1',rL1,'rL2',rL2,'rL2L1',rL2L1,'chord',chord,'rM',rM);
    //Now use the dot product method for computing angle between rM and rL2L1:
    const beta = angleBetween(rL2L1, rM);
    baseline = chord * Math.sin(beta)
    distance = baseline / Math.sin(parallax)
    vectorFromL1 = direction(observation[0].ra, observation[0].dec, distance)
    orbitComponents = {
        x: (rL1.x + vectorFromL1.x),
        y: (rL1.y + vectorFromL1.y),
        z: (rL1.z + vectorFromL1.z),
    }
    orbitRadius = vectorMagnitude(orbitComponents)
    orbitG = g / ((orbitRadius / R_EARTH) ** 2);
    period = Math.sqrt(4 * Math.PI * Math.PI * orbitRadius / orbitG) / 60
    periodString = 'мин'
    if(period > 90){
        period=period/60
        periodString = 'час'
    }
    else if(period > 24*60){
        period = period/60/24
        periodString = 'сут'
    }

    document.getElementById('result').innerHTML = "Расстояние до объекта:<br>~ " + Math.floor(distance / 1000) + " км"
    document.getElementById('extrainfo').innerHTML = `
    <p>Высота орбиты: ${Math.round((orbitRadius - R_EARTH) / 1000)} км</p>
    <p>Период обращения: ${Math.round(period*100)/100} ${periodString}</p>
    <p>Расстояние между наблюдателями: ${Math.floor(chord / 1000)} км</p>
    <p>Базис: ${Math.floor(baseline / 1000)} км</p>
    <p>Параллакс: ${Math.round(toDegrees(parallax) * 100) / 100} градусов</p>
    `

}
