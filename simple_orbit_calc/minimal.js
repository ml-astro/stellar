//solve 1: scanMinimums for obs1 + obs2
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
function calculate_object_position(earthpos, ra, distance) {
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
    obs1 = { JD: JD1, ra: ra1 }
    obs2 = { JD: JD2, ra: ra2 }
    if (isNaN(form.date3.value)) {
        JD3 = parseDate(form.date3.value)
        ra3temp = deg2decimal(form.ra3.value) * 15
        dec3temp = deg2decimal(form.dec3.value)
        ra3 = to_ecliptic(ra3temp, dec3temp)
        obs3 = { JD: JD3, ra: ra3 }
        solve(obs1, obs2, obs3)
    }
    else {
        JD3 = null
        ra3 = null
        solve(obs1, obs2)
    }
}


function scanMinimums(tdiff, earthFirst, earthLast, raFirst, raLast) {
    //scanMinimums откладывает минимумы в массив
    minimums = []
    step = 0.05
    D = 0.1
    D5Flag = false
    D10Flag = false
    var prepre = 360 //предпредыдущее значение расхождения RA
    var pre = 360
    //шаг 1 - сканирование до 40 а.е. в поисках потенциальных решений
    while (D < 40) {
        objectFirst = calculate_object_position(earthFirst, raFirst, D)
        orbitRadius = calculate_orbit_radius(objectFirst)
        objectPhaseFirst = xy_to_direction({ x: 0, y: 0 }, objectFirst)
        objectPhaseLast = calculate_next_phase(orbitRadius, tdiff, objectPhaseFirst)
        objectLast = direction_to_xy(objectPhaseLast, orbitRadius)
        raCalculated = xy_to_direction(earthLast, objectLast)
        direction_difference = Math.abs(raCalculated - raLast)
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
    return minimums
}

function getSolutions(minimums, earthFirst, ra1, earthLast, ra2, tdiff) {
    //ищет вокруг минимумов все решения. где разница <0.0001 запишет в массив потенциальных решений
    solutions = []
    for (var i = 0; i < minimums.length; i++) {
        D = minimums[i]
        step = 0.01
        var prevDiff = 180
        var objectFirst, objectLast, aradius, objectPhaseFirst, objectPhaseLast, raCalculated, direction_difference
        for (let i = 0; i < 500; i++) {
            objectFirst = calculate_object_position(earthFirst, ra1, D)
            aradius = calculate_orbit_radius(objectFirst)
            objectPhaseFirst = xy_to_direction({ x: 0, y: 0 }, objectFirst)
            objectPhaseLast = calculate_next_phase(aradius, tdiff, objectPhaseFirst)
            objectLast = direction_to_xy(objectPhaseLast, aradius)
            raCalculated = xy_to_direction(earthLast, objectLast)
            //сравниваем направление от земли 2 с расчетным
            direction_difference = Math.abs(raCalculated - ra2)
            if (direction_difference > 180) {
                direction_difference = Math.abs(direction_difference - 360)
            }
            if (direction_difference > prevDiff) {
                step = -step / 2
            }
            if (direction_difference < 0.0001) {
                radius = calculate_orbit_radius(objectFirst)
                //solutions D используем для следующего приближения
                solutions.push([roundNumber(radius), roundNumber(Math.sqrt(radius ** 3)), roundNumber(D)])
                break
            }
            prevDiff = direction_difference
            D = D + step
        }
    }
    return solutions
}

function compareSolutions(short, long) {
    bestGuess = []
    for (i = 0; i < short.length; i++) {
        if (Math.abs(short[i][0] - 1) > 0.2) {
            for (j = 0; j < long.length; j++) {
                if (Math.abs(short[i][0] - long[j][0]) / short[i][0] < 0.3) {
                    //длинная дуга наблюдений в приоритете. короткая только для отбора если несколько длинных решений
                    bestGuess.push(long[j])
                }
            }
        }
    }
    return bestGuess
}



function solve(obs1, obs2, obs3 = null) {
    document.getElementById('output').value = `
    Возможные решения:
    `

    obs1.earth = earthPosition(obs1.JD, earth)
    obs2.earth = earthPosition(obs2.JD, earth)

    var uniqueSolutions = []
    var uniqueMidSolutions = []
    var best = []
    //если указано третье наблюдение, ищет решения для промежуточного
    if (!obs3) {
        tdiff = obs2.JD - obs1.JD
        minimums = scanMinimums(tdiff, obs1.earth, obs2.earth, obs1.ra, obs2.ra)
        solutions = getSolutions(minimums, obs1.earth, obs1.ra, obs2.earth, obs2.ra, tdiff)
        uniqueSolutions = [...new Set(solutions.map(JSON.stringify))].map(JSON.parse);
        best = [...uniqueSolutions]
    }
    else {
        obs3.earth = earthPosition(obs3.JD, earth)
        tdiff = obs3.JD - obs1.JD
        minimums = scanMinimums(tdiff, obs1.earth, obs3.earth, obs1.ra, obs3.ra)
        solutions = getSolutions(minimums, obs1.earth, obs1.ra, obs3.earth, obs3.ra, tdiff)
        uniqueSolutions = [...new Set(solutions.map(JSON.stringify))].map(JSON.parse);
        console.log('uniqueSolutions',uniqueSolutions);
        tdiffControl = obs2.JD - obs1.JD
        newMinimums = []
        for (i = 0; i < uniqueSolutions.length; i++) {
            newMinimums.push(uniqueSolutions[i][2])
        }
        midSolutions = getSolutions(newMinimums, obs1.earth, obs1.ra, obs2.earth, obs2.ra, tdiffControl)
        console.log('midSolutions',midSolutions);
        uniqueMidSolutions = [...new Set(solutions.map(JSON.stringify))].map(JSON.parse);
        best = compareSolutions(uniqueMidSolutions, uniqueSolutions)
    }

    for (i = 0; i < best.length; i++) {
        document.getElementById('output').value += `
    радиус орбиты:       ${best[i][0]} а.е
    период:              ${best[i][1]} г.
    расстояние:          ${best[i][2]} а.е (набл.1)
    `
    }

}
