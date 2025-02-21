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
const today = new Date()
//UTC
const referenceDate = new Date(2024, 8, 22, 14, 33)
var Ndays = ((today - referenceDate) / 86400000)

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

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

Earth.longitude = Earth.offset + Ndays * Earth.daily % 360
Jupiter.longitude = Jupiter.offset + Ndays * Jupiter.daily % 360
calculateXY(Earth)
calculateXY(Jupiter)

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


/* CALCULATING MOON POSITIONS BOTH LONGITUDE AND IN X,Y COORDS */

const moons = [
    {
        name: 'Io',
        sma: 1.0,
        period: 1.769137786,
        offset: 292.8,
    },
    {
        name: 'Europa',
        sma: 1.5909,
        period: 3.551181,
        offset: 254.38,
    },
    {
        name: 'Ganymede',
        sma: 2.5383,
        period: 7.15455296,
        offset: 326.27,
    },
    {
        name: 'Callisto',
        sma: 4.4645,
        period: 16.6890184,
        offset: 136.94,
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
