## Manual

* in: Zoomar in. Minimal rutstorlek = 64 meter
* out: Zoomar ut. Maximal rutstorlek = 65536 meter
* ctr: Centrerar din position givet gps.
* path: öppnar stänger undermeny.
	* fetch: visar alla paths/marks. Närmaste blir current (gul).
		* Vill man byta: centrera och klicka på fetch igen.
	* rec: Startar/stoppar inspelning av koordinater.
	* mark: sparar nuvarande position
	* play: startar uppspelning av körinstruktioner.
	* share: mailar current path/mark
	* delete: tar bort current path/mark
* hårkors: Sätter/Rensar Target

* Inmatning av path/mark via url sparas till localStorage om den är unik.

### Skärm:

* Avstånd från hårkors till target.
* Bäring från hårkors till target.

### localStorage:

* Innehåller paths med box. Path sparas komprimerat med två tecken per koordinat.
	* checksumma av path
	* path x,y,letters (sweref)
	* box: x,y,w,h (sweref) Närmaste hörnpunkt gäller vid val av current
	* point count
	* distance in meters
* Innehåller marks
	x,y (sweref)