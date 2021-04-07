def II(): return int(input())
def MI(): return map(int, input().split())
def LI(): return list(map(int, input().split()))
def LLI(rows_number): return [LI() for _ in range(rows_number)]
def BI(): return input().rstrip()
def SI(): return input().rstrip().decode()

class Sieve:
	def __init__(self, n):
		self.plist = [2]
		min_prime_factor = [2, 0] * (n // 2 + 5)
		for x in range(3, n + 1, 2):
			if min_prime_factor[x] == 0:
				min_prime_factor[x] = x
				self.plist.append(x)
				if x ** 2 > n: continue
				for y in range(x ** 2, n + 5, 2 * x):
					if min_prime_factor[y] == 0:
						min_prime_factor[y] = x
		self.min_prime_factor = min_prime_factor

	# def isprime(self, x):
	# 	return self.min_prime_factor[x] == x

	# def pfct(self, x):
	# 	pp, ee = [], []
	# 	while x > 1:
	# 		mpf = self.min_prime_factor[x]
	# 		if pp and mpf == pp[-1]:
	# 			ee[-1] += 1
	# 		else:
	# 			pp.append(mpf)
	# 			ee.append(1)
	# 		x //= mpf
	# 	return [(p, e) for p, e in zip(pp, ee)]

sv = Sieve(20100)
pp = sv.plist
print(pp)

from bisect import bisect_left as bl

for _ in range(II()):
	d = II()
	i = bl(pp, d + 1)
	a = pp[i]
	i = bl(pp, a + d)
	b = pp[i]
	print(a * b)
