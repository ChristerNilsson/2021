
with open('fetch.bat', 'w') as f:
	for n in range(4,7):
		for e in range(-8,-5):
			lat = 6570016 + n * 512
			long = 682304 + e * 512
			url = f'"https://historiskakartor.lantmateriet.se/historiskakartor/wmsproxy?LAYERS=topowebbkartan&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application/vnd.ogc.se_inimage&FORMAT=image/jpeg&SRS=EPSG:3006&BBOX={long},{lat},{long+512},{lat+512}&WIDTH=256&HEIGHT=256"'
			f.write(f"curl {url} --output {long}-{lat}.jpg\n")
			print(url)
