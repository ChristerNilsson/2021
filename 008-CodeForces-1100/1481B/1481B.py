def ass(a, b): print(f"Assertion error: {a} != {b}" if a != b else 'OK')
def nr(): return int(input())
def nrs(): return [int(item) for item in input().split()]

def f(k,arr):
	index = -2
	i = 0
	while i < len(arr)-1:
		if arr[i] < arr[i+1]:
			k -= 1
			arr[i] += 1
			if k <= 0: return i+1
			if i > 0: i -= 1
		else:
			i += 1
	return index+1

# ass(f(3,[4,1,2,3]),2)
# ass(f(2114,[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100]),23)
# ass(f(260,[50,62,32,42,23,8,95,64,54,89,79,66]),4)

for i in range(nr()):
	n,k = nrs()
	print(f(k,nrs()))
