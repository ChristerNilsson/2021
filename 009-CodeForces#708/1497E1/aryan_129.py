import time
def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def number(): return int(input())
def numbers(): return [int(item) for item in input().split()]

r = 10 ** 7 + 10
m = [i for i in range(r)]

antal = 0
for i in range(2, int(r ** 0.5)):
	i *= i
	for j in range(i, r, i):
		while m[j] % i == 0:
			antal+=1
			m[j] //= i
print(antal)

def f(n,k,arr):
	s = set()
	ans = 1
	for item in arr:
		a = m[item]
		if a in s:
			ans += 1
			s = set()
		s.add(a)
	return ans

# ass(f(5,0,[18,6,2,4,1]),3)
# ass(f(5,0,[6,8,1,24,8]),2)
# ass(f(1,0,[1]),1)
# ass(f(11,0,[18,6,2,4,1,7,35,47,23,43,71]),3)

start = time.time()
for _ in range(number()):
	n, k = numbers()
	arr = numbers()
	print(f(n,k,arr))
print(time.time()-start)

