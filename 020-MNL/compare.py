import pandas as pd
import time

# Du kan styra jämförandet på flera olika sätt:
#  0. Välj kataloger med DIR1 och DIR2
#  1. Sätt ROWS = 1000 om du vill ha maximalt 1000 rader jämförda.
#  2. Vill du se bara första skillnaden, sätt FIRST = True
#  3. I slutet av denna fil anger du vilka filer du vill jämföra.
#  4. Ange acceptabelt antal ppm som parameter efter filnamnet.

DIR1 = 'data\\'
DIR2 = 'facit\\'
ROWS = 1000
FIRST = False

def ass (a,b,msg=''):
    if a != b:
        print('  Difference in',msg)
        print('  ',a)
        print('  ',b)
        if FIRST: assert a == b

def comp(cell1,cell2,dtype,ppm,msg):
    if dtype in ['float64','int64']:
        if cell1 != 0 or cell2 != 0:
            change = 2000000 * abs((cell1-cell2)/(cell1+cell2))
            if change >= ppm:
                if change >= 1: change = round(change)
                elif change >= ppm: change = round(change,6)
                print('  ',change,'ppm',f'({cell1},{cell2})')
    else:
        ass(cell1, cell2, msg)

def compare(filename,ppm=0.001):
    #SCI = "{" + f":.{digits}e" + "}"
    start = time.time()
    print()
    print('Comparing',filename,'using',ppm,'ppm')
    csv1 = pd.read_csv(DIR1 + filename + '.csv',nrows=ROWS)
    csv2 = pd.read_csv(DIR2 + filename + '.csv',nrows=ROWS)
    ass(csv1.shape,csv2.shape,'shape')
    rows,cols = csv2.shape
    cols1 = csv1.columns.to_list()
    cols2 = csv2.columns.to_list()
    cols = cols1 if len(cols1)> len(cols2) else cols2
    ass(cols1,cols2, 'column names')
    n = rows
    for colname in cols:
        if colname in cols1 and colname in cols2:
            col1 = csv1[colname]
            col2 = csv2[colname]
            dtype1 = col1.dtype
            dtype2 = col2.dtype
            print(' Comparing column',colname)
            for j in range(n):
                comp(col1[j],col2[j],dtype1,ppm,f"[{colname},{j}]")
        else:
            print(' Missing column',colname)
    print(f' {n} of {rows} rows and {len(cols)} cols compared in {(time.time()-start):.3f} seconds')

def simple(filename,ppm = 0.001):
    print()
    print('Comparing simple',filename,'using',ppm,'ppm')
    with open(DIR1 + filename + '.csv') as f: lines1 = f.readlines()
    with open(DIR2 + filename + '.csv') as f: lines2 = f.readlines()
    ass(len(lines1),len(lines2),'number of lines')
    for i in range(min(ROWS,len(lines1))):
        comp(float(lines1[i]), float(lines2[i]), 'float64', ppm, f"[{i}]")

print('Comparing directories',DIR1,'and',DIR2,'using maximum',ROWS,'rows')

# Skattning
simple('skattning_ASCs_hp')
simple('skattning_ASCs_rp')

# Nuläge
compare('kalibreringsfaktorer_hp')
compare('kalibreringsfaktorer_rp')
compare('resandedata_long_hp_nulage') # 60 MB
compare('resandedata_long_rp_nulage') # 60 MB

# Taxescenario
compare('Resultat_smabiljett')
compare('intakter_hp')
compare('intakter_rp')
#
