def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def number(): return int(input())
def numbers(): return [int(item) for item in input().split()]

def dp(x,a):
	mn = float('inf')
	for idx,item in enumerate(a):
		c = 0
		if item % (x ** mn) != 0:
			while item % x == 0:
				item //= x
				c += 1
				if c >= mn:	break
			if c < mn:
				mn = c
				min_idx = idx

	return sum(a) * (mn + 1) + sum(a[:min_idx])

ass(dp(2,[12]),36)
ass(dp(2,[4,6,8,2]),44)
ass(dp(3,[1,12]),13)
ass(dp(2,[4,6,8,9]),45)
ass(dp(7,[49,49,49,7,49]),553)

# for i in range(number()):
# 	n,x = numbers()
# 	print(dp(x,numbers()))

