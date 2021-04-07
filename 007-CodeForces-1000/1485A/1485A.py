import time
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

cache = {}

def dp(a,b):
	level=0
	if b==2 and a>3:
		b+=1
		level=1
	if b==1 and a>3:
		b+=2
		level=2

	queue = [[a,b]]
	#cache = {}

	def save(a,b):
		#key = str(a)+'|'+str(b)
		#if key not in cache:
		#	cache[key] = parent
		q2.append([a,b])

	while True:
		q2 = []
		level += 1
		for a,b in queue:
			if a < b: return level
			#parent = str(a) + '|' + str(b)
			save(a//b,b)
			save(a,b+1)
		queue = q2

#start = time.time()
#print(dp(2,2))
for i in range(number()):
	a,b = numbers()
	print(dp(a,b))
#print(time.time()-start)
