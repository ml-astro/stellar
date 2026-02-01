const R_EARTH = 6371e3; // метры

// БАЗОВАЯ ГЕОМЕТРИЯ
function ecefFromLatLon(lat, lon, h = 0) {
    lat = lat * Math.PI / 180;
    lon = lon * Math.PI / 180;
    const x = (R_EARTH + h) * Math.cos(lat) * Math.cos(lon);
    const y = (R_EARTH + h) * Math.cos(lat) * Math.sin(lon);
    const z = (R_EARTH + h) * Math.sin(lat);
    return [x, y, z];
}

function dirFromRaDec(ra, dec) {
    ra = ra * 15 * Math.PI / 180; // часы -> градусы -> радианы
    dec = dec * Math.PI / 180;
    const x = Math.cos(dec) * Math.cos(ra);
    const y = Math.cos(dec) * Math.sin(ra);
    const z = Math.sin(dec);
    const n = Math.sqrt(x * x + y * y + z * z);
    return [x / n, y / n, z / n];
}

// ЛИНЕЙНАЯ АЛГЕБРА
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function outer(a, b) {
    return [
        [a[0] * b[0], a[0] * b[1], a[0] * b[2]],
        [a[1] * b[0], a[1] * b[1], a[1] * b[2]],
        [a[2] * b[0], a[2] * b[1], a[2] * b[2]]
    ];
}

function matAdd(A, B) {
    return A.map((row, i) =>
        row.map((val, j) => val + B[i][j])
    );
}

function matVec(A, v) {
    return [
        A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2],
        A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2],
        A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2]
    ];
}

function solve3x3(A, b) {
    const [a, b1, c] = A[0];
    const [d, e, f] = A[1];
    const [g, h, i] = A[2];

    const det =
        a * (e * i - f * h) -
        b1 * (d * i - f * g) +
        c * (d * h - e * g);

    if (Math.abs(det) < 1e-12)
        throw "Вырожденная система";

    const inv = [
        [(e * i - f * h) / det, (c * h - b1 * i) / det, (b1 * f - c * e) / det],
        [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
        [(d * h - e * g) / det, (b1 * g - a * h) / det, (a * e - b1 * d) / det]
    ];

    return matVec(inv, b);
}

// ОСНОВНОЙ АЛГОРИТМ

function estimateMoonPosition(observers) {
    let A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    let b = [0, 0, 0];
    const I = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    for (const obs of observers) {
        const O = ecefFromLatLon(obs.lat, obs.lon);
        const D = dirFromRaDec(obs.ra, obs.dec);

        const DD = outer(D, D);
        const M = I.map((row, i) =>
            row.map((val, j) => val - DD[i][j])
        );

        A = matAdd(A, M);
        const Mb = matVec(M, O);
        b = b.map((val, i) => val + Mb[i]);
    }

    return solve3x3(A, b);
}

function distance(a, b) {
    return Math.sqrt(
        (a[0] - b[0]) ** 2 +
        (a[1] - b[1]) ** 2 +
        (a[2] - b[2]) ** 2
    );
}

/* ПРИМЕР
observers = [
    {
        lat: 59.47,
        lon: 25.02,
        ra: 8.79,
        dec: 19.88
    },
    {
        lat: 11.48,
        lon: 77.78,
        ra: 8.82,
        dec: 20.73
    },
    {
        lat: 71.4815,
        lon: 110.37,
        ra: 8.77,
        dec: 19.98
    }
]*/

function calculate(observers) {
    console.log(observers)
    const P = estimateMoonPosition(observers);
    const d = observers.reduce((sum, o) =>
        sum + distance(P, ecefFromLatLon(o.lat, o.lon)), 0
    ) / observers.length;

    console.log("Положение Луны (ECEF):", P);
    console.log("Расстояние:", (d / 1000).toFixed(1), "км");
    document.querySelector('#result').innerHTML = ("Расстояние: " + (d / 1000).toFixed(1) + " км")
}
