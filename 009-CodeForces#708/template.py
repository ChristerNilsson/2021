#import math
#import random
#import time
import os,io
input=io.BytesIO(os.read(0,os.fstat(0).st_size)).readline
def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def nr(): return int(input())
def nrs(): return [int(i) for i in input().split()]
def word():    return input()
def words():   return [i for i in input().split()]
def dump(lst):
	for i, item in enumerate(lst): print(i, item)
def binsearch(arr, a, b):
	m = (a + b) // 2
	if a >= b: return a - 1 if arr[a] == 0 else a
	return binsearch(arr, a, m - 1) if arr[m] == 0 else binsearch(arr, m + 1, b)
def gcd(x,y): return x if y == 0 else gcd(y, x % y)
def lcm(x,y): return x*y//gcd(x,y)

def f(x,arr):
	return x,arr

for i in range(nr()):
	n,x = nrs()
	print(f(x,nrs()))
