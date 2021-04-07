def ass(a, b):
	if a != b:
		print(f"Assertion error: {a} != {b}")
	else:
		print('OK')
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

def f(k, balls):
	flag = 1
	for x0, y0 in balls:
		for x1, y1 in balls:
			if abs(x0 - x1) + abs(y0 - y1) > k:
				flag = -1
				break
		else:
			flag = 1
			break
	return flag

for t in range(number()):
	n, k = numbers()
	balls = [numbers() for i in range(n)]
	print(f(k, balls))
