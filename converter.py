#!/usr/bin/env python

from optparse import OptionParser

def main():
    parser = OptionParser()
    parser.add_option("-i", "--input_file", dest = "input", help="input file to\
            be converted", metavar="FILE")
    parser.add_option("-o", "--output_file", dest = "output", help="output file\
            to be created", metavar="FILE")
    (options,args) = parser.parse_args()
    options.input = "leaf.obj"
    options.output  = options.input + ".asc"
    if not options.input or not options.output:
        return
    f  = open(options.input, 'r')
    v  = []
    vn = []
    vt = []
    fv = []
    for i in f:
        string = ""
        i = i.strip()
        if i[0:2] == 'vt':
            string = i.split(" ")
            vt.append([float(string[1]), float(string[2])])
        elif i[0:2] == 'vn':
            string = i.split(" ")
            vn.append([float(string[1]), float(string[2]), float(string[3])])
        elif i[0] == 'v':
            string = i.split(" ")
            v.append([float(string[1]), float(string[2]), float(string[3])])
        elif i[0] == 'f':
            string = i.split(" ")
            string = string[1:]
            f_two  = []
            for j in string:
                string = j.split("/")
                f_two.append([int(string[0])-1, int(string[1])-1, \
                        int(string[2])-1])
            fv.append(f_two)
    f.close()
    f = open(options.output, 'w')
    for i in fv:
        f.write("triangle\n")
        line  = " ".join([str(x) for x in v[i[0][0]]]) + " "
        line += " ".join([str(x) for x in vn[i[0][2]]]) + " "
        line += " ".join([str(x) for x in vt[i[0][1]]]) + "\n"
        f.write(line)
        line  = " ".join([str(x) for x in v[i[1][0]]]) + " "
        line += " ".join([str(x) for x in vn[i[1][2]]]) + " "
        line += " ".join([str(x) for x in vt[i[1][1]]]) + "\n"
        f.write(line)
        line  = " ".join([str(x) for x in v[i[2][0]]]) + " "
        line += " ".join([str(x) for x in vn[i[2][2]]]) + " "
        line += " ".join([str(x) for x in vt[i[2][1]]]) + "\n"
        f.write(line)
        if len(i) == 4:
            f.write("triangle\n")
            line  = " ".join([str(x) for x in v[i[0][0]]]) + " "
            line += " ".join([str(x) for x in vn[i[0][2]]]) + " "
            line += " ".join([str(x) for x in vt[i[0][1]]]) + "\n"
            f.write(line)
            line  = " ".join([str(x) for x in v[i[2][0]]]) + " "
            line += " ".join([str(x) for x in vn[i[2][2]]]) + " "
            line += " ".join([str(x) for x in vt[i[2][1]]]) + "\n"
            f.write(line)
            line  = " ".join([str(x) for x in v[i[3][0]]]) + " "
            line += " ".join([str(x) for x in vn[i[3][2]]]) + " "
            line += " ".join([str(x) for x in vt[i[3][1]]]) + "\n"
            f.write(line)
    f.close()
    return

if __name__ == "__main__":
    main()
