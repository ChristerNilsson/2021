# RL = [0,4,7,8,12,14,16,20,21,24,28]
# RW = [0,4,7,8,12,14,16,21]

RL = range(13)
RW = range(13)

m = []

def dump(m):
	for row in m:
		print(''.join([f"{cell:3}" for cell in row]))

def createMatrix(RL,RW,l,w):
	m = [[-1 for i in RW] for j in RL]

	for i,row in enumerate(m):
		for j,cell in enumerate(row):
			product = RL[i] * RW[j]
			antal = product//(l*w)
			m[i][j] = product - antal*l*w
			#m[i][j] = antal

	for i in range(len(m)):
		m[i][0]=RL[i]
	for j in range(len(RW)):
		m[0][j]=RW[j]

	dump(m)

createMatrix(RL,RW,7,4)

