import math

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

def f(x,arr):
	min = math.ceil(sum(arr)/x)
	max = sum([math.ceil(item/x) for item in arr])
	return str(min) + ' '+ str(max)

# ass(f(3,[3,6,9]),[6,6])
# ass(f(3,[6,4,11]),[7,8])

t = intline()[0]
for i in range(t):
	n,x = intline()
	print(f(x,intline()))
