W = 2.5*256 # window.innerWidth
H = 2.5*256 # window.innerHeight
INVISIBLE = -100
SIZE = 128 # 128..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

range = _.range
ass = (a,b) -> chai.assert.deepEqual a, b

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

position = [59.09663380498758, 17.718942469566965] # 3*128 meter in.

center = [] # skärmens mittpunkt (sweref). Påverkas av pan
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
	res = 450 - Math.round degrees Math.atan2 dx,dy
	res % 360

class Button 
	constructor : (x,y,prompt,event,color='#f000') ->
		@r = 25
		if prompt != ""
			@text = add 'text',svg, {x:x, y:y+5, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
			@text.textContent = prompt
			@text.style.fontSize = '25px'
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
		antal = if SIZE == 128 then 2 else SIZE//TILE
		x = H/2 + dy * antal
		y = W/2 - dx * antal
		@moveHard x,y

	moveHard : (x,y) ->
		setAttrs @circle, {cy:y, cx:x}
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
mouseup   = (evt) -> mouse = []
mousemove = (evt) ->
	if mouse.length == 0 then return
	factor = 2
	if SIZE == 128 then factor = 0.5
	if SIZE == 256 then factor = 1
	center[1] = center[1] - evt.movementX * factor
	center[0] = center[0] + evt.movementY * factor 
	center[1] = Math.round center[1]
	center[0] = Math.round center[0]
	drawMap()

convert = ([x,y]) -> # sweref punkt
	dx = x % SIZE # beräkna vektor dx,dy (sweref)
	dy = y % SIZE
	x -= dx       # beräkna rutans nedre vänstra hörn x,y (sweref)
	y -= dy

	if SIZE == 128
		dx = 2*dx + SIZE
		dy = 3*SIZE - 2*dy
	else if SIZE == 256
		dx = dx + SIZE//2 
		dy = 3*SIZE//2 - dy
	else
		dx = dx//2 + SIZE//4
		dy = 3*SIZE//4 - dy//2

	[x, y, dx,dy]

drawMap = ->
	n = 2
	[baseX,baseY,dx,dy] = convert center
	for j in range 2*n+1
		y = baseY + (j-n) * SIZE
		py = TILE*(j-n)+dy
		for i in range 2*n+1
			x = baseX + (n-i) * SIZE
			px = TILE*(i-n)+dx
			href = "maps\\#{SIZE}\\#{x}-#{y}-#{SIZE}.jpg"
			setAttrs images[j][i], {x:py, y:px, href:href}
			setAttrs rects[j][i],  {x:py, y:px}
	texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
	texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]}"
	targetButton.move()

centrera = ->
	grid = geodetic_to_grid position[0],position[1] # TURN!
	center = (Math.round g for g in grid)
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
	[baseX,baseY,dx,dy] = convert center

	images = []
	rects = []
	texts = []

	n = 2
	for j in range 2*n+1
		irow = []
		rrow = []
		for i in range 2*n+1
			irow.push add 'image',svg, {}
			rrow.push add 'rect', svg, {width:TILE, height:TILE, stroke:'black', 'stroke-width':1, fill:'none'}
		images.push irow
		rects.push rrow

	makeText W/2, 40
	makeText W/2, H-30

	targetButton = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	aimButton = new TargetButton W/2, H/2, "click('aim')"
	new Button 35,   35, 'in',  "click('in')"
	new Button W-35, 35, 'out', "click('out')"
	new Button 35, H-35, 'ctr', "click('ctr')"
	recButton = new Button W-35, H-35, 'rec', "recEvent()"

	console.log grid_to_geodetic 6553600+3*128,655360+3*128
	drawMap()

startup()
