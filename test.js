const today = new Date(1990, 3, 19, 0, 0)
const reference = new Date(2000, 0, 1, 0, 0)
var d = (today - reference) / 86400000
d = -3543

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

let N = 48.3313 + 3.24587E-5 * d //Long of asc. node
let i = 7.0047 + 5.00E-8 * d //Inclination
let w = 29.1241 + 1.01444E-5 * d //Argument of perihelion
let a = 0.387098 //Semi-major axis
let e = 0.205635 + 5.59E-10 * d //Eccentricity
let M = (168.6562 + 4.0923344368 * d) % 360 + 360 //Mean anonaly
let E0 = M + (180 / Math.PI) * e * Math.sin(toRadians(M)) * (1 + e * Math.cos(toRadians(M))) //eccentric anomaly
let E1 = E0 - (E0 - (180 / Math.PI) * e * Math.sin(toRadians(E0)) - M) / (1 - e * Math.cos(toRadians(E0))) //eccentric anomaly
let v = toDegrees(2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(toRadians(E1) / 2))); //true anomaly
let r = (a * (1 - e ** 2)) / (1 + e * Math.cos(toRadians(v))); //heliocentric distance




/*

Mercury:
    N =  48.3313_deg + 3.24587E-5_deg   * d    (Long of asc. node)
    i =   7.0047_deg + 5.00E-8_deg      * d    (Inclination)
    w =  29.1241_deg + 1.01444E-5_deg   * d    (Argument of perihelion)
    a = 0.387098                               (Semi-major axis)
    e = 0.205635     + 5.59E-10         * d    (Eccentricity)
    M = 168.6562_deg + 4.0923344368_deg * d    (Mean anonaly)
Venus:
    N =  76.6799_deg + 2.46590E-5_deg   * d
    i =   3.3946_deg + 2.75E-8_deg      * d
    w =  54.8910_deg + 1.38374E-5_deg   * d
    a = 0.723330
    e = 0.006773     - 1.302E-9         * d
    M =  48.0052_deg + 1.6021302244_deg * d
Mars:
    N =  49.5574_deg + 2.11081E-5_deg   * d
    i =   1.8497_deg - 1.78E-8_deg      * d
    w = 286.5016_deg + 2.92961E-5_deg   * d
    a = 1.523688
    e = 0.093405     + 2.516E-9         * d
    M =  18.6021_deg + 0.5240207766_deg * d
Jupiter:
    N = 100.4542_deg + 2.76854E-5_deg   * d
    i =   1.3030_deg - 1.557E-7_deg     * d
    w = 273.8777_deg + 1.64505E-5_deg   * d
    a = 5.20256
    e = 0.048498     + 4.469E-9         * d
    M =  19.8950_deg + 0.0830853001_deg * d
Saturn:
    N = 113.6634_deg + 2.38980E-5_deg   * d
    i =   2.4886_deg - 1.081E-7_deg     * d
    w = 339.3939_deg + 2.97661E-5_deg   * d
    a = 9.55475
    e = 0.055546     - 9.499E-9         * d
    M = 316.9670_deg + 0.0334442282_deg * d
Uranus:
    N =  74.0005_deg + 1.3978E-5_deg    * d
    i =   0.7733_deg + 1.9E-8_deg       * d
    w =  96.6612_deg + 3.0565E-5_deg    * d
    a = 19.18171     - 1.55E-8          * d
    e = 0.047318     + 7.45E-9          * d
    M = 142.5905_deg + 0.011725806_deg  * d
Neptune:
    N = 131.7806_deg + 3.0173E-5_deg    * d
    i =   1.7700_deg - 2.55E-7_deg      * d
    w = 272.8461_deg - 6.027E-6_deg     * d
    a = 30.05826     + 3.313E-8         * d
    e = 0.008606     + 2.15E-9          * d
    M = 260.2471_deg + 0.005995147_deg  * d
    
    */