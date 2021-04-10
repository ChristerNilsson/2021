#SIZE = 65536
#SIZE = 32768
#SIZE = 16384
#SIZE = 8192
#SIZE = 4096
#SIZE = 2048
#SIZE = 1024
#SIZE = 512
SIZE = 256
#SIZE = 128

latNW = 6553600
longNW = 655360

print(latNW  % SIZE, latNW)
print(longNW % SIZE, longNW)

with open('fetch.bat', 'w') as f:
	for n in range(8):
		for e in range(8):
			lat = latNW + n * SIZE
			long = longNW + e * SIZE
			url = '"https://historiskakartor.lantmateriet.se/historiskakartor/wmsproxy?LAYERS=topowebbkartan&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application/vnd.ogc.se_inimage&FORMAT=image/jpeg&SRS=EPSG:3006&'
			url += f'BBOX={long},{lat},{long+SIZE},{lat+SIZE}&WIDTH=256&HEIGHT=256"'
			f.write(f"curl {url} --output maps\\{SIZE}\\{lat}-{long}-{SIZE}.jpg\n")
			print(url)
