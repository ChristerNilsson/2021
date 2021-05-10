#!/usr/bin/env python
# coding: utf-8

import pandas as pd
# import numpy as np

import A20_Bearbetning as A20

#INDATA
resmonsterfil_UA = "data\\LeveransTillWSP_75_min_20200915_small.csv"
resmonsterfil_JA = "data\\LeveransTillWSP_75_min_20200915_small.csv"
#eventuellt även resandedata_JA.*p och resmonsterfil_JA

#resandedata_JA.*p bör läsas in från nuläget om resmonsterfil_UA == resmonsterfil_JA
#När scenarierna körs från olika filer kommer den köra om oavsett.
resandedata_UA = A20.Bearbetning(resmonsterfil=resmonsterfil_UA, inkludera_manader=[9])
resandedata_JA = resandedata_UA

# try:
#     if resmonsterfil_UA != resmonsterfil_JA:
#     #7 Läser in resandedatan och bearbetar den
#         resandedata_UA = Bearbetning(resmonsterfil=resmonsterfil_UA,inkludera_manader=[9])
#     else:
#         resandedata_UA = Bearbetning(resmonsterfil=resmonsterfil_UA,inkludera_manader=[9])
# except:
#     resandedata_UA = Bearbetning(resmonsterfil=resmonsterfil_UA,inkludera_manader=[9])

#Data som inte behöver lagras
del resandedata_UA.all_data
del resandedata_UA.resmonsterfil

#UTDATA
#resandedata_UA.hp #7
#resandedata_UA.rp #7

# del sys.modules["A21_Produktval_kostnad"]
# del Produktval_kostnad

import A21_Produktval_kostnad as A21

#INDATA
#resandedata_UA.hp #16
#resandedata_UA.rp #16

pristak_UA = pd.read_excel("data\\alla_indata.xlsx", sheet_name = "pristak_UA",index_col="Produkt") #3
pristak_UA_hp = pristak_UA[pristak_UA['Aldersgrupp'] == "Vuxen"]
pristak_UA_rp = pristak_UA[pristak_UA['Aldersgrupp'] == "Rabatterad"]

biljetter_UA = pd.read_excel("data\\alla_indata.xlsx", sheet_name = "biljetter_UA",index_col="Produkt") #3
biljetter_UA_hp = biljetter_UA[biljetter_UA['Aldersgrupp'] == "Vuxen"]
biljetter_UA_rp = biljetter_UA[biljetter_UA['Aldersgrupp'] == "Rabatterad"]

#9 & 10 Räknar ut kostnad för ett specifikt scenario
UA_hp = A21.Produktval_kostnad(resandedata_UA.hp, pristak_UA_hp, biljetter_UA_hp)
UA_rp = A21.Produktval_kostnad(resandedata_UA.rp, pristak_UA_rp, biljetter_UA_rp)

#Data som inte behöver lagras:
del UA_hp.pristak
del UA_rp.pristak
del UA_hp.biljetter
del UA_rp.biljetter
#Data som behövs till senare:
#biljetter_UA
#pristak_UA

#UTDATA
#UA_*p.resandedata #17 Tabell med resandedata och deras kostnader enl taxor indatafilen

import F33_34_Justering as F33

#INDATA
# UA_*p.resandedata SHORT #17 Resandedata med kostnader per biljettslag
skattning_ASCs_hp = pd.read_csv("data\\skattning_ASCs_hp.csv",header=None).to_numpy()[:,0] #11
skattning_ASCs_rp = pd.read_csv("data\\skattning_ASCs_rp.csv",header=None).to_numpy()[:,0] #11

pristak_JA = pd.read_excel("data\\alla_indata.xlsx", sheet_name = "pristak_JA",index_col="Produkt") #3
pristak_JA_hp = pristak_JA[pristak_JA['Aldersgrupp']=="Vuxen"]
pristak_JA_rp = pristak_JA[pristak_JA['Aldersgrupp']=="Rabatterad"]

# pristak_UA_*p #4
# biljetter_UA #4

#Justerar ASC för reskassa om det behövs
just_hp = F33.Justering(skattning_ASCs_hp, UA_hp.resandedata, pristak_JA_hp, pristak_UA_hp, biljetter_UA_hp)
just_rp = F33.Justering(skattning_ASCs_rp, UA_rp.resandedata, pristak_JA_rp, pristak_UA_rp, biljetter_UA_rp)

#UTDATA
#just_*p.resandedata #utdata med justerade asc för reskassa

import B24_Sannolikhet as B24

#INDATA
# just_*p.resandedata #Resandedata med kostnader per biljettslag och asc

#Räknar ut snl för kortval per individ baserat på skattningen
snl_hp = B24.Sannolikhet(just_hp.resandedata)
snl_rp = B24.Sannolikhet(just_rp.resandedata)

#Data som inte behöver lagras:
del snl_hp.resandedata
del snl_rp.resandedata
del snl_hp.ASCs
del snl_rp.ASCs

#UTDATA
#snl_*p.resandedata_long #lång utdata med snl för respektive val

# del sys.modules["H35_Elasticitet"]
# del Elasticitet

import H35_Elasticitet as H35

#INDATA
df_elast = pd.read_excel('data\\alla_indata.xlsx',sheet_name='elasticiteter_storbiljett',index_col=0) #Priselasticiteter per biljettslag (1 x 8)
resandedata_long_hp_nulage = pd.read_csv('data\\resandedata_long_hp_nulage.csv') #13
resandedata_long_rp_nulage = pd.read_csv('data\\resandedata_long_rp_nulage.csv') #13
#snl_*p.resandedata_long #20 UA

elast_hp = H35.Elasticitet(resandedata_long_hp_nulage, snl_hp.resandedata_long, df_elast)
elast_rp = H35.Elasticitet(resandedata_long_rp_nulage, snl_rp.resandedata_long, df_elast)

#Data som inte behöver lagras:
del elast_hp.df_elast
del elast_rp.df_elast
del elast_hp.resandedata_JA_long
del elast_rp.resandedata_JA_long
del elast_hp.resandedata_UA_long
del elast_rp.resandedata_UA_long
del elast_hp.resandedata_kostnad
del elast_rp.resandedata_kostnad

#UTDATA
#elast_*p.resandedata_long #23 #med prispred för UA och JA

# del sys.modules["I36_37_Sammanstallning"]
# del Sammanstallning

import I36_37_Sammanstallning as I36

#INDATA
kalibreringsfaktorer_hp = pd.read_csv('data\\kalibreringsfaktorer_hp.csv',index_col='intakt') #15
kalibreringsfaktorer_rp = pd.read_csv('data\\kalibreringsfaktorer_rp.csv',index_col='intakt') #15 #kalibreringsfaktorer (dataframe med intäkter och kvot verkliga genom modellerade intäkter)
#elast_*p.resandedata_long #23
andel = pd.read_excel('data\\alla_indata.xlsx',sheet_name='andel_uttag').set_index('namn').iloc[0,0] #enbart ett värde

resultat_hp = I36.Sammanstallning(elast_hp.resandedata_long,kalibreringsfaktorer_hp,andel)
resultat_rp = I36.Sammanstallning(elast_rp.resandedata_long,kalibreringsfaktorer_rp,andel)

#UTDATA:
# resultat_hp.kalibrerad_intakt
# resultat_rp.kalibrerad_intakt
# resultat_hp.resandedata_long
# resultat_rp.resandedata_long

#INDATA (redan inlästa i objektet)
# resultat_hp.kalibrerad_intakt #25
# resultat_rp.kalibrerad_intakt #25
# kalibreringsfaktorer_hp #15
# kalibreringsfaktorer_rp #15

resultat_hp.Scenariojamforelse()
resultat_rp.Scenariojamforelse()

#Data som inte behöver lagras:
del resultat_hp.kalibreringsfaktorer
del resultat_rp.kalibreringsfaktorer
del resultat_hp.kalibrerad_intakt
del resultat_rp.kalibrerad_intakt

#del sys.modules["J_Smabiljetter"]
#del Smabiljetter

import J_Smabiljetter as J

def justifyShape(df):
    # Make shape reflect the true values derived from actual matrix size.
    # This is a combination of Excel storing the wrong dimensions
    # and pandas.read_excel not checking the real dimensions.
    df.dropna(axis='columns', how='all', inplace=True)
    return df

#INDATA
df_elast = pd.read_excel('data\\alla_indata.xlsx',sheet_name='elasticiteter_smabiljett') #Priselasticiteter per biljettslag
df_prisf = justifyShape(pd.read_excel('data\\alla_indata.xlsx',sheet_name='prisforandring_smabiljett',index_col=0)) #Prisförändring per biljettslag
df_efterfr = pd.read_excel('data\\alla_indata.xlsx',sheet_name='intakt_smabiljett',index_col=0) #Intäkter per biljett
df_korr = justifyShape(pd.read_excel('data\\alla_indata.xlsx',sheet_name='korrigering_smabiljett',index_col=0)) #Korrigering per biljettyp

smabiljettintakter = J.Smabiljetter(df_elast,df_prisf,df_efterfr,df_korr)

#Data som inte behöver lagras:
del smabiljettintakter.df_elast

#UTDATA
#smabiljettintakter.df
#eller uppdelat:
#smabiljettintakter.JA
#smabiljettintakter.UA

#Resultat intäkter:
resultat_hp.intakter.to_csv('data\\intakter_hp.csv')
resultat_rp.intakter.to_csv('data\\intakter_rp.csv')

#resultat resandedata från nuläge:
#resandedata_long_hp_nulage
#resandedata_long_rp_nulage

#resultat resandedata från taxescenario:
#resultat_hp.resandedata_long
#resultat_rp.resandedata_long

#Resultat intäkter småbiljetter:
smabiljettintakter.df.to_csv('data\\Resultat_smabiljett.csv')

#resandedata_long_hp_nulage.iloc[:10000].to_csv('resandedata_long_hp_JA.csv')

#resultat_hp.resandedata_long.iloc[:10000].to_csv('resandedata_long_hp_UA.csv')

