/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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