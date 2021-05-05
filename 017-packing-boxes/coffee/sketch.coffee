n = 10000000
start = new Date()
for i in [0..n]
	z1 = i * 72
	z2 = i * 72
	z3 = i * 72
	z4 = i * 72
	z5 = i * 72
	z6 = i * 72
	z7 = i * 72
	z8 = i * 72
	z9 = i * 72
	z10 = i * 72

t = (new Date()-start)/1000 # s
console.log t

#console.log z1
console.log 180 * 10 * n/t

# 130 miljarder gånger snabbare än Numa
