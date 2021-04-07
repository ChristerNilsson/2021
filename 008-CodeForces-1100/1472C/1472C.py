def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

def f(arr):
	n = len(arr)
	a = [0] * (n+1)
	for i in range(n):
		j = i + arr[i]
		index = min(n,j)
		a[index] = max(a[index],a[i]+arr[i])
	return a[-1]

# ass(f([2,1000,2,3,995,1]),1000)
# ass(f([2,2,2,2,2,2]),6)
# ass(f([2,2,2,2,2]),6)
# ass(f([2,2,2,2]),4)
# ass(f([5,4,3,2,1]),5)
# ass(f([1,2,3,4,5]),7)
# ass(f([1,1,1,1,1]),5)
# ass(f([4,1,4,3]),5)
# ass(f([5,2,2,5,2]),7)

for _ in range(nr()):
	_ = nr()
	print(f(nrs()))
