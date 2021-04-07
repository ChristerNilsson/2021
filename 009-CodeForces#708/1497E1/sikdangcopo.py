def nr(): return nrs()[0]
def nrs(): return [int(item) for item in input().split()]

n=10000010

m=[0]*n
for i in range(1,n):
	if m[i]!=0: continue
	m[i]=i
	j=1
	while i*j*j<=n:
		m[i*j*j]=i
		j+=1

def f(a):
	s=set()
	r=1
	for i in a:
		if m[i] in s:
			r+=1
			s=set()
		s.add(m[i])
	return r

for t in range(nr()):
	N,K=nrs()
	A=nrs()
	print(f(A))
