#!/usr/bin/env python
# coding: utf-8

# In[98]:

DATA = 'data\\'
import pandas as pd
import numpy as np


# # Taxescenariot

# ## Del E

# ### DELUPPGIFT 3.1

# In[99]:


from A20_Bearbetning import *


# In[100]:


#INDATA
resmonsterfil_UA = DATA + "LeveransTillWSP_75_min_20200915.csv"
#eventuellt även resandedata_JA.*p och resmonsterfil_JA


# In[101]:


#resandedata_JA.*p bör läsas in från nuläget om resmonsterfil_UA == resmonsterfil_JA
#När scenarierna körs från olika filer kommer den köra om oavsett.
try:
    if resmonsterfil_UA != resmonsterfil_JA:
    #7 Läser in resandedatan och bearbetar den
        resandedata_UA = Bearbetning(resmonsterfil=resmonsterfil_UA,inkludera_manader=[9])
    else:
        resandedata_UA = resandedata_JA
except:
    resandedata_UA = Bearbetning(resmonsterfil=resmonsterfil_UA,inkludera_manader=[9])


# In[102]:


#Data som inte behöver lagras
del resandedata_UA.all_data
del resandedata_UA.resmonsterfil


# In[103]:


#UTDATA
#resandedata_UA.hp #7
#resandedata_UA.rp #7


# ### DELUPPGIFT 3.2

# In[104]:


# del sys.modules["A21_Produktval_kostnad"]
# del Produktval_kostnad


# In[105]:


from A21_Produktval_kostnad import *


# In[106]:


#INDATA
#resandedata_UA.hp #16
#resandedata_UA.rp #16
pristak_UA = pd.read_excel(DATA + "alla_indata.xlsx",
                   sheet_name = "pristak_UA",index_col="Produkt") #3
pristak_UA_hp = pristak_UA[pristak_UA['Aldersgrupp']=="Vuxen"]
pristak_UA_rp = pristak_UA[pristak_UA['Aldersgrupp']=="Rabatterad"]
biljetter_UA = pd.read_excel(DATA + "alla_indata.xlsx",
                   sheet_name = "biljetter_UA",index_col="Produkt") #3

biljetter_UA_hp = biljetter_UA[biljetter_UA['Aldersgrupp']=="Vuxen"]
biljetter_UA_rp = biljetter_UA[biljetter_UA['Aldersgrupp']=="Rabatterad"]


# In[107]:


#9 & 10 Räknar ut kostnad för ett specifikt scenario
UA_hp = Produktval_kostnad(resandedata_UA.hp, pristak_UA_hp, biljetter_UA_hp)
UA_rp = Produktval_kostnad(resandedata_UA.rp, pristak_UA_rp, biljetter_UA_rp)


# In[108]:


#Data som inte behöver lagras:
del UA_hp.pristak
del UA_rp.pristak
del UA_hp.biljetter
del UA_rp.biljetter
#Data som behövs till senare:
#biljetter_UA
#pristak_UA


# In[109]:


#UTDATA
#UA_*p.resandedata #17 Tabell med resandedata och deras kostnader enl taxor indatafilen


# ## Del F

# ### DELUPPGIFT 3.3

# In[110]:


from F33_34_Justering import *


# In[111]:


#INDATA
# UA_*p.resandedata SHORT #17 Resandedata med kostnader per biljettslag
skattning_ASCs_hp = pd.read_csv(DATA + "skattning_ASCs_hp.csv",header=None).to_numpy()[:,0] #11
skattning_ASCs_rp = pd.read_csv(DATA + "skattning_ASCs_rp.csv",header=None).to_numpy()[:,0] #11
pristak_JA = pd.read_excel(DATA + "alla_indata.xlsx",
                   sheet_name = "pristak_JA",index_col="Produkt") #3
pristak_JA_hp = pristak_JA[pristak_JA['Aldersgrupp']=="Vuxen"]
pristak_JA_rp = pristak_JA[pristak_JA['Aldersgrupp']=="Rabatterad"]
# pristak_UA_*p #4
# biljetter_UA #4


# In[112]:


#Justerar ASC för reskassa om det behövs
just_hp = Justering(skattning_ASCs_hp, UA_hp.resandedata, pristak_JA_hp, pristak_UA_hp, biljetter_UA_hp)
just_rp = Justering(skattning_ASCs_rp, UA_rp.resandedata, pristak_JA_rp, pristak_UA_rp, biljetter_UA_rp)


# In[113]:


#UTDATA
#just_*p.resandedata #utdata med justerade asc för reskassa


# # Del G

# ### DELUPPGIFT 3.4

# In[114]:


from B24_Sannolikhet import *


# In[115]:


#INDATA
# just_*p.resandedata #Resandedata med kostnader per biljettslag och asc


# In[116]:


#Räknar ut snl för kortval per individ baserat på skattningen
snl_hp = Sannolikhet(just_hp.resandedata)
snl_rp = Sannolikhet(just_rp.resandedata)


# In[117]:


#Data som inte behöver lagras:
del snl_hp.resandedata
del snl_rp.resandedata
del snl_hp.ASCs
del snl_rp.ASCs


# In[118]:


#UTDATA
#snl_*p.resandedata_long #lång utdata med snl för respektive val


# ## Del H

# ### DELUPPGIFT 3.5

# In[119]:


# del sys.modules["H35_Elasticitet"]
# del Elasticitet


# In[120]:


from H35_Elasticitet import *


# In[121]:


#INDATA
df_elast = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='elasticiteter_storbiljett',index_col=0) #Priselasticiteter per biljettslag (1 x 8)
resandedata_long_hp_nulage = pd.read_csv(DATA + 'resandedata_long_hp_nulage.csv') #13
resandedata_long_rp_nulage = pd.read_csv(DATA + 'resandedata_long_rp_nulage.csv') #13
#snl_*p.resandedata_long #20 UA


# In[122]:


elast_hp = Elasticitet(resandedata_long_hp_nulage, snl_hp.resandedata_long, df_elast)
elast_rp = Elasticitet(resandedata_long_rp_nulage, snl_rp.resandedata_long, df_elast)


# In[123]:


#Data som inte behöver lagras:
del elast_hp.df_elast
del elast_rp.df_elast
del elast_hp.resandedata_JA_long
del elast_rp.resandedata_JA_long
del elast_hp.resandedata_UA_long
del elast_rp.resandedata_UA_long
del elast_hp.resandedata_kostnad
del elast_rp.resandedata_kostnad


# In[124]:


#UTDATA
#elast_*p.resandedata_long #23 #med prispred för UA och JA


# ## Del I

# ### Deluppgift 3.6

# In[125]:


# del sys.modules["I36_37_Sammanstallning"]
# del Sammanstallning


# In[126]:


from I36_37_Sammanstallning import *


# In[127]:


#INDATA
kalibreringsfaktorer_hp = pd.read_csv(DATA + 'kalibreringsfaktorer_hp.csv',index_col='intakt') #15
kalibreringsfaktorer_rp = pd.read_csv(DATA + 'kalibreringsfaktorer_rp.csv',index_col='intakt') #15 #kalibreringsfaktorer (dataframe med intäkter och kvot verkliga genom modellerade intäkter)
#elast_*p.resandedata_long #23
andel = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='andel_uttag').set_index('namn').iloc[0,0] #enbart ett värde


# In[128]:


resultat_hp = Sammanstallning(elast_hp.resandedata_long,kalibreringsfaktorer_hp,andel)
resultat_rp = Sammanstallning(elast_rp.resandedata_long,kalibreringsfaktorer_rp,andel)


# In[129]:


#UTDATA:
# resultat_hp.kalibrerad_intakt
# resultat_rp.kalibrerad_intakt
# resultat_hp.resandedata_long
# resultat_rp.resandedata_long


# ### Deluppgift 3.7

# In[130]:


#INDATA (redan inlästa i objektet)
# resultat_hp.kalibrerad_intakt #25
# resultat_rp.kalibrerad_intakt #25
# kalibreringsfaktorer_hp #15
# kalibreringsfaktorer_rp #15


# In[131]:


resultat_hp.Scenariojamforelse()
resultat_rp.Scenariojamforelse()


# In[132]:


#Data som inte behöver lagras:
del resultat_hp.kalibreringsfaktorer
del resultat_rp.kalibreringsfaktorer
del resultat_hp.kalibrerad_intakt
del resultat_rp.kalibrerad_intakt


# In[133]:


#UTDATA:
# resultat_hp.intakter
# resultat_rp.intakter


# # Småbiljetter

# In[134]:


#del sys.modules["J_Smabiljetter"]
#del Smabiljetter


# In[135]:


from J_Smabiljetter import *


# In[136]:


#INDATA
df_elast = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='elasticiteter_smabiljett') #Priselasticiteter per biljettslag
df_prisf = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='prisforandring_smabiljett',index_col=0) #Prisförändring per biljettslag
df_efterfr = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='intakt_smabiljett',index_col=0) #Intäkter per biljett
df_korr = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='korrigering_smabiljett',index_col=0) #Korrigering per biljettyp


# In[137]:


smabiljettintakter = Smabiljetter(df_elast,df_prisf,df_efterfr,df_korr)


# In[138]:


#Data som inte behöver lagras:
del smabiljettintakter.df_elast


# In[139]:


#UTDATA
#smabiljettintakter.df
#eller uppdelat:
#smabiljettintakter.JA
#smabiljettintakter.UA


# # UTDATA

# In[140]:


#Resultat intäkter:
resultat_hp.intakter.to_csv(DATA + 'intakter_hp.csv')
resultat_rp.intakter.to_csv(DATA + 'intakter_rp.csv')


# In[141]:


#resultat resandedata från nuläge:
#resandedata_long_hp_nulage
#resandedata_long_rp_nulage


# In[142]:


#resultat resandedata från taxescenario:
#resultat_hp.resandedata_long
#resultat_rp.resandedata_long


# In[46]:


#Resultat intäkter småbiljetter:
smabiljettintakter.df.to_csv(DATA + 'Resultat_smabiljett.csv')


# In[96]:


#resandedata_long_hp_nulage.iloc[:10000].to_csv('resandedata_long_hp_JA.csv')


# In[151]:


#resultat_hp.resandedata_long.iloc[:10000].to_csv('resandedata_long_hp_UA.csv')

