//tropical year
year = 365.24219
JD0 = 2451544.417
equinox_date_correction = 101.88
earth_distance = 1

function rad2deg(radians) { return radians * 180.0 / Math.PI }
function deg2rad(deg) { return deg * Math.PI / 180 }
function earth_phase_angle(date) { return (equinox_date_correction + ((date - JD0) / year % 1 * 360)) % 360 }
function roundNumber(n){return Math.round(n*1000)/1000}

//относительное направление
function xy_to_direction(center, target) {
    dx = target[0] - center[0]
    dy = target[1] - center[1]
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
    xa = earthpos[0] + distance * Math.cos(ra)
    ya = earthpos[1] + distance * Math.sin(ra)
    return [xa, ya]
}

//нужно для расчета интервалов
function julian_date(year, month, day, time) {
    const observationDate = new Date(year, month - 1, day, time);
    JD = observationDate / 1000 / 3600 / 24 + 2440587.5
    return JD
}

function calculate_orbit_radius(apos) { return Math.sqrt(apos[0] ** 2 + apos[1] ** 2) }

//calculate new phase
function calculate_next_phase(R, timediff, angle0) {
    period = Math.sqrt(R ** 3)
    phasechange = timediff / (period * year) * 360
    console.log("period in years", period)
    console.log("orbital shift", phasechange)
    newphase = (phasechange + angle0) % 360
    console.log('new phase', newphase);
    return newphase
}

function deg2decimal(value) {
    degArray = value.split(':')
    return parseInt(degArray[0]) + degArray[1] / 60
}

//не работает как надо
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

function parseRA(data) {
    var [deg, min] = data.split(':')
    return parseInt(deg) + parseFloat(min / 60)
}

//console.log(to_ecliptic(4.06*15, 16.5));

function parseForm(form) {
    JD1 = parseDate(form.date1.value)
    JD2 = parseDate(form.date2.value)
    ra1 = parseRA(form.ra1.value)
    ra2 = parseRA(form.ra2.value)
    D = form.distance.value
    calculation(JD1, JD2, ra1, ra2, D)
}

function calculation(JD1, JD2, ra1, ra2, D) {
    tdiff = JD2 - JD1
    phase1 = earth_phase_angle(JD1)
    phase2 = calculate_next_phase(1, tdiff, phase1)
    earth1 = direction_to_xy(phase1, earth_distance)
    earth2 = direction_to_xy(phase2, earth_distance)

    //НАЧИНАЕМ ПЕРЕБОР РАССТОЯНИЙ ДЛЯ ПЕРВОГО НАБЛЮДЕНИЯ, ПРИ ЭТОМ СРАВНИВАЕМ НАПРАВЛЕНИЯ 1 И 2
    //это будем перебирать для алгоритма приближения
    //существует как минимум два решения для тех астероидов у которых малая элонгация с солнцем - подмешиваются расчеты для внутренней солнечной системы
    //для юпитера решила большая дуга наблюдений
    //посмотреть как будет с марсом. он дал мне большую погрешность при 3 месяцах


    asteroid1 = calculate_asteroid_position(earth1, ra1, D)
    
    aradius = calculate_orbit_radius(asteroid1)
    aphase1 = xy_to_direction([0, 0], asteroid1)
    aphase2 = calculate_next_phase(aradius, tdiff, aphase1)
    asteroid2 = direction_to_xy(aphase2, aradius)
    //у нас есть интервал времени
    //за это время знаем сколько прошел астероид и его новое положение ху
    //считаем направление от земли 2
    direction2 = xy_to_direction(earth2, asteroid2)
    //сравниваем направление от земли 2 с расчетным
    
    document.getElementById('output').value=`
    asteroid position 1:  ${asteroid1}
    earth position 1:     ${earth1}
    orbit radius:         ${roundNumber(aradius)}
    asteroid phase 1:     ${roundNumber(aphase1)}
    asteroid phase 2:     ${roundNumber(aphase2)}
    asteroid position 2:  ${asteroid2}
    earth position 2:     ${earth2}
    observed direction:   ${ra2}
    calculated direction: ${roundNumber(direction2)}
    direction difference: ${roundNumber(direction2 - ra2)}
    orbit radius':        ${calculate_orbit_radius(asteroid1)}
    `


}