def nr(): return int(input())
def word(): return input()

def f(w):
	a = []
	b = []
	for ch in w:
		if ch=='A':
			a.append(ch)
			b.append(ch)
		else:
			a.pop() if len(a) >= 1 else a.append(ch)
			b.pop() if len(b) >= 1 else b.append(ch)
	return min(len(a),len(b))

for _ in range(nr()): print(f(word()))

# for _ in range(int(input())): # sedenion
# 	c=0
# 	for i in input(): c=c-1 if i=='B' and c!=0 else c+1
# 	print(c)

# import random
# import time
# start = time.time()
# s = ''
# random.seed(0)
# for i in range(200000):
# 	s+="AB"[random.randint(0,1)]
# print(s)
# print(f(s))
# print(time.time()-start )

