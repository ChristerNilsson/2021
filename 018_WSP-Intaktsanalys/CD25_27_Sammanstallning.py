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
        rdl = self.resandedata_long
        #The predicted genomsnitt kostnad(inkl. moms) is attached as the last column
        rdl['kostnad_JA'] = rdl.Ypred * rdl.pris # task #13
        # the predicted Intäkter(exkl. moms) is attached as the last column
        rdl['okalibrerad_intakt_JA'] = rdl.kostnad_JA/1.06 #Utdata #13
    
    def totala_intakter(self,andel): #2.6
        rdl = self.resandedata_long
        # intäkter per biljettslag/produkttyp - 'alt'
        # Utdata task #14 per biljettslag nivå, Ypred är antal resenärer
        self.df_intakter = rdl[['okalibrerad_intakt_JA','Ypred','alt']].groupby(['alt']).sum()/andel

    def kalibreringsfaktorer(self,kalibreringsmal): #2.7
        ##summerar de två sista raderna (enkel_app och -_accesskort) och byter namn##
        summa_enkelbiljett = kalibreringsmal.iloc[3:].sum()[0]
        kalibreringsmal = kalibreringsmal.iloc[:3,:].copy() # eliminates mutation warning
        kalibreringsmal.loc['enkelbiljett',:] = summa_enkelbiljett
        
        ##Läser in skattad intäkt från intäktsberäkningen##
        self.kalibreringsfaktorer = self.df_intakter.copy()
        skf = self.kalibreringsfaktorer
        skf['antal_resenarer_JA'] = skf.Ypred.astype(int)
        skf.index = kalibreringsmal.index
        
        #Flyttar intäkt från månadsbiljett till enkelbiljett (de som köpt lågtrafikskort + enkelbiljetter i högtrafik)
        sdl = self.resandedata_long
        enkelintakt_manad = sum(sdl.loc[sdl.alt==1].okalibrerad_intakt_JA * sdl.loc[(sdl.alt==1)].andel_enkel)
        skf.loc['30d','okalibrerad_intakt_JA'] -= enkelintakt_manad
        skf.loc['enkelbiljett','okalibrerad_intakt_JA'] += enkelintakt_manad
        
        ##Beräknar kvot mellan aktuella intäkter och skattade intäkter för kalibreringsmålet##
        skf['kalibreringsmal'] = kalibreringsmal*10**3
        skf['intakt_JA'] = skf.kalibreringsmal
        skf['kalibreringsfaktor'] = skf.kalibreringsmal / skf.okalibrerad_intakt_JA
        
        #Kalibrerar intäkter i resandedatan
        kortval2kalibreringsfaktor = dict(zip(list(range(1,5)), skf.kalibreringsfaktor.tolist()))
        sdl['intakt_JA'] = sdl.alt.map(kortval2kalibreringsfaktor) * sdl.okalibrerad_intakt_JA #intäkt uppräknad med kalibreringsfaktorerna #26
        self.resandedata_long = sdl[sdl.columns.drop(['okalibrerad_intakt_JA'])]

        #Tar bort övriga kolumner
        self.kalibreringsfaktorer = skf[['intakt_JA', 'antal_resenarer_JA', 'kalibreringsfaktor']]
