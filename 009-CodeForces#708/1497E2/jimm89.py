def nr(): return nrs()[0]
def nrs(): return [int(i) for i in input().split()]

def get_prime(n):
	res = []
	for i in range(2,n):
		is_prime = True
		for x in res:
			if i % x == 0:
				is_prime = False
				break
		if is_prime: res.append(i)
	return res

prime = get_prime(3162)

cache = {}
def get_mask (num):
	key = num
	if key in cache: return cache[key]
	dv = []
	for p in prime:
		c = 0
		while num % p == 0:
			c += 1
			num = num // p
		if c % 2 == 1:
			dv.append(p)
		if num < p * p:
			break

	for x in dv:
		num *= x

	cache[key] = " ABCDEFGHIJKLM"[num]
	return cache[key]

def f(N,K,A):
	X = N+1
	dp = [X] * (K + 1)
	dp[0] = 1
	used = ["" for _ in range(K+1)] # hash är snabbare
	print('  i j   0 1 2 3 4  used[j]  X==12')
	for i,a in enumerate(A):
		print(" ")
		a = get_mask(a)
		for j in range(K, -1, -1):
			if dp[j] == X: continue
			if a in used[j]:
				if j < K and dp[j + 1] > dp[j]:
					dp[j + 1] = dp[j] # A
					used[j + 1] = used[j]
				dp[j] += 1 # B
				used[j] = ""
			used[j] += a
			d = ' '.join(['X' if item==X else str(item) for item in dp])
			#u = [((''.join(item.keys()))) for item in used]
			print(a,i%10,j,'| ' + d,' '+' '.join(used))
	return min(dp)

f(11,4,[6,2,2,8,9,1,3,6,3,9,7])
#f(11,4,[7,7,7,7,7,7,7,7,7,7,7])
#f(11,4,[1,2,3,5,6,7,6,5,3,2,1])

# for _ in range(nr()):
# 	N, K = nrs()
# 	A = nrs()
# 	print(f(N,K,A))
