import numpy as np
import pandas as pd

class Smabiljetter:
    def __init__(self,df_elast,df_prisf,df_efterfr,df_korr):
        self.df_elast = df_elast
        self.df = pd.concat([df_efterfr,df_prisf,df_korr]).transpose()
        kategorier = ['turist','skol-fritid','ovriga']
        
        for kat in kategorier:
            self.df['Elasticitet_'+kat] = self.df['Prisforandring_'+kat].map(self.Elasticiteter)
            self.df['Intakt_UA_'+kat] = (self.df['Intakt_JA_'+kat]*(1+self.df['Prisforandring_'+kat])*(1+self.df['Elasticitet_'+kat])*self.df['Korrigering_'+kat]).astype(int)
            
        #Sparar som dataram
        self.df = self.df.loc[:,self.df.columns.str.startswith('Intakt')].astype(int)
        self.JA = self.df.loc[:,self.df.columns.str.startswith('Intakt_JA')].astype(int)
        self.UA = self.df.loc[:,self.df.columns.str.startswith('Intakt_UA')]
        
        #Nytt format på df enl Sopra Sterias önskemål:
        hp=self.UA.T.Vuxen.values
        rp=self.UA.T.Rabatterad.values
        UA=np.concatenate((hp,rp))
        hp=self.JA.T.Vuxen.values
        rp=self.JA.T.Rabatterad.values
        JA=np.concatenate((hp,rp))
        self.df=pd.DataFrame({'intakt_JA':JA,'intakt_UA':UA,'is_hp':[1]*3+[0]*3})
        self.df.index=['turist','skol-fritid','ovriga']*2
        
        
    
    def Elasticiteter(self,prisf):
        if prisf < -.3:
            return self.df_elast.iloc[0,0]
        elif prisf < -.2:
            return self.df_elast.iloc[0,1]
        elif prisf < -.1:
            return self.df_elast.iloc[0,2]
        elif prisf < .0:
            return self.df_elast.iloc[0,3]
        elif prisf < .1:
            return self.df_elast.iloc[0,4]
        elif prisf < .2:
            return self.df_elast.iloc[0,5]
        elif prisf < .3:
            return self.df_elast.iloc[0,6]
        elif prisf > .3:
            return self.df_elast.iloc[0,7]