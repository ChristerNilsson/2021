import math,random,time
from collections import *
from itertools import *
def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')

def nr(): return int(input())
def nrs(): return [int(i) for i in input().split()]
def nrss(n): return [nrs() for _ in range(n)]
def word(): return input()
def words(): return [w for w in input().split()]

def rx(): return [s.rstrip() for s in open(0)]
def nrx(s): return int(s)
def nrxs(s): return [int(i) for i in s.split()]
def wrx(s): return s
def wrxs(s): return [w for w in s.split()]

def dump(lst):
	for i, item in enumerate(lst): print(i, item)
def binsearch(arr, a, b):
	m = (a + b) // 2
	if a >= b: return a - 1 if arr[a] == 0 else a
	return binsearch(arr, a, m - 1) if arr[m] == 0 else binsearch(arr, m + 1, b)
def gcd(x,y): return x if y == 0 else gcd(y, x % y)
def lcm(x,y): return x*y//gcd(x,y)
def sign(a): return 0 if a==0 else int(a/abs(a))

def f(n,m,x):
	x = x - 1
	i,j = x%n,x//n
	return 1+j+i*m

# ass(f(3,5,1),1)
# ass(f(3,5,2),6)
# ass(f(3,5,3),11)
# ass(f(3,5,4),2)
# ass(f(3,5,15),15)

for s in rx()[1::1]:
	n,m,x = nrxs(s)
	print(f(n,m,x))
