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

a = ['NO'] * 1000001
for i in range(0, 1000001, 2020):
	for j in range(0, 1000001, 2021):
		if i + j <= 1000000:
			a[i + j] = 'YES'

def f(n): return a[n]

# ass(f(100),'NO')
# ass(f(2020),'YES')
# ass(f(2021),'YES')
# ass(f(4040),'YES')
# ass(f(4041),'YES')
# ass(f(4042),'YES')

t = intline()[0]
for i in range(t):
	print(f(intline()[0]))
