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

def f(max,arr):
	c = [0,0,0]

	if arr[0] <= max[0]: c[0] = arr[0]
	else: return 'NO'
	if arr[1] <= max[1]: c[1] = arr[1]
	else: return 'NO'
	if arr[2] <= max[2]: c[2] = arr[2]
	else: return 'NO'

	antal = min(arr[3],max[0]-c[0])
	if antal >= 0:
		c[0] += antal
		c[2] += arr[3] - antal

	antal = min(arr[4],max[1]-c[1])
	if antal >= 0:
		c[1] += antal
		c[2] += arr[4]-antal

	result = c[0]<=max[0] and c[1]<=max[1] and c[2]<=max[2] and sum(c)==sum(arr)
	return 'YES' if result else 'NO'

# ass(f([1,2,3],[1,2,3,0,0]),'YES')
# ass(f([2,2,3],[1,2,3,1,0]),'YES')
# ass(f([2,2,3],[1,2,3,0,1]),'NO')
# ass(f([1,2,5],[1,2,3,1,1]),'YES')
# ass(f([0,0,0],[0,0,0,0,0]),'YES')
# ass(f([0,0,4],[1,0,0,0,0]),'NO')
# ass(f([13,37,42],[0,0,0,40,47]),'YES')

t = intline()[0]
for i in range(t):
	max = intline()
	arr = intline()
	print(f(max,arr))
