import pandas as pd

class Sammanstallning:
    def __init__(self, resandedata_long, kalibreringsfaktorer,andel):
        self.resandedata_long = resandedata_long
        self.kalibreringsfaktorer = kalibreringsfaktorer
        self.Viktad_forvantad_intakt() #24
        self.Totala_intakter(andel) #25
        
    def Viktad_forvantad_intakt(self): #3.6 #24
        rdl = self.resandedata_long
        self.resandedata_long['okalibrerad_intakt_UA'] = rdl.kostnad_UA * rdl.vikt / 1.06 #viktad intäkt vikt gånger förväntat pris och moms borträknad
        
        #Flyttar intäkt från månadsbiljett till enkelbiljett (de som köpt lågtrafikskort + enkelbiljetter i högtrafik)
        enkelintakt_manad = rdl.loc[(rdl.alt==1)].andel_enkel * rdl.loc[(rdl.alt==1)].okalibrerad_intakt_UA
        rdl.loc[(rdl.alt==1),'okalibrerad_intakt_UA'] -= enkelintakt_manad
        rdl.loc[(rdl.alt==4),'okalibrerad_intakt_UA'] += enkelintakt_manad.tolist()
        
        #Kalibrerar intäkter i resandedatan
        kortval2kalibreringsfaktor = dict(zip(list(range(1,5)), self.kalibreringsfaktorer['kalibreringsfaktor'].tolist()))
        rdl['intakt_UA'] = rdl['alt'].map(kortval2kalibreringsfaktor) * rdl.okalibrerad_intakt_UA #intäkt uppräknad med kalibreringsfaktorerna #Utdata 24
        
    def Totala_intakter(self,andel): #3.6 #25
        # intäkter per biljettslag/produkttyp - 'alt'
        self.kalibrerad_intakt = self.resandedata_long[['intakt_UA','antal_resenarer_UA','alt']].groupby(['alt']).sum()/andel #Utdata task #25 per biljettslag nivå
        self.kalibrerad_intakt.index = self.kalibreringsfaktorer.index.tolist()
        self.kalibrerad_intakt.index.name='intakt'
        self.kalibrerad_intakt['antal_resenarer_UA'] = self.kalibrerad_intakt.antal_resenarer_UA.astype(int) #Utdata 25
        
    def Scenariojamforelse(self): #3.6
        #Slår ihop tabeller
        self.intakter = pd.concat([self.kalibreringsfaktorer,self.kalibrerad_intakt], axis=1, sort=False)
        rdl = self.resandedata_long
        self.resandedata_long = rdl[rdl.columns.drop(['kostnad_JA','vikt','okalibrerad_intakt_UA','antal_resenarer_UA'])]
