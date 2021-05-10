import numpy as np
import pandas as pd

class Smabiljetter:
    def __init__(self,df_elast,df_prisf,df_efterfr,df_korr):
        self.df_elast = df_elast
        self.df = pd.concat([df_efterfr,df_prisf,df_korr]).transpose()
        kategorier = ['turist','skol-fritid','ovriga']
        
        for kat in kategorier:
            self.df['Elasticitet_'+kat] = self.df['Prisforandring_'+kat].map(self.Elasticiteter)
            a = self.df['Intakt_JA_'+kat]
            b = self.df['Prisforandring_'+kat] + 1
            c = self.df['Elasticitet_'+kat] + 1
            self.df['Intakt_UA_'+kat] = (a * b * c * self.df['Korrigering_'+kat]).astype(int)
            
        #Sparar som dataram
        self.df = self.df.loc[:,self.df.columns.str.startswith('Intakt')].astype(int)
        self.JA = self.df.loc[:,self.df.columns.str.startswith('Intakt_JA')].astype(int)
        self.UA = self.df.loc[:,self.df.columns.str.startswith('Intakt_UA')]
        
        #Nytt format på df enl Sopra Sterias önskemål:
        hp = self.UA.T.Vuxen.values
        rp = self.UA.T.Rabatterad.values
        UA = np.concatenate((hp,rp))
        hp = self.JA.T.Vuxen.values
        rp = self.JA.T.Rabatterad.values
        JA = np.concatenate((hp,rp))
        self.df = pd.DataFrame({'intakt_JA':JA,'intakt_UA':UA,'is_hp':[1]*3+[0]*3})
        self.df.index = ['turist','skol-fritid','ovriga']*2

    def Elasticiteter(self,prisf):
        if prisf < -.3: index = 0
        elif prisf < -.2: index = 1
        elif prisf < -.1: index = 2
        elif prisf < .0: index = 3
        elif prisf < .1:index = 4
        elif prisf < .2:index = 5
        elif prisf < .3:index = 6
        else: index = 7
        return self.df_elast.iloc[0,index]
