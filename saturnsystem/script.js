//Saturn axial tilt 3.13 deg

/************************************* CANVAS *********************************/
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
const centerX = canvas.width / 2


/************************************* DATES *********************************/
const today = new Date()
const referenceDate = new Date(2025, 0, 1)
var Ndays = ((today - referenceDate) / 86400000)


/************************************* VARIABLES CONSTANTS OBJECTS *********************************/
var tilt

const Saturn = {
    color: "#E6C28B",
    N: 113.5596,
    i: 2.485819,
    w: 337.1664,
    a: 9.555678,
    e: 0.0522302,
    M: 264.9878,
    dM: 0.03337136,
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
const moons = [
    {
        name: '1',
        sma: 0.238 * 3,
        period: 1.370218,
        offset: 115.8,
        color: '#f7dc6f'
    },
    {
        name: '2',
        sma: 0.295 * 3,
        period: 1.887802,
        offset: 71.2,
        color: '#f7dc6f'
    },
    {
        name: '3',
        sma: 0.3774 * 3,
        period: 2.736915,
        offset: 176.8,
        color: '#f7dc6f'
    },
    {
        name: '4',
        sma: 0.527 * 3,
        period: 4.518212,
        offset: 33.8,
        color: '#f7dc6f'
    },
    {
        name: '5',
        sma: 1.222 * 3,
        period: 15.945,
        offset: 105.7,
        color: '#f7dc6f'
    },
]


/************************************* CONTROLS *********************************/

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'a': skip(-3);
            break;
        case 's': skip(-1);
            break;
        case 'd': skip(-0.03);
            break;
        case 'f': skip(0.03);
            break;
        case 'g': skip(1);
            break;
        case 'h': skip(3);
            break;

    }
})

function skip(days) {
    today.setTime(today.getTime() + days * 86400000);
    Ndays = (today - referenceDate) / 86400000
    calcPlanetCoordinates(Earth)
    calcPlanetCoordinates(Saturn)
    caclulateSystem()
}


/************************************* RADIANS DEGREES *********************************/

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}


/************************************* INITIALIZE *********************************/

calcPlanetCoordinates(Earth)
calcPlanetCoordinates(Saturn)
caclulateSystem()


/************************************* CALCULATIONS *********************************/

//coordinates in 2d space
function calcPlanetCoordinates(planet) {
    let N = planet.N// + planet.dN * d //Long of asc. node    
    let i = planet.i// + planet.di * d //Inclination
    let w = planet.w// + planet.dw * d //Argument of perihelion
    let a = planet.a //Semi-major axis
    let e = planet.e// + planet.de * d //Eccentricity
    let M = (planet.M + planet.dM * Ndays) % 360 + 360 //Mean anonaly
    let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1.0 + e * Math.cos(toRadians(M))) //eccentric anomaly
    let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1.0 - e * Math.cos(toRadians(E0))) //eccentric anomaly
    let v = toDegrees(2.0 * Math.atan(Math.sqrt((1.0 + e) / (1.0 - e)) * Math.tan(toRadians(E1) / 2.0))); //true anomaly
    planet.r = (a * (1.0 - e * e)) / (1.0 + e * Math.cos(toRadians(v))); //current distance from sun
    planet.x = planet.r * (Math.cos(toRadians(N)) * Math.cos(toRadians(v + w)) - Math.sin(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.y = planet.r * (Math.sin(toRadians(N)) * Math.cos(toRadians(v + w)) + Math.cos(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.longitude = (toDegrees(Math.atan2(planet.y, planet.x)) + 360) % 360
}


//Saturn system view angle, distance
function caclulateSystem() {
    var deltaX = Saturn.x - Earth.x
    var deltaY = Saturn.y - Earth.y
    var viewAngle;
    var distance = Math.sqrt(Math.abs(deltaX) ** 2 + Math.abs(deltaY) ** 2)
    //var lightTravelTime = distance * 149597870.700 / 299792 / 3600 / 24
    var lightTravelTime = distance * 0.0057755271548459
    Ndays -= lightTravelTime
    document.getElementById("distance").textContent = 'Расстояние ' + Math.floor(lightTravelTime * 1440) + ' световых минут'

    if (deltaX > 0 && deltaY > 0) { //to top right
        viewAngle = toDegrees(Math.atan(deltaY / deltaX))
    }
    if (deltaX < 0 && deltaY > 0) { //to top left
        deltaX = Math.abs(deltaX)
        viewAngle = toDegrees(Math.atan(deltaX / deltaY)) + 90
    }
    if (deltaX < 0 && deltaY < 0) { //to bottom left
        deltaX = Math.abs(deltaX)
        deltaY = Math.abs(deltaY)
        viewAngle = toDegrees(Math.atan(deltaY / deltaX)) + 180
    }
    if (deltaX > 0 && deltaY < 0) { //to bottom right
        deltaY = Math.abs(deltaY)
        viewAngle = toDegrees(Math.atan(deltaX / deltaY)) + 270
    }

    tilt = Math.sin(toRadians(viewAngle - 353)) * 50

    /* CALCULATING MOON POSITIONS BOTH LONGITUDE AND IN X,Y COORDS */
    moons.forEach(moon => {
        moon.longitude = ((Ndays / moon.period) % 1 * 360 + moon.offset - viewAngle) % 360
        if (moon.longitude < 0) {
            moon.longitude += 360
        }
        calcCanvasPosition(moon)
    });
    drawSystem()
}

function calcCanvasPosition(moon) {
    moon.x = moon.sma * Math.cos(toRadians(moon.longitude))
    moon.y = moon.sma * Math.sin(toRadians(moon.longitude))
    moon.longitude = moon.longitude % 360
    if (moon.longitude < 90) {
        moon.x = moon.sma * Math.cos(toRadians(moon.longitude))
        moon.y = moon.sma * Math.sin(toRadians(moon.longitude))
    }
    if (moon.longitude < 180 && moon.longitude > 90) {
        //moon.longitude -= 90
        moon.x = - moon.sma * Math.sin(toRadians(moon.longitude - 90))
        moon.y = moon.sma * Math.cos(toRadians(moon.longitude - 90))
    }
    if (moon.longitude < 270 && moon.longitude > 180) {
        //moon.longitude -= 180
        moon.x = -moon.sma * Math.cos(toRadians(moon.longitude - 180))
        moon.y = -moon.sma * Math.sin(toRadians(moon.longitude - 180))
    }
    if (moon.longitude > 270) {
        //moon.longitude -= 270
        moon.x = moon.sma * Math.sin(toRadians(moon.longitude - 270))
        moon.y = -moon.sma * Math.cos(toRadians(moon.longitude - 270))
    }
}


/************************************* DRAW  *********************************/

function drawSystem() {
    /* DRAW VIEW OF SYSTEM */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw far moons
    moons.forEach(moon => {
        if (moon.y > 0) {
            drawMoon(moon)
        }
    });

    //67 140




    ctx.beginPath();
    ctx.fillStyle = Saturn.color
    ctx.ellipse(centerX, 200, 0.140 * 3 * canvas.width / 10, Math.abs(0.140*tilt*4), 0, 0, 2 * Math.PI);
    ctx.fill()

    ctx.beginPath();
    ctx.fillStyle = '#111'
    ctx.ellipse(centerX, 200, 0.074 * 3 * canvas.width / 10, Math.abs(0.074*tilt*4), 0, 0, 2 * Math.PI);
    ctx.fill()




    //draw Saturn between far and near moons
    ctx.beginPath();
    ctx.arc(centerX, 200, 0.058 * 3 * canvas.width / 10, 0, 2 * Math.PI);
    ctx.fillStyle = Saturn.color;
    ctx.fill();

    //draw near moons
    moons.forEach(moon => {
        if (moon.y < 0) {
            drawMoon(moon)
        }
    });
}

function drawMoon(moon) {
    var xPos = moon.x * canvas.width / 10 + centerX
    ctx.beginPath();
    ctx.arc(xPos, 200 + moon.y * tilt, 3, 0, 2 * Math.PI);
    ctx.fillStyle = moon.color;
    ctx.fill();
    ctx.font = "80% Arial";
    ctx.fillText(moon.name, xPos - 5, 270 + moon.y * tilt);
}