#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import time

start = time.time()

import A20_Bearbetning as A20

#INDATA
resmonsterfil_JA = "data\LeveransTillWSP_75_min_20200915_small.csv" #2
inkludera_manader = [9]

#Läser in resandedatan och bearbetar den
resandedata_JA = A20.Bearbetning(resmonsterfil=resmonsterfil_JA,inkludera_manader=inkludera_manader)

#Data som inte behöver lagras
del resandedata_JA.all_data
del resandedata_JA.resmonsterfil

#UTDATA
#resandedata_JA.hp #7
#resandedata_JA.rp #7

# del sys.modules["A21_Produktval_kostnad"]
# del Produktval_kostnad

import A21_Produktval_kostnad as A21

#INDATA
#resandedata_JA.hp #7
#resandedata_JA.rp #7
pristak_JA = pd.read_excel("data\\alla_indata.xlsx", sheet_name = "pristak_JA",index_col="Produkt") #3
pristak_JA_hp = pristak_JA[pristak_JA['Aldersgrupp']=="Vuxen"]
pristak_JA_rp = pristak_JA[pristak_JA['Aldersgrupp']=="Rabatterad"]
biljetter_JA = pd.read_excel("data\\alla_indata.xlsx", sheet_name = "biljetter_JA",index_col="Produkt") #3
biljetter_JA_hp = biljetter_JA[biljetter_JA['Aldersgrupp']=="Vuxen"]
biljetter_JA_rp = biljetter_JA[biljetter_JA['Aldersgrupp']=="Rabatterad"]
#aldersgrupp = "Vuxen" or "Rabatterad #för att

#Räknar ut kostnad för ett specifikt scenario
JA_hp = A21.Produktval_kostnad(resandedata_JA.hp, pristak_JA_hp, biljetter_JA_hp)
JA_rp = A21.Produktval_kostnad(resandedata_JA.rp, pristak_JA_rp, biljetter_JA_rp)

#Data som inte behöver lagras:
del biljetter_JA
del JA_hp.pristak
del JA_rp.pristak
del JA_hp.biljetter
del JA_rp.biljetter
#Data som behövs till senare:
#pristak_JA

#UTDATA
#JA_*p.resandedata #9 Tabell med resandedata och deras kostnader enl taxor indatafilen

# del sys.modules["B2_Sannolikhet"]
# del Sannolikhet
import B24_Sannolikhet as B24

#INDATA
# JA_*p.resandedata #17 Resandedata med kostnader per biljettslag
skattning_ASCs_hp = pd.read_csv("data\skattning_ASCs_hp.csv", header=None).to_numpy()[:, 0] #11
skattning_ASCs_rp = pd.read_csv("data\skattning_ASCs_rp.csv", header=None).to_numpy()[:, 0] #11

#Räknar ut snl för kortval per individ baserat på skattningen
snl_hp = B24.Sannolikhet(JA_hp.resandedata,skattning_ASCs_hp)
snl_rp = B24.Sannolikhet(JA_rp.resandedata,skattning_ASCs_rp)

del snl_hp.resandedata
del snl_rp.resandedata

#UTDATA
#snl_*p.resandedata_long #lång utdata med snl för respektive val

# del sys.modules["CD25_27_Sammanstallning"]
# del Sammanstallning
import CD25_27_Sammanstallning as CD25

#INDATA
#snl_*p.resandedata_long #12 med snl (Ypred) och pris och id
andel = pd.read_excel('data\\alla_indata.xlsx',sheet_name='andel_uttag').set_index('namn').iloc[0,0] #enbart ett värde
resultat_JA_hp = CD25.Sammanstallning(snl_hp.resandedata_long)
resultat_JA_rp = CD25.Sammanstallning(snl_rp.resandedata_long)

resultat_JA_hp.forvantad_kostnad_intakt() #2.5
resultat_JA_rp.forvantad_kostnad_intakt() #2.5
resultat_JA_hp.totala_intakter(andel) #2.6
resultat_JA_rp.totala_intakter(andel) #2.6

# In[ ]:
#UTDATA
#resultat_JA_*p.resandedata_long #13 med förväntad konsumentkostnad (pris_pred_JA) och producentintäkt (intakt_pred_JA) per månad
#resultat_JA_*p.df_intakter #14 skattade intäkter

# ## Del D
# ### DELUPPGIFT 2.7
# In[ ]:
#INDATA
#*p_kal.df_intakter #14 Skattade intäkter
kalibreringsmal = pd.read_excel('data\\alla_indata.xlsx',sheet_name='intakt_storbiljett').set_index('intakt') #1 kalibreringsmål för varje biljettslag (tkr)

# In[ ]:
resultat_JA_hp.kalibreringsfaktorer(kalibreringsmal[['Vuxen']])
resultat_JA_rp.kalibreringsfaktorer(kalibreringsmal[['Rabatterad']])

resultat_JA_hp.kalibreringsfaktorer.to_csv('data\\kalibreringsfaktorer_hp.csv')
resultat_JA_rp.kalibreringsfaktorer.to_csv('data\\kalibreringsfaktorer_rp.csv')

# In[ ]:

resultat_JA_hp.resandedata_long.to_csv('data\\resandedata_long_hp_nulage.csv')
resultat_JA_rp.resandedata_long.to_csv('data\\resandedata_long_rp_nulage.csv')

# In[2]:

#bör lagras till taxescenariot om resmonsterfil_UA == resmonsterfil_JA
#resandedata_JA.hp
#resandedata_JA.rp

# In[ ]:

print(time.time()-start)