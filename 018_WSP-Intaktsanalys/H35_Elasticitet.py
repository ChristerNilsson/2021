import pandas as pd
import numpy as np

class Elasticitet:
    def __init__(self, resandedata_JA_long, resandedata_UA_long, df_elast):
        self.df_elast  = df_elast
        self.resandedata_JA_long = resandedata_JA_long[['individ','alt','kostnad_JA']].copy() #Behöver bara dessa kolumner
        self.resandedata_UA_long = resandedata_UA_long
        
        self.Forvantad_kostnad()
        self.Relativ_kostnad()
        self.Antal_resor()
        
    def Forvantad_kostnad(self): #21
        rdUA = self.resandedata_UA_long
        rdJA = self.resandedata_JA_long
        rdUA['kostnad_UA'] = rdUA.Ypred * rdUA.pris
        
        #Skapar ny kolumn för unik identifiering av individer och deras kortval
        rdJA['individpost'] = rdJA.individ + '-' + rdJA.alt.astype(str)
        rdUA['individpost'] = rdUA.individ + '-' + rdUA.alt.astype(str)
        rdJA.set_index('individpost', inplace = True)
        rdUA.set_index('individpost', inplace = True)
        
        self.resandedata_JA_long = self.resandedata_JA_long[['kostnad_JA']]
        rdJA = self.resandedata_JA_long
        self.resandedata_long = pd.concat([rdUA,rdJA],ignore_index=False,axis=1).dropna() #För att lägga till kostnad_JA
        self.resandedata_long.reset_index(drop=True, inplace=True)

        rdl = self.resandedata_long
        #Räknar ut förväntat pris per individ (vektor för kort format)
        self.resandedata_kostnad = rdl.groupby(rdl.individ).agg({'kostnad_JA':'sum','kostnad_UA':'sum','Antal_resor_per_manad':'first'})  #Utdata 21

    def Relativ_kostnad(self): #22
        #Prisförändringen UA mot JA räknas fram
        rdk = self.resandedata_kostnad
        rdk['prisforandring'] = rdk.kostnad_UA / rdk.kostnad_JA - 1  #Utdata 22 är förändring i kostnad : Kvot #13 och #21

    def Antal_resor(self): #23
        #Vikten per "individ" räknas ut och läggs till i resandedatans (kort format)
        rdk = self.resandedata_kostnad
        rdl = self.resandedata_long

        # Ny vikt per individ: Nu representerar individen p individer (för p i weight)
        rdk['vikt'] = 1 + rdk.prisforandring * (rdk[['prisforandring','Antal_resor_per_manad']].apply(lambda x: self.Elasticiteter(*x),axis=1))

        #För att överföra vikt till resandedata_long
        rdl['vikt'] = np.repeat(rdk.vikt,4).tolist()
        
        #Beräknar antal resenärer i resandedatan
        rdl['antal_resenarer_UA'] = rdl.Ypred * rdl.vikt
        
    def Elasticiteter(self,prisf,resor):
        if resor > 62: resor = 62
        resor = int(resor)
        if prisf < -.3: index = 0
        elif prisf < -.2: index = 1
        elif prisf < -.1: index = 2
        elif prisf < .0: index = 3
        elif prisf < .1: index = 4
        elif prisf < .2: index = 5
        elif prisf < .3: index = 6
        else: index = 7
        return self.df_elast.iloc[resor - 1, index]
