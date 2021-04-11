W = window.innerWidth
H = window.innerHeight

INVISIBLE = -100
SIZE = 256 # 64..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

nw = W//TILE
nh = H//TILE

range = _.range
ass = (a,b=true) -> chai.assert.deepEqual a, b

setAttrs = (obj,attrs) ->
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

position = [59.26357841066772, 18.120888557388074] # (lat long)

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
		@r = 128
		if prompt != ""
			@text = add 'text',svg, {x:x, y:y+10, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
			@text.textContent = prompt
			@text.style.fontSize = '50px'
		@circle = add 'circle',svg, {cx:x, cy:y, r:@r, fill:color, stroke:'black', 'stroke-width':1, ontouchstart:event, onclick:event} #, ontouchmove:'nada(evt)', ontouchend:'nada(evt)'}

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

click = (s) -> 
	if s=='in'  and SIZE > 64 then SIZE //= 2
	if s=='out' and SIZE < 65536 then SIZE *= 2
	if s=='ctr' then centrera()
	if s=='aim' then aimEvent()
	drawMap()

mousedown = (event) -> mouse = [event.x,event.y]
mouseup   = (event) -> mouse = []
mousemove = (event) ->
	if mouse.length == 0 then return
	factor = 2
	if SIZE == 64 then factor = 0.25
	if SIZE == 128 then factor = 0.5
	if SIZE == 256 then factor = 1
	dx = event.movementX
	dy = event.movementY
	mouse = [dx,dy]
	center[0] -= Math.round dx * factor
	center[1] += Math.round dy * factor
	drawMap()

touchstart = (event) ->
	event.preventDefault()
	touches = event.targetTouches 
	if touches.length != 1 then return
	touch = touches[0]
	mouse = [touch.clientX,touch.clientY]

touchend = (event) ->
	event.preventDefault()
	mouse = []
	drawMap()

touchmove = (event) ->
	event.preventDefault()
	if mouse.length == 0 then return
	touches = event.targetTouches 
	if touches.length != 1 then return
	touch = touches[0]
	factor = 2
	if SIZE == 64 then factor = 0.25
	if SIZE == 128 then factor = 0.5
	if SIZE == 256 then factor = 1
	dx = touch.clientX - mouse[0]
	dy = touch.clientY - mouse[1]
	mouse = [touch.clientX,touch.clientY]
	center[0] -= Math.round dx * factor
	center[1] += Math.round dy * factor
	drawMap()

svg.addEventListener 'touchstart', touchstart
svg.addEventListener 'touchmove',  touchmove
svg.addEventListener 'touchend',   touchend

svg.addEventListener 'mousedown', mousedown
svg.addEventListener 'mousemove', mousemove
svg.addEventListener 'mouseup',   mouseup

interpolate = (a, b, c, d, value) -> c + value/b * (d-c)
ass 16, interpolate 0,1024,0,256,64
ass 240, interpolate 0,1024,256,0,64

convert = ([x,y],size=SIZE) -> # sweref punkt

	dx = x % SIZE # beräkna vektor dx,dy (sweref)
	dy = y % SIZE
	x -= dx       # beräkna rutans SW hörn x,y (sweref)
	y -= dy

	if SIZE in [64,128,256]
		dx = interpolate 0,SIZE, TILE,0, dx
		dy = interpolate 0,SIZE, 0,TILE, dy
	else
		dx = interpolate 0,SIZE, SIZE//2,0, dx
		dy = interpolate 0,SIZE, 0,SIZE//2, dy

	dx = Math.round dx
	dy = Math.round dy

	[x,y, dx,dy]

drawMap = ->
	[baseX,baseY,dx,dy] = convert center
	for j in range 2*nh+1
		y = baseY + (j-nh) * SIZE
		py = TILE*(nh-j+1)+dy
		for i in range 2*nw+1
			x = baseX + (i-nw) * SIZE
			px = TILE*(i-nw+1)+dx
			href = "maps\\#{SIZE}\\#{y}-#{x}-#{SIZE}.jpg"
			setAttrs images[j][i], {x:px, y:py, href:href} 
			setAttrs rects[j][i],  {x:px, y:py}
	# texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
	# texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]} DX:#{dx} DY:#{dy}"
	if target.length==2
		texts[0].textContent = "#{bearing(target,center)} º"
		texts[1].textContent = "#{distance(target,center)} m"
	else
		texts[0].textContent = ""
		texts[1].textContent = ""
	texts[2].textContent = "#{SIZE} m"
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
	text.style.fontSize = '50px'
	texts.push text

nada = (event) ->
	event.preventDefault()
	event.stopPropagation()

startup = ->
	console.log W,H,nw,nh
	add 'rect',svg,{width:W, height:H, fill:'green'}
	grid = geodetic_to_grid position[0],position[1]
	center = (Math.round g for g in grid)
	center.reverse()

	images = []
	rects = []
	texts = []

	for _ in range 2*nh+1
		irow = []
		rrow = []
		for _ in range 2*nw+1
			irow.push add 'image',svg, {}
			rrow.push add 'rect', svg, {width:TILE, height:TILE, stroke:'black', 'stroke-width':1, fill:'none'}
		images.push irow
		rects.push rrow

	makeText 1*W/3, 120+10
	makeText 2*W/3, 120+10
	makeText W/2, H-120+10

	targetButton = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	aimButton = new TargetButton W/2, H/2, "click('aim')"
	new Button 128,   128, 'in',  "click('in')"
	new Button W-128, 128, 'out', "click('out')"
	new Button 128, H-128, 'ctr', "click('ctr')"
	recButton = new Button W-128, H-128, 'rec', "recEvent()"

	console.log grid_to_geodetic 6553600+128,655360+128
	console.log grid_to_geodetic 6553600+78*256,655360+88*256
	console.log grid_to_geodetic 6553600+(78+16)*256,655360+(88+16)*256
	#console.log geodetic_to_grid 59.263331493465394, 18.122142177751353
	drawMap()

startup()
