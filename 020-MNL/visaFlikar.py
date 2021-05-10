import pandas as pd

DATA = "data\\"

sheets = pd.read_excel(DATA + "alla_indata.xlsx", sheet_name=None)
for sheetname in sheets:
    sheet = sheets[sheetname]
    rows,cols = sheet.shape
    if rows == 0: continue
    print()
    print('Sheet',sheetname,rows,'rows and',cols,'cols:')
    print(" ".join(sheet.columns.to_list()))
    print(sheet.values)
