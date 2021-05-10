#!/usr/bin/env python
# coding: utf-8

# In[ ]:
# import numpy as np
# import pandas as pd

class Justering:
    def __init__(self,ASCs,resandedata,pristak_JA,pristak_UA,biljetter):
        self.ASCs = ASCs
        self.resandedata = resandedata
        
        pristak_res_JA = pristak_JA.loc['Reskassa','Pristak_per_manad_dummy']
        pristak_enk_JA = pristak_JA.loc['Enkel','Pristak_per_manad_dummy']
        pristak_res_UA = pristak_UA.loc['Reskassa','Pristak_per_manad_dummy']
        pristak_enk_UA = pristak_UA.loc['Enkel','Pristak_per_manad_dummy']
        
        # paste initial parameter 
        self.resandedata['asc_LK'] = self.ASCs[0]
        self.resandedata['asc_RES'] = self.ASCs[1]
        self.resandedata['asc_ENK'] = self.ASCs[2]
        self.resandedata['param_kostnad'] = self.ASCs[3]
        
        #Bara om JA pristak_per manad ar 0 och UA pristak_per manad ar 1 ska konstant for reskassa justeras
        if (pristak_res_JA == 0) & (pristak_res_UA == 1):
            self.justera_konstant('Reskassa',biljetter,pristak_UA)
        if (pristak_enk_JA == 0) & (pristak_enk_UA == 1):
            self.justera_konstant('Enkel',biljetter,pristak_UA)

    def justera_konstant(self,enkelbiljettyp,biljetter,pristak_UA): #19
        baspris_30dagar = biljetter.loc['30_dagar','Baspris']
        pristak_per_manad = pristak_UA.loc[enkelbiljettyp,'Pristak_per_manad']
        pristak_kvot = 1.0 * pristak_per_manad/baspris_30dagar
        pristak_frek = 1.0 * pristak_per_manad/biljetter.loc[enkelbiljettyp,'Baspris']
        #exponentiell parameter för kontrollering riskpremien förändring 
        s = 2
        #parameter för kontrollering justerade reskassa konstant ska vara
        if enkelbiljettyp == "Reskassa":
            r = 2
            asc = 'asc_RES'
        else:
            r = 2 * (7.5 * biljetter.loc['Enkel','Baspris']/biljetter.loc['Reskassa','Baspris'] - 6.5)
            asc = 'asc_ENK'
        #justera reskassa konstant för varje individ beror på sitt antal resor per manad f=utdata_wide_vuxen.Antal_resor_per_manad
        srd = self.resandedata
        srd.loc[srd['Antal_resor_per_manad'] < pristak_frek,asc] += ((1-pristak_kvot) * r - srd.loc[srd['Antal_resor_per_manad'] < pristak_frek,asc])*((1.0*srd.loc[srd['Antal_resor_per_manad'] < pristak_frek,'Antal_resor_per_manad']/pristak_frek)**s)
        srd.loc[srd['Antal_resor_per_manad'] >= pristak_frek,asc] = (1-pristak_kvot) * r
