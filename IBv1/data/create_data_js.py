
import csv

with open('N.txt', 'r') as f:
    N = int(f.readline())

data = 'var cite = [ ["Author","Title","year","url","doi"],\n'

with open('cite.csv', 'r') as f:
    for line in f:
        data += '    [' + line.strip() + '],\n'

data += '  ], \n\n  exampDict = {\n'

with open('exampDict.csv', 'r') as f:
    for line in f:
        line = line.strip().split(',')
        data += '    ' + line[0] + ': [' + line[2] + ', [' + ','.join(line[3:]) + '], ' + line[1] + '], \n'

data += '  }, \n\n  props = [\n'

with open('props.csv', 'r', newline='') as f:
    lines = csv.reader(f, delimiter = ',', quotechar = '"', skipinitialspace=True)
    for line in lines:
        data += '    [ "' + line[0] + '", "' + line[1] + '", ["' + '","'.join(line[2:]) + '"] ], \n'

data += '  ], \n\n  keyDict = {\n'

with open('keyDict.csv', 'r', newline='') as f:
    lines = csv.reader(f, delimiter = ',', quotechar = '"', skipinitialspace=True)
    for line in lines:
        data += '    ' + line[0] + ':"' + line[1] + '", \n'

data += '  }, \n\n  implies = [ \n'

with open('implies.csv', 'r', newline='') as f:
    lines = csv.reader(f, delimiter = ',', quotechar = '"', skipinitialspace=True)
    for line in lines:
        data += '    [ [' + '], ['.join([','.join(line[3*n:3*n+3]) for n in range(N)]) + '] ], \n'

data += '  ], \n\n  reason = [ \n'

with open('reason.txt', 'r') as f:
    for line in f.readlines():
        data += '    ' + line.strip() + ', \n'

data += '  ];'

#print(data)

with open('data.js', 'w') as f:
    f.write(data)

'''
/*
    reasonDict = {
        "S": "Self",
        "T": "Trivial",
        "F": "Folklore",
        "C": "Citation",
    };
*/

'''
