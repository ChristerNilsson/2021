import pandas as pd
import time

# Du kan styra jämförandet på flera olika sätt:
#  0. Välj kataloger med DIR1 och DIR2
#  1. Sätt ROWS = 1000 om du vill ha maximalt 1000 rader jämförda.
#  2. Vill du se bara första problemet, sätt FIRST = True
#  3. I slutet av denna fil anger du vilka filer du vill jämföra.
#  4. Ange antal signifikanta siffror som andra parameter efter filnamnet.

DIR1 = 'data\\'
DIR2 = 'facit\\'
ROWS = 1000000
FIRST = False

def ass (a,b,msg=''):
    if a != b:
        print(' Difference in',msg)
        print('  ',a)
        print('  ',b)
        if FIRST: assert a == b

def compare(filename,digits = 6):
    SCI = "{" + f":.{digits}e" + "}"
    start = time.time()
    print()
    print('Comparing',filename,'with',digits,'digits')
    csv1 = pd.read_csv(DIR1 + filename + '.csv')
    csv2 = pd.read_csv(DIR2 + filename + '.csv')
    ass(csv1.shape,csv2.shape,'shape')
    rows,cols = csv2.shape
    cols1 = csv1.columns.to_list()
    cols2 = csv2.columns.to_list()
    cols = cols1 if len(cols1)> len(cols2) else cols2
    ass(cols1,cols2, 'column names')
    for colname in cols:
        if colname in cols1 and colname in cols2:
            print(' Comparing column',colname)
            col1 = csv1[colname]
            col2 = csv2[colname]
            dtype1 = col1.dtype
            dtype2 = col2.dtype
            #if dtype1=='float': continue
            for j in range(min(ROWS,rows)):
                cell1 = col1[j]
                cell2 = col2[j]
                if dtype1 == 'float':
                    ass(SCI.format(cell1),SCI.format(cell2), f"[{colname},{j}]")
                else:
                    ass(cell1,cell2,f"[{colname},{j}]")
        else:
            print(' Missing column',colname)
    print(f' {rows} rows and {len(cols)} cols compared in {(time.time()-start):.3f} seconds')

def simple(filename,digits = 6):
    SCI = "{:." + str(digits) + "e}"
    print()
    print('Comparing simple',filename,'with',digits,'digits')
    with open(DIR1 + filename + '.csv') as f: lines1 = f.readlines()
    with open(DIR2 + filename + '.csv') as f: lines2 = f.readlines()
    ass(len(lines1),len(lines2),'number of lines')
    for i in range(min(ROWS,len(lines1))):
        cell1 = float(lines1[i])
        cell2 = float(lines2[i])
        ass(SCI.format(cell1), SCI.format(cell2), f"[{i}]")

simple('skattning_ASCs_hp',8)
simple('skattning_ASCs_rp',8)
compare('Resultat_smabiljett',8)
compare('kalibreringsfaktorer_hp',8)
compare('kalibreringsfaktorer_rp',8)
compare('resandedata_long_hp_nulage',3) # 60 MB
compare('resandedata_long_rp_nulage',3) # 60 MB
