def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

for _ in range(nr()):
	n, k = nrs()

	r = []
	if k > 3:
		r = [1] * (k-3)
		n -= k-3

	h = n//2
	if n%2 == 1:
		r += [h,h,1]
	else:
		if h%2 == 0:
			r += [h,h // 2,h // 2]
		else:
			r += [h - 1,h - 1,2]

	print(*r)
