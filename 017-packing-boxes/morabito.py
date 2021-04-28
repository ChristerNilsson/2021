# Input: L, W, l, w, n ∈ Z.
# Output: Number of (l, w)-boxes packed within the (L, W)-pallet.

def ass(a,b):
	if a!=b:
		print(a,b)
		assert a==b

def Compute(L,W,x1,x2,y1,y2):
	return [x1,L-x1,x2-x1,x2,L-x2],[W-y1,W-y2,y2-y1,y1,y2]

N = 100
cache = {}
depth = [[24 for i in range(80+1)] for j in range(96+1)]

# Build sets SL and SW for (L, W, l, w)
def createSL(L,W,l,w):
	res = []
	for r in range(L):
		x0 = r*l
		if x0 > L: continue
		for s in range(W):
			x = x0+s*w
			if x<=L and x not in res: res.append(x)
	res.sort()
	return res
#assert [0, 4, 7, 8, 11, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28] == createSL(28,21,7,4)
ass([0, 2, 3, 4, 5, 6, 7, 8, 9, 10],createSL(10,8,3,2))
ass([0, 19, 29, 38, 48, 57, 58, 67, 76, 77, 86, 87, 95, 96], createSL(96,80,29,19))

def createSW(L,W,l,w):
	res = []
	for r in range(L):
		y0 = r*l
		if y0 > W: continue
		for s in range(W):
			y = y0 + s*w
			if y<=W and y not in res: res.append(y)
	res.sort()
	return res
#assert [0, 4, 7, 8, 11, 12, 14, 15, 16, 18, 19, 20, 21] == createSW(28,21,7,4)
#assert [0,2,3,4,5] == createSW(5,5,3,2)
ass([0, 19, 29, 38, 48, 57, 58, 67, 76, 77], createSW(96,80,29,19))

def RecursiveBD(L, W, l, w, n):
	key = (L,W,l,w)
	if key in cache:
		return cache[key]
	print('Rec',L,W,l,w,n)
	IL = L # gissning
	JW = W
	zlb = min(0,IL, JW)
	zub = max(IL, JW)

	if zlb == zub or depth[IL][JW] <= n:
		depth[IL][JW] = min(depth[IL][JW], n)
		cache[key] = zlb
		return zlb

	SL = createSL(L,W,l,w)
	SW = createSW(L,W,l,w)

	for x1 in SL:
		if x1 > L - w: continue
		for x2 in SL:
			if not (x1 <= x2 <= L - w): continue
			for y1 in SW:
				if y1 > W - w: continue
				for y2 in SW:
					print(x1,x2,y1,y2)
					if not (y1 <= y2 <= W - w) : continue
					if True: #this pattern is not symmetrical to any other then
						arrL, arrW = Compute(L,W, x1,x2,y1,y2)
						arrzlb = [min(arrL[i], arrW[i]) for i in range(5)]
						arrzub = [max(arrL[i], arrW[i]) for i in range(5)]
						Slb = sum(arrzlb)
						Sub = sum(arrzub)
						if n < N :
							z = [RecursiveBD(arrL[i], arrW[i], l, w, n + 1) for i in range(5)]
							for i in range(5):
								Slb += z[i] - arrzlb[i]
								Sub += z[i] - arrzub[i]
								if zlb >= Sub: break
								if Slb > zlb:
									zlb = Slb
									if zlb == zub :
										depth[IL][JW] = n
										cache[key]=zlb
										return zlb
						if Slb > zlb:
							zlb = Slb
							if zlb == zub:
								depth[IL][JW] = n
								cache[key] = zlb
								return zlb
	depth[IL][JW] = n
	cache[key] = zlb
	return zlb

#print(RecursiveBD(28,21,7,4,0))
#print(RecursiveBD(5,5,3,2,0))
print(RecursiveBD(96,80,29,19,0))
