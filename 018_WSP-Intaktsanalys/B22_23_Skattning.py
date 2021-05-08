import statsmodels.api as sm           # statistic package, requires Pip install at VSC terminal. 
import statsmodels.formula.api as smf
from sklearn import linear_model       # model package, requires Pip install at VSC terminal
from patsy import dmatrices            # matrix package, requires Pip install at VSC terminal

import matplotlib.pyplot as plt        #ploting package, requires Pip install at VSC terminal
 
from collections import OrderedDict    # Dictionary for param estimation in Pylogit package
import pylogit as pl                   # For MNL model estimation (conditional logit), requires Pip install at VSC terminal 
import pandas as pd
import numpy as np

class Skattning:
    def __init__(self,resandedata,kalibreringsmal_app,andel):
        self.resandedata = resandedata
        self.param_list = []
        ## preparing variables for estimation
        #Creates dummies for different ticket alternaitives from variable "alt"
        resandedata_just = self.enkel_app_justeringar(kalibreringsmal_app,andel) #2.2
        self.resandedata_just_long = self.utdata_long(resandedata_just)
        self.skapa_dummier()
        self.mnl() #2.3 & 2.4
        self.ASCs = self.param_list[0]
        
    def karin_kontroll(self):
        # För Karins stämmer med data innan skattning
        tmp = self.resandedata_just_long[self.resandedata_just_long['val']==1]
        df_obs = tmp[['val','alt']].groupby(['alt']).sum() # task #14
        df_price = tmp[['pris','alt']].groupby(['alt']).sum() # task #14
        df_price['pris']=df_price['pris']/1.06
        print(df_obs.join(df_price)) #Summan av antal val och summa av biljettintäkter
        return df_obs.head()
    
    def christofer_kontroll(self):
        # För Christofer stämmer med data innan skattning, 
        tmp = self.resandedata_just_long[self.resandedata_just_long['val']==1]
        df_price_p = tmp[['pris','SalesProductName']].groupby(['SalesProductName']).sum() # task #14
        df_price_p['pris']=df_price_p['pris']/1.06 #Summa av biljettintäkter
        print(df_price_p)
        
    def enkel_app_justeringar(self,kalibreringsmal_app,andel): #2.2
        # justeringar av resmönster - återskaffar enkelbiljetter för app och accesskort(inkl. paperkvitto och elektronisk paper):
        # läser in aktuell uttag andel och kalibreringsmål
        kal_app = kalibreringsmal_app
    
        # steg 2) beräknar ut justeringskvot mellan kalibreringsmål från excel, och motsvarande intäkter från resmönster(valideringar)
        # motsvarnade intäkter från valideringar i mkr
        res_app = sum(self.resandedata.loc[self.resandedata.SalesProductName== 'Mobil_enkel','P_ENK'])/1.06/10**6
        # genomsnitt resor per "individ"
        app = self.resandedata.loc[self.resandedata.SalesProductName=='Mobil_enkel',:]
        mean_app = sum(app.Antal_resor_per_manad)/len(app)
        # urval storlek 
        len_urv_app = int(round( (kal_app*andel -res_app)*10**6/(np.mean(app.P_ENK)/1.06),0))
        # steg 3) utökad urval för mer balanserad resmönster innan modell skattningar
        app_urv = app.sample(n=len_urv_app,replace=True,random_state=123)
        app_urv['id'] = range(max(self.resandedata['id']) *3, max(self.resandedata['id'])*3+len(app_urv))
        # läggar till ursprunglig data 
        # läggar till ursprunglig data 
        resandedata_just = self.resandedata.append([app_urv])
        resandedata_just = resandedata_just.loc[resandedata_just.SalesProductName!='Accesskort_enkel',:]
        return resandedata_just
    
    #Skapar lång data till MNL
    def utdata_long(self,resandedata):
        utdata_long=resandedata.append([resandedata]*3,ignore_index=True).sort_values('id').reset_index(drop=True) #Skapar lång dataframe
        utdata_long['val']=0
        utdata_long['alt']=0
        utdata_long.alt = np.arange(len(utdata_long)) % 4 + 1 #Namnger alternativ 1, 2, 3, 4
        utdata_long.loc[utdata_long.kortval==utdata_long.alt, 'val'] = 1 #väljer de alternativ som stämmer med kortval
        utdata_long = utdata_long.drop(columns = ['kortval'])
        utdata_long['pris']=0
        alt2pris = {1:'P_MK',2:'P_LK',3:'P_RES',4:'P_ENK'}
        alt2prodName = {1:'30-dagars',2:'Langperiod',3:'Reskassa',4:'Enkelbiljett'}
        for alt in alt2pris:
           utdata_long.loc[utdata_long.alt==alt, 'pris'] = utdata_long[alt2pris[alt]] #Lägger till motsvarande pris till kortval
           utdata_long.loc[utdata_long.alt==alt, 'SalesProductName'] = alt2prodName[alt] #Lägger till korrekt produktnamn utifrån kortval
        return utdata_long.drop(['P_MK','P_LK','P_RES','P_ENK','SourceSystemName','ProductCarrier'], 1) #Utdata #10
    
    def skapa_dummier(self):
        dummies = pd.get_dummies(self.resandedata_just_long['alt'],drop_first=True) # use the first alternative (månadskort) as reference level
        self.resandedata_just_long = pd.concat([self.resandedata_just_long, dummies], axis=1)              # make dummies of alternative as equivalent to N-1 factor 
        self.resandedata_just_long.rename(columns = {2:'alt2',3:'alt3',4:'alt4'}, inplace = True) #Renaming dummy columns: alt 2: LPK, alt 3: reskassan, alt 4: enkelbiljett
        
    def mnl(self): #2.3 & 2.4
        # Create the model specification for simple Multinomial Logit Model (MNL, McFadden)
        df_spec = OrderedDict()
        df_names = OrderedDict()
        for col, display_name in [("alt2", "lpk_hel"),  #Kortvalsparameter för Långa_periodbiljetter
                                  ("alt3", "rk_hel"),   #Kortvalsparameter för Förköp_enkel
                                  ("alt4", "ek_hel")]:  #Kortvalsparameter för Direktköp_enkel
            df_spec[col] = [[2,3,4]]
            df_names[col] = [display_name]

        df_spec['pris'] =[[1,2,3,4]]
        df_names['pris'] =['Kostnad_per_biljettslag'] #Kostnad:"Kostnad per biljettslag per individ" in 2019 okt level

        # Create an instance of the MNL model class
        model = pl.create_choice_model(data = self.resandedata_just_long,
                            alt_id_col="alt",      #indicates which alternative has been chosen
                            obs_id_col="id",       # id unique for individ + biljettslag, need to be continuous integer
                            choice_col="val",      #"Val av biljettslag per individ" - boolean: 1 for the chosen ticket, 0 otherwise.
                            specification=df_spec, #specification for the names of variable and variable in collection
                            model_type = "MNL",    #Multinomial logit model
                            names = df_names)      #Variable names in model estimation


        # Estimate the given model, starting from a point of all zeros
        # as the initial values.
        model_results = model.fit_mle(np.zeros(4),just_point=True)  #modell coefficients stored in model_results #RuntimeWarning: Method BFGS does not use Hessian information (hess).

        ## Look at the estimation summaries, not in use due to limit of RAM
        #df_model.get_statsmodels_summary()
        
        mle_params = model_results['x'] # x - parameters
        self.param_list = [mle_params,None,None,None] #Utdata #11
        # följer med ordning:Kortvalsparameter för Långa_periodbiljetter,Förköp_enkel,Direktköp_enkel och Kostnader per biljettslag
        
        predictions = model.predict(self.resandedata_just_long, param_list=self.param_list) #FutureWarning: arrays to stack must be passed as a "sequence" type such as list or tuple. Support for non-sequence iterables such as generators is deprecated as of NumPy 1.16 and will raise an error in the future.
        self.resandedata_just_long['Ypred'] = pd.Series(predictions,index=self.resandedata_just_long.index) #utdata #12

