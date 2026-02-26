//tropical year
year = 365.24219
JD0 = julian_date(2000, 1, 1)
equinox_date_correction = 101.88
earth_distance = 1

function rad2deg(radians) { return radians * 180.0 / Math.PI }
function deg2rad(deg) { return deg * Math.PI / 180 }
function roundNumber(n) { return Math.round(n * 1000) / 1000 }
function normalizeAngle(deg) {deg = deg % 360; return deg < 0 ? deg + 360 : deg;}


function solveKeplerEarth(M, e, tol = 1e-6) {
    let E = M; // начальное приближение
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
    dx = target[0] - center.x
    dy = target[1] - center.y
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
    return [x, y]
}

//расчет абсолютной позиции
function calculate_asteroid_position(earthpos, ra, distance) {
    ra = deg2rad(ra)
    xa = earthpos.x + distance * Math.cos(ra)
    ya = earthpos.y + distance * Math.sin(ra)
    return [xa, ya]
}

//нужно для расчета интервалов
function julian_date(year, month, day, time = 0) {
    const observationDate = new Date(year, month - 1, day, time);
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    return JD
}

function calculate_orbit_radius(apos) { return Math.sqrt(apos[0] ** 2 + apos[1] ** 2) }

//calculate new phase
function calculate_next_phase(R, timediff, angle0) {
    period = Math.sqrt(R ** 3)
    phasechange = timediff / (period * year) * 360
    newphase = (phasechange + angle0) % 360
    return newphase
}

function deg2decimal(value) {
    degArray = value.split(':')
    if (degArray[0] < 0) {
        return parseInt(degArray[0]) - degArray[1] / 60
    }
    return parseInt(degArray[0]) + degArray[1] / 60
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
    approximation(JD1, JD2, ra1, ra2)
    
}

function approximation(JD1, JD2, ra1, ra2) {
    tdiff = JD2 - JD1
    earth1 = earthPosition(JD1,earth)
    earth2 = earthPosition(JD2,earth)

    //НАЧИНАЕМ ПЕРЕБОР РАССТОЯНИЙ ДЛЯ ПЕРВОГО НАБЛЮДЕНИЯ, ПРИ ЭТОМ СРАВНИВАЕМ НАПРАВЛЕНИЯ 1 И 2
    //это будем перебирать для алгоритма приближения
    //существует как минимум два решения для тех объектов у которых малая элонгация с солнцем - подмешиваются расчеты для внутренней солнечной системы
    //для юпитера решила большая дуга наблюдений
    //посмотреть как будет с марсом. он дал мне большую погрешность при 3 месяцах
        
    step = 1
    D = 1
    var prevDiff = 360
    var asteroid1, asteroid2, aradius, aphase1, aphase2, direction2, direction_difference
    for (let i = 0; i < 50; i++) {
        asteroid1 = calculate_asteroid_position(earth1, ra1, D)
        aradius = calculate_orbit_radius(asteroid1)
        aphase1 = xy_to_direction({x:0,y:0}, asteroid1)
        aphase2 = calculate_next_phase(aradius, tdiff, aphase1)
        asteroid2 = direction_to_xy(aphase2, aradius)
        direction2 = xy_to_direction(earth2, asteroid2)
        //сравниваем направление от земли 2 с расчетным
        direction_difference = Math.abs(direction2 - ra2)
        if (direction_difference > prevDiff) {
            step = -step / 2
        }
        prevDiff = direction_difference
        D = D + step
    }

    document.getElementById('output').value = `
    наблюдение 1:
    координаты объекта:      ${roundNumber(asteroid1[0])} ${roundNumber(asteroid1[1])}
    координаты земли:        ${roundNumber(earth1.x)} ${roundNumber(earth1.y)}
    расстояние:              ${roundNumber(D)}

    наблюдение 2:
    координаты объекта:      ${roundNumber(asteroid2[0])} ${roundNumber(asteroid2[1])}
    координаты земли:        ${roundNumber(earth2.x)} ${roundNumber(earth2.y)}
    наблюдаемое направление: ${roundNumber(ra2)}
    расчетное направление:   ${roundNumber(direction2)}
    погрешность направления: ${roundNumber(direction_difference)}

    радиус орбиты:           ${roundNumber(calculate_orbit_radius(asteroid1))}
    `
}
