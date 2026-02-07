
const R_EARTH = 6371e3;

function toDegrees(rad) {
return rad * 180 / Math.PI;
}

function toRadians(deg) {
return deg * Math.PI / 180;
}

function vectorMagnitude(v) {
    return Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
}

function calculateDistance(observationDate,observers,moonParallax){
    console.log(observers[0]);
    console.log(observers[1]);
    
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    T = (JD-2451545.0)/36525
    parallax = toRadians(moonParallax)
    
    function calculateLST(longitude){
        GMST = 280.46061837+ 360.98564736629*(JD-2451545)+ 0.000387933*T*T - T*T*T/38710000
        GMST = GMST%360
        LST = GMST + longitude
        LST = (LST%360 + 360)%360
        return LST
    }

    lst1 = calculateLST(observers[0].lon)
    lst2 = calculateLST(observers[1].lon)
    hours = (lst2)/360*24

    function observerVector(latDeg, lstDeg) {
        const lat = toRadians(latDeg);
        const lst = toRadians(lstDeg);
        return {
            x: R_EARTH * Math.cos(lst) * Math.cos(lat),
            y: R_EARTH * Math.sin(lst) * Math.cos(lat),
            z: R_EARTH * Math.sin(lat)
        };
    }

    function sub(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        };
    }

    const rL1 = observerVector(observers[0].lat, lst1);
    const rL2 = observerVector(observers[1].lat, lst2);
    const rL2L1 = sub(rL2, rL1);
    const chord = vectorMagnitude(rL2L1);
    //Now that vector rL2L1 is determined, the directional vector rM to the moon needs to be calculated

    function moonDirection(raDeg, decDeg) {
        const ra  = toRadians(raDeg);
        const dec = toRadians(decDeg);
        return {
            x: Math.cos(ra) * Math.cos(dec),
            y: Math.sin(ra) * Math.cos(dec),
            z: Math.sin(dec)
        };
    }

    const rM = moonDirection(observers[1].ra, observers[1].dec);

    //Now use the dot product method for computing angle between the moon vector rM and rL2L1 as follows:

    function dot(a, b) {
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    function angleBetween(a, b) {
        const cos = dot(a, b) / (vectorMagnitude(a) * vectorMagnitude(b));
        return Math.acos(cos); // в радианах
    }


    const beta = angleBetween(rL2L1, rM);
    baseline = chord * Math.sin(beta)
    distance = baseline / Math.sin(parallax)    
    document.getElementById('result').innerHTML="Расчетное расстояние до Луны:<br>~ "+Math.floor(distance/1000) + " км"
    document.getElementById('extrainfo').innerHTML=`
    <p>Расстояние между наблюдателями: ${Math.floor(chord/1000)}</p>
    <p>Базис: ${Math.floor(baseline/1000)}</p>
    `
}