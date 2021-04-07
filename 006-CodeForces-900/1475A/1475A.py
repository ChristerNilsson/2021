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

# def f(n):
# 	if n%2 == 1: return 'YES'
# 	if n >= 3: return f(n//2)
# 	return 'NO'

def f(n):return 'NO' if n&(n-1) == 0 else 'YES'

ass(f(2),'NO')
ass(f(3),'YES')
ass(f(4),'NO')
ass(f(5),'YES')
ass(f(6),'YES')
ass(f(7),'YES')
ass(f(8),'NO')
ass(f(10),'YES')
ass(f(12),'YES')
ass(f(14),'YES')
ass(f(998244353),'YES')
ass(f(3*12),'YES')
ass(f(8*8),'NO')
ass(f(10*10),'YES')
ass(f(1099511627776),'NO')

# t = intline()[0]
# for i in range(t):
# 	print(f(intline()[0]))
