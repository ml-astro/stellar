//solve 1: scan for obs1 + obs2
//solve 2: <0.0001
//solve 3: solve 2 with obs1 + obs3

//tropical year
year = 365.24219
JD0 = julian_date(2000, 1, 1)
equinox_date_correction = 101.88
earth_distance = 1

function rad2deg(radians) { return radians * 180.0 / Math.PI }
function deg2rad(deg) { return deg * Math.PI / 180 }
function roundNumber(n) { return Math.round(n * 1000) / 1000 }
function normalizeAngle(deg) { deg = deg % 360; return deg < 0 ? deg + 360 : deg; }


function solveKeplerEarth(M, e, tol = 1e-6) {
    let E = M;
    let delta;
    do {
        delta = E - e * Math.sin(E) - M;
        E = E - delta / (1 - e * Math.cos(E));
    } while (Math.abs(delta) > tol);
    return E;
}

function earthPosition(jd, earth) {
    const d = jd - julian_date(2021, 1, 1, 0);
    let M = earth.M + earth.dM * d;
    M = normalizeAngle(M);
    M = deg2rad(M);
    const e = earth.e;
    const a = earth.a; // в млн км
    const E = solveKeplerEarth(M, e);
    const v = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
    );
    const r = a * (1 - e * Math.cos(E));
    const w = deg2rad(earth.w);
    const x = - r * Math.cos(v + w)
    const y = - r * Math.sin(v + w)
    return { x, y, r };
}

const earth = {
    N: 176.6624,
    i: 0,
    w: 286.3605,
    a: 1,
    e: 0.01672,
    M: 357.55703,
    dM: (1.1407E-5) * 86400
};



//относительное направление
function xy_to_direction(center, target) {
    dx = target.x - center.x
    dy = target.y - center.y
    direction = rad2deg(Math.atan(dy / dx))
    if (dx < 0) { direction += 180 }
    else if (dy < 0) { direction += 360 }
    return direction % 360
}

//абсолютная позиция
function direction_to_xy(phase, distance) {
    y = distance * Math.sin(deg2rad(phase))
    x = Math.sqrt(distance ** 2 - y * y)
    if (phase > 90 && phase < 270) { x = -x }
    return { x: x, y: y }
}

//расчет абсолютной позиции
function calculate_asteroid_position(earthpos, ra, distance) {
    ra = deg2rad(ra)
    xa = earthpos.x + distance * Math.cos(ra)
    ya = earthpos.y + distance * Math.sin(ra)
    return { x: xa, y: ya }
}

//нужно для расчета интервалов
function julian_date(year, month, day, time = 0) {
    const observationDate = new Date(year, month - 1, day, time);
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    return JD
}

function calculate_orbit_radius(position) { return Math.sqrt(position.x ** 2 + position.y ** 2) }

//расчет новой фазы
function calculate_next_phase(R, timediff, angle0) {
    period = Math.sqrt(R ** 3)
    phasechange = timediff / (period * year) * 360
    newphase = (phasechange + angle0) % 360
    return newphase
}

function deg2decimal(value) {
    degArray = value.split(':')
    if (isNaN(degArray[2])) {
        degArray[2] = 0
    }
    if (degArray[0] < 0) {
        return parseInt(degArray[0]) - degArray[1] / 60 - degArray[2] / 3600
    }
    return parseInt(degArray[0]) + degArray[1] / 60 + degArray[2] / 3600
}

function to_ecliptic(R, D) {
    const e = deg2rad(23.439291)
    const ra = deg2rad(R)
    const dec = deg2rad(D)
    const y = Math.sin(ra) * Math.cos(e) + Math.tan(dec) * Math.sin(e)
    const x = Math.cos(ra)
    let lon = rad2deg(Math.atan2(y, x))
    if (lon < 0) lon += 360
    return lon
}

function parseDate(data) {
    var [timePart, datePart] = data.split(' ')
    var dateSplit = datePart.split('.')
    var timeSplit = timePart.split(':')
    var time = parseFloat(timeSplit[1] / 60) + parseInt(timeSplit[0])
    return julian_date(dateSplit[2], parseInt(dateSplit[1]), parseInt(dateSplit[0]), time)
}

function parseForm(form) {
    JD1 = parseDate(form.date1.value)
    JD2 = parseDate(form.date2.value)
    ra1temp = deg2decimal(form.ra1.value) * 15
    ra2temp = deg2decimal(form.ra2.value) * 15
    dec1temp = deg2decimal(form.dec1.value)
    dec2temp = deg2decimal(form.dec2.value)
    ra1 = to_ecliptic(ra1temp, dec1temp)
    ra2 = to_ecliptic(ra2temp, dec2temp)
    innerFlag = form.inner.checked
    solve(JD1, JD2, ra1, ra2, innerFlag)
}


minimums = []

function scan(tdiff, earth1, earth2) {
    step = 0.05
    D = 0.1
    D5Flag = false
    D10Flag = false
    var prepre = 360 //предпредыдущее значение расхождения RA
    var pre = 360
    var asteroid1, asteroid2, aradius, aphase1, aphase2, raCalculated, direction_difference
    //шаг 1 - сканирование до 40 а.е. в поисках потенциальных решений
    while (D < 40) {
        asteroid1 = calculate_asteroid_position(earth1, ra1, D)
        aradius = calculate_orbit_radius(asteroid1)
        aphase1 = xy_to_direction({ x: 0, y: 0 }, asteroid1)
        aphase2 = calculate_next_phase(aradius, tdiff, aphase1)
        asteroid2 = direction_to_xy(aphase2, aradius)
        raCalculated = xy_to_direction(earth2, asteroid2)
        direction_difference = Math.abs(raCalculated - ra2)
        if (direction_difference > 180) {
            direction_difference = Math.abs(direction_difference - 360)
        }
        //добавляем предыдущую дистанцию
        if (pre <= direction_difference && pre <= prepre) {
            minimums.push(D - step)
        }
        prepre = pre
        pre = direction_difference
        if (D > 5 && D < 10 && D5Flag == false) {
            D5Flag = true
            step = step * 2
        }
        if (D >= 10 && D5Flag == true && D10Flag == false) {
            step = step * 2
            D10Flag = true
        }
        else { D = D + step }
    }
}

function solve(JD1, JD2, ra1, ra2) {
    document.getElementById('output').value = `
    Возможные решения:
    `
    tdiff = JD2 - JD1
    earth1 = earthPosition(JD1, earth)
    earth2 = earthPosition(JD2, earth)

    //scan откладывает минимумы в массив
    //шаг2 for ищет вокруг минимумов
    //все решения где разница <0.0001 запишет в массив потенциальных решений
    scan(tdiff, earth1, earth2)
    solutions = []

    for (var i = 0; i < minimums.length; i++) {
        D = minimums[i]
        step = 0.01
        var prevDiff = 180
        var asteroid1, asteroid2, aradius, aphase1, aphase2, raCalculated, direction_difference
        for (let i = 0; i < 200; i++) {
            asteroid1 = calculate_asteroid_position(earth1, ra1, D)
            aradius = calculate_orbit_radius(asteroid1)
            aphase1 = xy_to_direction({ x: 0, y: 0 }, asteroid1)
            aphase2 = calculate_next_phase(aradius, tdiff, aphase1)
            asteroid2 = direction_to_xy(aphase2, aradius)
            raCalculated = xy_to_direction(earth2, asteroid2)
            //сравниваем направление от земли 2 с расчетным
            direction_difference = Math.abs(raCalculated - ra2)
            if (direction_difference > 180) {
                direction_difference = Math.abs(direction_difference - 360)
            }
            if (direction_difference > prevDiff) {
                step = -step / 2
            }
            if (direction_difference < 0.0001) {
                radius = calculate_orbit_radius(asteroid1)
                solutions.push([roundNumber(radius), roundNumber(Math.sqrt(radius ** 3))])
                break
            }
            prevDiff = direction_difference
            D = D + step
        }

    }

    const uniqueSolutions = [...new Set(solutions.map(JSON.stringify))].map(JSON.parse);

    for (i = 0; i < uniqueSolutions.length; i++) {
        document.getElementById('output').value += `
    радиус орбиты:           ${uniqueSolutions[i][0]}
    период (лет):            ${uniqueSolutions[i][1]}
    `
    }


    /*document.getElementById('output').value = `
    наблюдение 1:
    координаты объекта:      ${roundNumber(asteroid1.x)} ${roundNumber(asteroid1.y)}
    координаты земли:        ${roundNumber(earth1.x)} ${roundNumber(earth1.y)}
    наблюдаемое направление: ${roundNumber(ra1)}
    расстояние:              ${roundNumber(D)}
    
    наблюдение 2:
    координаты объекта:      ${roundNumber(asteroid2.x)} ${roundNumber(asteroid2.y)}
    координаты земли:        ${roundNumber(earth2.x)} ${roundNumber(earth2.y)}
    наблюдаемое направление: ${roundNumber(ra2)}
    расчетное направление:   ${roundNumber(raCalculated)}
    погрешность направления: ${roundNumber(direction_difference)}
    
    радиус орбиты:           ${roundNumber(radius)}
    период (лет):            ${roundNumber(Math.sqrt(radius ** 3))}
        `
    }*/
}
