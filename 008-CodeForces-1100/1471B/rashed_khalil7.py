def ns():return[int(i)for i in input().split()]
def f():
	n,x=ns()
	a=ns()
	s=0
	u=1
	while 1:
		for i in a:
			if i%u:return s
			else:s+=i
		u*=x
for _ in range(int(input())):print(f())
