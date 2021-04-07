def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def number(): return int(input())
def numbers(): return [int(item) for item in input().split()]

# Man måste inse att additioner (i) sker före div (c)
# Tydligen behövs max 7 additioner

def solve(a, b):
	res = 999999
	for i in range(8):
		if b + i == 1: continue
		c = []
		tmp = a
		while tmp > 0:
			c.append(tmp)
			tmp //= b + i
		print(c,i,len(c))
		if i+len(c) < res: res = i+len(c)
	return res

print(solve(1337,1))

# for t in range(number()):
# 	a, b = numbers()
# 	print(solve(a,b))
