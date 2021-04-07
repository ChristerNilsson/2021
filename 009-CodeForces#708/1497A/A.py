def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

def f(a):
	a.sort()
	g = {}
	b = []
	for i in a:
		if i not in g: g[i] = 1
		else: b.append(i)
	return list(g.keys()) + b

for i in range(nr()):
	n = nr()
	print(*f(nrs()))
