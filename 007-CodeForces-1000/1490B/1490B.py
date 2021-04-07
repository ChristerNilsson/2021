def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
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
def gcd(x,y): return x if y == 0 else gcd(y, x % y)
def lcm(x,y): return x*y//gcd(x,y)

def f(arr):
	c = [0,0,0]
	for item in arr:
		c[item%3] += 1
	#print(c)
	counter = 0
	while True:
		i = c.index(max(c))
		if c[i] == len(arr)//3: return counter
		c[i] -= 1
		c[(i+1)%3] += 1
		counter += 1

for i in range(number()):
	_ = number()
	print(f(numbers()))
