W = 1024 # window.innerWidth
H = 1024 # window.innerHeight
INVISIBLE = -100
SIZE = 256 # 128..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

range = _.range
ass = (a,b=true) -> chai.assert.deepEqual a, b

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

position = [59.09443087294174, 17.7142975294884] # 128 meter in. (lat long)

center = [] # skärmens mittpunkt (sweref). Påverkas av pan (x y) (6 7)
target = [] # målkoordinater (sweref)
targetButton = null

mouse = []

images = []
rects = []
texts = []

recButton = null
rec = 0
aimButton = null

degrees = (radians) -> radians * 180 / Math.PI

distance = (p,q) ->
	if p.length != 2 or q.length != 2 then return 0

	dx = p[0] - q[0]
	dy = p[1] - q[1]
	Math.round Math.sqrt dx * dx + dy * dy

bearing = (p,q) ->
	if p.length!=2 or q.length!=2 then return 0
	dx = p[0] - q[0]
	dy = p[1] - q[1]
	res = 360 + Math.round degrees Math.atan2 dx,dy
	res % 360

class Button 
	constructor : (x,y,prompt,event,color='#f000') ->
		@r = 50
		if prompt != ""
			@text = add 'text',svg, {x:x, y:y+10, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
			@text.textContent = prompt
			@text.style.fontSize = '50px'
		@circle = add 'circle',svg, {cx:x, cy:y, r:@r, fill:color, stroke:'black', 'stroke-width':1, onclick:event}

class TargetButton extends Button
	constructor : (x,y,event,color) ->
		super x,y,'',event,color
		@vline = add 'line',svg, {x1:x-@r, y1:y, x2:x+@r, y2:y, stroke:'black', 'stroke-width':1}
		@hline = add 'line',svg, {x1:x, y1:y-@r, x2:x, y2:y+@r, stroke:'black', 'stroke-width':1}

	move : ->
		if target.length == 0 then return
		dx = target[0] - center[0]
		dy = target[1] - center[1]
		antal = SIZE/TILE
		x = W/2 + dx / antal
		y = H/2 - dy / antal
		@moveHard x,y

	moveHard : (x,y) ->
		setAttrs @circle, {cx:x, cy:y}
		setAttrs @vline, {x1:x-@r, y1:y, x2:x+@r, y2:y}
		setAttrs @hline, {x1:x, y1:y-@r, x2:x, y2:y+@r}

add = (type,parent,attrs) ->
	obj = document.createElementNS svgurl, type
	parent.appendChild obj
	setAttrs obj,attrs
	obj

setAttrs = (obj,attrs) ->
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

click = (s) -> 
	if s=='in'  and SIZE > 128 then SIZE //= 2
	if s=='out' and SIZE < 65536 then SIZE *= 2
	if s=='ctr' then centrera()
	if s=='aim' then aimEvent()
	drawMap()

mousedown = (evt) -> mouse = [evt.x,evt.y]
mouseup   = (evt) -> 
	mouse = []
	drawMap()

mousemove = (evt) ->
	if mouse.length == 0 then return
	factor = 2
	if SIZE == 128 then factor = 0.5
	if SIZE == 256 then factor = 1
	center[0] -= Math.round evt.movementX * factor
	center[1] += Math.round evt.movementY * factor
	drawMap()
	#moveMap()

touchstart = (event) ->
	event.preventDefault()
	mousedown event

touchend = (event) ->
	event.preventDefault()
	mouseup event

touchmove = (event) ->
	event.preventDefault()
	mousemove event

svg.addEventListener 'touchstart', touchstart
svg.addEventListener 'touchmove',  touchmove
svg.addEventListener 'touchend',   touchend

interpolate = (a, b, c, d, value) -> c + value/b * (d-c)
ass 16, interpolate 0,1024,0,256,64
ass 240, interpolate 0,1024,256,0,64

convert = ([x,y],size=SIZE) -> # sweref punkt

	dx = x % SIZE # beräkna vektor dx,dy (sweref)
	dy = y % SIZE
	x -= dx       # beräkna rutans SW hörn x,y (sweref)
	y -= dy

	if SIZE in [128,256]
		dx = interpolate 0,SIZE, TILE,0, dx
		dy = interpolate 0,SIZE, 0,TILE, dy
	else
		dx = interpolate 0,SIZE, SIZE//2,0, dx
		dy = interpolate 0,SIZE, 0,SIZE//2, dy

	dx = Math.round dx
	dy = Math.round dy

	[x,y, dx,dy]

# moveMap = ->
# 	n = 2
# 	[baseX,baseY,dx,dy] = convert center
# 	for j in range 2*n+1
# 		#y = baseY + (j-n) * SIZE
# 		py = TILE*(n-j+1)+dy
# 		for i in range 2*n+1
# 			#x = baseX + (i-n) * SIZE
# 			px = TILE*(i-n+1)+dx
# 			#href = "maps\\#{SIZE}\\#{y}-#{x}-#{SIZE}.jpg"
# 			setAttrs images[j][i], {x:px, y:py} 
# 			setAttrs rects[j][i],  {x:px, y:py}
# 	texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
# 	texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]} DX:#{dx} DY:#{dy}"
# 	targetButton.move()

drawMap = ->
	n = 2
	[baseX,baseY,dx,dy] = convert center
	for j in range 2*n+1
		y = baseY + (j-n) * SIZE
		py = TILE*(n-j+1)+dy
		for i in range 2*n+1
			x = baseX + (i-n) * SIZE
			px = TILE*(i-n+1)+dx
			href = "maps\\#{SIZE}\\#{y}-#{x}-#{SIZE}.jpg"
			setAttrs images[j][i], {x:px, y:py, href:href} 
			setAttrs rects[j][i],  {x:px, y:py}
	texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
	texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]} DX:#{dx} DY:#{dy}"
	targetButton.move()

centrera = ->
	grid = geodetic_to_grid position[0],position[1]
	center = (Math.round g for g in grid)
	center.reverse()
	drawMap()

aimEvent = ->
	if target.length == 0
		target = center.slice()
		targetButton.moveHard W/2,H/2
	else
		target = []
		targetButton.moveHard INVISIBLE, INVISIBLE

recEvent = ->
	rec = 1 - rec
	recButton.setAttributeNS null, 'fill',['#f008','#f000'][rec]

makeText = (x,y) ->
	text = add 'text',svg, {x:x, y:y, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '25px'
	texts.push text

startup = ->
	add 'rect',svg,{width:W, height:H, fill:'green'}
	grid = geodetic_to_grid position[0],position[1]
	center = (Math.round g for g in grid)
	center.reverse()

	images = []
	rects = []
	texts = []

	n = 2
	for _ in range 2*n+1
		irow = []
		rrow = []
		for _ in range 2*n+1
			irow.push add 'image',svg, {}
			rrow.push add 'rect', svg, {width:TILE, height:TILE, stroke:'black', 'stroke-width':1, fill:'none'}
		images.push irow
		rects.push rrow

	makeText W/2, 40
	makeText W/2, H-30

	targetButton = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	aimButton = new TargetButton W/2, H/2, "click('aim')"
	new Button 60,   60, 'in',  "click('in')"
	new Button W-60, 60, 'out', "click('out')"
	new Button 60, H-60, 'ctr', "click('ctr')"
	recButton = new Button W-60, H-60, 'rec', "recEvent()"

	console.log grid_to_geodetic 6553600+128,655360+128
	console.log grid_to_geodetic 6553600+3.5*128,655360+3.5*128
	drawMap()

startup()

