def number(): return int(input())

arr = [-1]
s = ''
for i in range(10):
	arr += [str(j)+s for j in range(1,10-i)]
	s = str(9-i) + s
arr += [-1]*5

for i in range(int(input())): print(arr[int(input())])
