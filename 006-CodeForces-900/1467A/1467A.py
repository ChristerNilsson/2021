def ass(a, b):
	if a != b: print(f"Assertion error: {a} != {b}")
	else: print('OK')
def intline(): return [int(item) for item in input().split()]
def line(): return [item for item in input().split()]
def number(): return int(input())
def dump(lst):
	for i, item in enumerate(lst): print(i, item)
def binsearch(arr, a, b):
	m = (a + b) // 2
	if a >= b: return a - 1 if arr[a] == 0 else a
	return binsearch(arr, a, m - 1) if arr[m] == 0 else binsearch(arr, m + 1, b)

def f(n):
	res = '9'
	digit = 8
	for i in range(n-1):
		res += str(digit)
		digit = (digit+1)%10
	return res

# ass(f(1),'9')
# ass(f(2),'98')
# ass(f(3),'989')
# ass(f(4),'9890')
# ass(f(5),'98901')
# ass(f(6),'989012')
# ass(f(10),'9890123456')
# ass(f(20),'98901234567890123456')


t = number()
for i in range(t):
	n = number()
	print(f(n))
