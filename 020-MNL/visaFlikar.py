import pandas as pd
FLIKAR = "biljetter_JA biljetter_UA pristak_JA pristak_UA intakt_storbiljett intakt_smabiljett andel_uttag elasticiteter_storbiljett elasticiteter_smabiljett enkel_app_justeringar prisforandring_smabiljett korrigering_smabiljett".split(" ")

DATA = "data\\"

for flik in FLIKAR:
    # OBS: nan finns i följande fyra flikar av misstag:
    # biljetter_JA
    # biljetter_UA
    # prisforandring_smabiljett
    # korrigering_smabiljett
    #sheet = pd.read_excel(DATA + "alla_indata_unmerged.xlsx",sheet_name = flik)
    sheet = pd.read_excel(DATA + "alla_indata.xlsx",sheet_name = flik)
    print()
    print(flik,sheet.shape)
    print(" ".join(sheet.columns.to_list()))
    print(sheet.values)
