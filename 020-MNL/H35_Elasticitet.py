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
        self.resandedata_UA_long.loc[:,'kostnad_UA'] = self.resandedata_UA_long['Ypred']*self.resandedata_UA_long['pris']
        
        #Skapar ny kolumn för unik identifiering av individer och deras kortval
        self.resandedata_JA_long.loc[:,'individpost'] = self.resandedata_JA_long['individ']+'-'+self.resandedata_JA_long['alt'].astype(str)
        self.resandedata_JA_long = self.resandedata_JA_long.set_index('individpost')
        self.resandedata_UA_long.loc[:,'individpost'] = self.resandedata_UA_long['individ']+'-'+self.resandedata_UA_long['alt'].astype(str)
        self.resandedata_UA_long = self.resandedata_UA_long.set_index('individpost')
        
        self.resandedata_JA_long = self.resandedata_JA_long[['kostnad_JA']]
        self.resandedata_long = pd.concat([self.resandedata_UA_long,self.resandedata_JA_long],ignore_index=False,axis=1).dropna() #För att lägga till kostnad_JA
        self.resandedata_long = self.resandedata_long.reset_index(drop=True)
        
        #Räknar ut förväntat pris per individ (vektor för kort format)
        self.resandedata_kostnad = self.resandedata_long.groupby(self.resandedata_long.individ).agg({'kostnad_JA':'sum','kostnad_UA':'sum','Antal_resor_per_manad':'first'})  #Utdata 21

    def Relativ_kostnad(self): #22
        #Prisförändringen UA mot JA räknas fram
        self.resandedata_kostnad.loc[:,'prisforandring'] = self.resandedata_kostnad['kostnad_UA']/self.resandedata_kostnad['kostnad_JA']-1  #Utdata 22 är förändring i kostnad : Kvot #13 och #21
        
    def Antal_resor(self): #23
        #Vikten per "individ" räknas ut och läggs till i resandedatans (kort format)
        self.resandedata_kostnad.loc[:,'vikt'] = 1+self.resandedata_kostnad['prisforandring']*(self.resandedata_kostnad[['prisforandring','Antal_resor_per_manad']].apply(lambda x: self.Elasticiteter(*x),axis=1)) #Ny vikt per individ: Nu representerar individen p individer (för p i weight)
        
        #För att överföra vikt till resandedata_long
        self.resandedata_long.loc[:,'vikt']=np.repeat(self.resandedata_kostnad.vikt,4).tolist()
        
        #Beräknar antal resenärer i resandedatan
        self.resandedata_long.loc[:,'antal_resenarer_UA'] = self.resandedata_long.Ypred*self.resandedata_long.vikt
        
    def Elasticiteter(self,prisf,resor):
        if resor > 62: resor = 62
        resor = int(resor)
        if prisf < -.3:
            return self.df_elast.iloc[resor-1,0]
        elif prisf < -.2:
            return self.df_elast.iloc[resor-1,1]
        elif prisf < -.1:
            return self.df_elast.iloc[resor-1,2]
        elif prisf < .0:
            return self.df_elast.iloc[resor-1,3]
        elif prisf < .1:
            return self.df_elast.iloc[resor-1,4]
        elif prisf < .2:
            return self.df_elast.iloc[resor-1,5]
        elif prisf < .3:
            return self.df_elast.iloc[resor-1,6]
        elif prisf > .3:
            return self.df_elast.iloc[resor-1,7]