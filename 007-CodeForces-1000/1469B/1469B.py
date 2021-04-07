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

def f(rs,bs):

	x = 0
	rbest = 0
	for item in rs:
		x += item
		if x > rbest: rbest = x

	x = 0
	bbest = 0
	for item in bs:
		x += item
		if x > bbest: bbest = x

	return max(0,rbest+bbest)

# rs = [-20,45,-28,-37,7,-44,-44,-74,-21,-25,-53,-68,-2,-47,25,-60,-53,-24,23,-94,-15,-23,17,-22,-8,-30,23,-58,-95,-24,45,27,-52,-18,10,30,-64,-93,-34,-67,-94,10,-99,-21,-19,-42,25,-93,-80,6,25,14,-46,-65,-33,-37,10,-89,3,-33,-13,22,-24,30,-25,33,-30,13,19,13,-10,-34,-17,33,-4,17,45,-63,-29,-12,35,43,10,-81,38]
# bs = [-8,-23,-38,41,19,19,-6,25,-58,-67,39,-77,-83,5,-47]
# ass(f(rs,bs),54)

for i in range(number()):
	n = number()
	rs = numbers()
	m = number()
	bs = numbers()
	print(f(rs,bs))
