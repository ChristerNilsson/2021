import math
n = 1000
for a in range(3,n):
	for b in range(a+1, n):
		c = math.sqrt(a*a+b*b)
		if int(c)==c: print(a,b,int(c))
