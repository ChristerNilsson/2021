def nr():  return int(input())
def nrs(): return [int(i) for i in input().split()]

def createPos(arr):
	res = [0] * (max(arr)+1)
	for i,item in enumerate(arr):
		res[item]=i
	return res

def f(arr):
	pos = createPos(arr)
	res = []
	m = len(arr)
	for n in reversed(range(len(pos))):
		if pos[n] > m: continue
		res += arr[pos[n]:m]
		m = pos[n]
	return res

for _ in range(nr()):
	_ = nr()
	print(*f(nrs()))
