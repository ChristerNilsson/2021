for t in range(int(input())):
	n,q = [int(item) for item in input().split()]
	a = input()
	for i,j in [[int(item) for item in input().split()] for i in range(q)]: print('YES' if a[i-1] in a[0:i-1] or a[j-1] in a[j:] else 'NO')
