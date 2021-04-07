import time
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
def gcd(x,y): return x if y == 0 else gcd(y, x % y)
def lcm(x,y): return x*y//gcd(x,y)

from bisect import bisect_left as bl

def primes(n):
	result = [2]
	for num in range(3, n + 1, 2):
		for i in result:
			if num % i == 0: break
		else:
			result.append(num)
	return result

def f(d):
	a = arr[bl(arr,1+d)]
	b = arr[bl(arr,a+d)]
	return a*b

problems = [number() for _ in range(number())]
maxproblem = max(problems)
arr = primes(2*maxproblem+11)
for problem in problems:
	print(f(problem))
