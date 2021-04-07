def nr(): return int(input())

cubes = {}
for i in range(1,10000+1):
	cubes[i*i*i] = True

def f(n):
	for cube in cubes:
		if n-cube in cubes: return 'YES'
	return 'NO'

for i in range(nr()):
	print(f(nr()))
