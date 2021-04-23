LETTERS = 'zyxwvutsrqponmlkjihgfedcba0ABCDEFGHIJKLMNOPQRSTUVWXYZ'

# endimensionell komprimering
# c b a 0 A B C = -3 -2 -1 0 1 2 3
# Två tecken per koordinat

# Exempel: 
# [1017,1373] absolut
# [1016,1378] (-1,5) aE
# [1016,1383] (0,5) 0E
# [1017,1388] (1,5) AE
# Kodas: 1017,1373,aE0EAE

encode = (x,y) ->
	if -26 <= x <= 26 and -26 <= y <= 26 then return LETTERS[26+x] + LETTERS[26+y]
	[x0,y0] = [Math.floor(x/2), Math.floor(y/2)]
	[x1,y1] = [x-x0,y-y0]
	encode(x0,y0) + encode(x1,y1)
ass '00', encode 0,0
ass '0A', encode 0,1
ass 'A0', encode 1,0
ass 'CC', encode 3,3
ass 'FF', encode 6,6
ass 'GG', encode 7,7
ass 'NN', encode 14,14
ass '0a', encode 0,-1
ass 'a0', encode -1,0
ass 'cC', encode -3,3
ass 'Ff', encode 6,-6
ass 'gG', encode -7,7
ass 'Nn', encode 14,-14
ass 'Zz', encode 26,-26
ass 'MnNm', encode 27,-27
ass 'LYMYLYMY', encode 50,100

decode = (xy) -> 
	ix = - 26 + LETTERS.indexOf xy[0]
	iy = - 26 + LETTERS.indexOf xy[1]
	[ix,iy]
ass [1,0], decode 'A0'
ass [0,1], decode '0A'
ass [7,7], decode 'GG'
ass [26,-26], decode 'Zz'

encodeAll = (pairs) -> # pairs of floating point
	[x,y] = pairs[0]
	[ix,iy] = [Math.round(x), Math.round(y)]
	[ex,ey] = [x-ix,y-iy] # hanterar det ackumulerade felet pga avrundning
	result = "#{ix},#{iy},"
	for i in range 1,pairs.length
		[x0,y0] = pairs[i-1]
		[x1,y1] = pairs[i]
		[dx,dy] = [ex+x1-x0, ey+y1-y0]
		[ix,iy] = [Math.round(dx), Math.round(dy)]
		[ex,ey] = [dx-ix,dy-iy]
		if ix != 0 or iy != 0 then result += encode ix,iy # removes [0,0]
	result
ass '1018,1373,bFAD', encodeAll [[1017.9,1373.1],[1016.1,1378.9],[1016.9,1383.1]]
ass '1017,1373,', encodeAll [[1017,1373]]

decodeAll = (s) ->
	result = []
	[x,y,points] = s.split ','
	x = parseInt x
	y = parseInt y
	result.push [x,y]
	if not points then return result
	for i in range 0,points.length,2
		xy = points.slice i,i+2
		[dx,dy] = decode xy
		x += dx
		y += dy
		result.push [x,y]
	result
ass [[1018,1373],[1016, 1379],[1017, 1383]], decodeAll '1018,1373,bFAD'
ass [[0,0],[3,-8],[-15,-17],[-34,-37],[-39,-55]], decodeAll '0,0,Christer'
ass [[1,2],[4,-6],[-14,-15],[-33,-35],[-38,-53]], decodeAll '1,2,Christer'
