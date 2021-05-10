# Iakttagelser angående Intäktsanalys

* Saknas anvisningar för installation.
* Saknas tester.
* Svengelska överallt.
* Panda-tabeller bör vara immutable. Utan .copy() uppstår varningar.
	* Immutable innebär att man inte ändrar i en tabell. Man skapar en ny. Strängar är t ex oftast immutable.
	* StaticFrame är ett sätt att åstadkomma detta: https://github.com/InvestmentSystems/static-frame
* Att låta datainnehållet styra kolumnnamnen är olämpligt. Borde styras med en parameter. Kostar tid och komplicerar koden.
	* Leverans: Kolumnnamner 10..99 byts mot följande:
		* antalresor_dag_1 .. antalresor_dag_30 (01 .. 30)
		* antalresor_rus_dag_1 .. antalresor_rus_dag_30 (R01 .. R30)
		* antalresor_lag_dag_1 .. antalresor_lag_dag_30 (L01 .. L30)
* Varför läsa 60 MB tre gånger?
* För långa kolumnnamn gör koden svårläst. Tre tecken + förklaring bör räcka.
	* Exempel Resandedata
		* TicketSerialNumber => TSN
		* SalesProductName => SPN
		* Antal_resor_per_manad_under_rusningstid => RUS
		* Antal_resor_per_manad_under_lagtrafik => LAG
* Man bör använda 01, 02, ... istf 1,2,... i kolumnnamn för att få korrekt numerisk sortering. (1,10,19,2,20,21 osv)
* Svårt att debugga mha Jupyter. PyCharm är bättre.
* Långa rader svårlästa. 400 tecken är definitivt för långt. Kan minskas med temporära variabler.
* Onödigt många värdesiffror i csv-filerna. 18 siffror bör vara sex värdesiffror, vilket ger en ppm och snabbare inläsning.
* alla_indata.xslx:biljetter_UA och JA: två celler mergade till en, ger NaN för den ena. Bättre indata!
	* Troligen förstår inte pandas.read_csv hur man hanterar mergade celler.

# Exekveringstider
* Main_Nuläge: 51.6 sekunder
