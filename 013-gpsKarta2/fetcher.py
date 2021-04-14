#SIZE = 65536
#SIZE = 32768
#SIZE = 16384
#SIZE = 8192
#SIZE = 4096
#SIZE = 2048
SIZE = 1024
#SIZE = 512
#SIZE = 256
#SIZE = 128
#SIZE = 64

latSW = 6553600 # 7
longSW = 655360 # 6

# 6553600+(78+16)*256
# 655360+(88+16)*256

print(latSW  % SIZE, latSW)
print(longSW % SIZE, longSW)

with open('fetch.bat', 'w') as f:
	for n in range(19,19+5):
		for e in range(22,22+5):
			lat = latSW + n * SIZE # 7
			long = longSW + e * SIZE # 6
			url = '"https://historiskakartor.lantmateriet.se/historiskakartor/wmsproxy?LAYERS=topowebbkartan&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application/vnd.ogc.se_inimage&FORMAT=image/jpeg&SRS=EPSG:3006&'
			url += f'BBOX={long},{lat},{long+SIZE},{lat+SIZE}&WIDTH=256&HEIGHT=256"'
			f.write(f"curl {url} --output maps\\{SIZE}\\{lat}-{long}-{SIZE}.jpg\n")
			print(url)
