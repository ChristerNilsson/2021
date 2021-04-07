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

def gcd(x, y): return x if y == 0 else gcd(y, x % y)
#ass(gcd(4,6),2)
def lcm(x,y): return x*y//gcd(x,y)
#ass(lcm(4,6),12)

def f(s,t):
	ns = len(s)
	nt = len(t)
	n = gcd(ns,nt) # 2
	res = ns * nt // n # 12
	item = s[0:n]
	if ns//n * item == s and nt//n * item == t:
		return res//n * item
	else:
		return -1

# ass(f('baba','bababa'),'babababababa')
# ass(f('baba','ba'),'baba')
# ass(f('aa','aaa'),'aaaaaa')
# ass(f('aba','ab'),-1)

for i in range(number()):
	s = word()
	t = word()
	print(f(s,t))
