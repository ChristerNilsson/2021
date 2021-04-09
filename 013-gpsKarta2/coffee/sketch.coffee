W = 768 # window.innerWidth
H = 768 # window.innerHeight
INVISIBLE = -100

range = _.range
ass = (a,b) -> chai.assert.deepEqual a, b

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

position = [59.09443087294174,17.7142975294884] # 128 m in.

#position = [59.09332934261859, 17.71197528267203] # 6553600, 655360
#position = [59.26519880996387, 18.132755831664422] # lat,lng y,x Home
#position = [59.26698746068617, 18.128352823008175] # Skarpnäcks Torg
#position = [59.2631917949656, 18.12265887424414] # Elhuset

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

SIZE = 256 # 128..65536 # rutornas storlek i meter

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

	move : () ->
		if target.length == 0 then return
		dx = target[0]-center[0]
		dy = target[1]-center[1]
		x = H/2 + dy // (SIZE//256)
		y = W/2 - dx // (SIZE//256)
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

# Givet en sweref punkt samt SIZE
#   beräkna rutans nedre vänstra hörn x,y (sweref)
#   beräkna vektor i skärmkoordinater dx,dy (0..256,0..256)
convert = ([x,y]) ->
	dx = x % SIZE
	dy = y % SIZE
	x -= dx
	y -= dy

	if SIZE == 128
		dx = 2*dx-SIZE
		dy = SIZE-2*dy
	else if SIZE == 256
		dx = dx-SIZE//2
		dy = SIZE//2-dy
	else
		dx = dx//2-SIZE//4
		dy = SIZE//4-dy//2

	[x, y, dx,dy]

drawMap = ->
	[baseX,baseY,dx,dy] = convert center
	console.log [baseX,baseY,dx,dy]
	for j in range 4
		y = baseY + (j-1) * SIZE
		for i in range 4
			x = baseX + (1-i) * SIZE
			href = "maps\\#{SIZE}\\#{x}-#{y}-#{SIZE}.jpg"
			setAttrs images[j][i], {x:256*j+dy, y:256*i+dx, href:href}
			setAttrs rects[j][i], {x:256*j+dy, y:256*i+dx}
	texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
	texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]}"
	targetButton.move()

centrera = () ->
	grid = geodetic_to_grid position[0],position[1] # TURN!
	center = (Math.round g for g in grid)
	drawMap()

aimEvent = () ->
	if target.length == 0
		target = center.slice()
		targetButton.moveHard W/2,H/2
	else
		target = []
		targetButton.moveHard INVISIBLE, INVISIBLE

recEvent = () ->
	rec = 1 - rec
	recButton.setAttributeNS null, 'fill',['#f008','#f000'][rec]

startup = ->
	add 'rect',svg,{x:0, y:0, width:W, height:H, stroke:'black', 'stroke-width':2, fill:'green'}
	grid = geodetic_to_grid position[0],position[1] # TURN!
	center = (Math.round g for g in grid)
	console.log center
	[baseX,baseY,dx,dy] = convert center
	console.log [baseX,baseY,dx,dy]

	images = []
	rects = []
	texts = []

	for j in range 4
		irow = []
		rrow = []
		y = baseY + (j-1) * SIZE
		for i in range 4
			x = baseX + (1-i) * SIZE 
			href = "maps\\#{SIZE}\\#{x}-#{y}-#{SIZE}.jpg" # TURN!
			console.log href
			irow.push add 'image',svg, {x:256*j+dy, y:256*i+dx, href:href}
			rrow.push add 'rect', svg, {x:256*i+dx, y:256*j+dy, width:256, height:256, stroke:'black', 'stroke-width':1, fill:'none'}
		images.push irow
		rects.push rrow

	text = add 'text',svg, {x:W/2, y:40, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '25px'
	text.textContent = SIZE
	texts.push text 

	text = add 'text',svg, {x:W/2, y:H-30, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '25px'
	text.textContent = SIZE
	texts.push text 

	targetButton = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	aimButton = new TargetButton W/2, H/2, "click('aim')"
	new Button 35,   35, 'in',  "click('in')"
	new Button W-35, 35, 'out', "click('out')"
	new Button 35, H-35, 'ctr', "click('ctr')"
	recButton = new Button W-35, H-35, 'rec', "recEvent()"

	console.log grid_to_geodetic 6553600+128,655360+128
	drawMap()

startup()
