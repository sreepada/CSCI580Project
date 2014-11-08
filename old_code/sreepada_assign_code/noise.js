/* 
 * This is an implementation of Perlin's noise as shown on 
 * http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
 */

function Interpolate(a, b, x) {
    return  a * (1 - x) + b * x;
}
function Noise(x, y) {
    var n = x + y * 57;
    var n = (n << 13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
}
function SmoothedNoise1(x, y) {
    var corners = (Noise(x - 1, y - 1) + Noise(x + 1, y - 1) + Noise(x - 1, y + 1) + Noise(x + 1, y + 1)) / 16;
    var sides = (Noise(x - 1, y) + Noise(x + 1, y) + Noise(x, y - 1) + Noise(x, y + 1)) / 8;
    var center = Noise(x, y) / 4;
    return corners + sides + center;
}
function InterpolatedNoise_1(x, y) {

    var integer_X = Math.floor(x);
    var fractional_X = x - integer_X;

    var integer_Y = Math.floor(y);
    var fractional_Y = y - integer_Y;

    var v1 = SmoothedNoise1(integer_X, integer_Y);
    var v2 = SmoothedNoise1(integer_X + 1, integer_Y);
    var v3 = SmoothedNoise1(integer_X, integer_Y + 1);
    var v4 = SmoothedNoise1(integer_X + 1, integer_Y + 1);

    var i1 = Interpolate(v1, v2, fractional_X);
    var i2 = Interpolate(v3, v4, fractional_X);

    return Interpolate(i1, i2, fractional_Y);
}
function PerlinNoise_2D(x, y) {
    var total = 0;
    var p = 2;
    var n = 6 - 1;
    for (var i = 0; i < n; i++) {
        var frequency = Math.pow(2, i);
        var amplitude = Math.pow(p, i);
        total = total + InterpolatedNoise_1(x * frequency, y * frequency) * amplitude;
    }
    return total;
}