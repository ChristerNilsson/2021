#!/usr/bin/env python
# coding: utf-8

# In[ ]:
import numpy as np
import pandas as pd

class Sannolikhet:
    def __init__(self,resandedata,ASCs=[]):
        self.ASCs = ASCs
        
        # paste initial parameter (endast i JA)
        if len(ASCs) != 0: #I UA är ASCs istället indata i justeringen
            resandedata['asc_LK']=self.ASCs[0]
            resandedata['asc_RES']=self.ASCs[1]
            resandedata['asc_ENK']=self.ASCs[2]
            resandedata['param_kostnad']=self.ASCs[3]
        
        self.resandedata = resandedata[['ID','CardKey','TicketSerialNumber','SalesProductName','Antal_resor_per_manad','Antal_resor_per_manad_under_rusningstid','Antal_resor_per_manad_under_lagtrafik','individ','kortval','andel_enkel','P_MK','P_LK','P_RES','P_ENK','asc_LK','asc_RES','asc_ENK','param_kostnad']].copy()
            #enbart nödvändiga kolumner bevaras
        
        self.snl()
        self.resandedata_long = self.utdata_long()
    
    def snl(self):
        #räknar utility med justerad parameter
        self.resandedata['U_MK']=(self.resandedata['P_MK']*self.resandedata['param_kostnad'])
        self.resandedata['U_LK']=(self.resandedata['asc_LK']+self.resandedata['P_LK']*self.resandedata['param_kostnad'])
        self.resandedata['U_RES']=(self.resandedata['asc_RES']+self.resandedata['P_RES']*self.resandedata['param_kostnad'])
        self.resandedata['U_ENK']=(self.resandedata['asc_ENK']+self.resandedata['P_ENK']*self.resandedata['param_kostnad'])
        #räknar probability 
        self.resandedata['Pb_MK']=(np.exp(self.resandedata['U_MK'])/(np.exp(self.resandedata['U_MK'])+np.exp(self.resandedata['U_LK'])+np.exp(self.resandedata['U_RES'])+np.exp(self.resandedata['U_ENK'])))
        self.resandedata['Pb_LK']=np.exp(self.resandedata['U_LK'])/(np.exp(self.resandedata['U_MK'])+np.exp(self.resandedata['U_LK'])+np.exp(self.resandedata['U_RES'])+np.exp(self.resandedata['U_ENK']))
        self.resandedata['Pb_RES']=np.exp(self.resandedata['U_RES'])/(np.exp(self.resandedata['U_MK'])+np.exp(self.resandedata['U_LK'])+np.exp(self.resandedata['U_RES'])+np.exp(self.resandedata['U_ENK']))
        self.resandedata['Pb_ENK']=np.exp(self.resandedata['U_ENK'])/(np.exp(self.resandedata['U_MK'])+np.exp(self.resandedata['U_LK'])+np.exp(self.resandedata['U_RES'])+np.exp(self.resandedata['U_ENK']))

        #kortval efter omräkning av probability
        kortval_just=pd.DataFrame({1:self.resandedata['Pb_MK'],2:self.resandedata['Pb_LK'],3:self.resandedata['Pb_RES'],4:self.resandedata['Pb_ENK']})
        self.resandedata['kortval_just']=kortval_just.idxmax(axis="columns")
    
    #att skapar lång data till genomsnittlig kostnad beräkning #21 liknande från A. 
    def utdata_long(self):
        utdata_long=self.resandedata.append([self.resandedata]*3,ignore_index=True).sort_values('individ').reset_index(drop=True) #Skapar lång dataframe
        utdata_long['val']=0
        utdata_long['alt']=0
        utdata_long.alt = np.arange(len(utdata_long)) % 4 + 1 #Namnger alternativ 1, 2, 3, 4
        utdata_long.loc[utdata_long.kortval_just==utdata_long.alt, 'val'] = 1 #väljer de alternativ som stämmer med korrigerad kortval
        #utdata_long = utdata_long.drop(columns = ['kortval'])
        utdata_long['pris']=0
        utdata_long['Ypred']=0
        alt2price = {1:'P_MK',2:'P_LK',3:'P_RES',4:'P_ENK'}
        alt2prb = {1:'Pb_MK',2:'Pb_LK',3:'Pb_RES',4:'Pb_ENK'}
        alt2prodName = {1:'30-dagars',2:'Langperiod',3:'Reskassa',4:'Enkelbiljett'}
        alt2andel_enkel = {2:0,3:0,4:1}
        for alt in alt2price:
            utdata_long.loc[utdata_long.alt==alt, 'pris'] = utdata_long[alt2price[alt]] #Lägger till motsvarande pris till kortval
            utdata_long.loc[utdata_long.alt==alt, 'Ypred'] = utdata_long[alt2prb[alt]] #Lägger till motsvarande probability till kortval
            utdata_long.loc[utdata_long.alt==alt, 'SalesProductName'] = alt2prodName[alt] #Lägger till korrekt produktnamn utifrån kortval
            if alt !=1:
                utdata_long.loc[utdata_long.alt==alt, 'andel_enkel'] = alt2andel_enkel[alt] #För fraktioner som representerar långperiodkort, eller reskassa (”alt”=2 eller ”alt”=3) är värdet alltid 0 För fraktioner som representerar enkelbiljetter (”alt”=4) är värdet alltid 1
        return utdata_long.drop(['U_MK','U_LK','U_RES','U_ENK','P_ENK','P_MK','P_LK','P_RES','Pb_ENK','Pb_MK','Pb_LK','Pb_RES','Pb_ENK'], 1)

