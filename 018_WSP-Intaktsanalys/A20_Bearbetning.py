#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
# import numpy as np
# import pickle
# import sys
import time


# In[2]:


#Indata:
    #2 Resmönsterfil (individer och deras resebeteende; olika beroende på hur lång giltighet en resa anses ha)
#Metod:
    #Bearbetar resandedatan (gör enklare kontroller och ändrar strukturen)
#Utdata:
    #7 i JA och #16 i UA - Bearbetad resandedatafil för UA

class Bearbetning:
    def __init__(self, resmonsterfil, inkludera_manader=False):
        print("Reading",resmonsterfil)
        start = time.time()
        self.resmonsterfil = resmonsterfil
        #Initierar attribut
        self.all_data = pd.DataFrame()
        self.hp = pd.DataFrame()
        self.rp = pd.DataFrame()
        #Kör datahanteringen
        self.importera_data()
        self.indatakontroll()
        self.bearbeta_resandedata(inkludera_manader)
        self.dela_upp_alder()
        print(" CPU:",time.time()-start)

    def importera_data(self):
        #Importerar resandedata
        self.all_data = pd.read_csv(self.resmonsterfil,parse_dates=['DatumFörstaBlipp','DatumSistaBlipp'])
        sad = self.all_data
        print(sad.shape)

        #self.all_data = self.all_data.iloc[:-1] #removing last row because it's empty

        sad['individ'] = sad['CardKey'].astype(int).astype(str)
        sad['individ'] += '-' + sad['TicketSerialNumber'].astype(int).astype(str)
        sad['individ'] += '-' + sad['SalesProductName'] #skapar unikt individ-ID baserat på ID och TicketSerialNumber

        sad.dropna(inplace = True); #tar bort alla NaN (Bara för felsäkerhet)
        print(sad.shape)
    
    def indatakontroll(self):
        #Byter ut å,ä,ö
        #self.all_data = self.all_data.replace({ 'ö' : 'o', 'å' : 'a', 'ä' : 'a' , 'Ö' : 'O' , 'Ä' : 'A' , 'Å' : 'A' }, regex=True); #I datan
        self.all_data.replace({ 'ö' : 'o', 'å' : 'a', 'ä' : 'a' , 'Ö' : 'O' , 'Ä' : 'A' , 'Å' : 'A' }, inplace=True, regex=True); #I datan
        self.all_data.columns = [c.replace('ö', 'o').replace('ä', 'a').replace('å', 'a').replace('Ö', 'O').replace('Ä', 'A').replace('Å', 'A').replace(' ', '_') for c in self.all_data.columns.tolist()]; #I kolumnhuvuden0
        #Hanterar kolumn 10-99 som anger antal resor per dag och period på dygnet
        #kolumner=self.all_data.columns.tolist()
        #startkol=kolumner.index('10')
        #Felkontroll: För att avgöra om det är dagarna med antal resor i rusningstid eller antal resor i lågtrafik som kommer först
        kolumner = self.all_data.columns.tolist()
        startkol = kolumner.index('10')
        if len(self.all_data[self.all_data.loc[:,kolumner[startkol+30]:kolumner[startkol+59]].sum(1)!=self.all_data.Antal_resor_per_manad_under_lagtrafik]) < len(self.all_data[self.all_data.loc[:,kolumner[startkol+30]:kolumner[startkol+59]].sum(1)!=self.all_data.Antal_resor_per_manad_under_rusningstid]):
            first="lag"
            second="rus"
        else:
            first="rus"
            second="lag"
        #Byter namn på kolumn 10-99
        for t in range(30):
            kolumner[t+startkol] = str('_'.join(["antalresor","dag",str(t+1)]))
            kolumner[t+startkol+30] = str('_'.join(["antalresor",first,"dag",str(t+1)]))
            kolumner[t+startkol+60] = str('_'.join(["antalresor",second,"dag",str(t+1)]))
        self.all_data.columns = kolumner
        #Felaktig indata

    def skapaUrval(self,urval,msg):
        antal = len(self.all_data[~urval])
        if antal == 0: return
        print(f" {antal} rad(er) plockas bort på grund av " + msg)
        self.all_data = self.all_data[urval]

    def bearbeta_resandedata(self,inkludera_manader):
        if inkludera_manader:
            # Filtrera bort de med 0 resor per månad och som började gälla utanför rätt period
            self.skapaUrval(self.all_data.DatumForstaBlipp.dt.month.isin(inkludera_manader), "att de ligger utanför perioden.")
        self.skapaUrval(self.all_data.Antal_resor_per_manad != 0, "noll antal resor per månad.")
        #Rader där antal resor per månad och summerat antal resor på 30 dagar inte överensstämmer plockas bort
        self.skapaUrval(self.all_data.loc[:,"antalresor_dag_1"    : "antalresor_dag_30"].sum(1) == self.all_data.Antal_resor_per_manad,"fel antal resor per månad.")
        self.skapaUrval(self.all_data.loc[:,"antalresor_rus_dag_1": "antalresor_rus_dag_30"].sum(1) == self.all_data.Antal_resor_per_manad_under_rusningstid,"fel antal resor per månad under rusningstid.")
        self.skapaUrval(self.all_data.loc[:,"antalresor_lag_dag_1": "antalresor_lag_dag_30"].sum(1) == self.all_data.Antal_resor_per_manad_under_lagtrafik,"fel antal resor per månad under lågtrafik.")

        #Kortval definieras beroende på typ av biljett
        sad = self.all_data
        sad['kortval'] = None
        name = sad.SalesProductName
        sad.loc[name.str.startswith('30'), 'kortval'] = 1
        sad.loc[name.str.startswith('90') | name.str.startswith('Ars'), 'kortval'] = 2
        sad.loc[name.str.startswith('Reskassa'), 'kortval'] = 3
        sad.loc[name.str.startswith('Enkelbiljett') | (name.str in ["RAB","VUX"]), 'kortval'] = 4

        #Nedan följer felmeddelande om något gått snett:
        if len(sad[sad.kortval.isna()])>0: Warning(str(len(sad[sad.kortval.isna()].SalesProductName.unique()))+" biljettyp(er) är inte definierad(e). Var god uppdatera koden!")

        #Korrigerar SalesProductPriceRange så att den stämmer (den var tidigare "övrig")
        sad.loc[sad.SalesProductName== "Reskassa rabatterad", 'SalesProductPriceRange'] = "Rabatterad"
        sad.loc[self.all_data.SalesProductName== "Reskassa vuxen", 'SalesProductPriceRange'] = "Vuxen"

        print(sad.shape)
        self.all_data = sad

    def dela_upp_alder(self):
        #Delar upp datan mellan vuxen och rabatterad
        self.hp = self.all_data[self.all_data.SalesProductPriceRange == 'Vuxen'].reset_index(drop=True)
        self.rp = self.all_data[self.all_data.SalesProductPriceRange == 'Rabatterad'].reset_index(drop=True)
        self.hp['id'] = range(1,len(self.hp)+1)
        self.rp['id'] = range(1,len(self.rp)+1)
