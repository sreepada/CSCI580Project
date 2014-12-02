/* 
 * CSCI 580 Project Uncanny Valley
 * This file contains constants which will be used by other functions
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
var Obj_tri_counter = 0;
var NoOfTrianglesInTheObject = 0;

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
var AMBIENT_COEFF = [0.7, 0.7, 0.7];

var SPECULAR_COEFF = [0.3, 0.3, 0.3];
var DIFFUSE_COEFF = [0.4, 0.4, 0.4];
var SPEC_POWER = 32;
 var LIGHT = [[[-1.7071, 0, 20], [0.2, 0.7, 0.3]]];
//var LIGHT = [[[-1.5071, -0.15, 10], [0.2, 0.7, 0.3]]];
var TREE_LIGHT = [[[-10.5071, 10.15, -10], [0.6, 0.24, 0.25]]];
//var LIGHT = [[[0.1, 0.2, 30], [0.2, 0.7, 0.3]]];

var SCENE_Translation = [0,0,0];
var SCENE_Scaling = [0,0,0];
var SCENE_RotationX = [0,0,0];
var SCENE_RotationY = [0,0,0];
var SCENE_RotationZ = [0,0,0];
var invNORMALS_RESULTANT = IDENTITY_MATRIX;
var SCENE_NORMALS_RESULTANT = IDENTITY_MATRIX;
var RANDOM = 0; 

var COLOR_THRESHOLD = 0;
var SHADING_TYPE = 2;
var ROTATE_STEP = {"rotate": [0, 0, 0]};
var READ_FILE_LINES = "";
var TREE_FILE_LINES = "";
var TEXTURE_FILE_DATA = "";

var AAKERNEL_SIZE = 1;
var AA_FILTER = [[0, 0, 1]];

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
            -65
        ],
        "lookAt": [
            -0.2,
            0,
            1
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

TREE_CAMERA_TRANSFORMATION = {
    "sp": [
        512,
        512
    ],
//     default camera postions
    "FOV": 35,
    "camera": {
        "position": [
            -40,
            -15,
            -10
        ],
        "lookAt": [
            0,
            0,
            0
        ],
        "worldUp": [
            0,
            1,
            0
        ]
    },
    "translation": [
        180,
        -10,
        0
    ],
    "scaling": [
        8,
        8,
        8
    ],
    "rotation": [
        0,
        0,
        0
    ]
};

var DEFAULT_TRANSFORMATION = DEFAULT_CAMERA_TRANSFORMATION;