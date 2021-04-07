def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

cache = {}
def lucky(d,item):
	if item in cache: return cache[item]
	if item < d: return False
	elif item >= d * 10: return True
	elif item % d == 0: return True
	elif item % 10 == d: return True
	res = lucky(d,item-d)
	cache[item] = res
	return res

def f(d,arr):
	cache.clear()
	for item in arr:
		print('YES' if lucky(d,item) else 'NO')

for _ in range(nr()):
	q,d = nrs()
	f(d,nrs())
