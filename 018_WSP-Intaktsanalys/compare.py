import pandas as pd

DIR1 = 'data\\'
DIR2 = 'facit\\'

def ass (a,b,msg=''):
    if a!=b:
        print(' Difference in',msg)
        print('  ',a)
        print('  ',b)
        #assert a==b

def compare(filename):
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
            if dtype1=='float': continue
            col1 = csv1[colname]
            col2 = csv2[colname]
            for j in range(rows):
                cell1 = col1[j]
                cell2 = col2[j]
                if dtype1 == 'float':
                    ass(f'{cell1:.8e}',f'{cell2:.8e}', f"[{colname},{j}]")
                else:
                    ass(cell1,cell2,f"[{colname},{j}]")
        else:
            print(' Missing column',colname)

compare('kalibreringsfaktorer_hp')
compare('kalibreringsfaktorer_rp')
compare('resandedata_long_hp_nulage')
compare('resandedata_long_rp_nulage')