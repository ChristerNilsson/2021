## Manual

* in: Zoomar in. Minimal rutstorlek = 64 meter
* out: Zoomar ut. Maximal rutstorlek = 65536 meter
* ctr: Centrerar din position givet gps.
* path: öppnar stänger undermeny.
	* fetch: visar alla paths and markers. Närmaste blir current.
		* Vill man byta: centrera på det området och klicka på fetch igen.
	* rec: Startar/stoppar inspelning av koordinater.
	* mark: sparar nuvarande position
	* play: startar uppspelning av körinstruktioner.
	* share: mailar current path/marker.
	* clear: avväljer current path/marker.
	* delete: tar bort current path/mark
* hårkors: Sätter/Rensar Target

* Inmatning av path/marker via url sparas till localStorage om den är unik.

### Skärm:

* Avstånd från hårkors till target.
* Bäring från hårkors till target.

### localStorage:

* Innehåller paths med box. Path sparas komprimerat med två tecken per gps-koordinat.
	* checksumma av path
	* path x,y,letters (sweref)
	* box: xmin,ymin,xmax,ymax (sweref) Närmaste hörnpunkt gäller vid val av current
* Innehåller markers
	x,y (sweref)