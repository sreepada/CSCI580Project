/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function readInputFile_org(evt, contents) {
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
            console.log(READ_FILE_LINES[0]);
        };
        r.readAsText(f);
    } else {
        alert("Failed to object load file");
    }
}

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
//                    console.log(READ_FILE_LINES[i], vtArray[vtC]);
                }
                if (READ_FILE_LINES[i].indexOf("vn ") > -1) {
                    vnArray.push(READ_FILE_LINES[i].substring(3));
                }
                if (READ_FILE_LINES[i].indexOf("f ") > -1) {
                    fArray.push(READ_FILE_LINES[i].substring(2));
                }
            }
            console.log(vArray.length, vtArray.length, vnArray.length);
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
//                    console.log(vertex1, vertex2, vertex3);
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex1[0]) - 1] + " "
                            + vtArray[parseInt(vertex1[1]) - 1] + " "
                            + vnArray[parseInt(vertex1[2]) - 1];
                    console.log(lineCount + " contains " + READ_FILE_LINES[lineCount], " read from ", vertex1);
                    lineCount += 1;
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex2[0]) - 1] + " "
                            + vtArray[parseInt(vertex2[1]) - 1] + " "
                            + vnArray[parseInt(vertex2[2]) - 1];
                    console.log(READ_FILE_LINES[lineCount], vertex2);
                    lineCount += 1;
                    READ_FILE_LINES[lineCount] = vArray[parseInt(vertex3[0]) - 1] + " "
                            + vtArray[parseInt(vertex3[1]) - 1] + " "
                            + vnArray[parseInt(vertex3[2]) - 1];
                    console.log(READ_FILE_LINES[lineCount], vertex3);
                    lineCount += 1;
                }
            }

            console.log(READ_FILE_LINES[0]);
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