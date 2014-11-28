/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//function readInputFile_org(evt, contents) {
//    //Retrieve the File from the FileList object
//    var f = evt.target.files[0];
//    console.log(evt.target.files);
//    if (f) {
//        var r = new FileReader();
//        r.onload = function (e) {
//            contents = e.target.result;
//            READ_FILE_LINES = contents.split("\n");
//            //in case there are files with windows EOL
//            if (!READ_FILE_LINES[1])
//                READ_FILE_LINES = contents.split("\r");
//            console.log(READ_FILE_LINES[0]);
//        };
//        r.readAsText(f);
//    } else {
//        alert("Failed to object load file");
//    }
//}

function readInputFile(evt, contents) {
    //Retrieve the File from the FileList object
    var f = evt.target.files[0];
    console.log(evt.target.files);
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            contents = e.target.result;
            READ_FILE_LINES = contents.split("\n");
            //in case there are files with windows EOL
            if (!READ_FILE_LINES[1])
                READ_FILE_LINES = contents.split("\r");
            var vArray = [], vtArray = [], vnArray = [], fArray = [];
            for (var i = 0; i < READ_FILE_LINES.length; i++) {
                if (READ_FILE_LINES[i].indexOf("v ") > -1) {
                    vArray.push(READ_FILE_LINES[i].substring(2));
                }
                if (READ_FILE_LINES[i].indexOf("vt ") > -1) {
                    vtArray.push(READ_FILE_LINES[i].substring(3));
                }
                if (READ_FILE_LINES[i].indexOf("vn ") > -1) {
                    vnArray.push(READ_FILE_LINES[i].substring(3));
                }
                if (READ_FILE_LINES[i].indexOf("f ") > -1) {
                    fArray.push(READ_FILE_LINES[i].substring(2));
                }
            }
            var output;
            var firstLineSplit;
            output = "var Triangles = [\r\n";
            READ_FILE_LINES = [];
            var lineCount = 0;
            for (var i = 0; i < fArray.length; i++) {
                var polygonVertices = fArray[i].split(" ");
                for (var j = 0; j <= polygonVertices.length - 2; j = j + 2) {
                    var vertex1 = polygonVertices[j].split("/");
                    var vertex2 = polygonVertices[j + 1].split("/");
                    var vertex3 = ((j + 2) === polygonVertices.length) ?
                            polygonVertices[0].split("/") :
                            polygonVertices[j + 2].split("/");
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex1[0]) - 1] + " "
                            + vnArray[parseInt(vertex1[2]) - 1] + " "
                            + vtArray[parseInt(vertex1[1]) - 1];

                    firstLineSplit = READ_FILE_LINES[lineCount].split(/[\s]+/);
                    output += "{'V1':{'X':'" + parseFloat(firstLineSplit[0]) + "','Y':'" + parseFloat(firstLineSplit[1]) + "','Z':'" + parseFloat(firstLineSplit[2]) + "','normal': {'x':'" + parseFloat(firstLineSplit[5]) + "','y':'" + parseFloat(firstLineSplit[6]) + "','z':'" + parseFloat(firstLineSplit[7]) + "'}, 's': '" + parseFloat(firstLineSplit[3]) + "','t': '" + parseFloat(firstLineSplit[4]) + "'},";
                    lineCount += 1;
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex2[0]) - 1] + " "
                            + vnArray[parseInt(vertex2[2]) - 1] + " "
                            + vtArray[parseInt(vertex2[1]) - 1];
                    firstLineSplit = READ_FILE_LINES[lineCount].split(/[\s]+/);
                    output += "'V2':{'X':'" + parseFloat(firstLineSplit[0]) + "','Y':'" + parseFloat(firstLineSplit[1]) + "','Z':'" + parseFloat(firstLineSplit[2]) + "','normal': {'x':'" + parseFloat(firstLineSplit[5]) + "','y':'" + parseFloat(firstLineSplit[6]) + "','z':'" + parseFloat(firstLineSplit[7]) + "'}, 's': '" + parseFloat(firstLineSplit[3]) + "','t': '" + parseFloat(firstLineSplit[4]) + "'},";

                    lineCount += 1;
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex3[0]) - 1] + " "
                            + vnArray[parseInt(vertex3[2]) - 1] + " "
                            + vtArray[parseInt(vertex3[1]) - 1];
                    firstLineSplit = READ_FILE_LINES[lineCount].split(/[\s]+/);
                    output += "'V3':{'X':'" + parseFloat(firstLineSplit[0]) + "','Y':'" + parseFloat(firstLineSplit[1]) + "','Z':'" + parseFloat(firstLineSplit[2]) + "','normal': {'x':'" + parseFloat(firstLineSplit[5]) + "','y':'" + parseFloat(firstLineSplit[6]) + "','z':'" + parseFloat(firstLineSplit[7]) + "'}, 's': '" + parseFloat(firstLineSplit[3]) + "','t': '" + parseFloat(firstLineSplit[4]) + "'}";
                    output += "},\r\n";
                    lineCount += 1;
                }
            }
            output += "]";
            //outputjson file
            //window.open().document.write(output);
        };
        r.readAsText(f);
    } else {
        alert("Failed to object load file");
    }
}

function readTreeInputFile(evt, contents) {
    //Retrieve the File from the FileList object
    var f = evt.target.files[0];
    console.log(evt.target.files);
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            contents = e.target.result;
            TREE_FILE_LINES = contents.split("\n");
            //in case there are files with windows EOL
            if (!TREE_FILE_LINES[1])
                TREE_FILE_LINES = contents.split("\r");
            var vArray = [], vtArray = [], vnArray = [], fArray = [];
            for (var i = 0; i < TREE_FILE_LINES.length; i++) {
                if (TREE_FILE_LINES[i].indexOf("v ") > -1) {
                    vArray.push(TREE_FILE_LINES[i].substring(2));
                }
                if (TREE_FILE_LINES[i].indexOf("vt ") > -1) {
                    vtArray.push(TREE_FILE_LINES[i].substring(3));
                }
                if (TREE_FILE_LINES[i].indexOf("vn ") > -1) {
                    vnArray.push(TREE_FILE_LINES[i].substring(3));
                }
                if (TREE_FILE_LINES[i].indexOf("f ") > -1) {
                    fArray.push(TREE_FILE_LINES[i].substring(2));
                }
            }
            var output;
            var firstLineSplit;
            output = "var Triangles = [\r\n";
            TREE_FILE_LINES = [];
            var lineCount = 0;
            for (var i = 0; i < fArray.length; i++) {
                var polygonVertices = fArray[i].split(" ");
                for (var j = 0; j <= polygonVertices.length - 2; j = j + 2) {
                    var vertex1 = polygonVertices[j].split("/");
                    var vertex2 = polygonVertices[j + 1].split("/");
                    var vertex3 = ((j + 2) === polygonVertices.length) ?
                            polygonVertices[0].split("/") :
                            polygonVertices[j + 2].split("/");
                    TREE_FILE_LINES[lineCount] = vArray[parseInt(vertex1[0]) - 1] + " "
                            + vnArray[parseInt(vertex1[2]) - 1] + " "
                            + vtArray[parseInt(vertex1[1]) - 1];
                    lineCount += 1;
                    TREE_FILE_LINES[lineCount] = vArray[parseInt(vertex2[0]) - 1] + " "
                            + vnArray[parseInt(vertex2[2]) - 1] + " "
                            + vtArray[parseInt(vertex2[1]) - 1];
                    firstLineSplit = TREE_FILE_LINES[lineCount].split(/[\s]+/);
                    lineCount += 1;
                    TREE_FILE_LINES[lineCount] = vArray[parseInt(vertex3[0]) - 1] + " "
                            + vnArray[parseInt(vertex3[2]) - 1] + " "
                            + vtArray[parseInt(vertex3[1]) - 1];
                    lineCount += 1;
                }
            }
        };
        r.readAsText(f);
    } else {
        alert("Failed to object load file");
    }
}


function readTextureFile(evt, contents) {
    //Retrieve the File from the FileList object
    var f = evt.target.files[0];
    console.log(evt.target.files[0]);
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            contents = e.target.result;
            var splitArray = contents.split("\n");
            //in case there are files with windows EOL
            if (!splitArray[1]) {
                splitArray = contents.split("\r");
            }
            readAndPlotTexture(splitArray);
        };
        r.readAsBinaryString(f);
    } else {
        alert("Failed to texture load file");
    }
}