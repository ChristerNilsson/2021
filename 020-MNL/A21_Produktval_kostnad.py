#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import pickle
import sys


# In[25]:


#Indata:
    #7 i JA eller #16 i UA - Bearbetad resandedatafil
    #3 i JA eller #4 i UA - Produktkatalog som definierar priser och pristaksparametrer
#Metod:
    #Räknar ut lägsta pris per månad för respektive produktval och individ
#Utdata:
    #9 i JA eller 17 i UA - Tabeller över kostnad/månad per individ för varje biljettslag
    #10 i JA eller 18 i UA - Lång tabeller över kostnad/månad per individ och biljettslag
    
class Produktval_kostnad:
    def __init__(self, resandedata, pristak, biljetter):
        self.resandedata = resandedata.copy()
        self.pristak = pristak
        self.biljetter = biljetter
        #Kör datahanteringen och räknar ut lägsta pris per biljettslag
        self.indatakontroll()
        self.bearbeta_anvandarindata()
        self.kostnadsberäkning()
    
    def definiera_biljettattribut(self):
        #Räknar ut andelen i kortval 2 som väljer 90-dagar framför årsbiljett
        andel_90=1.0*len(self.resandedata[(self.resandedata.SalesProductName.str.startswith('90'))]) /             len(self.resandedata[(self.resandedata.kortval==2)])
        #Definiera följande för HT och LT:
        lagsta_pris = {'Baspris' : min(self.biljetter.loc['Reskassa','Baspris'],self.biljetter.loc['Enkel','Baspris']),
                             'Lagpris' : min(self.biljetter.loc['Reskassa','Lagpris'],self.biljetter.loc['Enkel','Lagpris']),
                             'Pristak_per_dag' : min(self.pristak.loc['Reskassa','Pristak_per_dag']*self.pristak.loc['Reskassa','Lagsta_pris_faktor_dag'],self.pristak.loc['Enkel','Pristak_per_dag']*self.pristak.loc['Enkel','Lagsta_pris_faktor_dag']),
                             'Pristak_per_manad' : min(self.pristak.loc['Reskassa','Pristak_per_manad']*self.pristak.loc['Reskassa','Lagsta_pris_faktor_manad'],self.pristak.loc['Enkel','Pristak_per_manad']*self.pristak.loc['Enkel','Lagsta_pris_faktor_manad'])}
        return andel_90,lagsta_pris

    def indatakontroll(self):
        #Felaktig indata
        urval = self.biljetter.loc[(self.biljetter['Bred_lagtrafiksbiljett_dummy'] == 1) & (self.biljetter['Smal_lagtrafiksbiljett_dummy'] == 1)]
        if len(urval) > 0:
            print("Felaktig indata. Båda lågtrafiksdummierna kan inte vara aktiverade för samma biljettyp:")
            for biljettyp in urval.index.to_list():
                print(biljettyp)
            sys.exit("Programmet avbryts")
        
    def bearbeta_anvandarindata(self):
        #Kopierar över dummy-variabel från 90_dagar till Ars
        self.biljetter.loc['Ars',['Lagtrafiksprisfaktor','Bred_lagtrafiksbiljett_dummy','Smal_lagtrafiksbiljett_dummy']]=self.biljetter.loc['90_dagar',['Lagtrafiksprisfaktor','Bred_lagtrafiksbiljett_dummy','Smal_lagtrafiksbiljett_dummy']].rename(index={'90_dagar':'Ars'})
        #Om ingen lågtrafiksdummy är aktiverad sätts lågtrafiksprisfaktorn till 1
        self.biljetter.loc[(self.biljetter['Bred_lagtrafiksbiljett_dummy'] == 0) & (self.biljetter['Smal_lagtrafiksbiljett_dummy'] == 0),'Lagtrafiksprisfaktor']=1
        #Kompletterar prisinformaitonen med kostnad för olika perioder av dagen
        self.biljetter.loc[:,'Lagpris']=self.biljetter['Baspris']*self.biljetter['Lagtrafiksprisfaktor']
        #Skapar en faktor som är 1 om dummyn är 1 och inf om dummyn är 0. Detta behövs till Kostnad.py-skriptet för att pristaket ska bli oändligt om pristaket inte är aktiverat.
        self.pristak.loc[:,'Lagsta_pris_faktor_dag']=((1-self.pristak.Pristak_per_dag_dummy)*np.inf).fillna(1)
        self.pristak.loc[:,'Lagsta_pris_faktor_manad']=((1-self.pristak.Pristak_per_manad_dummy)*np.inf).fillna(1)
        #Pristak får inte vara 0 för den ska multipliceras med inf senare
        self.pristak.loc[self.pristak['Pristak_per_manad_dummy']==0,'Pristak_per_manad']=1
        self.pristak.loc[self.pristak['Pristak_per_dag_dummy']==0,'Pristak_per_dag']=1
    
    #Räknar ut lägsta pris för månadsbiljetter
    def kostnad_MK(self,lagsta_pris):
        bred = self.biljetter.loc['30_dagar','Bred_lagtrafiksbiljett_dummy']
        smal = self.biljetter.loc['30_dagar','Smal_lagtrafiksbiljett_dummy']
        pristak_per_manad = self.pristak.loc['Reskassa','Pristak_per_manad_dummy']+self.pristak.loc['Enkel','Pristak_per_manad_dummy'] #Räcker att minst en är aktiverad
        pristak_per_dag = self.pristak.loc['Reskassa','Pristak_per_dag_dummy']+self.pristak.loc['Enkel','Pristak_per_dag_dummy'] #Räcker att minst en är aktiverad

        #definierar alternativ
        kostnad_obegr = self.biljetter.loc['30_dagar','Baspris'] #Kostnad för månadskort obegränsat
        alt_grund = kostnad_obegr #Grundalternativet
        alt_grund_enkel_andel = 0 #NY #Andel av priset som utgörs av enkelbiljetter
        alt_lag_manad = np.inf #Lågtrafiksalternativet sätts initialt till oändligheten
        alt_lag_dag = np.inf
        alt_lag_enkel_andel = 0 #NY #Andel av priset som utgörs av enkelbiljetter (initieras som noll, men ändras om lagtrafikbiljett finns
        if (bred + smal): #Om lågtrafiksbiljetter existerar ges även alt_lag som alternativ
            kostnad_lt_kort = self.biljetter.loc['30_dagar','Lagpris']
            if bred: #Om 
                kostnad_ht_manad = lagsta_pris['Baspris']*self.resandedata.Antal_resor_per_manad_under_rusningstid
                kostnad_ht_dag = lagsta_pris['Baspris'] * self.resandedata.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"] #en matris: resenärer x dagar
            elif smal:
                kostnad_ht_manad = lagsta_pris['Baspris']*(self.resandedata.Antal_resor_per_manad-self.resandedata.Antal_resor_per_manad_under_lagtrafik)
                kostnad_ht_dag = lagsta_pris['Baspris'] * (self.resandedata.loc[:,"antalresor_dag_1":"antalresor_dag_30"] - self.resandedata.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].to_numpy())
            #Inget pristak:
            alt_lag_manad = kostnad_lt_kort + kostnad_ht_manad
            alt_lag_manad_enkel_andel = 1-kostnad_lt_kort/alt_lag_manad #NY #Andel av priset som utgörs av enkelbiljetter
            #alt_lag_manad_enkelbilj = kostnad_ht_manad #NY denna om vi kör med enkel totalkostnad
            alt_lag_dag = kostnad_lt_kort + kostnad_ht_dag.sum(1)
            alt_lag_dag_enkel_andel = 1-kostnad_lt_kort/alt_lag_dag #NY #Andel av priset som utgörs av enkelbiljetter
            #alt_lag_dag_enkelbilj = kostnad_ht_dag.sum(1) #NY denna om vi kör med enkel totalkostnad
            if pristak_per_manad:
                kostnad_tak_manad = lagsta_pris['Pristak_per_manad']
                kostnad_tak_manad_enkel_andel = 1 #NY om det här valet görs, räknas hela kostnaden som enkelbiljett
                kostnad_manad = np.minimum(kostnad_tak_manad,alt_lag_manad) #minimum av _att köpa enkelbiljetter upp till pristaket_ och _kostnaden för att köpa lågtrafikskortet och komplettera med enkelbiljetter i högtrafik_
                alt_lag_manad_enkel_andel = (kostnad_tak_manad<=alt_lag_manad)*kostnad_tak_manad_enkel_andel+(kostnad_tak_manad>alt_lag_manad)*alt_lag_manad_enkel_andel #NY #Andel av priset som utgörs av enkelbiljetter
                alt_lag_manad = kostnad_manad
            if pristak_per_dag:
                kostnad_tak_dag = lagsta_pris['Pristak_per_dag']
                kostnad_tak_dag_enkel_andel = 1 #NY om det här valet görs, räknas hela kostnaden som enkelbiljett
                sum_kost_ht_per_dag = np.minimum(kostnad_tak_dag,kostnad_ht_dag).sum(1) #tar lägsta pris av _pristak_ eller _enkelbiljetter i högtrafik_ varje enskild dag och summerar över alla dagar i månaden
                alt_lag_dag_enkel_andel = (kostnad_tak_dag<=alt_lag_dag)*kostnad_tak_dag_enkel_andel+(kostnad_tak_dag>alt_lag_dag)*alt_lag_dag_enkel_andel #NY #Andel av priset som utgörs av enkelbiljetter
                alt_lag_dag = kostnad_lt_kort + sum_kost_ht_per_dag
            alt_lag_enkel_andel = (alt_lag_manad<=alt_lag_dag)*alt_lag_manad_enkel_andel+(alt_lag_manad>alt_lag_dag)*alt_lag_dag_enkel_andel #NY #Andel av priset som utgörs av enkelbiljetter
        alt_lag = np.minimum(alt_lag_manad,alt_lag_dag)
        self.resandedata['andel_enkel'] = (alt_grund<=alt_lag)*alt_grund_enkel_andel+(alt_grund>alt_lag)*alt_lag_enkel_andel #NY #Andel av priset som utgörs av enkelbiljetter
        self.resandedata['P_MK'] = np.minimum(alt_grund,alt_lag)
    
    #Räknar ut lägsta pris för 90-dagar och årskort
    def kostnad_LPK(self,lagsta_pris,andel):
        bred = self.biljetter.loc['90_dagar','Bred_lagtrafiksbiljett_dummy']
        smal = self.biljetter.loc['90_dagar','Smal_lagtrafiksbiljett_dummy']
        pristak_per_manad = self.pristak.loc['Reskassa','Pristak_per_manad_dummy']+self.pristak.loc['Enkel','Pristak_per_manad_dummy'] #Räcker att minst en är aktiverad
        pristak_per_dag = self.pristak.loc['Reskassa','Pristak_per_dag_dummy']+self.pristak.loc['Enkel','Pristak_per_dag_dummy'] #Räcker att minst en är aktiverad

        #definierar alternativ
        kostnad_obegr = andel * self.biljetter.loc['90_dagar','Baspris']/3 + (1-andel) * self.biljetter.loc['Ars','Baspris']/12 #Kostnad för periodkort obegränsat
        alt_grund = kostnad_obegr #Grundalternativet
        alt_lag_manad = np.inf #Lågtrafiksalternativet sätts initialt till oändligheten
        alt_lag_dag = np.inf
        if (bred + smal): #Om lågtrafiksbiljetter existerar ges även alt_lag som alternativ
            kostnad_lt_kort = andel * self.biljetter.loc['90_dagar','Lagpris']/3 + (1-andel) * self.biljetter.loc['Ars','Lagpris']/12 #Kostnad för periodkort obegränsat
            if bred: #Om 
                kostnad_ht_manad = lagsta_pris['Baspris'] * self.resandedata.Antal_resor_per_manad_under_rusningstid
                kostnad_ht_dag = lagsta_pris['Baspris'] * self.resandedata.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"] #en matris: resenärer x dagar
            elif smal:
                kostnad_ht_manad = lagsta_pris['Baspris']*(self.resandedata.Antal_resor_per_manad-self.resandedata.Antal_resor_per_manad_under_lagtrafik)
                kostnad_ht_dag = lagsta_pris['Baspris'] * (self.resandedata.loc[:,"antalresor_dag_1":"antalresor_dag_30"] - self.resandedata.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].to_numpy())
            #Inget pristak:
            alt_lag_manad = kostnad_lt_kort + kostnad_ht_manad
            alt_lag_dag = kostnad_lt_kort + kostnad_ht_dag.sum(1)
            if pristak_per_manad:
                kostnad_tak_manad = lagsta_pris['Pristak_per_manad']
                kostnad_manad = np.minimum(kostnad_tak_manad,alt_lag_manad) #minimum av _att köpa enkelbiljetter upp till pristaket_ och _kostnaden för att köpa lågtrafikskortet och komplettera med enkelbiljetter i högtrafik_
                alt_lag_manad = kostnad_manad
            if pristak_per_dag:
                kostnad_tak_dag = lagsta_pris['Pristak_per_dag']
                sum_kost_ht_per_dag = np.minimum(kostnad_tak_dag,kostnad_ht_dag).sum(1) #tar lägsta pris av _pristak_ eller _enkelbiljetter i högtrafik_ varje enskild dag och summerar över alla dagar i månaden
                alt_lag_dag = kostnad_lt_kort + sum_kost_ht_per_dag
        self.resandedata['P_LK'] = np.minimum(alt_grund,np.minimum(alt_lag_manad,alt_lag_dag))

    #Räknar ut lägsta pris för engångbiljetter (reskassa eller enkel papperbiljett)
    def kostnad_ENK(self,lagsta_pris,enkelbiljettyp):
        if enkelbiljettyp == "Reskassa":
            kol='P_RES'
        else:
            kol='P_ENK'
        bred = self.biljetter.loc[enkelbiljettyp,'Bred_lagtrafiksbiljett_dummy']
        smal = self.biljetter.loc[enkelbiljettyp,'Smal_lagtrafiksbiljett_dummy']
        pristak_per_manad = self.pristak.loc[enkelbiljettyp,'Pristak_per_manad_dummy']
        pristak_per_dag = self.pristak.loc[enkelbiljettyp,'Pristak_per_dag_dummy']

        #definierar alternativ
        kostnad_obegr = self.biljetter.loc[enkelbiljettyp,'Baspris'] * self.resandedata.Antal_resor_per_manad
        alt_grund = kostnad_obegr #Grundalternativet
        alt_lag_manad = np.inf #Lågtrafiksalternativen sätts till oändligheten initialt
        alt_lag_dag = np.inf
        kostnad_tak_manad = np.inf
        kostnad_tak_dag = np.inf
        kostnad_manad = np.inf
        kostnad_dag = self.biljetter.loc[enkelbiljettyp,'Baspris'] * self.resandedata.loc[:,"antalresor_dag_1":"antalresor_dag_30"] #kostnad för singelbiljetter per dag och individ (matris)
        if bred: #(08:30-16:30; 17:30-07:30)
             kostnad_manad = self.biljetter.loc[enkelbiljettyp,'Baspris'] * self.resandedata.Antal_resor_per_manad_under_rusningstid + self.biljetter.loc[enkelbiljettyp,'Lagpris'] * (self.resandedata.Antal_resor_per_manad-self.resandedata.Antal_resor_per_manad_under_rusningstid)
             kostnad_dag = self.biljetter.loc[enkelbiljettyp,'Baspris'] * self.resandedata.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"] + self.biljetter.loc[enkelbiljettyp,'Lagpris'] * (self.resandedata.loc[:,"antalresor_dag_1":"antalresor_dag_30"].to_numpy() - self.resandedata.loc[:,"antalresor_rus_dag_1":"antalresor_rus_dag_30"].to_numpy()) #en matris: resenärer x dagar
        elif smal: #(09:00-15:00; 18:00-05:00)
             kostnad_manad = self.biljetter.loc[enkelbiljettyp,'Baspris'] * (self.resandedata.Antal_resor_per_manad-self.resandedata.Antal_resor_per_manad_under_lagtrafik) + self.biljetter.loc[enkelbiljettyp,'Lagpris'] * (self.resandedata.Antal_resor_per_manad_under_lagtrafik)
             kostnad_dag = self.biljetter.loc[enkelbiljettyp,'Baspris'] * (self.resandedata.loc[:,"antalresor_dag_1":"antalresor_dag_30"] - self.resandedata.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].to_numpy()) + self.biljetter.loc[enkelbiljettyp,'Lagpris'] * self.resandedata.loc[:,"antalresor_lag_dag_1":"antalresor_lag_dag_30"].to_numpy()
        if pristak_per_manad:
            kostnad_tak_manad = self.pristak.loc[enkelbiljettyp,'Pristak_per_manad']
        alt_lag_manad = np.minimum(kostnad_tak_manad,kostnad_manad) #minimum av _att köpa enkelbiljetter upp till pristaket_ och _kostnaden för att köpa enkelbiljetter_
        if pristak_per_dag:
            kostnad_tak_dag = self.pristak.loc[enkelbiljettyp,'Pristak_per_dag']
        alt_lag_dag = np.minimum(kostnad_tak_dag,kostnad_dag).sum(1) #tar lägsta pris av _pristak_ och _enkelbiljetter_ varje enskild dag och summerar över alla dagar i månaden
        self.resandedata[kol] = np.minimum(alt_grund,np.minimum(alt_lag_manad,alt_lag_dag))
    
    #Ger rimligt produktnamn
    def justera_produktnamn(self):
        self.resandedata.loc[self.resandedata.SalesProductName.str.startswith('30'), 'SalesProductName'] = '30-dagars'
        self.resandedata.loc[self.resandedata.SalesProductName.str.startswith('90'), 'SalesProductName'] = '90-dagars'
        self.resandedata.loc[self.resandedata.SalesProductName.str.startswith('Ars'), 'SalesProductName'] = 'Arsbiljett'
        self.resandedata.loc[self.resandedata.SalesProductName.str.startswith('Reskassa'), 'SalesProductName'] = 'Reskassa'
        self.resandedata.loc[self.resandedata.SalesProductName.str.startswith('Enkelbiljett'), 'SalesProductName'] = 'Accesskort_enkel'
        self.resandedata.loc[(self.resandedata.SalesProductName=="RAB")|(self.resandedata.SalesProductName=="VUX"), 'SalesProductName'] = 'Mobil_enkel'
            
    def kostnadsberäkning(self):
        #Räknar ut lägsta pris för alla biljettyper. Resultatet skrivs in som kolumner i resandedata
        andel_90,lagsta_pris = self.definiera_biljettattribut()
        self.kostnad_MK(lagsta_pris)
        self.kostnad_LPK(lagsta_pris,andel_90)
        self.kostnad_ENK(lagsta_pris,"Reskassa")
        self.kostnad_ENK(lagsta_pris,"Enkel")
        self.justera_produktnamn()

