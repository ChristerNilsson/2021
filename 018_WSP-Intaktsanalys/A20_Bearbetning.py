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
        self.all_data=pd.read_csv(self.resmonsterfil,parse_dates=['DatumFörstaBlipp','DatumSistaBlipp'])
        self.all_data = self.all_data.iloc[:-1] #removing last row because it's empty
        self.all_data.loc[:,'individ']=self.all_data['CardKey'].astype(int).astype(str)+'-'+self.all_data['TicketSerialNumber'].astype(int).astype(str)+'-'+self.all_data['SalesProductName'] #skapar unikt individ-ID baserat på ID och TicketSerialNumber
        self.all_data=self.all_data.dropna(); #tar bort alla NaN (Bara för felsäkerhet)
    
    def indatakontroll(self):
        #Byter ut å,ä,ö
        #self.all_data = self.all_data.replace({ 'ö' : 'o', 'å' : 'a', 'ä' : 'a' , 'Ö' : 'O' , 'Ä' : 'A' , 'Å' : 'A' }, regex=True); #I datan
        self.all_data.replace({ 'ö' : 'o', 'å' : 'a', 'ä' : 'a' , 'Ö' : 'O' , 'Ä' : 'A' , 'Å' : 'A' }, inplace=True, regex=True); #I datan
        self.all_data.columns = [c.replace('ö', 'o').replace('ä', 'a').replace('å', 'a').replace('Ö', 'O').replace('Ä', 'A').replace('Å', 'A').replace(' ', '_') for c in self.all_data.columns.tolist()]; #I kolumnhuvuden0
        #Hanterar kolumn 10-99 som anger antal resor per dag och period på dygnet
        kolumner=self.all_data.columns.tolist()
        startkol=kolumner.index('10')
        #Felkontroll: För att avgöra om det är dagarna med antal resor i rusningstid eller antal resor i lågtrafik som kommer först
        kolumner=self.all_data.columns.tolist()
        startkol=kolumner.index('10')
        if len(self.all_data[self.all_data.loc[:,kolumner[startkol+30]:kolumner[startkol+59]].sum(1)!=self.all_data.Antal_resor_per_manad_under_lagtrafik]) < len(self.all_data[self.all_data.loc[:,kolumner[startkol+30]:kolumner[startkol+59]].sum(1)!=self.all_data.Antal_resor_per_manad_under_rusningstid]):
            first="lag"
            second="rus"
        else:
            first="rus"
            second="lag"
        #Byter namn på kolumn 10-99
        for t in range(30):
            kolumner[t+startkol]=str('_'.join(["antalresor","dag",str(t+1)]))
            kolumner[t+startkol+30]=str('_'.join(["antalresor",first,"dag",str(t+1)]))
            kolumner[t+startkol+60]=str('_'.join(["antalresor",second,"dag",str(t+1)]))
        self.all_data.columns=kolumner
        #Felaktig indata
        
    def bearbeta_resandedata(self,inkludera_manader):
        #Filtrera bort de med 0 resor per månad och som började gälla utanför rätt period
        if inkludera_manader:

            antal = len(self.all_data[~(self.all_data.DatumForstaBlipp.dt.month.isin(inkludera_manader))])
            print(f" {antal} rad(er) plockas bort på grund av att de ligger utanför perioden.")
            self.all_data = self.all_data[(self.all_data.DatumForstaBlipp.dt.month.isin(inkludera_manader))]

        antal = len(self.all_data[(self.all_data.Antal_resor_per_manad == 0)])
        print(f" {antal} rad(er) plockas bort på grund av 0 antal resor per månad.")
        self.all_data = self.all_data[(self.all_data.Antal_resor_per_manad != 0)]
        #Rader där antal resor per månad och summerat antal resor på 30 dagar inte överensstämmer plockas bort

        antal = len(self.all_data[self.all_data.loc[:,"antalresor_dag_1":"antalresor_dag_30"].sum(1)!=self.all_data.Antal_resor_per_manad])
        print(f" {antal} rad(er) plockas bort på grund av fel antal resor per månad.")

        antal = len(self.all_data[self.all_data.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"].sum(1)!=self.all_data.Antal_resor_per_manad_under_rusningstid])
        print(str()+f" {antal} rad(er) plockas bort på grund av fel antal resor per månad under rusningstid.")

        antal = len(self.all_data[self.all_data.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].sum(1)!=self.all_data.Antal_resor_per_manad_under_lagtrafik])
        print(f" {antal} rad(er) plockas bort på grund av fel antal resor per månad under lågtrafik.")
        self.all_data=self.all_data[(self.all_data.loc[:,"antalresor_dag_1":"antalresor_dag_30"].sum(1)==self.all_data.Antal_resor_per_manad)&
                (self.all_data.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"].sum(1)==self.all_data.Antal_resor_per_manad_under_rusningstid)&
                (self.all_data.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].sum(1)==self.all_data.Antal_resor_per_manad_under_lagtrafik)]
        #Kortval definieras beroende på typ av biljett
        self.all_data['kortval'] = None
        self.all_data.loc[self.all_data.SalesProductName.str.startswith('30'), 'kortval'] = 1
        self.all_data.loc[self.all_data.SalesProductName.str.startswith('90')|self.all_data.SalesProductName.str.startswith('Ars'), 'kortval'] = 2
        self.all_data.loc[self.all_data.SalesProductName.str.startswith('Reskassa'), 'kortval'] = 3
        self.all_data.loc[self.all_data.SalesProductName.str.startswith('Enkelbiljett')|(self.all_data.SalesProductName=="RAB")|(self.all_data.SalesProductName=="VUX"), 'kortval'] = 4
        #Nedan följer felmeddelande om något gått snett:
        if len(self.all_data[self.all_data.kortval.isna()])>0: Warning(str(len(self.all_data[self.all_data.kortval.isna()].SalesProductName.unique()))+" biljettyp(er) är inte definierad(e). Var god uppdatera koden!")
        #Korrigerar SalesProductPriceRange så att den stämmer (den var tidigare "övrig")
        self.all_data.loc[self.all_data.SalesProductName== "Reskassa rabatterad", 'SalesProductPriceRange'] = "Rabatterad"
        self.all_data.loc[self.all_data.SalesProductName== "Reskassa vuxen", 'SalesProductPriceRange'] = "Vuxen"
        
    def dela_upp_alder(self):
        #Delar upp datan mellan vuxen och rabatterad
        self.hp = self.all_data[self.all_data.SalesProductPriceRange == 'Vuxen'].reset_index(drop=True)
        self.rp = self.all_data[self.all_data.SalesProductPriceRange == 'Rabatterad'].reset_index(drop=True)
        self.hp['id']=range(1,len(self.hp)+1)
        self.rp['id']=range(1,len(self.rp)+1)

