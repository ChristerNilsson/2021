import pandas as pd
import time

# Du kan begränsa jämförandet på några olika sätt:
#  0. Välj kataloger med DIR1 och DIR2
#  1. I slutet av denna fil kan du påverka vila filer du vill jämföra. Byt mellan if 1 och if 0
#  2. Byt range(rows) till t ex range(min(1000,rows))
#  3. Påverka antal signifikanta siffror genom att ändra .7e till .6e eller något annat
#  4. Vill du se bara första problemet, avkommentera "assert a==b"

DIR1 = 'data\\'
DIR2 = 'facit\\'

def ass (a,b,msg=''):
    if a!=b:
        print(' Difference in',msg)
        print('  ',a)
        print('  ',b)
        #assert a==b

def compare(filename):
    start = time.time()
    print()
    print('Comparing',filename)
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
            dtype1 = csv1[colname].dtype
            dtype2 = csv1[colname].dtype
            #if dtype1=='float': continue
            col1 = csv1[colname]
            col2 = csv2[colname]
            for j in range(min(1000000,rows)):
                cell1 = col1[j]
                cell2 = col2[j]
                if dtype1 == 'float':
                    ass(f'{cell1:.8e}',f'{cell2:.8e}', f"[{colname},{j}]")
                else:
                    ass(cell1,cell2,f"[{colname},{j}]")
        else:
            print(' Missing column',colname)
    print(" CPU:",f'{(time.time()-start):3f}')

def simple(filename):
    print()
    print('Comparing simple',filename)
    with open(DIR1 + filename + '.csv') as f: lines1 = f.readlines()
    with open(DIR2 + filename + '.csv') as f: lines2 = f.readlines()
    ass(len(lines1),len(lines2),'number of lines')
    for i in range(min(1000000,len(lines1))):
        cell1 = float(lines1[i])
        cell2 = float(lines2[i])
        ass(f'{cell1:.7e}', f'{cell2:.7e}', f"[{i}]")

if 1: simple('skattning_ASCs_hp')
if 1: simple('skattning_ASCs_rp')
if 1: compare('Resultat_smabiljett')
if 1: compare('kalibreringsfaktorer_hp')
if 1: compare('kalibreringsfaktorer_rp')
if 1: compare('resandedata_long_hp_nulage') # 60 MB
if 1: compare('resandedata_long_rp_nulage') # 60 MB
