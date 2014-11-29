#!/usr/bin/env python

from math import cos
from math import sin
from math import radians
from optparse import OptionParser

def main():
    parser = OptionParser()
    parser.add_option("-i", "--input_file", dest = "input", help="input file to\
            be converted", metavar="FILE")
    parser.add_option("-o", "--output_file", dest = "output", help="output file\
            to be created", metavar="FILE")
    (options,args) = parser.parse_args()
    options.input = "leaf.obj.asc"
    options.output  = "HW5\\transform.obj.asc"

    if not options.input or not options.output:
        return

    mat = []
    nat = []
    final = []
    mat = combine([translate([-25,20,0]), scale([1,1,1])])
    nmat = []
    final.append([mat, nat])
    mat = combine([translate([-10,0, 0]), scale([4,4,4]), rotateX(0), \
            rotateY(90)])
    nmat = combine([rotateX(0), rotateY(90)])
    final.append([mat, nat])
    mat = combine([translate([5,10,0]), scale([2,2,2]), rotateX(180), \
        rotateZ(90), rotateY(180)])
    #nmat = combine([rotateX(180), rotateZ(90), rotateY(180)])
    nmat = []
    final.append([mat, nat])
    mat = combine([translate([10,5,0]), scale([0.5,0.5,0.5]), rotateX(45), \
        rotateZ(90), rotateY(180)])
    nmat = combine([rotateX(45), rotateZ(90), rotateY(180)])
    final.append([mat, nat])

    #mat = combine([translate([0,8,0]), scale([3,3,3])])
    #final.append([mat, nat])
    #mat.append(combine([translate([-15,13,0]), rotateX(70)]))
    #mat.append(combine([translate([-15,10,0]), rotateX(50), rotateZ(40)]))
    #mat.append(combine([scale([1.5,1.5,1.5]), rotateX(50), rotateZ(40), \
        #rotateY(50), translate([6,4,10])]))
    #mat.append(combine([scale([1,1,1]), rotateY(60), rotateZ(20), \
        #rotateY(50), translate([3,2,0])]))
    #mat.append(combine([scale([0.5,0.5,0.5]), rotateX(40), rotateY(70), \
        #rotateY(50), translate([8,5,10])]))
    output = []
    for i, j in final:
        fin  = open(options.input, "r")
        output.append(calc(i, j, fin))
        fin.close()
    fout = open(options.output, "w")
    merge(output, fout)
    fout.close()
    return

def merge(output, fout):
    for i in output:
        for line in i:
            fout.write(line)

def calc(matV, matN, fin):
    output = []
    for i in fin:
        if i[0] == 't':
            output.append(i)
            continue
        i = i.strip().split(" ")
        val = [float(x) for x in i]
        if matV:
            ret = multiply(matV, [val[0], val[1], val[2], 1])
        else:
            ret = [val[0], val[1], val[2]]
        string = " ".join([str(ret[0]), str(ret[1]), str(ret[2])]) + " "
        if matN:
            ret = multiply(matN, [val[3], val[4], val[5], 1])
        else:
            ret = [val[3], val[4], val[5]]
        string += " ".join([str(ret[0]), str(ret[1]), str(ret[2])]) + " "
        string += " ".join([str(val[6]), str(val[7])]) + "\n"
        output.append(string)
    return output

def combine(mats):
    ret = [ [1,0,0,0],\
            [0,1,0,0],\
            [0,0,1,0],\
            [0,0,0,1]]
    for mat in mats:
        ret = multiplyMatrix(ret, mat)
    return ret

def multiplyMatrix(mat1, mat2):
    ret = []
    for i in range(4):
        ret.append([[],[],[],[]])
    for i in range(4):
        for j in range(4):
            ret[i][j] = 0
            for k in range(4):
                ret[i][j] += mat1[i][k] * mat2[k][j]
    return ret



def multiply(mat, vert):
    ret = []
    for i in range(4):
        ret.append([[]])
    for i in range(4):
        ret[i] = 0
        for j in range(4):
            ret[i] += mat[i][j] * vert[j]
    return ret

def rotateX(degree):
    mat = []
    for i in range(4):
        mat.append([[], [], [], []])
    mat[0][0] = 1
    mat[0][1] = 0
    mat[0][2] = 0
    mat[0][3] = 0

    mat[1][0] = 0
    mat[1][1] = cos(radians(degree))
    mat[1][2] = -sin(radians(degree))
    mat[1][3] = 0

    mat[2][0] = 0
    mat[2][1] = sin(radians(degree))
    mat[2][2] = cos(radians(degree))
    mat[2][3] = 0

    mat[3][0] = 0
    mat[3][1] = 0
    mat[3][2] = 0
    mat[3][3] = 1
    return mat

def rotateY(degree):
    mat = []
    for i in range(4):
        mat.append([[], [], [], []])
    mat[0][0] = cos(radians(degree))
    mat[0][1] = 0
    mat[0][2] = sin(radians(degree))
    mat[0][3] = 0

    mat[1][0] = 0
    mat[1][1] = 1
    mat[1][2] = 0 
    mat[1][3] = 0

    mat[2][0] = -sin(radians(degree))
    mat[2][1] = 0
    mat[2][2] = cos(radians(degree))
    mat[2][3] = 0

    mat[3][0] = 0
    mat[3][1] = 0
    mat[3][2] = 0
    mat[3][3] = 1
    return mat

def rotateZ(degree):
    mat = []
    for i in range(4):
        mat.append([[], [], [], []])
    mat[0][0] = cos(radians(degree))
    mat[0][1] = -sin(radians(degree))
    mat[0][2] = 0 
    mat[0][3] = 0

    mat[1][0] = sin(radians(degree))
    mat[1][1] = cos(radians(degree))
    mat[1][2] = 0 
    mat[1][3] = 0

    mat[2][0] = 0 
    mat[2][1] = 0
    mat[2][2] = 1
    mat[2][3] = 0

    mat[3][0] = 0
    mat[3][1] = 0
    mat[3][2] = 0
    mat[3][3] = 1
    return mat

def translate(distance):
    mat = []
    for i in range(4):
        mat.append([[], [], [], []])
    mat[0][0] = 1
    mat[0][1] = 0
    mat[0][2] = 0 
    mat[0][3] = distance[0]

    mat[1][0] = 0
    mat[1][1] = 1
    mat[1][2] = 0 
    mat[1][3] = distance[1]

    mat[2][0] = 0
    mat[2][1] = 0
    mat[2][2] = 1
    mat[2][3] = distance[2]

    mat[3][0] = 0
    mat[3][1] = 0
    mat[3][2] = 0
    mat[3][3] = 1
    return mat

def scale(size):
    mat = []
    for i in range(4):
        mat.append([[], [], [], []])
    mat[0][0] = size[0]
    mat[0][1] = 0
    mat[0][2] = 0
    mat[0][3] = 0

    mat[1][0] = 0
    mat[1][1] = size[1]
    mat[1][2] = 0 
    mat[1][3] = 0

    mat[2][0] = 0
    mat[2][1] = 0
    mat[2][2] = size[2]
    mat[2][3] = 0

    mat[3][0] = 0
    mat[3][1] = 0
    mat[3][2] = 0
    mat[3][3] = 1
    return mat

if __name__ == "__main__":
    main()
