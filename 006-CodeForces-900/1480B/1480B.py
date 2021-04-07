def ass(a, b):
	if a != b: print(f"Assertion error: {a} != {b}")
	else: print('OK')
def intline():
	return [int(item) for item in input().split()]
def line():
	return [item for item in input().split()]
def dump(lst):
	for i, item in enumerate(lst): print(i, item)
def binsearch(arr, a, b):
	m = (a + b) // 2
	if a >= b: return a - 1 if arr[a] == 0 else a
	return binsearch(arr, a, m - 1) if arr[m] == 0 else binsearch(arr, m + 1, b)

def f(A,B,n,avals,bvals):
	killed = 0

	# start with smallest values in avals
	arr = [[avals[i],i] for i in range(n)]
	arr.sort()
	arr = [i for _,i in arr]

	for i in arr:
		a = avals[i]
		b = bvals[i]
		attacks = (b+A-1)//A
		if B-a*(attacks-1) > 0:
			b -= A * attacks
			B -= a * attacks
		if b <= 0: killed += 1
	return 'YES' if killed == n else 'NO'

# ass(f(3,17,1,[2],[16]),'YES')
# ass(f(999,999,1,[1000],[1000]),'NO')
# ass(f(10,260,3,[10,20,30],[100,50,30]),'NO')
# ass(f(10,260,3,[20,10,30],[50,100,30]),'NO')
# ass(f(10,261,3,[20,10,30],[50,100,30]),'YES')
# ass(f(1000,1000,4,[200,300,500,400],[1000,1000,1000,1000]),'YES')

t = intline()[0]
for i in range(t):
	A,B,n = intline()
	avals = intline()
	bvals = intline()
	print(f(A,B,n,avals,bvals))
