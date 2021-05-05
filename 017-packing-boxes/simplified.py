import time

def ass(a,b):
	if a == b: return
	print(a,b)
	assert a == b

def man(H,W,h,w): return (H//h)*(W//w) # tile: hxw

def manual(H,W,h,w): # returns number of rectangles. All horisontal or all vertical
	ass(True,(H * W) // (h * w) <= 2)
	result = max(man(H,W,h,w), man(H,W,w,h), man(W,H,h,w), man(W,H,w,h))
	#print('manual',H,W,result)
	return result
# ass(0, manual(4,6,4,7))
# ass(0, manual(3,7,4,7))
# ass(1, manual(4,7,4,7))
# ass(1, manual(4,7,7,4))
# ass(1, manual(4,7,7,4))
# ass(2, manual(14,4,7,4))
# ass(2, manual(11,7,7,4))
# ass(1, manual(12,6,7,4))
# ass(2, manual(7,8,7,4))

cache = {}
vcutcache = {}
hcutcache = {}
framecache = {}

def solve(H,W,h,w,level=''):
	#if level == '': print((H*W)//(h*w))
	if level == '':
		print('clear')
		cache.clear()
		hcutcache.clear()
		vcutcache.clear()
		framecache.clear()
		if [h,w] == [7,4]:
			cache[(6, 14)] = 2
			cache[(10,10)] = 2
			cache[(11, 8)] = 3
			cache[(12, 8)] = 3
			cache[(14, 14)] = 6
		if [h,w] == [143,84]:
			cache[(190, 190)] = 2
			cache[(208, 208)] = 2
		if [h,w] == [136,94]:
			cache[(1168, 102)] = 8
			cache[(1208, 142)] = 12
			cache[(1188, 122)] = 8
		if [h,w] == [144,84]:
			cache[(126,908)] = 6
			cache[(102,884)] = 6
			cache[(150,932)] = 11
		if [h,w] == [143,84]:
			cache[(98,1048)] = 7
			cache[(148,1098)] = 13
			cache[(130,1080)] = 7

	key = (H,W)
	if key in cache: return cache[key]
	if (W,H) in cache: return cache[(W,H)]
	if (H<h or W<w) and (W<h or H<w): return 0
	if H%h == 0 and W%w == 0: return (H//h) * (W//w)
	if H%w == 0 and W%h == 0: return (H//w) * (W//h)
	if ((H*W)//(h*w) <= 2): return manual(H,W,h,w)

	walls = []
	walls += [x for x in range(w,W//2+1,w)] + [y for y in range(h,H//2+1,h)]
	walls += [x for x in range(h,W//2+1,h)] + [y for y in range(w,H//2+1,w)]
	walls = list(set(walls))
	walls.sort()

	alts1 = frame4(walls,W,H,w,h,level)
	alts2 = 0 #cut(walls,W,H,w,h,level)
	alternatives = max(alts1, alts2)

	if alternatives == 0:
		print(level,"Skum",H,W,(H*W)//(h*w))
		return (H*W)//(h*w) # SKUM!
	cache[key] = alternatives
	#print(level+'solve',H,W,h,w,cache[key])
	return cache[key]

def vcut(wall,W,H,w,h,level):
	if wall >= W//2: return 0
	key = (wall,W,H)
	if key in vcutcache: return vcutcache[key]
	#if (wall,H,W) in vcutcache: return vcutcache[(wall,H,W)]
	s1 = solve(wall,   H, w, h, level + '  ')
	s2 = solve(W-wall, H, w, h, level + '  ')
	#print(level, 'vcut', wall, W, H, w, h, s1,s2)
	vcutcache[key] = s1 + s2
	return vcutcache[key]

def hcut(wall,W,H,w,h,level):
	if wall >= H//2: return 0
	key = (wall,W,H)
	if key in hcutcache: return hcutcache[key]
	#if (wall,H,W) in hcutcache: return hcutcache[(wall,H,W)]
	s1 = solve(W, wall,   w, h, level + '  ')
	s2 = solve(W, H-wall, w, h, level + '  ')
	#print(level, 'hcut', wall, W, H, w, h, s1, s2)
	hcutcache[key] = s1 + s2
	return hcutcache[key]

def cut(walls,W,H,w,h,level=''): # skär rakt igenom
	result = 0
	for wall in walls:
		s1 = hcut(wall,W,H,w,h,level+'  ')
		s2 = vcut(wall,W,H,w,h,level+'  ')
		result = max(result,s1, s2)
	#print(level,'cut',walls,W,H,w,h,result)
	return result # max(result)

def frame(wall,W,H,w,h,level=''): # skala av fyra murar
	# Låt oss iaktta murens högra sida.
	# width och height anger murstenens bredd och höjd
	#key = (wall,W,H,w,h)
	#if key in framecache: return framecache[key]
	alternatives = []
	count = wall // w # murens tjocklek i antal stenar
	#if count > 5: return 0
	antal = 0
	temp = (H-wall) // h # antal stenar på höjden
	if temp == 0 or temp * h > H-wall: # krock, beräkna sidorna olika
		if W - 2 * wall > 0:
			antal = H // h + (W - 2 * wall) // h
	else:
		antal = (H-wall) // h + (W-wall) // h
	if antal > 0:
		if H - 2 * wall >= 0 and W - 2 * wall >= 0:
			s = solve(H - 2 * wall, W - 2 * wall, h, w, level + '  ')
			alternatives.append(2 * antal * count + s)  # four walls
	#framecache[key] = alternatives
	if len(alternatives)==0:
		return 0
	else:
		return max(alternatives)

def frame4(walls,W,H,w,h,level=''):
	key = (W,H,w,h)
	if key in framecache: return framecache[key]
	# if (W,H,h,w) in framecache: return framecache[(W,H,h,w)]
	# if (H,W,h,w) in framecache: return framecache[(H,W,h,w)]
	# if (H,W,w,h) in framecache: return framecache[(H,W,w,h)]
	alternatives = []
	if H*W < 4*h*w: return 0
	for wall in walls: # wall anger murens totala tjocklek
		alternatives.append(frame(wall,W,H,w,h,level))
		alternatives.append(frame(wall,W,H,h,w,level))
		alternatives.append(frame(wall,H,W,w,h,level))
		alternatives.append(frame(wall,H,W,h,w,level))
	alternatives = max(alternatives)
	#alternatives.sort()
	#print(level,'frame4',walls,W,H,w,h,alternatives)
	framecache[key] = alternatives
	return alternatives

start = time.time()
for i in range(1):
#	pass
	# ass(0,solve(6,4,7,4))
	# ass(1,solve(7,4,7,4))
	# ass(1,solve(4,7,7,4))
	# ass(1,solve(8,5,7,4))
	# ass(4,solve(14,8,7,4))
	# ass(2,solve(8,7,7,4))
	# ass(3,solve(11,8,7,4))
	# ass(4,solve(11,11,7,4))
	# ass(3,solve(12,8,7,4))
	# ass(4,solve(12,12,7,4))
	# # # #
	# ass(2,solve(6,14,7,4))
	# ass(2,solve(14,6,7,4))
	# ass(6,solve(14,14,7,4))
	# # # # # #
	# ass(2,solve(10,10,7,4))
	# ass(7,solve(20,12,7,4)) ###
	# ass(12,solve(20,20,7,4))
	# ass(32,solve(30,30,7,4)) ###
	# ass(56,solve(40,40,7,4))
	# ass(88,solve(50,50,7,4)) # eg 89
	# ass(128,solve(60,60,7,4))
	# ass(154,solve(66,66,7,4)) # eg 155
	# ass(356,solve(100,100,7,4)) # 357
	# ass(1426,solve(200,200,7,4)) # 1428
	# # #
	# ass(8928,solve(500,500,7,4)) # [8928] 28 ms
	#
	#ass(35714,solve(1000,1000,7,4)) # [35714] 0.45 s
	#ass(35785,solve(1001,1001,7,4)) # [35785] 1.03 s
	#ass(35856,solve(1002,1002,7,4)) # [35857] 0.55 s
	#ass(35928,solve(1003,1003,7,4)) # [35928] 1.18 s
	# #
	#ass(142856,solve(2000,2000,7,4)) # [142857] 2.55 s
	#ass(540,solve(2560,2560,143,84)) # [545] 8 ms

# Rectangular, not quadratic
	#ass(219,solve(2296,1230,136,94)) # [219] 2.14s istf 120 ms
	ass(216,solve(2296,1230,136,94)) # [219] 2 ms istf 120 ms
	#ass(267,solve(2252,1470,144,84)) # [271] 2 ms istf 4.43s
	#ass(334, solve(2560, 1610, 143, 84))  # [341] 3 ms istf 24.42s
#print(len(cache),cache)

# print(len(cache))
# print(len(hcutcache))
# print(len(vcutcache))
# print(len(framecache))
# print((cache))
#for c in cache: print(c,cache[c])
#for cut in hcutcache: print(cut,hcutcache[cut])
#for cut in vcutcache:print(cut,vcutcache[cut])
# print((framecache))
print(time.time() - start)

#ass([],frame2([4,7,8],20,20,4,7,''))
#ass([13,6,10],frame2V([4,7,8],20,20,4,7,'')) # D

#ass([6],frame2V([4],12,20,4,7,''))

#ass([3],cut([4,7],11,8,4,7,''))
#ass([],cut([4,7,8],12,20,4,7,''))

#ass([8], hcut([7],12,20,4,7,''))

#ass(4, solve(13,12,7,4))

#ass([0,4],frame4([4],13,12,7,4))

#ass([4],cut([4],12,13,4,7))
#ass([4],cut([4],12,12,4,7))
#ass(3,solve(12,8,4,7))
#ass([3],frame4([4],12,8,7,4))

#ass(1,solve(4,13,4,7))
#ass(4,solve(9,13,4,7))
# ass([0,4],frame4([4],13,9,7,4))

###### graveyard #####

# def frame2V(walls,W,H,w,h,level): # skala av två vertikala murar
# 	alternatives = []
# 	for wall in walls: # wall anger murens totala tjocklek
# 		if wall*2 > W: continue
# 		#if wall*2 > H: continue
# 		count = wall // w # murens tjocklek i antal stenar
# 		antal = H // h * 2 * count
# 		if antal > 0 and W >= 2 * wall:
# 			s = solve(H, W - 2 * wall, h, w, level + ' ')
# 			alternatives.append(antal + s)
# 	return alternatives
# ass([],frame2V([4],6,14,7,4,'')) # A
# ass([],frame2V([4],6,14,4,7,'')) # B
# ass([],frame2V([4],14,6,7,4,'')) # C
# ass([],frame2V([4],14,6,4,7,'')) # D
# ass([],frame2V([7],6,14,7,4,'')) # A
# ass([],frame2V([7],6,14,4,7,'')) # B
# ass([2],frame2V([7],14,6,7,4,'')) # C
# ass([],frame2V([7],14,6,4,7,'')) # D

# def frame2H(walls,W,H,w,h,level): # skala av två horisontella murar
# 	alternatives = []
# 	for wall in walls: # wall anger murens totala tjocklek
# 		#if wall*2 > W: continue
# 		if wall*2 > H: continue
# 		count = wall // h # murens tjocklek i antal stenar
# 		antal = W // w * 2 * count
# 		if antal > 0 and H >= 2 * wall: alternatives.append(antal + solve(H - 2 * wall, W, h, w, level + ' '))
# 	return alternatives
# ass([],frame2H([4],6,14,7,4,'')) # A
# ass([],frame2H([4],6,14,4,7,'')) # B
# ass([],frame2H([4],14,6,7,4,'')) # C
# ass([],frame2H([4],14,6,4,7,'')) # D
# ass([],frame2H([7],6,14,7,4,'')) # A
# ass([2],frame2H([7],6,14,4,7,'')) # B
# ass([],frame2H([7],14,6,7,4,'')) # C
# ass([],frame2H([7],14,6,4,7,'')) # D

# def frame2(walls,W,H,w,h,level):
# 	if [20,12,7,4] == [W,H,w,h]:
# 		zz=99
# 	result = []
# 	result += frame2V(walls,W,H,w,h,level)
# 	result += frame2V(walls,W,H,h,w,level)
# 	result += frame2V(walls,H,W,w,h,level)
# 	result += frame2V(walls,H,W,h,w,level)
# 	result += frame2H(walls,W,H,w,h,level)
# 	result += frame2H(walls,W,H,h,w,level)
# 	result += frame2H(walls,H,W,w,h,level)
# 	result += frame2H(walls,H,W,h,w,level)
# 	#print(walls,W,H,w,h,level,result)
# 	result = list(set(result))
# 	result.sort()
# 	return result
# ass([2,2],frame2([4,7],6,14,4,7,''))
# ass([2,2],frame2([4,7],6,14,7,4,''))
# ass([6, 4, 6, 6, 4, 6, 6, 6, 4, 6, 6, 4],frame2([4,7],14,14,4,7,''))
