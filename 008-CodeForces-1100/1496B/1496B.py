import math
def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

def mex(arr):
	i=0
	for item in arr:
		if i != item: return i
		i += 1
	return len(arr)
# ass(mex(set([1,4,0,2])),3)
# ass(mex(set([2,5,1])),0)
# ass(mex(set([0,1,2])),3)
# ass(mex(set([0,4,8])),1)

def step (s) :
	a = mex(s)
	b = max(s)
	return math.ceil((a+b)/2)
# ass(step(set([4,0,8])),5)

def move(s):
	s.add(step(s))
	return s

def f(k,arr):
	arr.sort()
	s = set(arr)
	if min(s)==0 and max(s)==len(s)-1: return k+len(s)
	for i in range(k):
		news = move(s)
		if len(s) == len(news): break
		s = news
	return len(s)

# ass(f(10,[0,1,2]),13)
# ass(f(10,[0,1,2,3]),14)
#
# ass(f(1,[0,1,3,4]),4)
# ass(f(1,[0,1,4]),4)
# ass(f(0,[0,1,4]),3)
# ass(f(1,[0,1,3]),3)
# ass(f(1,[0,2,3]),3)
# ass(f(2,[1,2,3]),3)
# ass(f(1,[0,2,4]),4)
# ass(f(2,[0,2,4]),4)
#
# ass(f(114514,[8,0,4]),4)

for _ in range(nr()):
	n,k = nrs()
	print(f(k,nrs()))
