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

function checkIfInsideTriangle(point, vertex0, vertex1, vertex2) {
//    point[2] = z;
//    var n = crossProduct1D(subtractVectors(vertex1, vertex0), subtractVectors(vertex2, vertex0));
//    var nA = crossProduct1D(subtractVectors(vertex2, vertex1), subtractVectors(point, vertex1));
//    var nB = crossProduct1D(subtractVectors(vertex0, vertex2), subtractVectors(point, vertex2));
//    var nC = crossProduct1D(subtractVectors(vertex1, vertex0), subtractVectors(point, vertex0));
//    var nMod = n[0] * n[0] + n[1] * n[1] + n[2] * n[2];
//    var alpha = Math.abs(getDotProduct(n, nA, "notNormal") / nMod);
//    var beta = Math.abs(getDotProduct(n, nB, "notNormal") / nMod);
//    var gamma = Math.abs(getDotProduct(n, nC, "notNormal") / nMod);

//    debugger;
    var areaOfTriangle = Math.abs(vertex0[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - vertex0[1]));
    var areaWithoutV0 = Math.abs(point[0] * (vertex2[1] - vertex1[1]) + vertex1[0] * (point[1] - vertex2[1]) + vertex2[0] * (vertex1[1] - point[1]));
    var areaWithoutV1 = Math.abs(vertex0[0] * (vertex2[1] - point[1]) + point[0] * (vertex0[1] - vertex2[1]) + vertex2[0] * (point[1] - vertex0[1]));
    var areaWithtouV2 = Math.abs(vertex0[0] * (point[1] - vertex1[1]) + vertex1[0] * (vertex0[1] - point[1]) + point[0] * (vertex1[1] - vertex0[1]));
    var w0 = areaWithoutV0 / areaOfTriangle;
    var w1 = areaWithoutV1 / areaOfTriangle;
    var w2 = areaWithtouV2 / areaOfTriangle;
    if (Math.round(w0 + w1 + w2) === 1) {
//        console.log(w0, w1, w2);
//    if (alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1 && gamma >= 0 && gamma <= 1) {
//    if (Math.round(alpha + beta + gamma) === 1) {
//        debugger;
        return 1;
    }
    else
        return 0;
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
            && getDotProduct(normal, cameraVector, "notNormalized") > 0) {
        return colors;
    }
    else if (getDotProduct(getUnitVector(normal), getUnitVector(light[0]), "notNormalized") > 0
            && getDotProduct(normal, cameraVector, "notNormalized") < 0) {
        //if the signs are negative then the light does not contribute to that color, so, skip it.
        return colors;
    }

    var lDk = getDotProduct(getUnitVector(light[0]), getUnitVector(normal), "notNormalized");
    //get specular color coefficients
    var reflected = getReflectedVector(light[0], normal);
    var lSk = Math.pow(getDotProduct(getUnitVector(reflected), getUnitVector(cameraVector), "notNormalized"), SPEC_POWER);

    var newKs = (shadingType === 1 && coeff !== -1) ? coeff : SPECULAR_COEFF;
    var newKd = (coeff !== -1) ? coeff : DIFFUSE_COEFF;

    colors[0] += light[1][0] * (newKd[0] * lDk + newKs[0] * lSk);
    colors[1] += light[1][1] * (newKd[1] * lDk + newKs[1] * lSk);
    colors[2] += light[1][2] * (newKd[2] * lDk + newKs[2] * lSk);

    return colors;
}

function getColorForNormal(colNormal, coeff, shadingType) {
    var normal = [colNormal[0][0], colNormal[1][0], colNormal[2][0]];
    var colors = [0, 0, 0];
    var cameraVector = [-(DEFAULT_TRANSFORMATION.camera.lookAt[0] - DEFAULT_TRANSFORMATION.camera.position[0]),
        -(DEFAULT_TRANSFORMATION.camera.lookAt[1] - DEFAULT_TRANSFORMATION.camera.position[1]),
        -(DEFAULT_TRANSFORMATION.camera.lookAt[2] - DEFAULT_TRANSFORMATION.camera.position[2])];
//    var cameraVector = [0, 0, -1];

    var newKa = (coeff !== -1) ? coeff : AMBIENT_COEFF;

    //adding ambient color to rgb
    colors[0] += AMBIENT_LIGHT[1][0] * newKa[0];
    colors[1] += AMBIENT_LIGHT[1][1] * newKa[1];
    colors[2] += AMBIENT_LIGHT[1][2] * newKa[2];

    for (var lightIterator = 0; lightIterator < LIGHT.length; lightIterator++) {
        colors = getColorfromLight(LIGHT[lightIterator], normal, cameraVector, colors, coeff, shadingType);
    }

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
                var mappingType = 1;
                if (!isNaN(z) && (CONTEXT_LIST[1][3 + aaIterator][ic][jc][3] === 0 || CONTEXT_LIST[1][3 + aaIterator][ic][jc][3] > z)) {
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
                    //console.log(colors);
                }
            }
        }
    }
}

//function shadowRay(pointInObject, light, triangleVectors, normal, ic, jc) {
//    debugger
//    var tempObjectValues = new Array(10);
//    for (var j = 1; j < tempObjectValues.length; j++) {
//        if (j < 7)
//            tempObjectValues[j] = new Array(3);
//        else
//            tempObjectValues[j] = new Array(2);
//    }
//            var triangleIterator = 0;
//            var temptmin = Z_MAX;

//            var camN = normalize1DMatrix(
//                   subtractVectors(light, pointInObject));

//function rayTraceTriangle(triangleVectors) {
//    var camN = normalize1DMatrix(
//            subtractVectors(DEFAULT_TRANSFORMATION.camera.position,
//                    DEFAULT_TRANSFORMATION.camera.lookAt));
////    var camU = normalize1DMatrix(
////            crossProduct1D(DEFAULT_TRANSFORMATION.camera.worldUp, camN));
//    var camU = normalize1DMatrix(DEFAULT_TRANSFORMATION.camera.worldUp);
//    var camV = crossProduct1D(camN, camU);

// function rayTraceTriangle(triangleVectors, leafNo) {
//     var camN = normalize1DMatrix(
//             subtractVectors(light, pointInObject));
// 

//                        //console.log(imagePlaneS);
//            while (triangleIterator < triangleVectors.length) {
//                var Vector0 = triangleVectors[triangleIterator].slice(0, 3);
//                var Vector1 = triangleVectors[triangleIterator + 1].slice(0, 3);
//                var Vector2 = triangleVectors[triangleIterator + 2].slice(0, 3);
//                var normal0 = triangleVectors[triangleIterator].slice(3, 6);
//                var normal1 = triangleVectors[triangleIterator].slice(3, 6);
//                var normal2 = triangleVectors[triangleIterator].slice(3, 6);
//                var uv0 = triangleVectors[triangleIterator].slice(6, 8);
//                var uv1 = triangleVectors[triangleIterator].slice(6, 8);
//                var uv2 = triangleVectors[triangleIterator].slice(6, 8);

//                triangleIterator += 3;
//                var pointNormal = crossProduct1D(
//                        subtractVectors(Vector1, Vector0),
//                        subtractVectors(Vector2, Vector0));
//                var traingleD = getDotProduct(Vector0, pointNormal);

//                var ndotP = getDotProduct(camN,
//                        pointInObject, "notNormalized");

//                //                console.log(imagePlaneS, imagePlaneS.length);
//                //                debugger;
//                var ndotD = getDotProduct(
//                        camN,
//                        light,
//                        "notN");
//                var t = -(ndotP + traingleD) / ndotD;
//                //                console.log(t);

//                    if (temptmin > t) {
//                        var pointInShadow = addVectors(
//                                pointInObject,
//                                scalarMultiple(
//                                       light,
//                                        t
//                                        )
//                                );
//                    //    if (getDotProduct(pointInShadow,pointNormal) < 0) {
//                        //if (checkIfInsideTriangle(
//                        //        pointInObject,
//                        //        Vector0,
//                        //        Vector1,
//                        //        Vector2
//                        //        ) === 1) {

//                        var ztemp = pointInShadow[2];
//                    //            //(
//                    //        //         -(pointNormal[0] * ic)
//                    //        //         - (pointNormal[1] * jc)
//                    //        //         - traingleD
//                    //        //         ) / pointNormal[2];
//                           temptmin = t;
//                            tempObjectValues = [ztemp,
//                                Vector0, Vector1, Vector2,
//                                normal0, normal1, normal2,
//                                uv0, uv1, uv2
//                            ];
//                    //        //
//                    //    }
//                    //}
//                }
//            }
//            if (temptmin > 0 && temptmin != Z_MAX) {
//               //if (getDotProduct(pointInShadow, pointNormal) < 0) {
//                debugger
//                    tempObjectValues = transformAll(tempObjectValues);
//                    var colors = shadingInterpolation([ic, jc, tempObjectValues[0]],
//                            [tempObjectValues[1][0], tempObjectValues[1][1], normal0, uv0, tempObjectValues[1][2]],
//                            [tempObjectValues[2][0], tempObjectValues[2][1], normal1, uv1, tempObjectValues[2][2]],
//                            [tempObjectValues[3][0], tempObjectValues[3][1], normal2, uv2, tempObjectValues[3][2]],
//                            SHADING_TYPE,
//                            1);
//                    //if (colorShadow != null) {
//                    CONTEXT_LIST[1][3][ic][jc][0] = 255*(AMBIENT_LIGHT[1][0] + AMBIENT_COEFF[0]);//(colors[0]);
//                    CONTEXT_LIST[1][3][ic][jc][1] = 255 * AMBIENT_LIGHT[1][1] + AMBIENT_COEFF[1]; //(colors[1]);
//                    CONTEXT_LIST[1][3][ic][jc][2] = 255 * AMBIENT_LIGHT[1][2] + AMBIENT_COEFF[2];// (colors[2]);
//                    //CONTEXT_LIST[1][3][ic][jc][3] = ztemp;
//                    return [CONTEXT_LIST[1][3][ic][jc][0], CONTEXT_LIST[1][3][ic][jc][1], CONTEXT_LIST[1][3][ic][jc][2], CONTEXT_LIST[1][3][ic][jc][3]];
//                //}
//                //else
//                //    return [-1, -1, -1,-1];

//            }
//            else
//                return [-1, -1, -1,-1];

//}

//function rayTraceTriangle(triangleVectors) {
//    var camN = normalize1DMatrix(
//            subtractVectors(DEFAULT_TRANSFORMATION.camera.position,
//                    DEFAULT_TRANSFORMATION.camera.lookAt));
//    var camU = normalize1DMatrix(
//            crossProduct1D(DEFAULT_TRANSFORMATION.camera.worldUp, camN));
//    var camV = crossProduct1D(camN, camU);

//    var imgPlaneHeight = 256;
//    var imgPlaneWidth = 256;
//    var imgPlaneD = imgPlaneHeight /
//            (2 * Math.tan(DEFAULT_TRANSFORMATION.FOV * DEGREE2RADIANS / 2));
//    var imgPlaneC = subtractVectors(DEFAULT_TRANSFORMATION.camera.position,
//            scalarMultiple(camN, imgPlaneD));
//    var imgPlaneL = subtractVectors(
//            subtractVectors(
//                    imgPlaneC,
//                    scalarMultiple(camU, imgPlaneWidth / 2)),
//            scalarMultiple(camV, imgPlaneHeight / 2));

//    for (var ic = 0; ic < 256; ic++) {
//        for (var jc = 0; jc < 256; jc++) {
//            console.log(ic);
//            var imagePlaneS = addVectors(
//                    addVectors(
//                            imgPlaneL,
//                            scalarMultiple(
//                                    camU,
//                                    ic)),
//                    scalarMultiple(
//                            camV,
//                            jc)
//                    );

//            var colorShadow = [0, 0, 0,0];
//            tminShadowColor = [-1, -1, -1,-1];
//            var triangleIterator = 0;
//            tmin = Z_MAX;
////            console.log(imagePlaneS);
//            while (triangleIterator < triangleVectors.length) {
//                var Vector0 = triangleVectors[triangleIterator].slice(0, 3);
//                var Vector1 = triangleVectors[triangleIterator + 1].slice(0, 3);
//                var Vector2 = triangleVectors[triangleIterator + 2].slice(0, 3);
//                var normal0 = triangleVectors[triangleIterator].slice(3, 6);
//                var normal1 = triangleVectors[triangleIterator].slice(3, 6);
//                var normal2 = triangleVectors[triangleIterator].slice(3, 6);
//                var uv0 = triangleVectors[triangleIterator].slice(6, 8);
//                var uv1 = triangleVectors[triangleIterator].slice(6, 8);
//                var uv2 = triangleVectors[triangleIterator].slice(6, 8);

//                triangleIterator += 3;
//                var pointNormal = crossProduct1D(
//                        subtractVectors(Vector1, Vector0),
//                        subtractVectors(Vector2, Vector0));
//                var traingleD = getDotProduct(Vector0, pointNormal);

//                var ndotP = getDotProduct(
//                    //pointNormal,
//                    camN,
//                        DEFAULT_TRANSFORMATION.camera.position, "notNormalized");

////                console.log(imagePlaneS, imagePlaneS.length);
////                debugger;
//                var ndotD = getDotProduct(
//                    //pointNormal,
//                    camN,
//                        subtractVectors(imagePlaneS,
//                                DEFAULT_TRANSFORMATION.camera.position),
//                        "notN");
//                var t = -(ndotP + traingleD) / ndotD;


////                console.log(t);
//                if (tmin > t) {
//                    var pointInObject = addVectors(
//DEFAULT_TRANSFORMATION.camera.position,
//scalarMultiple(
//      subtractVectors(
//              imagePlaneS,
//              DEFAULT_TRANSFORMATION.camera.position),
//      t
//      )
//);
//                    //transform point from object space to screen space 
//                    //var transformedPoint = transformAllPoint(pointInObject);
//                    //var transformVector0 = transformAllPoint(Vector0);
//                    //var transformVector1 = transformAllPoint(Vector1);
//                    //var transformVector2 = transformAllPoint(Vector2);
//                    debugger;
//                    colorShadow = shadowRay(pointInObject, LIGHT[0][1], triangleVectors, camN, ic, jc);
//                    if (checkIfInsideTriangle(
//                       // transformedPoint,transformVector0,transformVector1,transformVector2
//                            pointInObject,
//                            Vector0,
//                            Vector1,
//                            Vector2
//                            ) === 1) {
//                        z =  (
//                                -(pointNormal[0] * ic)
//                                - (pointNormal[1] * jc)
//                                - traingleD
//                                ) / pointNormal[2];
//                        tmin = t;
//                        ObjectValues = [z,
//                            Vector0, Vector1, Vector2,
//                            normal0, normal1, normal2,
//                            uv0, uv1, uv2
//                        ];
//                        tminShadowColor = colorShadow;
//                        //new tmin an object values

//                        //Shadow ray Function call and calculations

//                    }
//                }
//            }

//            if (tmin > 0 && tmin !== Z_MAX) {
////                    console.log(t, pointInObject);s
////                console.log(pointInObject, "yes inside");
////                CONTEXT_LIST[1][3][ic][jc] = [12, 123, 23, 0];
//                ObjectValues = transformAll(ObjectValues);
//                var colors = shadingInterpolation([ic, jc, ObjectValues[0]],
//                        [ObjectValues[1][0], ObjectValues[1][1], normal0, uv0, ObjectValues[1][2]],
//                        [ObjectValues[2][0], ObjectValues[2][1], normal1, uv1, ObjectValues[2][2]],
//                        [ObjectValues[3][0], ObjectValues[3][1], normal2, uv2, ObjectValues[3][2]],
//                        SHADING_TYPE,
//                        1);
//                //if (tminShadowColor[0] != -1 && tminShadowColor[1] != -1 && tminShadowColor[2] != -1 && tminShadowColor[3] != -1) {
//                //    CONTEXT_LIST[1][3][ic][jc][0] = tminShadowColor[0];
//                //    CONTEXT_LIST[1][3][ic][jc][1] = tminShadowColor[1];
//                //    CONTEXT_LIST[1][3][ic][jc][2] = tminShadowColor[2];
//                //    CONTEXT_LIST[1][3][ic][jc][3] = tminShadowColor[3];
//                //}
//                //else {
//                    CONTEXT_LIST[1][3][ic][jc][0] = Math.abs(colors[0]);
//                    CONTEXT_LIST[1][3][ic][jc][1] = Math.abs(colors[1]);
//                    CONTEXT_LIST[1][3][ic][jc][2] = Math.abs(colors[2]);
//                    CONTEXT_LIST[1][3][ic][jc][3] = z;
//                //}
//                console.log(CONTEXT_LIST[1][3][ic][jc][0]);
//            }
//        }
//    }
//    console.log(camN, camU, camV, imgPlaneD, imgPlaneHeight, imgPlaneWidth, imgPlaneC, imgPlaneL, pointNormal);
//}
function getRay(xp, yp, camN, camPos, camU, camV, rayEtoO) {
    var position = subtractVectors(camN, subtractVectors(scalarMultiple(camV, xp), scalarMultiple(camU, yp)));
    position[1] = -position[1];
    rayEtoO[0] = position;
    rayEtoO[1] = subtractVectors(position, camPos);
}

function rayTraceTriangle(triangleVectors, camN, camPos, camU, camV, rayEtoO, rayPtoL) {
    //var camV = crossProduct1D(camN, camU);

    var imgPlaneHeight = 256;
    var imgPlaneWidth = 256;
    var minPoint;
    for (var ic = 0; ic < imgPlaneHeight; ic++) {
        for (var jc = 0; jc < imgPlaneWidth; jc++) {
//            console.log(ic);
            //screen to world ic = height js = width
            var xp = jc * 1 / imgPlaneWidth * 2 - 1;
            var yp = ic * 1 / imgPlaneHeight * 2 - 1;
            //get ray's position and direction;
            getRay(xp, yp, camN, camPos, camU, camV, rayEtoO);

            var triangleIterator = 0;
//            var tmin = Z_MAX;
            var tmin = Z_MAX;
            //            console.log(imagePlaneS);


            while (triangleIterator < triangleVectors.length) {
                var Vector0 = triangleVectors[triangleIterator].slice(0, 3);
                var Vector1 = triangleVectors[triangleIterator + 1].slice(0, 3);
                var Vector2 = triangleVectors[triangleIterator + 2].slice(0, 3);
                var normal0 = triangleVectors[triangleIterator].slice(3, 6);
                var normal1 = triangleVectors[triangleIterator + 1].slice(3, 6);
                var normal2 = triangleVectors[triangleIterator + 2].slice(3, 6);
                var uv0 = triangleVectors[triangleIterator].slice(6, 8);
                var uv1 = triangleVectors[triangleIterator + 1].slice(6, 8);
                var uv2 = triangleVectors[triangleIterator + 2].slice(6, 8);
                if (checkIfClockwise(Vector0, Vector1, Vector2) === true) {
                    var temp = Vector1;
                    Vector1 = Vector2;
                    Vector2 = temp;
                }

                triangleIterator += 3;
                var triangleNormal = normalize1DMatrix(crossProduct1D(subtractVectors(Vector1, Vector0), subtractVectors(Vector2, Vector0)));
                var traingleD = getDotProduct(Vector0, triangleNormal);
                var pointNormal = triangleNormal;
                var ndotP = getDotProduct(
                        pointNormal,
                        //camN,
                        rayEtoO[0], "notNormalized");

                var ndotD = getDotProduct(
                        pointNormal,
                        //camN,
                        rayEtoO[1],
                        "notN");
                if (ndotD !== 0) {
                    var t = -(ndotP + traingleD) / ndotD;
                    if (tmin > t) {
                        //any point that intersect with triangle plane
                        var pointInObject = addVectors(
                                rayEtoO[0],
                                scalarMultiple(
                                        rayEtoO[1], t
                                        )
                                );
                        //see if point lies in shadow?
//                        colorShadow = shadowRay(pointNormal, rayPtoL, ic, jc, triangleVectors, camN);
                        // debugger;
                        if (checkIfInsideTriangle(
                                // transformedPoint,transformVector0,transformVector1,transformVector2
                                pointInObject,
                                Vector0,
                                Vector1,
                                Vector2
                                ) === 1) {
                            minPoint = pointInObject;
                            z = (
                                    -(pointNormal[0] * ic)
                                    - (pointNormal[1] * jc)
                                    - traingleD
                                    ) / pointNormal[2];
                            tmin = t;
                            ObjectValues = [z,
                                Vector0, Vector1, Vector2,
                                normal0, normal1, normal2,
                                uv0, uv1, uv2
                            ];
                        }
                    }
                }
            }
            if (tmin > 0 && tmin !== Z_MAX) {
                if (checkIfInsideTriangle(minPoint, ObjectValues[1], ObjectValues[2], ObjectValues[3]) === 1) {

                    ObjectValues = transformAll(ObjectValues);
                    var colors = shadingInterpolation([ic, jc, ObjectValues[0]],
                            [ObjectValues[1][0], ObjectValues[1][1], normal0, uv0, ObjectValues[1][2]],
                            [ObjectValues[2][0], ObjectValues[2][1], normal1, uv1, ObjectValues[2][2]],
                            [ObjectValues[3][0], ObjectValues[3][1], normal2, uv2, ObjectValues[3][2]],
                            SHADING_TYPE,
                            1);

                    CONTEXT_LIST[1][3][ic][jc][0] += Math.abs(colors[0]);
                    CONTEXT_LIST[1][3][ic][jc][1] += Math.abs(colors[1]);
                    CONTEXT_LIST[1][3][ic][jc][2] += Math.abs(colors[2]);
                    CONTEXT_LIST[1][3][ic][jc][3] = z;
                }
            }
        }
    }
}

function shadowRay(pointNormal, rayPtoL, ic, jc, triangleVectors, camN)
{

    var sObjectValues = new Array(10);
    for (var j = 1; j < sObjectValues.length; j++) {
        if (j < 7)
            sObjectValues[j] = new Array(3);
        else
            sObjectValues[j] = new Array(2);

    }
    ;
    var minPoint;
    var imgPlaneD = 256 /
            (2 * Math.tan(DEFAULT_TRANSFORMATION.FOV * DEGREE2RADIANS / 2));

//    pointNormal = [ic, jc, imgPlaneD];
    //for (var i = 0; i < LIGHT.length; i++) {
    var v = normalize1DMatrix(subtractVectors(LIGHT[0][2], pointNormal));
    //debugger
    rayPtoL[0] = LIGHT[0][0];//pointNormal;
    rayPtoL[1] = v;
    var triangleIterator = 0;
    var stmin = Z_MAX;

    while (triangleIterator < triangleVectors.length) {
        var Vector0 = triangleVectors[triangleIterator].slice(0, 3);
        var Vector1 = triangleVectors[triangleIterator + 1].slice(0, 3);
        var Vector2 = triangleVectors[triangleIterator + 2].slice(0, 3);
        var normal0 = triangleVectors[triangleIterator].slice(3, 6);
        var normal1 = triangleVectors[triangleIterator+1].slice(3, 6);
        var normal2 = triangleVectors[triangleIterator+2].slice(3, 6);
        var uv0 = triangleVectors[triangleIterator].slice(6, 8);
        var uv1 = triangleVectors[triangleIterator+1].slice(6, 8);
        var uv2 = triangleVectors[triangleIterator+2].slice(6, 8);

        triangleIterator += 3;
        var pointNormal1 = crossProduct1D(
                subtractVectors(Vector1, Vector0),
                subtractVectors(Vector2, Vector0));
        var traingleD = getDotProduct(Vector0, pointNormal1);

        var ndotP = getDotProduct(
                pointNormal1,
                //camN,
                rayPtoL[0], "notNormalized");

        var ndotD = getDotProduct(
                pointNormal1,
                //camN,
                rayPtoL[1],
                "notN");
        if (ndotD !== 0) {
            var t = -(ndotP + traingleD) / ndotD;
            //                console.log(t);
            if (stmin > t) {
                var pointInObject1 = addVectors(
                        rayPtoL[0],
                        scalarMultiple(
                                rayPtoL[1], t
                                ));
                if (checkIfInsideTriangle(
                        // transformedPoint,transformVector0,transformVector1,transformVector2
                        pointInObject1,
                        Vector0,
                        Vector1,
                        Vector2
                        ) === 1) {
                    minPoint = pointInObject1;

                    stmin = t;
                    sObjectValues = [40,
                        Vector0, Vector1, Vector2,
                        normal0, normal1, normal2,
                        uv0, uv1, uv2
                    ];
                }
//                }
            }
        }
    }
    if (stmin > 0 && stmin !== Z_MAX) {
        if (checkIfInsideTriangle(minPoint, sObjectValues[1], sObjectValues[2], sObjectValues[3]) === 1) {

            CONTEXT_LIST[1][3][ic][jc][0] += 255 * (AMBIENT_LIGHT[1][0] + AMBIENT_COEFF[0]);//(colors[0]);
            CONTEXT_LIST[1][3][ic][jc][1] += 255 * (AMBIENT_LIGHT[1][1] + AMBIENT_COEFF[1]); //(colors[1]);
            CONTEXT_LIST[1][3][ic][jc][2] += 255 * (AMBIENT_LIGHT[1][2] + AMBIENT_COEFF[2]);// (colors[2]);
        }
    }
    //}
}

//Saurabh
function getTransformedVects(vertex) {
    var TransformedVector = [[0], [0], [0], [0]];
//    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, spTransfrom(DEFAULT_TRANSFORMATION.sp, DEFAULT_TRANSFORMATION.FOV));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, piTransfrom(DEFAULT_TRANSFORMATION.FOV));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, iwTransfrom(DEFAULT_TRANSFORMATION.camera.position,
            DEFAULT_TRANSFORMATION.camera.lookAt,
            DEFAULT_TRANSFORMATION.camera.worldUp));

    var newTranslation = [0.5, 0.5, 0.5];
    SCENE_RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, translateVector(newTranslation));
    TransformedVector = multiplyMatrices(SCENE_RESULTANT_MATRIX, vertex);
    normalizeVectsByW(TransformedVector, 1);
    // RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, scaleVector(DEFAULT_TRANSFORMATION.scaling));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, rotateVector(DEFAULT_TRANSFORMATION.rotation));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, NEW_TRANSFROM);

    // NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, iwNTransfrom(DEFAULT_TRANSFORMATION.camera.position,
//             DEFAULT_TRANSFORMATION.camera.lookAt,
//             DEFAULT_TRANSFORMATION.camera.worldUp));
//     NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, rotateVector(DEFAULT_TRANSFORMATION.rotation));
//     NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, NEW_N_TRANSFROM);
//     NORMALS_RESULTANT = normalizeMatrix(NORMALS_RESULTANT);

    return TransformedVector;
}

function getDeTransformedVects(TransformedVector) {
    var vertex = [[0], [0], [0], [0]];
    debugger
    var invRESULTANT_MATRIX = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    invRESULTANT_MATRIX = invert4DMat(RESULTANT_MATRIX);

    vertex = multiplyMatrices(invRESULTANT_MATRIX, TransformedVector);
    normalizeVectsByW(vertex, 2);

//    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, spTransfrom(DEFAULT_TRANSFORMATION.sp, DEFAULT_TRANSFORMATION.FOV));

//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, piTransfrom(DEFAULT_TRANSFORMATION.FOV));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, iwTransfrom(DEFAULT_TRANSFORMATION.camera.position,
//             DEFAULT_TRANSFORMATION.camera.lookAt,
//             DEFAULT_TRANSFORMATION.camera.worldUp));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, translateVector(DEFAULT_TRANSFORMATION.translation));

//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, scaleVector(DEFAULT_TRANSFORMATION.scaling));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, rotateVector(DEFAULT_TRANSFORMATION.rotation));
//     RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, NEW_TRANSFROM);

//     NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, iwNTransfrom(DEFAULT_TRANSFORMATION.camera.position,
//             DEFAULT_TRANSFORMATION.camera.lookAt,
//             DEFAULT_TRANSFORMATION.camera.worldUp));
//     NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, rotateVector(DEFAULT_TRANSFORMATION.rotation));
//     NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, NEW_N_TRANSFROM);
//     NORMALS_RESULTANT = normalizeMatrix(NORMALS_RESULTANT);
    return vertex;
}

function normalizeVectsByW(vertex, Selection) {
//Transformation
    if (Selection === 1) {
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 4; j++) {
                vertex[j][i] = vertex[j][i] / vertex[3][i];
            }
        }
    }
//De-Transformation
    if (Selection === 2) {
        for (var i = 0; i < 1; i++) {
            for (var j = 0; j < 4; j++) {
                vertex[j][i] = vertex[j][i] / vertex[3][i];
            }
        }
    }
}

function invert4DMat(mat) {

    var invMat = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    var det = (1 / determinant(mat));

    invMat[0][0] = (mat[1][2] * mat[2][3] * mat[3][1] - mat[1][3] * mat[2][2] * mat[3][1] + mat[1][3] * mat[2][1] * mat[3][2] - mat[1][1] * mat[2][3] * mat[3][2] - mat[1][2] * mat[2][1] * mat[3][3] + mat[1][1] * mat[2][2] * mat[3][3]) * det;
    invMat[0][1] = (mat[0][3] * mat[2][2] * mat[3][1] - mat[0][2] * mat[2][3] * mat[3][1] - mat[0][3] * mat[2][1] * mat[3][2] + mat[0][1] * mat[2][3] * mat[3][2] + mat[0][2] * mat[2][1] * mat[3][3] - mat[0][1] * mat[2][2] * mat[3][3]) * det;
    invMat[0][2] = (mat[0][2] * mat[1][3] * mat[3][1] - mat[0][3] * mat[1][2] * mat[3][1] + mat[0][3] * mat[1][1] * mat[3][2] - mat[0][1] * mat[1][3] * mat[3][2] - mat[0][2] * mat[1][1] * mat[3][3] + mat[0][1] * mat[1][2] * mat[3][3]) * det;
    invMat[0][3] = (mat[0][3] * mat[1][2] * mat[2][1] - mat[0][2] * mat[1][3] * mat[2][1] - mat[0][3] * mat[1][1] * mat[2][2] + mat[0][1] * mat[1][3] * mat[2][2] + mat[0][2] * mat[1][1] * mat[2][3] - mat[0][1] * mat[1][2] * mat[2][3]) * det;
    invMat[1][0] = (mat[1][3] * mat[2][2] * mat[3][0] - mat[1][2] * mat[2][3] * mat[3][0] - mat[1][3] * mat[2][0] * mat[3][2] + mat[1][0] * mat[2][3] * mat[3][2] + mat[1][2] * mat[2][0] * mat[3][3] - mat[1][0] * mat[2][2] * mat[3][3]) * det;
    invMat[1][1] = (mat[0][2] * mat[2][3] * mat[3][0] - mat[0][3] * mat[2][2] * mat[3][0] + mat[0][3] * mat[2][0] * mat[3][2] - mat[0][0] * mat[2][3] * mat[3][2] - mat[0][2] * mat[2][0] * mat[3][3] + mat[0][0] * mat[2][2] * mat[3][3]) * det;
    invMat[1][2] = (mat[0][3] * mat[1][2] * mat[3][0] - mat[0][2] * mat[1][3] * mat[3][0] - mat[0][3] * mat[1][0] * mat[3][2] + mat[0][0] * mat[1][3] * mat[3][2] + mat[0][2] * mat[1][0] * mat[3][3] - mat[0][0] * mat[1][2] * mat[3][3]) * det;
    invMat[1][3] = (mat[0][2] * mat[1][3] * mat[2][0] - mat[0][3] * mat[1][2] * mat[2][0] + mat[0][3] * mat[1][0] * mat[2][2] - mat[0][0] * mat[1][3] * mat[2][2] - mat[0][2] * mat[1][0] * mat[2][3] + mat[0][0] * mat[1][2] * mat[2][3]) * det;
    invMat[2][0] = (mat[1][1] * mat[2][3] * mat[3][0] - mat[1][3] * mat[2][1] * mat[3][0] + mat[1][3] * mat[2][0] * mat[3][1] - mat[1][0] * mat[2][3] * mat[3][1] - mat[1][1] * mat[2][0] * mat[3][3] + mat[1][0] * mat[2][1] * mat[3][3]) * det;
    invMat[2][1] = (mat[0][3] * mat[2][1] * mat[3][0] - mat[0][1] * mat[2][3] * mat[3][0] - mat[0][3] * mat[2][0] * mat[3][1] + mat[0][0] * mat[2][3] * mat[3][1] + mat[0][1] * mat[2][0] * mat[3][3] - mat[0][0] * mat[2][1] * mat[3][3]) * det;
    invMat[2][2] = (mat[0][1] * mat[1][3] * mat[3][0] - mat[0][3] * mat[1][1] * mat[3][0] + mat[0][3] * mat[1][0] * mat[3][1] - mat[0][0] * mat[1][3] * mat[3][1] - mat[0][1] * mat[1][0] * mat[3][3] + mat[0][0] * mat[1][1] * mat[3][3]) * det;
    invMat[2][3] = (mat[0][3] * mat[1][1] * mat[2][0] - mat[0][1] * mat[1][3] * mat[2][0] - mat[0][3] * mat[1][0] * mat[2][1] + mat[0][0] * mat[1][3] * mat[2][1] + mat[0][1] * mat[1][0] * mat[2][3] - mat[0][0] * mat[1][1] * mat[2][3]) * det;
    invMat[3][0] = (mat[1][2] * mat[2][1] * mat[3][0] - mat[1][1] * mat[2][2] * mat[3][0] - mat[1][2] * mat[2][0] * mat[3][1] + mat[1][0] * mat[2][2] * mat[3][1] + mat[1][1] * mat[2][0] * mat[3][2] - mat[1][0] * mat[2][1] * mat[3][2]) * det;
    invMat[3][1] = (mat[0][1] * mat[2][2] * mat[3][0] - mat[0][2] * mat[2][1] * mat[3][0] + mat[0][2] * mat[2][0] * mat[3][1] - mat[0][0] * mat[2][2] * mat[3][1] - mat[0][1] * mat[2][0] * mat[3][2] + mat[0][0] * mat[2][1] * mat[3][2]) * det;
    invMat[3][2] = (mat[0][2] * mat[1][1] * mat[3][0] - mat[0][1] * mat[1][2] * mat[3][0] - mat[0][2] * mat[1][0] * mat[3][1] + mat[0][0] * mat[1][2] * mat[3][1] + mat[0][1] * mat[1][0] * mat[3][2] - mat[0][0] * mat[1][1] * mat[3][2]) * det;
    invMat[3][3] = (mat[0][1] * mat[1][2] * mat[2][0] - mat[0][2] * mat[1][1] * mat[2][0] + mat[0][2] * mat[1][0] * mat[2][1] - mat[0][0] * mat[1][2] * mat[2][1] - mat[0][1] * mat[1][0] * mat[2][2] + mat[0][0] * mat[1][1] * mat[2][2]) * det;

    return invMat;
}

function determinant(mat) {
    var value;
    value =
            mat[0][3] * mat[1][2] * mat[2][1] * mat[3][0] - mat[0][2] * mat[1][3] * mat[2][1] * mat[3][0] - mat[0][3] * mat[1][1] * mat[2][2] * mat[3][0] + mat[0][1] * mat[1][3] * mat[2][2] * mat[3][0] +
            mat[0][2] * mat[1][1] * mat[2][3] * mat[3][0] - mat[0][1] * mat[1][2] * mat[2][3] * mat[3][0] - mat[0][3] * mat[1][2] * mat[2][0] * mat[3][1] + mat[0][2] * mat[1][3] * mat[2][0] * mat[3][1] +
            mat[0][3] * mat[1][0] * mat[2][2] * mat[3][1] - mat[0][0] * mat[1][3] * mat[2][2] * mat[3][1] - mat[0][2] * mat[1][0] * mat[2][3] * mat[3][1] + mat[0][0] * mat[1][2] * mat[2][3] * mat[3][1] +
            mat[0][3] * mat[1][1] * mat[2][0] * mat[3][2] - mat[0][1] * mat[1][3] * mat[2][0] * mat[3][2] - mat[0][3] * mat[1][0] * mat[2][1] * mat[3][2] + mat[0][0] * mat[1][3] * mat[2][1] * mat[3][2] +
            mat[0][1] * mat[1][0] * mat[2][3] * mat[3][2] - mat[0][0] * mat[1][1] * mat[2][3] * mat[3][2] - mat[0][2] * mat[1][1] * mat[2][0] * mat[3][3] + mat[0][1] * mat[1][2] * mat[2][0] * mat[3][3] +
            mat[0][2] * mat[1][0] * mat[2][1] * mat[3][3] - mat[0][0] * mat[1][2] * mat[2][1] * mat[3][3] - mat[0][1] * mat[1][0] * mat[2][2] * mat[3][3] + mat[0][0] * mat[1][1] * mat[2][2] * mat[3][3];

    return value;
}
