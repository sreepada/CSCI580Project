/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getDotProduct(vector1, vector2, choice) {
    var dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
    if (choice === "normalized") {
        return Math.abs(dotProduct) > 1 ? 1.0 : Math.abs(dotProduct);
    }
    return dotProduct;
}

function getUnitVector(vector) {
    var magVector = Math.sqrt(
            Math.pow(vector[0], 2) +
            Math.pow(vector[1], 2) +
            Math.pow(vector[2], 2));
    return [vector[0] / magVector, vector[1] / magVector, vector[2] / magVector];
}

function getReflectedVector(light, normal) {
    var dotProduct = getDotProduct(normal, light, "notNormalized");
    return [(2 * dotProduct * normal[0]) - light[0],
        (2 * dotProduct * normal[1]) - light[1],
        (2 * dotProduct * normal[2]) - light[2]];
}

function getColorfromLight(light, normal, cameraVector, colors, coeff, shadingType) {
    if (getDotProduct(getUnitVector(normal), getUnitVector(light[0]), "notNormalized") < 0 && getDotProduct(getUnitVector(normal), getUnitVector(cameraVector), "notNormalized") < 0)
        for (var i = 0; i < 3; i++)
            normal[i] *= -1;
    else if (getDotProduct(getUnitVector(normal), getUnitVector(light[0]), "notNormalized") < 0
            && getDotProduct(normal, cameraVector, "notNormalized") > 0)
        return colors;
    else if (getDotProduct(getUnitVector(normal), getUnitVector(light[0]), "notNormalized") > 0
            && getDotProduct(normal, cameraVector, "notNormalized") < 0)
        //if the signs are negative then the light does not contribute to that color, so, skip it.
        return colors;

    var lDk = getDotProduct(getUnitVector(light[0]), getUnitVector(normal), "notNormalized");
    //get specular color coefficients
    var reflected = getReflectedVector(light[0], normal);
    var lSk = Math.pow(getDotProduct(getUnitVector(reflected), getUnitVector(cameraVector), "notNormalized"), SPEC_POWER);

    var newKs = (shadingType === 1 && coeff !== -1) ? coeff : SPECULAR_COEFF;
    var newKd = (coeff !== -1) ? coeff : DIFFUSE_COEFF;

//    newKs = [0, 0, 0];
    colors[0] += light[1][0] * (newKd[0] * lDk + newKs[0] * lSk);
    colors[1] += light[1][1] * (newKd[1] * lDk + newKs[1] * lSk);
    colors[2] += light[1][2] * (newKd[2] * lDk + newKs[2] * lSk);
    return colors;
}

function getColorForNormal(colNormal, coeff, shadingType) {
    var normal = [colNormal[0][0], colNormal[1][0], colNormal[2][0]];
    var colors = [0, 0, 0];
//              var cameraVector = [-(DEFAULT_TRANSFORMATION.camera.lookAt[0] - DEFAULT_TRANSFORMATION.camera.position[0]),
//                    -(DEFAULT_TRANSFORMATION.camera.lookAt[1] - DEFAULT_TRANSFORMATION.camera.position[1]),
//                    -(DEFAULT_TRANSFORMATION.camera.lookAt[2] - DEFAULT_TRANSFORMATION.camera.position[2])];
    var cameraVector = [0, 0, -1];

    var newKa = (coeff !== -1) ? coeff : AMBIENT_COEFF;

    //adding ambient color to rgb
    colors[0] += AMBIENT_LIGHT[1][0] * newKa[0];
    colors[1] += AMBIENT_LIGHT[1][1] * newKa[1];
    colors[2] += AMBIENT_LIGHT[1][2] * newKa[2];

    colors = getColorfromLight(LIGHT_1, normal, cameraVector, colors, coeff, shadingType);
    colors = getColorfromLight(LIGHT_2, normal, cameraVector, colors, coeff, shadingType);
    colors = getColorfromLight(LIGHT_3, normal, cameraVector, colors, coeff, shadingType);

    return [Math.abs(colors[0] * 255), Math.abs(colors[1] * 255), Math.abs(colors[2] * 255)];
}

function getSortedOnX(verteces) {
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3 - i; j++) {
            if (j + 1 < 3 && verteces[j][0] > verteces[j + 1][0]) {
                var tmp = verteces[j + 1];
                verteces[j + 1] = verteces[j];
                verteces[j] = tmp;
            }
        }
    }
    return verteces;
}

function warp(value, point) {
    var sz = point / (Z_MAX - point);
    for (var i = 0; i < 2; i++) {
        if (value[i] < 0)
            value[i] = value[i] * -1;
        else if (value[i] > 1)
            value[i] = 1;
        value[i] = value[i] / (sz + 1);
    }
    return value;
}

function unwarp(value, point) {
    var sz = point / (Z_MAX - point);
    return (value * (sz + 1));
}

function getScalarColor(value) {
    var array = [[255, 0, 0],
        [55, 255, 55],
        [255, 255, 0],
        [0, 112, 192],
        [122, 66, 164],
        [153, 255, 153],
        [255, 192, 0],
        [24, 122, 192],
        [166, 166, 166],
        [255, 0, 255],
        [0, 51, 102]
    ];

    if (value > 0) {
        var upperIndex = Math.ceil(value * 5);
        var lowerIndex = upperIndex - 1;
    }
    else {
        var lowerIndex = 0;
        var upperIndex = 1;
    }

    var lowerWeight = (value - (lowerIndex * 0.2)) / 0.2;
    var upperWeight = ((upperIndex * 0.2) - value) / 0.2;
    return [(lowerWeight * (array[upperIndex][0] / 255)) + (upperWeight * (array[lowerIndex][0] / 255)),
        (lowerWeight * (array[upperIndex][1] / 255)) + (upperWeight * (array[lowerIndex][1] / 255)),
        (lowerWeight * (array[upperIndex][2] / 255)) + (upperWeight * (array[lowerIndex][2] / 255))];
}

function getColorFromProcTex(u, v) {
    var Xr = (v - 0.5) * 2;
    var Xi = (u - 0.5) * 2;
//    var Xr = u;
//    var Xi = v;
    Xr = PerlinNoise_2D(Xr, Xi);
    Xi = Xr;
    var Cr = -0.012375;
    var Ci = 0.56805;
    var iteration = 0;
    var maxIteration = 5;
    var lenX;
    while (iteration < maxIteration) {
        var real = (Xr * Xr) - (Xi * Xi) + Cr;
//        var imag = (2 * Xr * Xi) + Ci;
        var imag = (1 * Xr * Xi) + Ci;
        Xr = real;
        Xi = imag;
        lenX = (Xr * Xr) + (Xi * Xi);
        if (lenX > 4) {
            lenX = 4;
            break;
        }
        iteration++;
    }
    lenX = lenX > 4 ? 2 : Math.sqrt(lenX);
    return getScalarColor(lenX);
}

function getTextureColorCoeff(point, mappingType, vertex0, vertex1, vertex2, isItProcedural) {
    vertex0[1] = warp([vertex0[1][0], vertex0[1][1]], vertex0[2]);
    vertex1[1] = warp([vertex1[1][0], vertex1[1][1]], vertex1[2]);
    vertex2[1] = warp([vertex2[1][0], vertex2[1][1]], vertex2[2]);
    var smallU = vertex0[0] * vertex0[1][0] + vertex1[0] * vertex1[1][0] + vertex2[0] * vertex2[1][0];
    var smallV = vertex0[0] * vertex0[1][1] + vertex1[0] * vertex1[1][1] + vertex2[0] * vertex2[1][1];
    var pX = unwarp(smallV, point[2]) * (parseInt(TEXTURE_FILE_DATA[1]) - 1);
    var pY = unwarp(smallU, point[2]) * (parseInt(TEXTURE_FILE_DATA[2]) - 1);
    pX = pX < 0 ? pX * -1 : pX;
    pY = pY < 0 ? pY * -1 : pY;
    
    var floorBigU = Math.min(parseInt(TEXTURE_FILE_DATA[1]) - 1, Math.floor(pY));
    var floorBigV = Math.min(parseInt(TEXTURE_FILE_DATA[2]) - 1, Math.floor(pX));
    var ceilBigU = Math.min(parseInt(TEXTURE_FILE_DATA[1]) - 1, Math.ceil(pY));
    var ceilBigV = Math.min(parseInt(TEXTURE_FILE_DATA[2]) - 1, Math.ceil(pX));
    var t = pY - floorBigU;
    var s = pX - floorBigV;
    var coeff = new Array(3);

    if (isItProcedural === 3) {
        coeff = getColorFromProcTex(pY / (CONTEXT_LIST[4][0].width - 1), pX / (CONTEXT_LIST[4][0].height - 1));
    }
    else {
        coeff[0] = (s * t * TEXTURE_FILE_DATA[4][ceilBigV][ceilBigU].r) +
                ((1 - s) * t * TEXTURE_FILE_DATA[4][floorBigV][ceilBigU].r) +
                (s * (1 - t) * TEXTURE_FILE_DATA[4][ceilBigV][floorBigU].r) +
                ((1 - s) * (1 - t) * TEXTURE_FILE_DATA[4][floorBigV][floorBigU].r);
        coeff[1] = (s * t * TEXTURE_FILE_DATA[4][ceilBigV][ceilBigU].g) +
                ((1 - s) * t * TEXTURE_FILE_DATA[4][floorBigV][ceilBigU].g) +
                (s * (1 - t) * TEXTURE_FILE_DATA[4][ceilBigV][floorBigU].g) +
                ((1 - s) * (1 - t) * TEXTURE_FILE_DATA[4][floorBigV][floorBigU].g);
        coeff[2] = (s * t * TEXTURE_FILE_DATA[4][ceilBigV][ceilBigU].b) +
                ((1 - s) * t * TEXTURE_FILE_DATA[4][floorBigV][ceilBigU].b) +
                (s * (1 - t) * TEXTURE_FILE_DATA[4][ceilBigV][floorBigU].b) +
                ((1 - s) * (1 - t) * TEXTURE_FILE_DATA[4][floorBigV][floorBigU].b);
    }
    return coeff;
}

function shadingInterpolation(point, vertex0, vertex1, vertex2, shadingType, mappingType) {
    if (shadingType === 0) {
        //FLAT shading
        return getColorForNormal(vertex0[2], -1, shadingType);
    }
    else if (shadingType === 1) {
        //GOURAUD shading
        var areaOfTriangle = vertex0[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - vertex0[1]);
        if (areaOfTriangle === 0)
            return getColorForNormal(vertex0[2], -1, shadingType);
        var areaWithoutV0 = point[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (point[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - point[1]);
        var areaWithoutV1 = vertex0[0] * (vertex2[1] - point[1]) + point[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (point[1] - vertex0[1]);
        var areaWithtouV2 = vertex0[0] * (point[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - point[1]) + point[0] * (vertex1[1] - vertex0[1]);
        var w0 = areaWithoutV0 / areaOfTriangle;
        var w1 = areaWithoutV1 / areaOfTriangle;
        var w2 = areaWithtouV2 / areaOfTriangle;

        var colorsCoeff = (TEXTURE_FILE_DATA === "" && mappingType !== 3) ? -1 : getTextureColorCoeff(point,
                mappingType,
                [w0, vertex0[3], vertex0[4]],
                [w1, vertex1[3], vertex1[4]],
                [w2, vertex2[3], vertex2[4]],
                mappingType);
        var colorsOfV0 = getColorForNormal(vertex0[2], colorsCoeff,
                shadingType);
        var colorsOfV1 = getColorForNormal(vertex1[2], colorsCoeff,
                shadingType);
        var colorsOfV2 = getColorForNormal(vertex2[2], colorsCoeff,
                shadingType);
        var colorsForCurrPoint = new Array(3);
        for (i = 0; i < 3; i++) {
            colorsForCurrPoint[i] = w0 * colorsOfV0[i] + w1 * colorsOfV1[i] + w2 * colorsOfV2[i];
        }
        return colorsForCurrPoint;
    }
    else if (shadingType === 2) {
        var areaOfTriangle = vertex0[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - vertex0[1]);
        if (areaOfTriangle === 0)
            return getColorForNormal(vertex0[2], -1, shadingType);
        var areaWithoutV0 = point[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (point[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - point[1]);
        var areaWithoutV1 = vertex0[0] * (vertex2[1] - point[1]) + point[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (point[1] - vertex0[1]);
        var areaWithtouV2 = vertex0[0] * (point[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - point[1]) + point[0] * (vertex1[1] - vertex0[1]);
        var w0 = areaWithoutV0 / areaOfTriangle;
        var w1 = areaWithoutV1 / areaOfTriangle;
        var w2 = areaWithtouV2 / areaOfTriangle;

        var normalForCurrPoint = new Array(4);
        for (i = 0; i < 3; i++) {
            normalForCurrPoint[i] = new Array(1);
            normalForCurrPoint[i][0] = w0 * vertex0[2][i] + w1 * vertex1[2][i] + w2 * vertex2[2][i];
        }
        normalForCurrPoint[3] = new Array(1);
        normalForCurrPoint[3][0] = 1;
        var colorsCoeff = (TEXTURE_FILE_DATA === "" && mappingType !== 3) ? -1 : getTextureColorCoeff(point,
                mappingType,
                [w0, vertex0[3], vertex0[4]],
                [w1, vertex1[3], vertex1[4]],
                [w2, vertex2[3], vertex2[4]],
                mappingType);

        return getColorForNormal(normalForCurrPoint, colorsCoeff,
                shadingType);
    }
}

function checkIfClockwise(Vector0, Vector1, Vector2) {
    var sum = (Vector1[0][0] - Vector0[0][0]) * (Vector1[1][0] + Vector0[1][0]);
    sum += (Vector2[0][0] - Vector1[0][0]) * (Vector2[1][0] + Vector1[1][0]);
    sum += (Vector0[0][0] - Vector2[0][0]) * (Vector0[1][0] + Vector2[1][0]);
    if (sum > 0)
        return true;
    return false;
}

function colorMeATriangle(aaIterator, Vector0, Vector1, Vector2, normal0, normal1, normal2, uvList0, uvList1, uvList2) {
    var x0 = Math.round(Vector0[0][0]);
    var y0 = Math.round(Vector0[1][0]);
    var z0 = Math.round(Vector0[2][0]);
    var x1 = Math.round(Vector1[0][0]);
    var y1 = Math.round(Vector1[1][0]);
    var z1 = Math.round(Vector1[2][0]);
    var x2 = Math.round(Vector2[0][0]);
    var y2 = Math.round(Vector2[1][0]);
    var z2 = Math.round(Vector2[2][0]);

    //Calculate A,B and C values for the line equation Ax + By + Cz + D= 0
    var A0 = y1 - y0;
    var B0 = -(x1 - x0);
    var C0 = (x1 - x0) * y0 - (y1 - y0) * x0;

    var A1 = y2 - y1;
    var B1 = -(x2 - x1);
    var C1 = (x2 - x1) * y1 - (y2 - y1) * x1;

    var A2 = y0 - y2;
    var B2 = -(x0 - x2);
    var C2 = (x0 - x2) * y2 - (y0 - y2) * x2;

    var lowestX = Math.min(x0, Math.min(x1, x2));
    var lowestY = Math.min(y0, Math.min(y1, y2));
    var highestX = Math.max(x0, Math.max(x1, x2));
    var highestY = Math.max(y0, Math.max(y1, y2));

    var lowestX = Math.max(0, lowestX);
    var lowestY = Math.max(0, lowestY);
    var highestX = Math.min(256, highestX);
    var highestY = Math.min(256, highestY);

    var vectorA = [[x1 - x0],
        [y1 - y0],
        [z1 - z0]];
    var vectorB = [[x2 - x0],
        [y2 - y0],
        [z2 - z0]];
    var vectorC = [[vectorA[1] * vectorB[2] - vectorA[2] * vectorB[1]],
        [vectorA[2] * vectorB[0] - vectorA[0] * vectorB[2]],
        [vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0]]];

    var cMax;
    if (vectorC[0] > vectorC[1] && vectorC[0] > vectorC[2]) {
        cMax = vectorC[0];
    }
    if (vectorC[1] > vectorC[0] && vectorC[1] > vectorC[2]) {
        cMax = vectorC[0];
    }
    if (vectorC[2] > vectorC[1] && vectorC[2] > vectorC[0]) {
        cMax = vectorC[0];
    }
    vectorC = [vectorC[0] / cMax, vectorC[1] / cMax, vectorC[2] / cMax];

    var D = -(vectorC[0] * x0) - (vectorC[1] * y0) - (vectorC[2] * z0);

    var itIsClockwise = checkIfClockwise(Vector0, Vector1, Vector2);

    for (var jc = lowestY; jc <= highestY; jc++) {
        for (var ic = lowestX; ic <= highestX; ic++) {
            var value0 = A0 * ic + B0 * jc + C0;
            var value1 = A1 * ic + B1 * jc + C1;
            var value2 = A2 * ic + B2 * jc + C2;
            var z;
            var render = false;
            if (!itIsClockwise) {
                if (value0 <= 0 && value1 <= 0 && value2 <= 0) {
                    render = true;
                }
            }
            else if (itIsClockwise) {
                if (value0 >= 0 && value1 >= 0 && value2 >= 0) {
                    render = true;
                }
            }
            if (Boolean(render)) {
                z = (-(vectorC[0] * ic) - (vectorC[1] * jc) - D) / vectorC[2];
                if (aaIterator === 6) {
                    if (!isNaN(z) && (CONTEXT_LIST[1][3][ic][jc][3] === 0 || CONTEXT_LIST[1][3][ic][jc][3] > z)) {
                        var mappingType = 1;
                        var colors = shadingInterpolation([ic, jc, z],
                                [x0, y0, normal0, uvList0, z0],
                                [x1, y1, normal1, uvList1, z1],
                                [x2, y2, normal2, uvList2, z2],
                                SHADING_TYPE,
                                2);
                        CONTEXT_LIST[mappingType][3][ic][jc][0] = colors[0];
                        CONTEXT_LIST[mappingType][3][ic][jc][1] = colors[1];
                        CONTEXT_LIST[mappingType][3][ic][jc][2] = colors[2];
                        CONTEXT_LIST[mappingType][3][ic][jc][3] = z;
                        mappingType = 3;
                        colors = shadingInterpolation([ic, jc, z],
                                [x0, y0, normal0, uvList0, z0],
                                [x1, y1, normal1, uvList1, z1],
                                [x2, y2, normal2, uvList2, z2],
                                SHADING_TYPE,
                                mappingType);
                        CONTEXT_LIST[mappingType][3][ic][jc][0] = colors[0];
                        CONTEXT_LIST[mappingType][3][ic][jc][1] = colors[1];
                        CONTEXT_LIST[mappingType][3][ic][jc][2] = colors[2];
                        CONTEXT_LIST[mappingType][3][ic][jc][3] = z;
                    }
                }
                else {
                    var mappingType = 2;
                    if (!isNaN(z) && (CONTEXT_LIST[2][3 + aaIterator][ic][jc][3] === 0 || CONTEXT_LIST[2][3 + aaIterator][ic][jc][3] > z)) {
                        var colors = shadingInterpolation([ic, jc, z],
                                [x0, y0, normal0, uvList0, z0],
                                [x1, y1, normal1, uvList1, z1],
                                [x2, y2, normal2, uvList2, z2],
                                SHADING_TYPE,
                                mappingType);
                        CONTEXT_LIST[mappingType][3 + aaIterator][ic][jc][0] = colors[0];
                        CONTEXT_LIST[mappingType][3 + aaIterator][ic][jc][1] = colors[1];
                        CONTEXT_LIST[mappingType][3 + aaIterator][ic][jc][2] = colors[2];
                        CONTEXT_LIST[mappingType][3 + aaIterator][ic][jc][3] = z;
                    }
                }
            }
        }
    }
}