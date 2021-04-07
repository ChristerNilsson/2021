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

for i in range(number()):
	w = word()
	print('NO' if len(w) % 2 == 1 or w[0] == ')' or w[-1] == '(' else 'YES')
