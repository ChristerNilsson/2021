from collections import *
from itertools import *

for s in[*open(0)][2::2]:
	a = [int(i) for i in s.split()]
	c = Counter(k for k,g in groupby(a))
	print(min(c[x] - 1 + (x!=a[0]) + (x!=a[-1]) for x in c))
