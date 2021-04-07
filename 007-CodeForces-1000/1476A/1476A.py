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

def f(n,k):
	if n%k == 0: return 1
	if k < n:    return 2
	if k%n == 0: return k//n
	return 1 + k//n

# ass(f(1,1),1)
# ass(f(2,1),1)
# ass(f(4,2),1)
# ass(f(4,3),2)
# ass(f(8,1),1)
# ass(f(8,3),2)
# ass(f(8,7),2)
# ass(f(8,8),1)
# ass(f(8,9),2)
# ass(f(8,15),2)
# ass(f(8,16),2)
# ass(f(8,17),3)
# ass(f(8,23),3)
# ass(f(8,24),3)
# ass(f(8,25),4)

for i in range(number()):
	n,k = numbers()
	print(f(n,k))
