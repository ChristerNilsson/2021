def ass(a,b):
	if a!=b: print('Assert failed:',a,'!=',b)

def f(W,H,w,h):
	#print(W*H/(w*h))
	res = 0
	for i in range(H//h+1):
		p = i * (W//w)
		rest = H-i*h
		l = (rest//w) * (W//h)
		#print(i,p,l,p+l)
		res = max(res,p+l)
	return res

def find(W,H,w,h):
	a = f(W,H,w,h)
	b = f(H,W,w,h)
	return max(a,b)

# ass(13, find(96,80,19,29))
# ass(133, find(960,80,19,29))
# ass(1388, find(960,800,19,29))
# ass(13936, find(9600,800,19,29))
# ass(139368, find(9600,8000,19,29))
# ass(1393684, find(96000,8000,19,29))
# ass(13936842, find(96000,80000,19,29))
# ass(139382068, find(960000,80000,19,29))
# ass(1393820689, find(960000,800000,19,29))

print(find(5,5,3,2)) # borde vara 4
print(find(115,115,19,29)) # borde vara 24
print(find(575,575,145,95)) # borde vara 24
