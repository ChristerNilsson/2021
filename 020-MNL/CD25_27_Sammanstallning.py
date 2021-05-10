#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
import numpy as np

class Sammanstallning:
    def __init__(self,resandedata_long):
        self.resandedata_long = resandedata_long
        self.df_intakter = pd.DataFrame()
        
    def forvantad_kostnad_intakt(self): #2.5
        #The predicted genomsnitt kostnad(inkl. moms) is attached as the last column
        self.resandedata_long['kostnad_JA'] = self.resandedata_long['Ypred']*self.resandedata_long['pris'] # task #13
        # the predicted Intäkter(exkl. moms) is attached as the last column
        self.resandedata_long['okalibrerad_intakt_JA'] = self.resandedata_long['kostnad_JA']/1.06 #Utdata #13
    
    def totala_intakter(self,andel): #2.6
        # intäkter per biljettslag/produkttyp - 'alt'
        self.df_intakter = self.resandedata_long[['okalibrerad_intakt_JA','Ypred','alt']].groupby(['alt']).sum()/andel #Utdata task #14 per biljettslag nivå, Ypred är antal resenärer
        
    def kalibreringsfaktorer(self,kalibreringsmal): #2.7
        ##summerar de två sista raderna (enkel_app och -_accesskort) och byter namn##
        summa_enkelbiljett = kalibreringsmal.iloc[3:].sum()[0]
        kalibreringsmal = kalibreringsmal.iloc[:3,:].copy()
        kalibreringsmal.loc['enkelbiljett',:] = summa_enkelbiljett
        
        ##Läser in skattad intäkt från intäktsberäkningen##
        self.kalibreringsfaktorer = self.df_intakter.copy()
        self.kalibreringsfaktorer['antal_resenarer_JA'] = self.kalibreringsfaktorer.Ypred.astype(int)
        self.kalibreringsfaktorer.index = kalibreringsmal.index
        
        #Flyttar intäkt från månadsbiljett till enkelbiljett (de som köpt lågtrafikskort + enkelbiljetter i högtrafik)
        enkelintakt_manad = sum((self.resandedata_long.loc[(self.resandedata_long.alt==1)].okalibrerad_intakt_JA)*(self.resandedata_long.loc[(self.resandedata_long.alt==1)].andel_enkel))
        self.kalibreringsfaktorer.loc['30d','okalibrerad_intakt_JA']-=enkelintakt_manad
        self.kalibreringsfaktorer.loc['enkelbiljett','okalibrerad_intakt_JA']+=enkelintakt_manad
        
        ##Beräknar kvot mellan aktuella intäkter och skattade intäkter för kalibreringsmålet##
        self.kalibreringsfaktorer['kalibreringsmal'] = kalibreringsmal*10**3
        self.kalibreringsfaktorer['intakt_JA'] = self.kalibreringsfaktorer['kalibreringsmal']
        self.kalibreringsfaktorer['kalibreringsfaktor'] = (self.kalibreringsfaktorer['kalibreringsmal'])/(self.kalibreringsfaktorer)['okalibrerad_intakt_JA']
        
        #Kalibrerar intäkter i resandedatan
        kortval2kalibreringsfaktor = dict(zip(list(range(1,5)), self.kalibreringsfaktorer['kalibreringsfaktor'].tolist()))
        self.resandedata_long.loc[:,'intakt_JA'] = self.resandedata_long['alt'].map(kortval2kalibreringsfaktor)*self.resandedata_long['okalibrerad_intakt_JA'] #intäkt uppräknad med kalibreringsfaktorerna #26
        self.resandedata_long = self.resandedata_long[self.resandedata_long.columns.drop(['okalibrerad_intakt_JA'])]
        
        
        
        #Tar bort övriga kolumner
        self.kalibreringsfaktorer = self.kalibreringsfaktorer[['intakt_JA', 'antal_resenarer_JA', 'kalibreringsfaktor']]