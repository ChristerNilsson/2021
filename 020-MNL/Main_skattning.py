#!/usr/bin/env python
# coding: utf-8

# In[1]:

DATA = "data\\"

#För att läsa in modulen igen:
# del sys.modules["G35_Elasticitet"]
# del Elasticitet


# In[2]:


import pandas as pd
import numpy as np


# # Nuläget

# ## Del A

# ### DELUPPGIFT 2.0

# In[3]:


from A20_Bearbetning import *


# In[4]:


#INDATA
resmonsterfil_JA = DATA + "LeveransTillWSP_75_min_20200915.csv" #2
inkludera_manader=[9]


# In[5]:


#Läser in resandedatan och bearbetar den
resandedata_JA = Bearbetning(resmonsterfil=resmonsterfil_JA,inkludera_manader=inkludera_manader)


# In[6]:


#Data som inte behöver lagras
del resandedata_JA.all_data
del resandedata_JA.resmonsterfil


# In[7]:


#UTDATA
#resandedata_JA.hp #7
#resandedata_JA.rp #7


# ### DELUPPGIFT 2.1

# In[8]:


from A21_Produktval_kostnad import *


# In[9]:


#INDATA
#resandedata_JA.hp #7
#resandedata_JA.rp #7
pristak_JA = pd.read_excel(DATA + "alla_indata.xlsx",
                   sheet_name = "pristak_JA",index_col="Produkt") #3
pristak_JA_hp = pristak_JA[pristak_JA['Aldersgrupp']=="Vuxen"]
pristak_JA_rp = pristak_JA[pristak_JA['Aldersgrupp']=="Rabatterad"]
biljetter_JA = pd.read_excel(DATA + "alla_indata.xlsx",
                   sheet_name = "biljetter_JA",index_col="Produkt") #3
biljetter_JA_hp = biljetter_JA[biljetter_JA['Aldersgrupp']=="Vuxen"]
biljetter_JA_rp = biljetter_JA[biljetter_JA['Aldersgrupp']=="Rabatterad"]


# In[10]:


#Räknar ut kostnad för ett specifikt scenario
JA_hp = Produktval_kostnad(resandedata_JA.hp, pristak_JA_hp, biljetter_JA_hp)
JA_rp = Produktval_kostnad(resandedata_JA.rp, pristak_JA_rp, biljetter_JA_rp)


# In[11]:


#Data som inte behöver lagras:
del biljetter_JA
del JA_hp.pristak
del JA_rp.pristak
del JA_hp.biljetter
del JA_rp.biljetter
#Data som behövs till senare:
#pristak_JA


# In[12]:


#UTDATA
#JA_*p.resandedata #9 Tabell med resandedata och deras kostnader enl taxor indatafilen


# ## Del B

# ### DELUPPGIFT 2.2-2.4

# In[13]:


from B22_23_Skattning import *


# In[14]:


kalibreringsmal_app_hp = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='enkel_app_justeringar').set_index('Kortsval_mkr').iloc[0,0]


# In[15]:


#INDATA
#JA_*p.resandedata #9
kalibreringsmal_app_hp = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='enkel_app_justeringar').set_index('Kortsval_mkr').iloc[0,0]
kalibreringsmal_app_rp = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='enkel_app_justeringar').set_index('Kortsval_mkr').iloc[1,0] #Saknar nummer i programstrukturen
andel = pd.read_excel(DATA + 'alla_indata.xlsx',sheet_name='andel_uttag').set_index('namn').iloc[0,0] #enbart ett värde


# In[16]:


skattning_hp = Skattning(JA_hp.resandedata,kalibreringsmal_app_hp,andel)
skattning_rp = Skattning(JA_rp.resandedata,kalibreringsmal_app_rp,andel)


# In[17]:


del skattning_hp.resandedata
del skattning_rp.resandedata
del skattning_hp.resandedata_just_long
del skattning_rp.resandedata_just_long
del skattning_hp.param_list
del skattning_rp.param_list


# In[18]:


#UTDATA
#skattning_*p.ASCs #11


# In[19]:


np.savetxt(DATA + "skattning_ASCs_hp.csv", skattning_hp.ASCs, fmt="%s", delimiter=",")


# In[20]:


np.savetxt(DATA + "skattning_ASCs_rp.csv", skattning_rp.ASCs, fmt="%s", delimiter=",")

