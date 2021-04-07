for _ in [0...parseInt readline()]
	c=0
	for i in readline()
		c+= if i=='B' and c>0 then -1 else 1
	print c
