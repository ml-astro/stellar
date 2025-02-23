const today = new Date()
const reference = new Date(2000, 0, 1, 0, 0)
var d = (today - reference) / 86400000
let zoom = 0.2;
let info = false
let displaynames = false
let distances = false

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

const planets = [
    {
        name: 'Меркурий',
        color: "#918E87",
        N: 48.330766,
        dN: 3.24587E-5,
        i: 7.005,
        di: 5.00E-8,
        w: 29.1241,
        dw: 1.01444E-5,
        a: 0.3871,
        e: 0.205636,
        de: 5.59E-10,
        M: 168.6562,
        dM: 4.0923344368
    },
    {
        name: 'Венера',
        color: "#D9C091",
        N: 76.6798,
        dN: 2.46590E-5,
        i: 3.3947,
        di: 2.75E-8,
        w: 54.8910,
        dw: 1.38374E-5,
        a: 0.723336,
        e: 0.006777,
        de: - 1.302E-9,
        M: 48.0052,
        dM: 1.6021302244
    },
    {
        name: 'Земля',
        color: "#2B65EC",
        N: 140.224,
        dN: 0.0,
        i: 0,
        di: 1.036E-04,
        w: 322.6935,
        dw: 4.70935E-5,
        a: 1.00000261,
        e: 0.0167,
        de: - 1.151E-9,
        M: 356.0470,
        dM: 0.9856002585,
    },
    {
        name: 'Марс',
        color: "#C1440E",
        N: 49.5574,
        dN: 2.11081E-5,
        i: 1.8497,
        di: - 1.78E-8,
        w: 286.5016,
        dw: 2.92961E-5,
        a: 1.523688,
        e: 0.093405,
        de: 2.516E-9,
        M: 18.6021,
        dM: 0.5240207766,
    },
    {
        name: 'Юпитер',
        color: "#D2B48C",
        N: 100.4542,
        dN: 2.76854E-5,
        i: 1.3030,
        di: - 1.557E-7,
        w: 273.8777,
        dw: 1.64505E-5,
        a: 5.20256,
        e: 0.048498,
        de: 4.469E-9,
        M: 19.8950,
        dM: 0.0830853001,
    },
    {
        name: 'Сатурн',
        color: "#E6C28B",
        N: 113.6634,
        dN: 2.38980E-5,
        i: 2.4886,
        di: - 1.081E-7,
        w: 339.3939,
        dw: 2.97661E-5,
        a: 9.55475,
        e: 0.055546,
        de: - 9.499E-9,
        M: 316.9670,
        dM: 0.0334442282,
    },
    {
        name: 'Уран',
        color: "#7FBCD2",
        N: 74.0005,
        dN: 1.3978E-5,
        i: 0.7733,
        di: 1.9E-8,
        w: 96.6612,
        dw: 3.0565E-5,
        a: 19.18171,
        e: 0.047318,
        de: 7.45E-9,
        M: 142.5905,
        dM: 0.011725806,
    },
    {
        name: 'Нептун',
        color: "#7F88AA",
        N: 131.7806,
        dN: 3.0173E-5,
        i: 1.7700,
        di: - 2.55E-7,
        w: 272.8461,
        dw: - 6.027E-6,
        a: 30.05826,
        e: 0.008606,
        de: 2.15E-9,
        M: 260.2471,
        dM: 0.005995147,
    }
]

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case '+': zoomView('in');
            break;
        case '-': zoomView('out');
            break;
    }
})
window.addEventListener('wheel', e => {
    (e.deltaY > 0) ? zoomView('out') : (zoomView('in'));
})

function zoomView(mode) {
    if (mode == 'in') {
        if (zoom > 0.033) {
            zoom = zoom * 0.9;
        }
    }
    if (mode == 'out') {
        if (zoom < 10) {
            zoom = zoom * 1.1;
        }
    }
    generateSystem()
}

function calculateXY(planet) {
    let N = planet.N + planet.dN * d //Long of asc. node    
    let i = planet.i + planet.di * d //Inclination
    let w = planet.w + planet.dw * d //Argument of perihelion
    let a = planet.a //Semi-major axis
    let e = planet.e + planet.de * d //Eccentricity
    let M = (planet.M + planet.dM * d) % 360 + 360 //Mean anonaly
    let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1 + e * Math.cos(toRadians(M))) //eccentric anomaly
    let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1 - e * Math.cos(toRadians(E0))) //eccentric anomaly
    let v = toDegrees(2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(toRadians(E1) / 2))); //true anomaly
    let r = (a * (1 - e ** 2)) / (1 + e * Math.cos(toRadians(v))); //distance
    planet.x = r * (Math.cos(toRadians(N)) * Math.cos(toRadians(v + w)) - Math.sin(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.y = r * (Math.sin(toRadians(N)) * Math.cos(toRadians(v + w)) + Math.cos(toRadians(N)) * Math.sin(toRadians(v + w)) * Math.cos(toRadians(i)))
    planet.orbit = Math.sqrt(planet.x ** 2 + planet.y ** 2)
    //let longitude = (toDegrees(Math.atan2(y, x)) + 360) % 360
}


planets.forEach(planet => {
    calculateXY(planet)
})

function toggleInfo() {
    if (!info) {
        if (!distances) {
            calculateDistance()
        }
        document.getElementById('info').style.display = 'initial'
        info = true
    }
    else {
        document.getElementById('info').style.display = 'none'
        document.getElementById('info').innerHTML = ''
        info = false
    }
}

function calculateDistance() {
    document.getElementById('info').innerHTML += '<p>Расстояния до планет</p>'
    planets.forEach(planet => {
        let earthX = planets[2].x
        let earthY = planets[2].y
        if (planet.name != 'Земля') {
            let distance = Math.round((Math.sqrt(Math.abs(earthX - planet.x) ** 2 + Math.abs(earthY - planet.y) ** 2))*1496)/10
            document.getElementById('info').innerHTML += '<p>' + planet.name + ': ' + distance + ' млн. км.</p>'
            document.getElementById('info').style.display = 'initial'
        }
    });
}

function toggleNames() {
    if (!displaynames) {
        displaynames = true
    }
    else {
        displaynames = false
    }
    generateSystem()
}
generateSystem()

function generateSystem() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.clientWidth / 2, canvas.clientHeight / 2, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    planets.forEach(planet => {
        ctx.beginPath();
        ctx.setLineDash([2, 5]);
        ctx.arc(planet.x * 50 / zoom + canvas.width / 2, -planet.y * 50 / zoom + canvas.height / 2, 4, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.fill();
        ctx.strokeStyle = planet.color;
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height / 2, planet.orbit * 50 / zoom, 0, 2 * Math.PI)
        ctx.stroke();
        if (displaynames) {
            ctx.font = "80% Arial";
            ctx.fillText(planet.name, planet.x * 50 / zoom - 5 + canvas.width / 2, -planet.y * 50 / zoom + 20 + canvas.height / 2);
        }
    });

}