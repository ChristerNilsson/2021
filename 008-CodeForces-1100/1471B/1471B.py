def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

def f(x,arr):
	arr = [[item,1]for item in arr]
	summa = 0
	arr2 = []
	while True:
		summa += sum([q*antal for q,antal in arr])
		for q,antal in arr:
			if q % x == 0:
				arr2 += [[q//x,antal*x]]
			else:
				return summa + sum([q*antal for q,antal in arr2])
		arr,arr2 = arr2,[]

for _ in range(nr()):
	n,x = nrs()
	print(f(x,nrs()))

