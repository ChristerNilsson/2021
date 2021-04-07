def ass(a, b):
	if a != b: print(f"Assertion error: {a} != {b}")
	else: print('OK')
def number(): return int(input())
def numbers(): return [int(item) for item in input().split()]
def word():    return input()
def words():   return [item for item in input().split()]
def dump(lst):
	for i, item in enumerate(lst): print(i, item)
def binsearch(arr, a, b):
	m = (a + b) // 2
	if a >= b: return a - 1 if arr[a] == 0 else a
	return binsearch(arr, a, m - 1) if arr[m] == 0 else binsearch(arr, m + 1, b)

def f(arr):
	arr = [item for sublist in arr for item in sublist]
	neg = 0
	pos = 0
	zero = 0
	summa = 0
	smallest = abs(arr[0])
	for item in arr:
		if item < 0: neg += 1
		elif item == 0: zero += 1
		else: pos += 1
		summa += abs(item)
		if abs(item) < smallest: smallest = abs(item)
	if neg % 2 == 0: return summa
	else:
		return summa if zero > 0 else summa - 2*smallest

for t in range(number()):
	n,m = numbers()
	arr = [numbers() for i in range(n)]
	print(f(arr))
