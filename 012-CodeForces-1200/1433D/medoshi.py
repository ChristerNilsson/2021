def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def rx(): return [s.rstrip() for s in open(0)]
def nrxs(s): return [int(i) for i in s.split()]

def f(a):
	k = -1
	res = []
	b = []
	for i in range(1, len(a)):
		if a[0] != a[i]:
			res.append([1,i + 1])
			k = i
		else:
			b.append(i)
	if k != -1:
		for item in b:
			res.append([k + 1,item + 1])
	return res

# ass(f([1, 9, 2, 9, 4, 1, 6, 6, 8]),[[1, 2], [1, 3], [1, 4], [1, 5], [1, 7], [1, 8], [1, 9], [9, 6]])

for s in rx()[2::2]:
	res = f(nrxs(s))
	print('NO' if res == [] else 'YES')
	for item in res: print(*item)

