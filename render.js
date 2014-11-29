/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function setup() {
    var contextIterator = 1;
    for (var aaIterator = 0; aaIterator < AAKERNEL_SIZE; aaIterator++) {
        CONTEXT_LIST[contextIterator][3 + aaIterator] = new Array(DEFAULT_TRANSFORMATION.sp[0]);
        for (var arrayPointer = 0; arrayPointer <= DEFAULT_TRANSFORMATION.sp[0]; arrayPointer++) {
            CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer] = new Array(DEFAULT_TRANSFORMATION.sp[1]);
            for (var arrayPointer2 = 0; arrayPointer2 <= DEFAULT_TRANSFORMATION.sp[1]; arrayPointer2++) {
//                        CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer][arrayPointer2] = [128, 112, 96, 0];
                CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer][arrayPointer2] = [255, 255, 255, 0];
            }
        }
    }
}

function writeToCanvas() {
    var contextIterator = 1;
    for (var arrayPointer = 0; arrayPointer < DEFAULT_TRANSFORMATION.sp[0]; arrayPointer++) {
        for (var arrayPointer2 = 0; arrayPointer2 < DEFAULT_TRANSFORMATION.sp[1]; arrayPointer2++) {
            var d = CONTEXT_LIST[contextIterator][2].data;
            var r = 0;
            var g = 0;
            var b = 0;
            for (var aaIterator = 0;
                    aaIterator < AAKERNEL_SIZE; aaIterator++) {
                r = r + (CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer][arrayPointer2][0] * AA_FILTER[aaIterator][2]);
                g = g + (CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer][arrayPointer2][1] * AA_FILTER[aaIterator][2]);
                b = b + (CONTEXT_LIST[contextIterator][3 + aaIterator][arrayPointer][arrayPointer2][2] * AA_FILTER[aaIterator][2]);
            }
            d[0] = r;
            d[1] = g;
            d[2] = b;
            d[3] = 255;
            CONTEXT_LIST[contextIterator][1].putImageData(CONTEXT_LIST[contextIterator][2], arrayPointer, arrayPointer2);
        }
    }
}

function plotProcTex() {
    CONTEXT_LIST[4][1].clearRect(0, 0, CONTEXT_LIST[4][0].height, CONTEXT_LIST[4][0].width);
    for (var i = 0; i < CONTEXT_LIST[4][0].height; i++) {
        for (var j = 0; j < CONTEXT_LIST[4][0].width; j++) {
            var d = CONTEXT_LIST[4][2].data;
            var colors = getColorFromProcTex(i / (CONTEXT_LIST[4][0].height - 1), j / (CONTEXT_LIST[4][0].width - 1));
            d[0] = colors[0] * 255;
            d[1] = colors[1] * 255;
            d[2] = colors[2] * 255;
            d[3] = 255;
            CONTEXT_LIST[4][1].putImageData(CONTEXT_LIST[4][2], j, i);
        }
    }
}

function readAndPlotTexture(splitArray) {
    TEXTURE_FILE_DATA = splitArray.slice(0, 4);
    TEXTURE_FILE_DATA.push(splitArray.slice(4).join("\n"));
    var maxRGB = parseInt(TEXTURE_FILE_DATA[3]);
    var pixelDetails = new Array(TEXTURE_FILE_DATA[1]);
    CONTEXT_LIST[0][0].width = TEXTURE_FILE_DATA[1];
    CONTEXT_LIST[0][0].height = TEXTURE_FILE_DATA[2];
    var k = 0;
    for (var i = 0; i < TEXTURE_FILE_DATA[2]; i++) {
        pixelDetails[i] = new Array(TEXTURE_FILE_DATA[2]);
        for (var j = 0; j < TEXTURE_FILE_DATA[1]; j++) {
            var d = CONTEXT_LIST[0][2].data;
            var r = TEXTURE_FILE_DATA[4].charCodeAt(k++);
            var g = TEXTURE_FILE_DATA[4].charCodeAt(k++);
            var b = TEXTURE_FILE_DATA[4].charCodeAt(k++);
            d[0] = r;
            d[1] = g;
            d[2] = b;
            d[3] = 255;
            CONTEXT_LIST[0][1].putImageData(CONTEXT_LIST[0][2], j, i);
            pixelDetails[i][j] = {"r": r / maxRGB,
                "g": g / maxRGB,
                "b": b / maxRGB};
        }
    }
    TEXTURE_FILE_DATA[4] = pixelDetails;
    console.log(TEXTURE_FILE_DATA);
}

function updateTransformationValues() {
    var newTranslation = [0, 0, 0];
    var newScaling = [1, 1, 1];
    var newRotation = [0, 0, 0];
    if (document.getElementById("Tx").value !== "") {
        newTranslation[0] = parseFloat(document.getElementById("Tx").value);
    }
    if (document.getElementById("Ty").value !== "") {
        newTranslation[1] = parseFloat(document.getElementById("Ty").value);
    }
    if (document.getElementById("Tz").value !== "") {
        newTranslation[2] = parseFloat(document.getElementById("Tz").value);
    }
    if (document.getElementById("Sx").value !== "" && document.getElementById("Sx").value !== "0") {
        newScaling[0] = parseFloat(document.getElementById("Sx").value);
    }
    if (document.getElementById("Sy").value !== "" && document.getElementById("Sy").value !== "0") {
        newScaling[1] = parseFloat(document.getElementById("Sy").value);
    }
    if (document.getElementById("Sz").value !== "" && document.getElementById("Sz").value !== "0") {
        newScaling[2] = parseFloat(document.getElementById("Sz").value);
    }
    if (document.getElementById("Rx").value !== "") {
        newRotation[0] = parseFloat(document.getElementById("Rx").value);
    }
    if (document.getElementById("Ry").value !== "") {
        newRotation[1] = parseFloat(document.getElementById("Ry").value);
    }
    if (document.getElementById("Rz").value !== "") {
        newRotation[2] = parseFloat(document.getElementById("Rz").value);
    }

    NEW_TRANSFROM = multiplyMatrices(NEW_TRANSFROM, translateVector(newTranslation));
    NEW_TRANSFROM = multiplyMatrices(NEW_TRANSFROM, scaleVector(newScaling));
    NEW_TRANSFROM = multiplyMatrices(NEW_TRANSFROM, rotateVector(newRotation));
    NEW_N_TRANSFROM = multiplyMatrices(NEW_N_TRANSFROM, rotateVector(newRotation));
}

function cleanUp() {
    if (READ_FILE_LINES === "") {
        alert("Please upload a object file first!!");
        return;
    }
    document.getElementById('renderAll').style.background = 'red';
    RESULTANT_MATRIX = [[1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]];
//    updateTransformationValues();
    CONTEXT_LIST[1][1].clearRect(0, 0, DEFAULT_TRANSFORMATION.sp[0], DEFAULT_TRANSFORMATION.sp[1]);
    setup();
    renderStep();
    document.getElementById('renderAll').style.background = 'green';
    document.getElementById('renderAll').style.color = 'yellow';
}

function updateResultantMatrix() {
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, spTransfrom(DEFAULT_TRANSFORMATION.sp, DEFAULT_TRANSFORMATION.FOV));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, piTransfrom(DEFAULT_TRANSFORMATION.FOV));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, iwTransfrom(DEFAULT_TRANSFORMATION.camera.position,
            DEFAULT_TRANSFORMATION.camera.lookAt,
            DEFAULT_TRANSFORMATION.camera.worldUp));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, translateVector(DEFAULT_TRANSFORMATION.translation));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, scaleVector(DEFAULT_TRANSFORMATION.scaling));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, rotateVector(DEFAULT_TRANSFORMATION.rotation));
    RESULTANT_MATRIX = multiplyMatrices(RESULTANT_MATRIX, NEW_TRANSFROM);
    NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, iwNTransfrom(DEFAULT_TRANSFORMATION.camera.position,
            DEFAULT_TRANSFORMATION.camera.lookAt,
            DEFAULT_TRANSFORMATION.camera.worldUp));
    NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, rotateVector(DEFAULT_TRANSFORMATION.rotation));
    NORMALS_RESULTANT = multiplyMatrices(NORMALS_RESULTANT, NEW_N_TRANSFROM);
    NORMALS_RESULTANT = normalizeMatrix(NORMALS_RESULTANT);
}

function transformAll(ObjectValues) {
    var Vertex0 = [
        [ObjectValues[1][0]],
        [ObjectValues[1][1]],
        [ObjectValues[1][2]],
        [1]
    ];
    var Vertex1 = [
        [ObjectValues[2][0]],
        [ObjectValues[2][1]],
        [ObjectValues[2][2]],
        [1]
    ];
    var Vertex2 = [
        [ObjectValues[3][0]],
        [ObjectValues[3][1]],
        [ObjectValues[3][2]],
        [1]
    ];
    var normal0 = [
        [ObjectValues[4][0]],
        [ObjectValues[4][1]],
        [ObjectValues[4][2]],
        [1]
    ];
    var normal1 = [
        [ObjectValues[5][0]],
        [ObjectValues[5][1]],
        [ObjectValues[5][2]],
        [1]
    ];
    var normal2 = [
        [ObjectValues[6][0]],
        [ObjectValues[6][1]],
        [ObjectValues[6][2]],
        [1]
    ];

    Vertex0 = multiplyMatrices(RESULTANT_MATRIX, Vertex0);
    Vertex1 = multiplyMatrices(RESULTANT_MATRIX, Vertex1);
    Vertex2 = multiplyMatrices(RESULTANT_MATRIX, Vertex2);
    normal0 = multiplyMatrices(NORMALS_RESULTANT, normal0);
    normal1 = multiplyMatrices(NORMALS_RESULTANT, normal1);
    normal2 = multiplyMatrices(NORMALS_RESULTANT, normal2);
    Vertex0 = normalizeW(Vertex0);
    Vertex1 = normalizeW(Vertex1);
    Vertex2 = normalizeW(Vertex2);
    normal0 = normalizeW(normal0);
    normal1 = normalizeW(normal1);
    normal2 = normalizeW(normal2);

    ObjectValues[1] = [Vertex0[0][0],
        Vertex0[1][0],
        Vertex0[2][0]];
    ObjectValues[2] = [Vertex1[0][0],
        Vertex1[1][0],
        Vertex2[2][0]];
    ObjectValues[3] = [Vertex2[0][0],
        Vertex2[1][0],
        Vertex2[2][0]];
    ObjectValues[4] = normal0;
    ObjectValues[5] = normal1;
    ObjectValues[6] = normal2;
    return ObjectValues;
}

function renderStep() {
    DEFAULT_TRANSFORMATION = TREE_CAMERA_TRANSFORMATION;
    updateResultantMatrix();
    var PLANE_FILE_LINES = [];
    var lineCount = 0;
    //add plane to tree files
    //lineCount = TREE_FILE_LINES.length;
    PLANE_FILE_LINES[lineCount] = "0.000000 0.000000 0.000000" + " "
                            + "0.00000 1.000000 0.000000 "
                            + "1.000000 1.000000";
    lineCount += 1;
    PLANE_FILE_LINES[lineCount] = "0.000000 0.000000 20.000000 "
                            + "0.00000 1.000000 0.000000 "
                            + "1.000000 0.000000";
    lineCount += 1;
    PLANE_FILE_LINES[lineCount] = "20.000000 0.000000 20.000000 "
                            + "0.00000 1.000000 0.000000 "
                            + "0.000000 0.000000";
    lineCount += 1;
    PLANE_FILE_LINES[lineCount] = "0.000000 0.000000 0.000000 "
                            + "0.00000, 1.000000, 0.000000 "
                            + "1.000000 1.000000";
    lineCount += 1;
    PLANE_FILE_LINES[lineCount] = "20.000000 0.000000 0.000000 "
                            + "0.00000 1.000000 0.000000 "
                            + "0.000000 1.000000";
    lineCount += 1;
    PLANE_FILE_LINES[lineCount] = "20.000000 0.000000 20.000000 "
                            + "0.00000 1.000000 0.000000 "
                            + "0.000000 0.000000";
    //plane
    lineCount = 0;
    while (lineCount < PLANE_FILE_LINES.length && PLANE_FILE_LINES !== "") {
        //lee scan part starts
        var firstLineSplit = PLANE_FILE_LINES[lineCount].split(/[\s]+/);
        var secondLineSplit = PLANE_FILE_LINES[lineCount + 1].split(/[\s]+/);
        var thirdLineSplit = PLANE_FILE_LINES[lineCount + 2].split(/[\s]+/);
        var Vertex0 = [[parseFloat(firstLineSplit[0])], [parseFloat(firstLineSplit[1])], [parseFloat(firstLineSplit[2])], [1]];
        var Vertex1 = [[parseFloat(secondLineSplit[0])], [parseFloat(secondLineSplit[1])], [parseFloat(secondLineSplit[2])], [1]];
        var Vertex2 = [[parseFloat(thirdLineSplit[0])], [parseFloat(thirdLineSplit[1])], [parseFloat(thirdLineSplit[2])], [1]];
        var normal0 = [[parseFloat(firstLineSplit[3])], [parseFloat(firstLineSplit[4])], [parseFloat(firstLineSplit[5])], [1]];
        var normal1 = [[parseFloat(secondLineSplit[3])], [parseFloat(secondLineSplit[4])], [parseFloat(secondLineSplit[5])], [1]];
        var normal2 = [[parseFloat(thirdLineSplit[3])], [parseFloat(thirdLineSplit[4])], [parseFloat(thirdLineSplit[5])], [1]];
        var uvList0 = [parseFloat(firstLineSplit[6]), parseFloat(firstLineSplit[7])];
        var uvList1 = [parseFloat(secondLineSplit[6]), parseFloat(secondLineSplit[7])];
        var uvList2 = [parseFloat(thirdLineSplit[6]), parseFloat(thirdLineSplit[7])];

        Vertex0 = multiplyMatrices(RESULTANT_MATRIX, Vertex0);
        Vertex1 = multiplyMatrices(RESULTANT_MATRIX, Vertex1);
        Vertex2 = multiplyMatrices(RESULTANT_MATRIX, Vertex2);
        normal0 = multiplyMatrices(NORMALS_RESULTANT, normal0);
        normal1 = multiplyMatrices(NORMALS_RESULTANT, normal1);
        normal2 = multiplyMatrices(NORMALS_RESULTANT, normal2);

        Vertex0 = normalizeW(Vertex0);
        Vertex1 = normalizeW(Vertex1);
        Vertex2 = normalizeW(Vertex2);
        normal0 = normalizeW(normal0);
        normal1 = normalizeW(normal1);
        normal2 = normalizeW(normal2);

        //Aliasing part
        for (var aaIterator = 0; aaIterator < AAKERNEL_SIZE; aaIterator++) {
            var loopVertex0 = Vertex0;
            var loopVertex1 = Vertex1;
            var loopVertex2 = Vertex2;
            Vertex0[0][0] = Vertex0[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
            Vertex0[1][0] = Vertex0[1][0] + parseFloat(AA_FILTER[aaIterator][1]);
            Vertex1[0][0] = Vertex1[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
            Vertex1[1][0] = Vertex1[1][0] + parseFloat(AA_FILTER[aaIterator][1]);
            Vertex2[0][0] = Vertex2[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
            Vertex2[1][0] = Vertex2[1][0] + parseFloat(AA_FILTER[aaIterator][1]);


            colorMeATriangle(aaIterator, Vertex0, Vertex1, Vertex2, normal0, normal1, normal2, uvList0, uvList1, uvList2, 1);
            Vertex0 = loopVertex0;
            Vertex1 = loopVertex1;
            Vertex2 = loopVertex2;
        }
        lineCount = lineCount + 3;
        //lee scan part ends
    }
    //TREE_FILE_LINES
    //lineCount = 0;
    //while (lineCount < TREE_FILE_LINES.length && TREE_FILE_LINES !== "") {
    //    //lee scan part starts
    //    var firstLineSplit = TREE_FILE_LINES[lineCount].split(/[\s]+/);
    //    var secondLineSplit = TREE_FILE_LINES[lineCount + 1].split(/[\s]+/);
    //    var thirdLineSplit = TREE_FILE_LINES[lineCount + 2].split(/[\s]+/);
    //    debugger
    //    var Vertex0 = [[parseFloat(firstLineSplit[0])], [parseFloat(firstLineSplit[1])], [parseFloat(firstLineSplit[2])], [1]];
    //    var Vertex1 = [[parseFloat(secondLineSplit[0])], [parseFloat(secondLineSplit[1])], [parseFloat(secondLineSplit[2])], [1]];
    //    var Vertex2 = [[parseFloat(thirdLineSplit[0])], [parseFloat(thirdLineSplit[1])], [parseFloat(thirdLineSplit[2])], [1]];
    //    var normal0 = [[parseFloat(firstLineSplit[3])], [parseFloat(firstLineSplit[4])], [parseFloat(firstLineSplit[5])], [1]];
    //    var normal1 = [[parseFloat(secondLineSplit[3])], [parseFloat(secondLineSplit[4])], [parseFloat(secondLineSplit[5])], [1]];
    //    var normal2 = [[parseFloat(thirdLineSplit[3])], [parseFloat(thirdLineSplit[4])], [parseFloat(thirdLineSplit[5])], [1]];
    //    var uvList0 = [parseFloat(firstLineSplit[6]), parseFloat(firstLineSplit[7])];
    //    var uvList1 = [parseFloat(secondLineSplit[6]), parseFloat(secondLineSplit[7])];
    //    var uvList2 = [parseFloat(thirdLineSplit[6]), parseFloat(thirdLineSplit[7])];

    //    Vertex0 = multiplyMatrices(RESULTANT_MATRIX, Vertex0);
    //    Vertex1 = multiplyMatrices(RESULTANT_MATRIX, Vertex1);
    //    Vertex2 = multiplyMatrices(RESULTANT_MATRIX, Vertex2);
    //    normal0 = multiplyMatrices(NORMALS_RESULTANT, normal0);
    //    normal1 = multiplyMatrices(NORMALS_RESULTANT, normal1);
    //    normal2 = multiplyMatrices(NORMALS_RESULTANT, normal2);

    //    Vertex0 = normalizeW(Vertex0);
    //    Vertex1 = normalizeW(Vertex1);
    //    Vertex2 = normalizeW(Vertex2);
    //    normal0 = normalizeW(normal0);
    //    normal1 = normalizeW(normal1);
    //    normal2 = normalizeW(normal2);

    //    //Aliasing part
    //    for (var aaIterator = 0; aaIterator < AAKERNEL_SIZE; aaIterator++) {
    //        var loopVertex0 = Vertex0;
    //        var loopVertex1 = Vertex1;
    //        var loopVertex2 = Vertex2;
    //        Vertex0[0][0] = Vertex0[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
    //        Vertex0[1][0] = Vertex0[1][0] + parseFloat(AA_FILTER[aaIterator][1]);
    //        Vertex1[0][0] = Vertex1[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
    //        Vertex1[1][0] = Vertex1[1][0] + parseFloat(AA_FILTER[aaIterator][1]);
    //        Vertex2[0][0] = Vertex2[0][0] + parseFloat(AA_FILTER[aaIterator][0]);
    //        Vertex2[1][0] = Vertex2[1][0] + parseFloat(AA_FILTER[aaIterator][1]);

    //        colorMeATriangle(aaIterator, Vertex0, Vertex1, Vertex2, normal0, normal1, normal2, uvList0, uvList1, uvList2);
    //        Vertex0 = loopVertex0;
    //        Vertex1 = loopVertex1;
    //        Vertex2 = loopVertex2;
    //    }
    //    lineCount = lineCount + 3;
    //    //lee scan part ends
    //}

    writeToCanvas();

    DEFAULT_TRANSFORMATION = DEFAULT_CAMERA_TRANSFORMATION;
    var lineCount = 0;
    var triangleVector = new Array(3);
    while (lineCount < READ_FILE_LINES.length) {
        var firstLineSplit = READ_FILE_LINES[lineCount].split(/[\s]+/);
        triangleVector[lineCount] = [
            parseFloat(firstLineSplit[0]),
            parseFloat(firstLineSplit[1]),
            parseFloat(firstLineSplit[2]),
            parseFloat(firstLineSplit[3]),
            parseFloat(firstLineSplit[4]),
            parseFloat(firstLineSplit[5]),
            parseFloat(firstLineSplit[6]),
            parseFloat(firstLineSplit[7])
        ];
        
        var translateFirst = 0;
        if(translateFirst === 1){
        triangleIterator = lineCount;
              var Vector0 = triangleVector[triangleIterator].slice(0, 3);
                var normal0 = triangleVector[triangleIterator].slice(3, 6);
                var uv0 = triangleVector[triangleIterator].slice(6, 8);

                var vertex = [[0], [0], [0], [1]];
                var TransformedVector = [[0], [0], [0], [0]];

                var normal = [[0], [0], [0], [1]];
                var TransformedNormal = [[0], [0], [0], [0]];
                for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (i === 0)
                            vertex[j][i] = Vector0[j];
                        normal[j][i] = normal0[j];
                    }
                }
//         debugger
                TransformedVector = getTransformedVects(vertex,0);

                TransformedNormal = multiplyMatrices(SCENE_NORMALS_RESULTANT, normal);
                normalizeVectsByW(TransformedNormal, 1);


                vertex = [[0], [0], [0], [0]];
                normal = [[0], [0], [0], [0]];

                vertex = getDeTransformedVects(TransformedVector);
                normal = multiplyMatrices(invNORMALS_RESULTANT, TransformedNormal);
                normalizeVectsByW(normal, 2);

                for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (i === 0)
                            Vector0[j] = parseFloat(vertex[j][i]);
                        normal0[j] = parseFloat(normal[j][i]);
                    }
                }

                triangleVector[lineCount] = (Vector0.concat(normal0)).concat(uv0);
          }
        
        lineCount = lineCount + 1;
    }

//Saurabh
    var leafNo = 0;
    var totalLeaves = 1;
    NoOfTrianglesInTheObject = triangleVector.length;
    while (leafNo < totalLeaves) {
        if (leafNo > 0) {
            lineCount = lineCount;
            var triangleIterator = 0;
            while (triangleIterator < NoOfTrianglesInTheObject) {
                var Vector0 = triangleVector[triangleIterator].slice(0, 3);
                var normal0 = triangleVector[triangleIterator].slice(3, 6);
                var uv0 = triangleVector[triangleIterator].slice(6, 8);

                var vertex = [[0], [0], [0], [1]];
                var TransformedVector = [[0], [0], [0], [0]];

                var normal = [[0], [0], [0], [1]];
                var TransformedNormal = [[0], [0], [0], [0]];
                for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (i === 0)
                            vertex[j][i] = Vector0[j];
                        normal[j][i] = normal0[j];
                    }
                }

                TransformedVector = getTransformedVects(vertex, 1);
                TransformedNormal = multiplyMatrices(SCENE_NORMALS_RESULTANT, normal);
                normalizeVectsByW(TransformedNormal, 1);


                vertex = [[0], [0], [0], [0]];
                normal = [[0], [0], [0], [0]];

                vertex = getDeTransformedVects(TransformedVector);
                normal = multiplyMatrices(invNORMALS_RESULTANT, TransformedNormal);
                normalizeVectsByW(normal, 2);

                for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < 3; j++) {
                        if (i === 0)
                            Vector0[j] = parseFloat(vertex[j][i]);
                        normal0[j] = parseFloat(normal[j][i]);
                    }
                }

                triangleVector[lineCount] = (Vector0.concat(normal0)).concat(uv0);
                triangleIterator += 1;
                lineCount += 1;
            }
        }

        leafNo += 1;
    }

    console.log(triangleVector, triangleVector.length);

//screen = position + lookat
    var camPos = DEFAULT_TRANSFORMATION.camera.position;
    var camN = //normalize1DMatrix(
            addVectors(DEFAULT_TRANSFORMATION.camera.position,
                    DEFAULT_TRANSFORMATION.camera.lookAt); //);
    var camU = DEFAULT_TRANSFORMATION.camera.worldUp;
    //v cross product of up and look at 
    var camV = normalize1DMatrix(
            crossProduct1D(DEFAULT_TRANSFORMATION.camera.lookAt, DEFAULT_TRANSFORMATION.camera.worldUp));
    var rayEtoO = [[0, 0, 0], [0, 0, 0]];

    var rayPtoL = [[0, 0, 0], [0, 0, 0]];

//    rayTraceTriangle(triangleVector, camN, camPos, camU, camV, rayEtoO, rayPtoL);
    shadowRay(rayPtoL, triangleVector);
    writeToCanvas();
}