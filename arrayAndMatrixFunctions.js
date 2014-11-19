/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function arraysEqual(array1, array2) {
    if (array1.length !== array2.length)
        return false;
    for (i = 0; i < array1.length; i++)
        if (array1[i] !== array2[i])
            return false;
    return true;
}

function multiplyMatrices(matrix1, matrix2) {
    var matrix1rows = matrix1.length;
    var matrix1cols = matrix1[0].length;
    var matrix2cols = matrix2[0].length;
    var resultMatrix = new Array(matrix1rows);
    for (var row = 0; row < matrix1rows; row++) {
        resultMatrix[row] = new Array(matrix2cols);
        for (var col = 0; col < matrix2cols; col++) {
            resultMatrix[row][col] = 0;
        }
    }
    for (var row = 0; row < matrix1rows; row++) {
        for (var col = 0; col < matrix2cols; col++) {
            for (var colalt = 0; colalt < matrix1cols; colalt++) {
                resultMatrix[row][col] += matrix1[row][colalt] * matrix2[colalt][col];
            }
        }
    }
    return resultMatrix;
}

function normalizeW(vector) {
    vector[0][0] /= vector[3][0];
    vector[1][0] /= vector[3][0];
    vector[2][0] /= vector[3][0];
    vector[3][0] /= vector[3][0];
    return vector;
}

function normalizeMatrix(matrix) {
    var arrayLength = matrix.length;
    var sum = new Array(arrayLength);
    for (var i = 0; i < matrix.length; i++) {
        sum[i] = 0;
        for (var j = 0; j < matrix[0].length; j++) {
            sum[i] += Math.pow(matrix[i][j], 2);
        }
        sum[i] = Math.sqrt(1 / sum[i]);
        for (var j = 0; j < matrix[0].length; j++) {
            matrix[i][j] *= sum[i];
        }
    }
    return matrix;
}
function normalize1DMatrix(matrix) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        sum += Math.pow(matrix[i], 2);
    }
    sum = Math.sqrt(1 / sum);
    for (var j = 0; j < matrix.length; j++) {
        matrix[j] *= sum;
    }
    return matrix;
}

function crossProduct1D(vector1, vector2) {
    var result = new Array(vector1.length);
    result[0] = vector1[1]*vector2[2] - vector1[2]*vector2[1];
    result[1] = vector1[0]*vector2[2] - vector1[2]*vector2[0];
    result[2] = vector1[0]*vector2[1] - vector1[1]*vector2[0];
    return result;
}

function subtractVectors(vector1, vector2) {
    var result = new Array(vector1.length);
    for (var i = 0; i < vector1.length; i++) {
        result[i] = vector1[i] - vector2[i];
    }
    return result;
}

function addVectors(vector1, vector2) {
    var result = new Array(vector1.length);
    for (var i = 0; i < vector1.length; i++) {
        result[i] = vector1[i] + vector2[i];
    }
    return result;
}

function scalarMultiple(matrix, scalar) {
    var result = new Array(matrix.length);
    for (var i = 0; i < matrix.length; i++) {
        result[i] = matrix[i] * scalar;
    }
    return result;
}