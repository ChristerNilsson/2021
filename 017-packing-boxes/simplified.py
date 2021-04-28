import time

def ass(a,b):
	if a == b: return
	print(a,b)
	assert a == b

cache = {}
def solve(H,W,h,w,level=''):
	#if level == '': print((H*W)//(h*w))
	if level == '': cache.clear()
	key = (H,W)
	if key in cache: return cache[key]
	#print(len(level),level,'solve',H,W,h,w)
	if (H<h or W<w) and (W<h or H<w): return 0
	if H%h == 0 and W%w == 0: return (H//h) * (W//w)
	if H%w == 0 and W%h == 0: return (H//w) * (W//h)

	walls = [x for x in range(w,W//2,w)] + [y for y in range(h,H//2,h)]
	walls = list(set(walls))
	walls.sort()

	# Låt oss iaktta murens högra sida.
	# width och height anger murstenens bredd och höjd

	alternatives = []
	for wall in walls: # wall anger murens totala tjocklek
		if wall % w == 0:
			width,height = w,h
		else:
			width,height = h,w
		#if 2 * width > W: continue
		#if 2 * height > H: continue
		count = wall // width # murens tjocklek i antal stenar
		temp = (H-wall) // height # antal stenar på höjden
		if temp == 0 or temp * height > H-wall: # krock, beräkna sidorna olika
			antal = H // height + (W - 2 * wall) // width # ver och hor olika
		else:
			antal = (H-wall) // height * 2 # ver och hor samma
		value = 2*antal*count + solve(H-2*wall, W-2*wall, h,w, level+' ')
		#print(len(level),level,'xx',wall,value)
		alternatives.append(value)
	if len(alternatives) == 0:
		#print("Skum",H,W,(H*W)//(h*w))
		return (H*W)//(h*w) # SKUM!
	cache[key] = max(alternatives)
	return cache[key]

start = time.time()
for i in range(1):
	ass(0,solve(6,4,7,4))
	ass(1,solve(7,4,7,4))
	ass(1,solve(4,7,7,4))
	ass(1,solve(5,8,7,4))
	ass(4,solve(14,8,7,4))
	ass(2,solve(8,7,7,4))
	ass(4,solve(11,11,7,4))
	ass(2,solve(10,10,7,4))
	ass(4,solve(11,11,7,4))
	ass(12,solve(20,20,7,4))
	ass(32,solve(30,30,7,4))
	ass(56,solve(40,40,7,4))
	ass(88,solve(50,50,7,4)) # eg 89
	ass(128,solve(60,60,7,4))
	ass(154,solve(66,66,7,4)) # eg 155
	ass(356,solve(100,100,7,4)) # 357
	ass(1426,solve(200,200,7,4)) # [1428]

	ass(8928,solve(500,500,7,4)) # [8928] 28 ms

	ass(35714,solve(1000,1000,7,4)) # [35714] 195 ms
	ass(35785,solve(1001,1001,7,4)) # [35785] 131 ms
	ass(35856,solve(1002,1002,7,4)) # [35857] 201 ms
	ass(35928,solve(1003,1003,7,4)) # [35928] 232 ms
	#
	ass(142856,solve(2000,2000,7,4)) # [142857] 1487 ms
	ass(540,solve(2560,2560,143,84)) # [545] 1 ms

# Rectangular, not quadratic
#	ass(112,solve(2296,1230,136,94))
#print(len(cache),cache)

print(time.time() - start)

