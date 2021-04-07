nrs = -> parseInt i for i in readline().split ' '
nr = -> nrs()[0]

min = (arr) ->
	best = arr[0]
	for item in arr
		if item < best then best=item
	best

for _ in [0...nr()]
	nx = nrs()
	n = nx[0]
	x = nx[1]
	A = nrs()

	a = A.shift()
	mult = 0
	mults = []
	while a % Math.pow(x,mult+1) == 0
		mult+=1
	mults.push mult
	for b in A
		while b % Math.pow(x,mult)
			mult -= 1
		mults.push mult
	iters = 1 + min mults
	A.unshift a

	sum = 0
	for i in [0...A.length]
		sum += A[i] * (Math.min(iters,mults[i])+1)
	print sum
