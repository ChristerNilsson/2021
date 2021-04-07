nrs = -> parseInt i for i in readline().split ' '
nr = -> nrs()[0]

min = (lst) ->
	best = lst[0]
	for item in lst
		best = if item < best then item else best 
	best 

n = 10000000

get_prime = (n) ->
	res = []
	for i in [2...n]
		is_prime = true
		for x in res
			if i % x == 0
				is_prime = false
				break
		if is_prime then res.push i
	res

prime = get_prime 3162

cache = {}
get_mask = (num) ->
	key = num
	if key in cache then return cache[key]
	dv = []
	for p in prime
		c = 0
		while num % p == 0
			c += 1
			num = num // p
		if c % 2 == 1
			dv.push p
		if num < p * p
			break

	for x in dv
		num *= x

	cache[key] = num
	num

for _ in [0...nr()]
	NK = nrs()
	N = NK[0]
	K = NK[1]
	A = nrs()
	dp = (N for _ in [0..K+1])
	dp[0] = 1
	used = ({} for _ in [0...K+1])
	for a in A
		a = get_mask a
		for j in [K..0]
			if dp[j] == N then continue 
			if a of used[j]
				if j < K and dp[j + 1] > dp[j]
					dp[j + 1] = dp[j]
					used[j + 1] = used[j]
				dp[j] += 1
				used[j] = {}
			used[j][a] = 1
	print min dp
