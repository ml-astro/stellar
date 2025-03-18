var currentDate = new Date()

//элементы орбит опираются на эту дату:
const reference = new Date(2025, 0, 1, 0, 0)
var d = (currentDate - reference) / 86400000
let zoom = 2.5;
let namesVisible = false
let isInfoActive = false
let animate
let intervalid
let planetCentered = 0

var modal = document.getElementsByClassName('modal')[0]
let playButton = document.getElementById('play')

//-------------- CREATING CANVAS --------------------///

const system = document.createElement("canvas");
const systemId = document.createAttribute("id");
const systemWidth = document.createAttribute("width");
const systemHeight = document.createAttribute("height");
systemId.value = "myCanvas";
systemWidth.value = window.innerWidth + 'px';
systemHeight.value = window.innerHeight + 'px';
system.setAttributeNode(systemId);
system.setAttributeNode(systemWidth);
system.setAttributeNode(systemHeight);
document.getElementsByClassName('system')[0].appendChild(system);
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

//------------------------- CREATING EVENT LISTENERS ----------------------//

window.addEventListener('keydown', e => {
    switch (e.key.toLowerCase()) {
        case '+': zoomView('in');
            break;
        case '-': zoomView('out');
            break;
        case 'q': skip(1);
            break;
        case 'a': skip(-1);
            break;
        case 'w': skip(30);
            break;
        case 's': skip(-30);
            break;
        case 'e': skip(365);
            break;
        case 'd': skip(-365);
            break;
        case 'i': toggleInfo();
            break;
        case 'n': toggleNames();
            break;
        case 'й': skip(1);
            break;
        case 'ф': skip(-1);
            break;
        case 'ц': skip(30);
            break;
        case 'ы': skip(-30);
            break;
        case 'у': skip(365);
            break;
        case 'в': skip(-365);
            break;
        case 'ш': toggleInfo();
            break;
        case 'т': toggleNames();
            break;
        case '0':
            planetCentered=0
            drawSystem();
            break;
        case '1':
            centerPlanet(1)
            drawSystem();
            break;
            case '2':
            centerPlanet(2)
            drawSystem();
            break;
        case '3':
            centerPlanet(3)
            drawSystem();
            break;
        case '4':
            centerPlanet(4)
            drawSystem();
            break;
        case '5':
            centerPlanet(5)
            drawSystem();
            break;
        case '6':
            centerPlanet(6)
            drawSystem();
            break;
        case '7':
            centerPlanet(7)
            drawSystem();
            break;
        case '8':
            centerPlanet(8)
            drawSystem();
            break;


    }
})

window.addEventListener('wheel', e => {
    (e.deltaY > 0) ? zoomView('out') : (zoomView('in'));
})

playButton.addEventListener('click', () => {
    if (!intervalid) {
        document.getElementById('play').innerHTML = 'II'
        intervalid = setInterval(() => {
            skip(3)
        }, 100)
    }
    else {
        document.getElementById('play').innerHTML = '&#9658;'
        clearInterval(intervalid)
        intervalid = null
    }
})


//----------------------------------- PLANETS DATA ----------------------------//
const planets = [
    {
        //in million km
        name: 'Меркурий',
        color: "#918E87",
        size: 0.00244,
        mag0: -0.42,
        N: 48.2998053, //OM
        i: 7.003502, //IN
        w: 29.1956, //W
        a: 57.909,
        e: 0.20563889, //EC
        M: 103.9465, //MA
        dM: 4.09234043, //N
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Венера',
        color: "#D9C091",
        size: 0.006052,
        mag0: -4.4,
        N: 76.61185393,
        i: 3.3943933,
        w: 55.15075,
        a: 108.20835,
        e: 0.00674678,
        M: 280.074910,
        dM: 1.602144,
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Земля',
        color: "#2B65EC",
        N: 190.71637577,
        i: 0.00297708,
        w: 272.9783,
        a: 149.734386,
        e: 0.0175619,
        M: 357.412225,
        dM: 0.984262,
        //сраные костыли!
        xoffset: 4,
        yoffset: 0
    },
    {
        name: 'Марс',
        color: "#C1440E",
        size: 0.003389,
        mag0: -1.52,
        N: 49.48673,
        i: 1.84758,
        w: 286.7115,
        a: 227.948,
        e: 0.0934303,
        M: 124.444888,
        dM: 0.524009568,
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Юпитер',
        color: "#D2B48C",
        size: 0.069911,
        mag0: -9.4,
        N: 100.52021,
        i: 1.30346,
        w: 273.609,
        a: 778.33186,
        e: 0.0483062,
        M: 58.982826,
        dM: 0.08309065,
        xoffset: 15,
        yoffset: 25
    },
    {
        name: 'Сатурн',
        color: "#E6C28B",
        size: 0.058232,
        mag0: -8.88,
        N: 113.5596,
        i: 2.485819,
        w: 337.1664,
        a: 1429.50914,
        e: 0.0522302,
        M: 264.9878,
        dM: 0.03337136,
        xoffset: 40,
        yoffset: 60
    },
    {
        name: 'Уран',
        color: "#7FBCD2",
        size: 0.025362,
        mag0: -7.19,
        N: 0.025362,
        i: 0.772897,
        w: 90.4959,
        a: 2887.44094,
        e: 0.0456241,
        M: 255.88225,
        dM: 0.01162337,
        xoffset: 20,
        yoffset: -100
    },
    {
        name: 'Нептун',
        color: "#7F88AA",
        size: 0.024622,
        mag0: -6.87,
        N: 131.9474,
        i: 1.77485,
        w: 268.1154,
        a: 4515.4065,
        e: 0.012661,
        M: 319.6851,
        dM: 0.005944,
        xoffset: 0,
        yoffset: 0
    }
]

//---------------------------------- INITIALIZATION -----------------------------//
calculatePositions()
drawSystem()
showDate()
var xCenter = 0
var yCenter = 0


//------------------------------------ CONVERSIONS ---------------------------------//

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180.0 / Math.PI)
}

//------------------------------------ UI FUNCTIONS ---------------------------------//

function skip(days) {
    currentDate.setDate(currentDate.getDate() + days);
    d = (currentDate - reference) / 86400000
    calculatePositions()
    if (isInfoActive) {
        displayInfo()
    }
    drawSystem()
    showDate()
}

function centerPlanet(num) {
    planetCentered=num
}

function zoomView(mode) {
    if (mode == 'out') {
        if (zoom > 0.03) {
            zoom = zoom * 0.9;
        }
    }
    if (mode == 'in') {
        if (zoom < 10) {
            zoom = zoom * 1.1;
        }
    }
    drawSystem()
}

//показать названия
function toggleNames() {
    namesVisible = !namesVisible
    drawSystem();
}

function toggleInfo() {
    if (!isInfoActive) {
        modal.style.display = 'initial'
        displayInfo()
    }
    else {
        modal.style.display = 'none'
    }
    isInfoActive = !isInfoActive
}

function displayInfo() {
    let i = 1
    planets.forEach(planet => {
        if (planet.name != 'Земля') {
            let tr = document.getElementsByTagName('tr')[i]
            tr.getElementsByTagName('td')[1].textContent = Math.round(calculateDistance(planet)) + ' м.км'
            tr.getElementsByTagName('td')[2].textContent = Math.round(calculateElongation(planet)) + '\u00B0'
            tr.getElementsByTagName('td')[3].textContent = Math.round(calculatePhase(planet)) + '%'
            tr.getElementsByTagName('td')[4].textContent = Math.round(calculateSize(planet)) + '"'
            tr.getElementsByTagName('td')[5].textContent = Math.round(calculateMag(planet) * 10) / 10
            i++
        }
    })
}


//------------------------------------ CALCUATIONS ---------------------------------//

//расчет положений планет, радиуса вектора, угла
function calculatePositions() {
    planets.forEach(planet => {
        let N = planet.N// + planet.dN * d //Long of asc. node    
        let i = planet.i// + planet.di * d //Inclination
        let w = planet.w// + planet.dw * d //Argument of perihelion
        let a = planet.a //Semi-major axis
        let e = planet.e// + planet.de * d //Eccentricity
        //put the updated numbers for dM later from horizons interface
        let M = (planet.M + planet.dM * d) % 360 + 360 //Mean anonaly
        let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1.0 + e * Math.cos(toRadians(M))) //eccentric anomaly
        let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1.0 - e * Math.cos(toRadians(E0))) //eccentric anomaly
        let v = toDegrees(2.0 * Math.atan(Math.sqrt((1.0 + e) / (1.0 - e)) * Math.tan(toRadians(E1) / 2.0))); //true anomaly
        planet.r = (a * (1.0 - e * e)) / (1.0 + e * Math.cos(toRadians(v))); //current distance from sun
        planet.x = planet.r * (Math.cos(toRadians(N)) * Math.cos(toRadians(v + w)) - Math.sin(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
        planet.y = planet.r * (Math.sin(toRadians(N)) * Math.cos(toRadians(v + w)) + Math.cos(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
        planet.longitude = (toDegrees(Math.atan2(planet.y, planet.x)) + 360) % 360
    })
}

//a - earth to planet
//b - sun to planet
//c - sun to earth
//A - angle planet - sun - earth
//B - angle sun - earth - planet = elongation
//returns elongation
function calculateElongation(planet) {
    let a = planet.distance
    let b = planet.r
    let c = planets[2].r
    let elongation = toDegrees(Math.acos((a * a + c * c - b * b) / (2 * a * c)))
    if (!isNaN(elongation)) {
        planet.elongation = elongation
    }
    return (planet.elongation)
}

//returns distance from earth
function calculateDistance(planet) {
    planet.distance = (Math.sqrt((planets[2].x - planet.x) ** 2 + (planets[2].y - planet.y) ** 2))
    return planet.distance
}

//returns angular size
function calculateSize(planet) {
    return planet.size / planet.distance * 206265 * 2
}

//returns phase
function calculatePhase(planet) {   
    let longitudeDifference = Math.abs(planet.longitude - planets[2].longitude)
    if (longitudeDifference > 180) {
        longitudeDifference = 360 - longitudeDifference
    }
    planet.phaseangle = longitudeDifference + planet.elongation
    if (planet.phaseangle > 180) {
        planet.phaseangle = 180
    }
    let phase
    if (planet.phaseangle < 90) {
        phase = ((1.0 - Math.cos(planet.phaseangle * 0.017453292)) / 2.0) * 100;
    }
    if (planet.phaseangle > 90) {
        phase = ((1.0 + Math.cos((180 - planet.phaseangle) * 0.017453292)) / 2.0) * 100;
    }
    if (!isNaN(phase)) {
        planet.phase = phase
    }
    planet.longitudeDifference = longitudeDifference
    return (planet.phase)
}

//returns magnitude
function calculateMag(planet) {
    let r = planet.r / 149.6;
    let delta = planet.distance / 149.6
    let distanceFactor = 5 * Math.log10(r * delta);
    let g = toRadians(180 - planet.phaseangle)
    let phi = -2.5 * Math.log10((1 + Math.cos(g)) / 2);
    return planet.mag0 + distanceFactor + phi;
}

function showDate() {
    let day = currentDate.getDate()
    if (day < 10) { day = '0' + day }
    let month = currentDate.getMonth() + 1
    if (month < 10) { month = '0' + month }
    let year = currentDate.getFullYear()
    document.querySelector('#calendar p').textContent = day + '.' + month + '.' + year
}

//нарисовать систему на холсте
function drawSystem() {
    if (planetCentered == 0) {
        xCenter = 0
        yCenter = 0
    }
    else {
        xCenter = planets[planetCentered-1].x * zoom
        yCenter = planets[planetCentered-1].y * zoom
    }
   console.log(planetCentered);
   
    //xCenter=planets[2].x*zoom
    //yCenter=planets[2].y*zoom
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    //ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, 2 * Math.PI);
    ctx.arc(canvas.width / 2 - xCenter, canvas.height / 2 + yCenter, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    planets.forEach(planet => {
        //draw planet
        ctx.beginPath();
        ctx.arc(planet.x * zoom + canvas.width / 2 - xCenter, -planet.y * zoom + canvas.height / 2 + yCenter, 4, 0, 2 * Math.PI); //planets
        //ctx.arc(planet.x * zoom + canvas.width / 2, -planet.y * zoom + canvas.height / 2, 4, 0, 2 * Math.PI); //planets
        ctx.fillStyle = planet.color;
        ctx.fill();
        //draw orbit
        ctx.setLineDash([1, 15]);
        ctx.strokeStyle = planet.color;
        if (namesVisible) {
            ctx.font = "80% Arial";
            ctx.fillStyle = planet.color;
            ctx.fillText(planet.name, planet.x * zoom - 5 + canvas.width / 2 -xCenter, -planet.y * zoom +yCenter + 18 + canvas.height / 2);
        }
        ctx.beginPath()
        let omega = planet.w + 45//вот такое говно
        // Малая полуось
        let b = planet.a * Math.sqrt(1 - planet.e ** 2);
        let focusOffset = planet.e * planet.a; // Смещение фокуса (Солнца)
        ctx.save();
        ctx.translate(canvas.clientWidth / 2 - xCenter, canvas.clientHeight / 2 + yCenter); // Перемещаем центр
        //ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2); // Перемещаем центр
        ctx.rotate(((-omega) * Math.PI) / 180); // Поворот эллипса
        ctx.beginPath();
        //1 смещение по х - focus offset - смещение фокуса эллипса от центра - к солнцу
        //2 смещение по оси у
        //3 малая полуось
        //4 большая полуось
        //5.6.7 не надо
        ctx.ellipse((-focusOffset + planet.xoffset) * zoom, zoom * planet.yoffset, planet.a * zoom, b * zoom, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    });
}
