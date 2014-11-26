/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var FLAG = 0;
var CONTENTS;
var TEXTURE_BUFFER, CANVAS_BUFFER;
var Z_MAX = Math.pow(2, 16) - 1;
var DEGREE2RADIANS = 0.0174532925;

var TEXTURE_CANVAS = document.getElementById("texture");
var TEXTURE_CONTEXT = TEXTURE_CANVAS.getContext("2d");
var TEXTURE_DATA = TEXTURE_CONTEXT.createImageData(1, 1);
var MAIN_CANVAS = document.getElementById("mainCanvas");
var MAIN_CONTEXT = MAIN_CANVAS.getContext("2d");
var MAIN_DATA = MAIN_CONTEXT.createImageData(1, 1);

var CONTEXT_LIST = [[TEXTURE_CANVAS, TEXTURE_CONTEXT, TEXTURE_DATA],
    [MAIN_CANVAS, MAIN_CONTEXT, MAIN_DATA]];

var IDENTITY_MATRIX = [[1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]];
var RESULTANT_MATRIX = IDENTITY_MATRIX;
var SCENE_RESULTANT_MATRIX = IDENTITY_MATRIX;
var NORMALS_RESULTANT = IDENTITY_MATRIX;
var NEW_TRANSFROM = IDENTITY_MATRIX;
var NEW_N_TRANSFROM = IDENTITY_MATRIX;
var INTERVAL_COUNT = 0;
var RENDER_TIMER;

var AMBIENT_LIGHT = [[0, 0, 0], [0.3, 0.3, 0.3]];
var AMBIENT_COEFF = [0.1, 0.1, 0.1];

var SPECULAR_COEFF = [0.3, 0.3, 0.3];
var DIFFUSE_COEFF = [0.7, 0.7, 0.7];
var SPEC_POWER = 32;
//-1 0.333 -1
//var LIGHT = [[[-0.7071, 0.7071, 0], [0.9, 0.2, 0.9]],
//[[0, -0.7071, -0.7071], [0.9, 0.2, 0.3]],
//[[0.7071, 0.0, -0.7071], [0.2, 0.7, 0.3]]
//];
var LIGHT = [[0.7071, 0.7071, 0.7071], [1, 1, 1], [-1, 0.33, -1]];

var COLOR_THRESHOLD = 0;
var SHADING_TYPE = 2;
var ROTATE_STEP = {"rotate": [0, 0, 0]};
var READ_FILE_LINES = "";
var TEXTURE_FILE_DATA = "";

//var AAKERNEL_SIZE = 6;
//var AA_FILTER = [//[0, 0, 1]];
//    [-0.52, 0.38, 0.128],
//    [0.41, 0.56, 0.119],
//    [0.27, 0.08, 0.294],
//    [-0.17, -0.29, 0.249],
//    [0.58, -0.55, 0.104],
//    [-0.31, -0.71, 0.106],
//    [0, 0, 1]
//];

var AAKERNEL_SIZE = 1;
var AA_FILTER = [[0, 0, 1]];


//var DEFAULT_CAMERA_TRANSFORMATION = {
//    "sp": [
//        256,
//        256
//    ],
////     default camera postions
//    "FOV": 50,
//    "camera": {
//        "position": [
//            0,
//            15,
//            18
//        ],
//        "lookAt": [
//            0,
//            0,
//            0
//        ],
//        "worldUp": [
//            0,
//            1,
//            0
//        ]
//    },
//    "translation": [
//        0,
//        0,
//        0
//    ],
//    "scaling": [
//        2,
//        2,
//        2
//    ],
//    "rotation": [
//        0,
//        0,
//        0
//    ]
//};

DEFAULT_CAMERA_TRANSFORMATION = {
    "sp": [
        512,
        512
    ],
//     default camera postions
    "FOV": 60,
    "camera": {
        "position": [
            0,
            0,
            -35
        ],
        "lookAt": [
            -0.2,
            0,
            5
        ],
        "worldUp": [
            0,
            1,
            0
        ]
    },
    "translation": [
        0,
        -3.25,
        3.5
    ],
    "scaling": [
        3.25,
        3.25,
        3.25
    ],
    "rotation": [
        -45,
        -30,
        0
    ]
};

var HW5_CAMERA_TRANSFORMATION = {
    "sp": [
        256,
        256
    ],
    //HW 5 camera positions
    "FOV": 63.7,
    "camera": {
        "position": [
            -3,
            -25,
            -4
        ],
        "lookAt": [
            7.8,
            0.7,
            6.5
        ],
        "worldUp": [
            -0.2,
            1,
            0
        ]
    },
    "translation": [
        0,
        -3.25,
        3.5
    ],
    "scaling": [
        3.25,
        3.25,
        3.25
    ],
    "rotation": [
        -45,
        -30,
        0
    ]
};

var HW4_CAMERA_TRANSFORMATION = {
    "sp": [
        256,
        256
    ],
    //HW 4 camera positions
    "FOV": 53.7,
    "camera": {
        "position": [
            13.2,
            -8.7,
            -14.8
        ],
        "lookAt": [
            0.8,
            0.7,
            4.5
        ],
        "worldUp": [
            -0.2,
            1,
            0
        ]
    },
    "translation": [
        0,
        -3.25,
        3.5
    ],
    "scaling": [
        3.25,
        3.25,
        3.25
    ],
    "rotation": [
        -45,
        -30,
        0
    ]
};

var DEFAULT_TRANSFORMATION = DEFAULT_CAMERA_TRANSFORMATION;//HW4_CAMERA_TRANSFORMATION;