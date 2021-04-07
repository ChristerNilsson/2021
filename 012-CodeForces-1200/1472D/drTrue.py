def nr(): return nrs()[0]
def nrs(): return [int(i) for i in input().split()]
def sign(a): return 0 if a==0 else int(a/abs(a))

for _ in range(nr()):
	n = nr()
	arr = sorted(nrs(),reverse=True)
	a = sum([i for i in arr[::2]if i%2==0])
	b = sum([i for i in arr[1::2] if i%2])
	print(['Bob','Tie','Alice'][1+sign(a-b)])
