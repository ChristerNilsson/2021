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

def f(arr):
	for i in range(len(arr)-1):
		amount = arr[i] - i
		if amount >= 0:
			arr[i]   -= amount
			arr[i+1] += amount
	#print(arr)
	for i in range(len(arr)-1):
		if arr[i] >= arr[i+1]: return 'NO'
	return 'YES'

# ass(f([1,2]),'YES')
# ass(f([1,0]),'YES')
# ass(f([4,4,4]),'YES')
# ass(f([0,]),'YES')
# ass(f([0,0]),'NO')
# ass(f([0,0,0]),'NO')
# ass(f([0,1,0]),'NO')
#
# ass(f([0,1,1]),'NO')
# ass(f([1,0,1]),'NO')
# ass(f([1,1,0]),'NO')
#
# ass(f([0,2,2]),'YES')
# ass(f([2,0,2]),'YES')
# ass(f([2,2,0]),'YES')
#
# ass(f([0,1,2]),'YES')
# ass(f([0,2,1]),'YES')
# ass(f([1,0,2]),'YES')
# ass(f([1,2,0]),'YES')
# ass(f([2,0,1]),'YES')
# ass(f([2,1,0]),'YES')
#
# ass(f([1,1,2]),'YES')
# ass(f([1,2,1]),'YES')
# ass(f([1,1,2]),'YES')
# ass(f([1,2,1]),'YES')
# ass(f([2,1,1]),'YES')
# ass(f([2,1,1]),'YES')
#
# ass(f([0,0,6]),'NO')

# ass(f([1000000000,1000000000,1000000000,1000000000]),'YES')

t = intline()[0]
for i in range(t):
	n = intline()[0]
	print(f(intline()))
