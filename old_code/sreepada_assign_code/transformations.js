/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function spTransfrom(spValues, FOV) {
    var Xsp = [[spValues[0] / 2, 0, 0, spValues[0] / 2],
        [0, spValues[1] / -2, 0, spValues[1] / 2],
        [0, 0, Z_MAX * Math.tan(FOV * DEGREE2RADIANS / 2), 0],
        [0, 0, 0, 1]];
    return Xsp;
}

function piTransfrom(FOV) {
    var Xpi = [[1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, Math.tan(FOV * DEGREE2RADIANS / 2), 1]];
    return Xpi;
}

function iwTransfrom(cameraPostion, cameraLookat, cameraWorldUp) {
    var clMod = Math.pow((cameraLookat[0] - cameraPostion[0]), 2)
            + Math.pow((cameraLookat[1] - cameraPostion[1]), 2)
            + Math.pow((cameraLookat[2] - cameraPostion[2]), 2);
    clMod = Math.sqrt(clMod);

    var X = new Array(3), Y = new Array(3), Z = new Array(3);

    Z[0] = (cameraLookat[0] - cameraPostion[0]) / clMod;
    Z[1] = (cameraLookat[1] - cameraPostion[1]) / clMod;
    Z[2] = (cameraLookat[2] - cameraPostion[2]) / clMod;

    var upZdot = (cameraWorldUp[0] * Z[0]) + (cameraWorldUp[1] * Z[1]) + (cameraWorldUp[2] * Z[2]);
    cameraWorldUp[0] = cameraWorldUp[0] - (upZdot * Z[0]);
    cameraWorldUp[1] = cameraWorldUp[1] - (upZdot * Z[1]);
    cameraWorldUp[2] = cameraWorldUp[2] - (upZdot * Z[2]);

    var upMod = Math.sqrt(Math.pow(cameraWorldUp[0], 2) + Math.pow(cameraWorldUp[1], 2) + Math.pow(cameraWorldUp[2], 2));
    Y[0] = cameraWorldUp[0] / upMod;
    Y[1] = cameraWorldUp[1] / upMod;
    Y[2] = cameraWorldUp[2] / upMod;

    X[0] = Y[1] * Z[2] - Y[2] * Z[1];
    X[1] = Y[2] * Z[0] - Y[0] * Z[2];
    X[2] = Y[0] * Z[1] - Y[1] * Z[0];

    var XCdot = X[0] * cameraPostion[0] + X[1] * cameraPostion[1] + X[2] * cameraPostion[2];
    var YCdot = Y[0] * cameraPostion[0] + Y[1] * cameraPostion[1] + Y[2] * cameraPostion[2];
    var ZCdot = Z[0] * cameraPostion[0] + Z[1] * cameraPostion[1] + Z[2] * cameraPostion[2];

    var Xiw = [[X[0], X[1], X[2], -XCdot],
        [Y[0], Y[1], Y[2], -YCdot],
        [Z[0], Z[1], Z[2], -ZCdot],
        [0, 0, 0, 1]];

    return Xiw;
}

function iwNTransfrom(cameraPostion, cameraLookat, cameraWorldUp) {
    var clMod = Math.pow((cameraLookat[0] - cameraPostion[0]), 2)
            + Math.pow((cameraLookat[1] - cameraPostion[1]), 2)
            + Math.pow((cameraLookat[2] - cameraPostion[2]), 2);
    clMod = Math.sqrt(clMod);

    var X = new Array(3), Y = new Array(3), Z = new Array(3);

    Z[0] = (cameraLookat[0] - cameraPostion[0]) / clMod;
    Z[1] = (cameraLookat[1] - cameraPostion[1]) / clMod;
    Z[2] = (cameraLookat[2] - cameraPostion[2]) / clMod;

    var upZdot = (cameraWorldUp[0] * Z[0]) + (cameraWorldUp[1] * Z[1]) + (cameraWorldUp[2] * Z[2]);
    cameraWorldUp[0] = cameraWorldUp[0] - (upZdot * Z[0]);
    cameraWorldUp[1] = cameraWorldUp[1] - (upZdot * Z[1]);
    cameraWorldUp[2] = cameraWorldUp[2] - (upZdot * Z[2]);

    var upMod = Math.sqrt(Math.pow(cameraWorldUp[0], 2) + Math.pow(cameraWorldUp[1], 2) + Math.pow(cameraWorldUp[2], 2));
    Y[0] = cameraWorldUp[0] / upMod;
    Y[1] = cameraWorldUp[1] / upMod;
    Y[2] = cameraWorldUp[2] / upMod;

    X[0] = Y[1] * Z[2] - Y[2] * Z[1];
    X[1] = Y[2] * Z[0] - Y[0] * Z[2];
    X[2] = Y[0] * Z[1] - Y[1] * Z[0];

//    var XCdot = X[0] * cameraPostion[0] + X[1] * cameraPostion[1] + X[2] * cameraPostion[2];
//    var YCdot = Y[0] * cameraPostion[0] + Y[1] * cameraPostion[1] + Y[2] * cameraPostion[2];
//    var ZCdot = Z[0] * cameraPostion[0] + Z[1] * cameraPostion[1] + Z[2] * cameraPostion[2];

    var Xiw = [[X[0], X[1], X[2], 0],
        [Y[0], Y[1], Y[2], 0],
        [Z[0], Z[1], Z[2], 0],
        [0, 0, 0, 1]];

    return Xiw;
}

function scaleVector(scaleValues) {
    var scaleMatrix = [[scaleValues[0], 0, 0, 0],
        [0, scaleValues[1], 0, 0],
        [0, 0, scaleValues[2], 0],
        [0, 0, 0, 1]];
    return scaleMatrix;
}

function rotateVector(rotateValues) {
    var rotateMatrixX = [[1, 0, 0, 0],
        [0, Math.cos(rotateValues[0] * DEGREE2RADIANS), -Math.sin(rotateValues[0] * DEGREE2RADIANS), 0],
        [0, Math.sin(rotateValues[0] * DEGREE2RADIANS), Math.cos(rotateValues[0] * DEGREE2RADIANS), 0],
        [0, 0, 0, 1]];
    var rotateMatrixY = [[Math.cos(rotateValues[1] * DEGREE2RADIANS), 0, Math.sin(rotateValues[1] * DEGREE2RADIANS), 0],
        [0, 1, 0, 0],
        [-Math.sin(rotateValues[1] * DEGREE2RADIANS), 0, Math.cos(rotateValues[1] * DEGREE2RADIANS), 0],
        [0, 0, 0, 1]];
    var rotateMatrixZ = [[Math.cos(rotateValues[2] * DEGREE2RADIANS), -Math.sin(rotateValues[2] * DEGREE2RADIANS), 0, 0],
        [Math.sin(rotateValues[2] * DEGREE2RADIANS), Math.cos(rotateValues[2] * DEGREE2RADIANS), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]];
    return multiplyMatrices(multiplyMatrices(rotateMatrixZ, rotateMatrixY), rotateMatrixX);
}

function translateVector(translateValues) {
    var translateMatrix = [[1, 0, 0, translateValues[0]],
        [0, 1, 0, translateValues[1]],
        [0, 0, 1, translateValues[2]],
        [0, 0, 0, 1]];
    return translateMatrix;
}