def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def nr(): return int(input())
def nrs(): return [int(i) for i in input().split()]

def f(n,tags,scores):
	dp = [0] * n
	for i in range(1,n):
		for j in range(i-1,-1,-1):
			if tags[i] == tags[j]: continue
			score = abs(scores[i] - scores[j])
			dp[i],dp[j] = max(dp[i],dp[j] + score), max(dp[j],dp[i] + score)
	return max(dp)

# ass(f(4,[1,2,3,4],[5,10,15,20]),35)
# ass(f(4,[1,2,1,2],[5,10,15,20]),30)
# ass(f(4,[2,2,4,1],[2,8,19,1]),42)
# ass(f(8,[1,2,3,3,4,5,6,7],[93,95,97,99,88,74,81,96]),129)

for _ in range(nr()):
	n = nr()
	tags = nrs()
	scores = nrs()
	print(f(n,tags,scores))
