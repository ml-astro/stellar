const system = document.createElement("canvas");
const systemId = document.createAttribute("id");
const systemWidth = document.createAttribute("width");
const systemHeight = document.createAttribute("height");
systemId.value = "myCanvas";

systemWidth.value = window.innerWidth + 'px';
systemHeight.value = 400;

system.setAttributeNode(systemId);
system.setAttributeNode(systemWidth);
system.setAttributeNode(systemHeight);
document.getElementsByClassName('system')[0].appendChild(system);
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

/* WORKS BAD WITH CIRCULAR ORBITS */
//const today = new Date()
const today = new Date(2027,7,25,8,40)
//UTC
//const referenceDate = new Date(2024, 8, 22, 14, 33)
const referenceDate = new Date(2025, 0, 1, 0, 0)
var Ndays = ((today - referenceDate) / 86400000)

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}
/*
const Jupiter = {
    sma: 5.2038,
    offset: 69.568,
    daily: 360 / 4332.59,
}

const Earth = {
    sma: 1,
    offset: 0.0,
    daily: 360 / 365.256363004
}
*/

const Jupiter = {
    num: 3,
        N: 100.52021,
        i: 1.30346,
        w: 273.609,
        a: 5.202827,
        e: 0.0483062,
        M: 58.982826,
        dM: 0.08309065
}

const Earth = {
        N: 190.71637577,
        i: 0.00297708,
        w: 272.9783,
        a: 1.00091255,
        e: 0.0175619,
        M: 357.412225,
        dM: 0.984262
}

calculatePosition(Earth)
calculatePosition(Jupiter)

function calculatePosition(planet) {
    let N = planet.N// + planet.dN * d //Long of asc. node    
    let i = planet.i// + planet.di * d //Inclination
    let w = planet.w// + planet.dw * d //Argument of perihelion
    let a = planet.a //Semi-major axis
    let e = planet.e// + planet.de * d //Eccentricity
    //put the updated numbers for dM later from horizons interface
    let M = (planet.M + planet.dM * Ndays) % 360 + 360 //Mean anonaly
    let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1.0 + e * Math.cos(toRadians(M))) //eccentric anomaly
    let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1.0 - e * Math.cos(toRadians(E0))) //eccentric anomaly
    let v = toDegrees(2.0 * Math.atan(Math.sqrt((1.0 + e) / (1.0 - e)) * Math.tan(toRadians(E1) / 2.0))); //true anomaly
    planet.r = (a * (1.0 - e * e)) / (1.0 + e * Math.cos(toRadians(v))); //current distance from sun

    planet.x = planet.r * (Math.cos(toRadians(N)) * Math.cos(toRadians(v + w)) - Math.sin(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.y = planet.r * (Math.sin(toRadians(N)) * Math.cos(toRadians(v + w)) + Math.cos(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.longitude = (toDegrees(Math.atan2(planet.y, planet.x)) + 360) % 360
}

/*Earth.longitude = Earth.offset + Ndays * Earth.daily % 360
Jupiter.longitude = Jupiter.offset + Ndays * Jupiter.daily % 360
calculateXY(Earth)
calculateXY(Jupiter)
*/
/* Calculating X,Y positions */

function calculateXY(planet) {   
    planet.longitude = planet.longitude % 360
    if (planet.longitude < 90) {
        planet.x = planet.sma * Math.cos(toRadians(planet.longitude))
        planet.y = planet.sma * Math.sin(toRadians(planet.longitude))
    }

    if (planet.longitude < 180 && planet.longitude > 90) {
        planet.longitude -= 90
        planet.x = - planet.sma * Math.sin(toRadians(planet.longitude))
        planet.y = planet.sma * Math.cos(toRadians(planet.longitude))
    }

    if (planet.longitude < 270 && planet.longitude > 180) {
        planet.longitude -= 180
        planet.x = -planet.sma * Math.cos(toRadians(planet.longitude))
        planet.y = -planet.sma * Math.sin(toRadians(planet.longitude))
    }

    if (planet.longitude > 270) {
        planet.longitude -= 270
        planet.x = planet.sma * Math.sin(toRadians(planet.longitude))
        planet.y = -planet.sma * Math.cos(toRadians(planet.longitude))
    }
}

/* Calculating Jupiter system view angle */

var deltaX = Jupiter.x - Earth.x
var deltaY = Jupiter.y - Earth.y
var viewAngle;
var distance = Math.sqrt(Math.abs(deltaX) ** 2 + Math.abs(deltaY) ** 2)
var timeDelay = distance * 0.0058
var lightTravelTime = distance * 149597870.700 / 299792 / 3600 / 24

document.getElementById("distance").textContent = 'Расстояние ' + Math.floor(lightTravelTime * 24 * 60) + ' световых минут'


if (deltaX > 0 && deltaY > 0) {
    viewAngle = toDegrees(Math.atan(deltaY / deltaX))
}
if (deltaX < 0 && deltaY > 0) {
    deltaX = Math.abs(deltaX)
    viewAngle = toDegrees(Math.atan(deltaX / deltaY)) + 90
}
if (deltaX < 0 && deltaY < 0) {
    deltaX = Math.abs(deltaX)
    deltaY = Math.abs(deltaY)
    viewAngle = toDegrees(Math.atan(deltaY / deltaX)) + 180
}
if (deltaX > 0 && deltaY < 0) {
    deltaY = Math.abs(deltaY)
    viewAngle = toDegrees(Math.atan(deltaX / deltaY)) + 270
}
console.log(viewAngle);



/* CALCULATING MOON POSITIONS BOTH LONGITUDE AND IN X,Y COORDS */

const moons = [
    {
        name: 'Io',
        sma: 1.0,
        period: 1.769137786,
        offset: 218.8,
    },
    {
        name: 'Europa',
        sma: 1.5909,
        period: 3.551181,
        offset: 4.88,
    },
    {
        name: 'Ganymede',
        sma: 2.5383,
        period: 7.15455296,
        offset: 348.28,
    },
    {
        name: 'Callisto',
        sma: 4.4645,
        period: 16.6890184,
        offset: 149.75,
    }
]

moons.forEach(moon => {
    moon.longitude = (((Ndays - lightTravelTime) / moon.period) % 1 * 360 + moon.offset) % 360
    calculateXY(moon)
});



/* DRAW VIEW OF SYSTEM */
const centerX = canvas.width / 2

function drawMoon(moon) {
    //canvas.width, canvas.height

    var xPos = moon.x * canvas.width / 10 + centerX
    ctx.beginPath();
    ctx.arc(xPos, 200, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.font = "80% Arial";
    ctx.fillText(moon.name.substring(0, 1), xPos - 5, 250);
}

//draw far moons
moons.forEach(moon => {
    if (moon.y > 0) {
        drawMoon(moon)
    }
});
//draw jupiter between far and near moons
ctx.beginPath();
ctx.arc(centerX, 200, 0.16 * canvas.width / 10, 0, 2 * Math.PI);
ctx.fillStyle = "orange";
ctx.fill();

//draw near moons
moons.forEach(moon => {
    if (moon.y < 0) {
        drawMoon(moon)
    }
});
