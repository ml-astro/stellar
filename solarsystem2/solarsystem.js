var currentDate = new Date()

//элементы орбит опираются на эту дату:
const reference = new Date(2025, 0, 1, 0, 0)
var d = (currentDate - reference) / 86400000
let zoom = 150;
let info = false
let namesVisible = false
let distancesVisible = false
let animate

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
    switch (e.key) {
        case '+': zoomView('in');
            break;
        case '-': zoomView('out');
            break;
        case 'd': skip(1);
            break;
        case 's': skip(-1);
            break;
        case 'в': skip(1);
            break;
        case 'ы': skip(-1);
            break;
    }
})

window.addEventListener('wheel', e => {
    (e.deltaY > 0) ? zoomView('out') : (zoomView('in'));
})


//----------------------------------- PLANETS DATA ----------------------------//
const planets = [
    {
        name: 'Меркурий',
        color: "#918E87",
        N: 48.33076593,
        i: 7.0049790,
        w: 29.1241,
        a: 0.38709927,
        e: 0.20563593,
        M: 103.9465,
        dM: 4.0923344368,
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Венера',
        color: "#D9C091",
        N: 76.67984255,
        i: 3.39467605,
        w: 54.8910,
        a: 0.72333566,
        e: 0.00677672,
        M: 280.074910,
        dM: 1.6021302244,
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Земля',
        color: "#2B65EC",
        N: 140.2241915,
        i: -0.00001531,
        w: 322.6935,
        a: 1.00000261,
        e: 0.01671123,
        M: 357.6180389,
        dM: 0.9856002585,
        //сраные костыли!
        xoffset: 0.01,
        yoffset: 0.015
    },
    {
        name: 'Марс',
        color: "#C1440E",
        N: 49.55953891,
        i: 1.84969142,
        w: 286.5016,
        a: 1.52371034,
        e: 0.09339410,
        M: 124.444888195,
        dM: 0.5240207766,
        xoffset: 0,
        yoffset: 0
    },
    {
        name: 'Юпитер',
        color: "#D2B48C",
        N: 100.47390909,
        i: 1.30439695,
        w: 273.8777,
        a: 5.20288700,
        e: 0.04838624,
        M: 59.073717,
        dM: 0.0830853001,
        xoffset: 0.1,
        yoffset: 0.2
    },
    {
        name: 'Сатурн',
        color: "#E6C28B",
        N: 113.66242448,
        i: 2.48599187,
        w: 339.3939,
        a: 9.53667594,
        e: 0.05386179,
        M: 265.2373659,
        dM: 0.0334442282,
        xoffset: 0.3,
        yoffset: 0.5
    },
    {
        name: 'Уран',
        color: "#7FBCD2",
        N: 74.01692503,
        i: 0.77263783,
        w: 96.6612,
        a: 19.18916464,
        e: 0.04725744,
        M: 255.880997,
        dM: 0.011725806,
        xoffset: 0.2,
        yoffset: 0.4
    },
    {
        name: 'Нептун',
        color: "#7F88AA",
        N: 131.78422574,
        i: 1.77004347,
        w: 272.8461,
        a: 30.06992276,
        e: 0.00859048,
        M: 320.068409,
        dM: 0.005995147,
        xoffset: 0,
        yoffset: 0
    }
]

//---------------------------------- INITIALIZATION -----------------------------//
planets.forEach(planet => {
    calculatePositions(planet)
})
calculateDistances()
drawSystem()

//------------------------------------ FUNCTIONS ---------------------------------//
function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

function animationStep(x) {
    clearInterval(animate)
    step = 5;

    //and add days to for next frame
    animate = setInterval(() => {
        currentDate.setDate(currentDate.getDate() + 5);
        d = (currentDate - reference) / 86400000
        planets.forEach(planet => {
            calculatePositions(planet)
            calculateDistances()
        })
        drawSystem()
    }, 100);
}

//stop animation
function stop() {
    clearInterval(animate);
}

function skip(days) {
    currentDate.setDate(currentDate.getDate() + days);
    d = (currentDate - reference) / 86400000
    planets.forEach(planet => {
        calculatePositions(planet)
        calculateDistances()
    })
    drawSystem()
}

function zoomView(mode) {

    if (mode == 'out') {
        if (zoom > 2) {
            zoom = zoom * 0.9;
        }
    }
    if (mode == 'in') {
        if (zoom < 800) {
            zoom = zoom * 1.1;
        }
    }
    drawSystem()
}

//расчет положений планет - в объекты
function calculatePositions(planet) {
    let N = planet.N// + planet.dN * d //Long of asc. node    
    let i = planet.i// + planet.di * d //Inclination
    let w = planet.w// + planet.dw * d //Argument of perihelion
    let a = planet.a //Semi-major axis
    let e = planet.e// + planet.de * d //Eccentricity

    //put the updated numbers for dM later from horizons interface
    let M = (planet.M + planet.dM * d) % 360 + 360 //Mean anonaly

    let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1 + e * Math.cos(toRadians(M))) //eccentric anomaly
    let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1 - e * Math.cos(toRadians(E0))) //eccentric anomaly
    let v = toDegrees(2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(toRadians(E1) / 2))); //true anomaly
    let r = (a * (1 - e * e)) / (1 + e * Math.cos(toRadians(v))); //distance
    planet.x = r * (Math.cos(toRadians(N)) * Math.cos(toRadians(v + w)) - Math.sin(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.y = r * (Math.sin(toRadians(N)) * Math.cos(toRadians(v + w)) + Math.cos(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    //planet.orbit = Math.sqrt(planet.x ** 2 + planet.y ** 2)

    //let longitude = (toDegrees(Math.atan2(y, x)) + 360) % 360
}

//расчет расстояний от земли - после расчета положений
function calculateDistances() {
    planets.forEach(planet => {
        if (planet.name != 'Земля') { planet.distance = Math.round((Math.sqrt(Math.abs(planets[2].x - planet.x) ** 2 + Math.abs(planets[2].y - planet.y) ** 2)) * 10) / 10 + ' а.е.' }
    });
    drawSystem()
}

//показать названия
function toggleNames() {
    if (!namesVisible) {
        namesVisible = true
    }
    else {
        namesVisible = false
    }
    drawSystem()
    calculateDistances()
}

function toggleInfo() {
    if (!distancesVisible) {
        distancesVisible = true
    }
    else {
        distancesVisible = false
    }
    drawSystem()
    calculateDistances()
}

//нарисовать систему на холсте
function drawSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    planets.forEach(planet => {

        //draw planet
        ctx.beginPath();
        ctx.arc(planet.x * zoom + canvas.width / 2, -planet.y * zoom + canvas.height / 2, 4, 0, 2 * Math.PI); //planets
        ctx.fillStyle = planet.color;
        ctx.fill();

        //draw orbit
        ctx.setLineDash([1, 5]);
        ctx.strokeStyle = planet.color;
        ctx.beginPath()
        drawOrbit(planet.a, planet.e, planet.w, planet.xoffset, planet.yoffset);
        //круговые орбиты
        //ctx.arc(canvas.width / 2, canvas.height / 2, planet.orbit * zoom, 0, 2 * Math.PI)
        ctx.stroke();

        //show date
        ctx.font = "100% Arial";
        let month = currentDate.getMonth() + 1
        if (month < 10) { month = '0' + month }
        ctx.fillStyle = "white";
        ctx.fillText(currentDate.getDate() + '.' + month + '.' + currentDate.getFullYear(), 30, 30);

        //show names
        ctx.font = "80% Arial";
        if (namesVisible) {
            ctx.fillStyle = planet.color;
            ctx.fillText(planet.name, planet.x * zoom - 5 + canvas.width / 2, -planet.y * zoom + 18 + canvas.height / 2);
        }

        //show distances
        if (distancesVisible) {
            if (planet.name != 'Земля') {
                ctx.fillStyle = planet.color;
                ctx.fillText(planet.distance, planet.x * zoom - 5 + canvas.width / 2, -planet.y * zoom + 32 + canvas.height / 2);
            }
        }
    });
}

function drawOrbit(a, e, omega, x, y) {
    omega += 45 //вот такое говно

    // Малая полуось
    let b = a * Math.sqrt(1 - e * e);
    let focusOffset = e * a; // Смещение фокуса (Солнца)

    ctx.save();
    ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2); // Перемещаем центр
    ctx.rotate(((-omega) * Math.PI) / 180); // Поворот эллипса

    ctx.beginPath();
    //1 смещение по х - focus offset - смещение фокуса эллипса от центра - к солнцу
    //2 смещение по оси у
    //3 малая полуось
    //4 большая полуось
    //5.6.7 не надо
    ctx.ellipse((-focusOffset + x) * zoom, zoom * y, a * zoom, b * zoom, 0, 0, 2 * Math.PI);
    ctx.restore();
}

