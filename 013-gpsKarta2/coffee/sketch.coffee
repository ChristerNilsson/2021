W = window.innerWidth
H = window.innerHeight

INVISIBLE = -200
SIZE = 256 # 64..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

nw = W//TILE
nh = H//TILE

updateMode = 0 # 0=manual 1=gps
moreMode = 1

boxes = []
currentPath = null
trail = null # M256,256 l100,100 l50,0

sendMail = (subject,body) ->
	mail.href = "mailto:janchrister.nilsson@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
	mail.click()

setAttrs = (obj,attrs) ->
	if not obj then return 
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

#position = [59.09443087294174, 17.7142975294884] # 6553600,655360
position = [59.265196, 18.132748] # Home (lat long)
grid = []

center = [] # skärmens mittpunkt (sweref). Påverkas av pan (x y) (6 7)
target = [] # målkoordinater (sweref)

mouse = []
images = []
rects = []
texts = []
buttons = {}

record = 0

distance = (p,q) ->
	if p.length != 2 or q.length != 2 then return 0
	dx = p[0] - q[0]
	dy = p[1] - q[1]
	Math.sqrt dx * dx + dy * dy

bearing = (p,q) ->
	if p.length!=2 or q.length!=2 then return 0
	dx = p[0] - q[0]
	dy = p[1] - q[1]
	res = 360 + Math.round degrees Math.atan2 dx,dy
	res % 360

class Path
	constructor : (@path) ->
		console.log 'Path',@path
		if @path == ""
			@points = []
			@hash = 0
			@distance = 0
			@count = 0
			@box = null
		else
			@points = decodeAll @path
			console.log 'points',@points
			@hash = @hashCode @path
			console.log 'hash',@hash
			@distance = @calcDist() # in meters
			console.log 'distance',@distance
			@count = @points.length
			@box = @calcBox()
			console.log 'box',@box

	calcDist : ->
		res = 0
		for i in range 1,@points.length
			[x0,y0] = @points[i-1]
			[x1,y1] = @points[i]
			dx = x0-x1
			dy = y0-y1
			res += Math.sqrt dx*dx+dy*dy
		Math.round res

	calcBox : ->
		[xmin,ymin] = @points[0]
		[xmax,ymax] = @points[0]
		for [x,y] in @points
			if x < xmin then xmin = x
			if x > xmax then xmax = x
			if y < ymin then ymin = y
			if y > ymax then ymax = y
		[[xmin,ymin],[xmax,ymax]]

	hashCode : (path) ->
		hash = 0
		for i in range path.length
			hash  = ((hash << 5) - hash) + path.charCodeAt i
		hash

	save : ->
		if @points.length == 0 then return
		found = false
		@path = encodeAll @points
		@hash = @hashCode @path
		@box = @calcBox()
		@distance = @calcDist()
		for box in boxes
			if box[0] == @hash then found = true
		if not found
			console.log 'save',@points,@path,@hash,@box,@distance
			boxes.push [@hash,@box]
			localStorage['boxes'] = JSON.stringify boxes
			localStorage[@hash] = @path
	
	delete : ->
		localStorage.removeItem @hash
		for i in range boxes.length
			box = boxes[i]
			if box[0] == @hash
				boxes.splice i,1
				currentPath = null
				localStorage['boxes'] = JSON.stringify boxes

class Button 
	constructor : (@x,@y,@prompt,event,color='#f000') ->
		@r = 128
		@circle0 = add 'circle',svg, {cx:@x, cy:@y, r:@r, fill:'none', stroke:'black', 'stroke-width':1}
		if @prompt != ""
			@text = add 'text',svg, {x:@x, y:@y+10, stroke:'black', fill:'black', 'stroke-width':1, 'text-anchor':'middle'}
			@text.textContent = @prompt
			@text.style.fontSize = '50px'
			@text.style.userSelect = 'none'
		@circle1 = add 'circle',svg, {cx:@x, cy:@y, r:@r, fill:color, stroke:'black', 'stroke-width':1, ontouchstart:event, onclick:event}
	setColor : (color) -> setAttrs @circle1, {fill:color}
	setTextFill : (color) -> setAttrs @text, {fill:color}
	enable : -> 
		setAttrs @circle0, {cx:@x}
		setAttrs @circle1, {cx:@x}
		if @prompt!='' then setAttrs @text, {x:@x}
	disable : -> 
		setAttrs @circle0, {cx:INVISIBLE}
		setAttrs @circle1, {cx:INVISIBLE}
		if @prompt!='' then setAttrs @text, {x:INVISIBLE}

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
		setAttrs @circle1, {cx:x, cy:y}
		setAttrs @vline, {x1:x-@r, y1:y, x2:x+@r, y2:y}
		setAttrs @hline, {x1:x, y1:y-@r, x2:x, y2:y+@r}

add = (type,parent,attrs) ->
	obj = document.createElementNS svgurl, type
	parent.appendChild obj
	setAttrs obj,attrs
	obj

click = (s) -> 
	event.preventDefault()
	if s=='in'  and SIZE > 64 then SIZE //= 2
	if s=='out' and SIZE < 65536 then SIZE *= 2
	if s=='center' then centrera()
	if s=='aim' then aimEvent()
	event.stopPropagation()
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
	center[0] -= dx * factor
	center[1] += dy * factor
	updateMode = 0
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
	center[0] -= dx * factor
	center[1] += dy * factor
	updateMode = 0
	drawMap()

svg.addEventListener 'touchstart', touchstart
svg.addEventListener 'touchmove',  touchmove
svg.addEventListener 'touchend',   touchend

svg.addEventListener 'mousedown', mousedown
svg.addEventListener 'mousemove', mousemove
svg.addEventListener 'mouseup',   mouseup

convert = ([x,y],size=SIZE) -> # sweref punkt
	dx = x % size # beräkna vektor dx,dy (sweref)
	dy = y % size
	x -= dx       # beräkna rutans SW hörn x,y (sweref)
	y -= dy
	dx = map dx, 0,size, 0,TILE # map n,start1,stop1,start2,stop2
	dy = map dy, 0,size, 0,TILE
	[x,y, dx,dy]
ass [655360,6553600,64,72], convert [655360+16,6553600+18],64
ass [655360,6553600,128,128], convert [655360+64,6553600+64],128
ass [655360+128,6553600+128,0,0], convert [655360+128,6553600+128],128
ass [655360,6553600,44,44], convert [655360+22,6553600+22],128
ass [655360,6553600,128,128], convert [655360+128,6553600+128],256
ass [655360,6553600,64,64], convert [655360+64,6553600+64],256
ass [655360,6553600,64,74], convert [655360+128,6553600+148],512
ass [655360,6553600,32,32], convert [655360+64,6553600+64],512
ass [655360,6553600,200,250], convert [655360+400,6553600+500],512
ass [655360,6553600,32,37], convert [655360+128,6553600+148],1024
ass [655360,6553600,16,16], convert [655360+64,6553600+64],1024
ass [655360,6553600,100,125], convert [655360+400,6553600+500],1024

updateTrail = (baseX,baseY,dx,dy) ->
	if not currentPath
		setAttrs trail, {points:''}
		return 

	x0 = baseX - SIZE
	x1 = baseX + SIZE
	y0 = baseY - SIZE
	y1 = baseY + SIZE

	s = []
	for [x,y] in currentPath.points
		xx = map x, x0,x1, W/2 - TILE, W/2 + TILE
		yy = map y, y0,y1, H/2 - TILE, H/2 + TILE
		s.push "#{Math.round xx-dx},#{Math.round H+dy-yy}"
	setAttrs trail, {points:s.join ' '}

drawMap = ->
	[baseX,baseY,dx,dy] = convert center
	for j in range -nh,nh+1
		y = baseY + j * SIZE - SIZE
		py = H/2 - TILE*j + dy
		for i in range -nw,nw+1
			x = baseX + i * SIZE
			px = W/2 + TILE*i - dx
			href = "maps\\#{SIZE}\\#{y}-#{x}-#{SIZE}.jpg"
			if href != images[j+nh][i+nw].getAttributeNS null,'href' # only update if needed
				setAttrs images[j+nh][i+nw], {href:href}
			setAttrs images[j+nh][i+nw], {x:px, y:py}
			setAttrs rects[j+nh][i+nw],  {x:px, y:py}

	updateTrail Math.round(baseX),Math.round(baseY),Math.round(dx),Math.round(dy)

	if texts.length == 8 
		texts[0].textContent = if target.length==2 then "#{bearing target,center} º" else ""
		texts[1].textContent = if target.length==2 then "#{Math.round distance target,center} m" else ""

		if currentPath
			if record == 0 then texts[2].textContent = "#{currentPath.points.length}"
			if record == 1 then texts[2].textContent = "Record #{currentPath.points.length}"
		else
			texts[2].textContent = "Boxes: #{boxes.length}"

		texts[3].textContent = "#{SIZE} #{updateMode}"
		texts[4].textContent = "#{position[0]}"
		texts[5].textContent = "#{position[1]}"
		texts[6].textContent = "#{Math.round center[0]}"
		texts[7].textContent = "#{Math.round center[1]}"
		
		if buttons.target then buttons.target.move()

centrera = ->
	updateMode = 1
	grid = geodetic_to_grid position[0],position[1]
	center = (g for g in grid)
	center.reverse()
	drawMap()

aimEvent = ->
	if target.length == 0
		target = center.slice()
		buttons.target.moveHard W/2,H/2
	else
		target = []
		buttons.target.moveHard INVISIBLE, INVISIBLE

#####

loadPath = -> # url -> localStorage
	boxes = if localStorage.boxes then JSON.parse localStorage.boxes else []
	parameters = getParameters()
	if not parameters.path then return
	currentPath = new Path parameters.path
	currentPath.save()

clearPath = ->
	currentPath = null
	drawMap()
	more()

fetchPath = -> # visa alla synliga paths. Närmaste gulmarkeras, övriga gråmarkeras
	bestDist = 9999999
	besti = -1
	for [key,[[x0,y0],[x1,y1]]],i in boxes
		for p in [[x0,y0],[x0,y1],[x1,y0],[x1,y1]]
			d = distance p,center
			if d < bestDist
				bestDist = d
				besti = i
	if besti != -1
		currentPath = new Path localStorage[boxes[besti][0]]
		center = currentPath.points[0].slice()
	more()
	drawMap()

mark = -> # Spara center i localStorage
	temp = new Path "#{Math.round center[0]},#{Math.round center[1]}"
	temp.save()
	more()

deletePath = -> # tag bort current Path från localStorage
	currentPath.delete()
	more()

recordPath = -> # start/stopp av inspelning av path
	record = 1 - record
	if record == 1 then currentPath = new Path ""
	if record == 0 then currentPath.save()
	buttons.record.setTextFill ['#000f','#f00f'][record]
	texts[2].textContent = "#{currentPath.points.length}"
	more()

sharePath = ->
	header = ''
	body = ''
	if currentPath and currentPath.points.length > 0
		header = "#{currentPath.points.length} points. #{currentPath.distance} meter."
		body += "#{window.location.origin + window.location.pathname}?path=#{currentPath.path}"

	body += "\n"
	for box,i in boxes
		[hash,[[xmin,ymin],[xmax,ymax]]] = box
		body += "Box #{i+1}: xmin=#{xmin} ymin=#{ymin} xmax=#{xmax} ymax=#{ymax} hash=#{hash}\n"

	#body += "\n"
	total = 0
	for i in range localStorage.length
		key = localStorage.key i
		if key=='boxes' then continue
		bytes = localStorage[key].length
		body += "\nLocalStorage #{key} (#{bytes} bytes)\n"
		body += "#{localStorage[key]}\n"
		total += bytes
	body += "\nSize in bytes: #{total}\n"

	sendMail header, body
	more()

#####

makeText = (x,y) ->
	text = add 'text',svg, {x:x, y:y, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '50px'
	text.style.userSelect = 'none'
	texts.push text

nada = (event) ->
	event.preventDefault()
	event.stopPropagation()

locationUpdateFail = (error) ->	if error.code == error.PERMISSION_DENIED then messages = ['','','','','','Check location permissions']

locationUpdate = (p) ->
	position = [myRound(p.coords.latitude,6), myRound(p.coords.longitude,6)]
	grid = geodetic_to_grid position[0],position[1]
	temp = (Math.round(g) for g in grid)
	temp.reverse()
	if record == 1 then currentPath.points.push temp.slice()
	if updateMode == 1 then center = temp
	drawMap()

initGPS = ->
	navigator.geolocation.watchPosition locationUpdate, locationUpdateFail,
		enableHighAccuracy: true
		maximumAge: 30000
		timeout: 27000

makeMarker = (name,n) ->
	result = add 'marker', svg, 
		id : name
		viewBox : "0 0 #{2*n+1} #{2*n+1}"
		refX : n
		refY : n
		markerWidth : n
		markerHeight : n
	add 'circle', result,
		cx : n
		cy : n
		r : n
		fill : 'yellow'
		stroke : 'black'
	result

initTrail = ->
	if false
		trail = add 'path', svg, {d:"", stroke:'red', 'stroke-width':1, fill:'none'}
	else
		makeMarker 'smalldot', 2
		makeMarker 'bigdot', 8
		trail = add 'polyline', svg, 
			points : ''
			fill : 'none'
			stroke : 'red'
			'stroke-width' : 2
			'marker-start' : "url(#bigdot)"
			'marker-mid' : "url(#smalldot)"
			'marker-end' : "url(#bigdot)"

more = () ->
	moreMode = 1 - moreMode
	names = "fetch record mark play clear delete share"
	for name in names.split ' '
		if moreMode == 0 then buttons[name].disable()
		if moreMode == 1 then buttons[name].enable()

startup = ->
	loadPath()
	initGPS()
	add 'rect',svg,{width:W, height:H, fill:'green'}

	grid = geodetic_to_grid position[0],position[1]
	center = (g for g in grid)
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

	x0 = 0.36*W
	x1 = 0.64*W
	y0 = 120+10
	y1 = H-180+10
	y2 = H-120+10
	y3 = H-60+10
	makeText x0, y0
	makeText x1, y0
	makeText x0, y1
	makeText x1, y1
	makeText x0, y2
	makeText x1, y2
	makeText x0, y3
	makeText x1, y3

	x0 = 128
	x1 = W/2
	x2 = W-128
	y0 = 128
	y1 = 256+128
	y2 = 512+128
	y3 = H-128

	buttons.target = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	new TargetButton W/2, H/2, "click('aim')"
	new Button x0, y0, 'in',  "click('in')"
	new Button x2, y0, 'out', "click('out')"
	new Button x0, y3, 'center', "click('center')"
	new Button x2, y3, 'more', "more()"

	x = (W/2 + 400 * Math.cos radians i for i in range 0,360,60)
	y = (H/2 + 400 * Math.sin radians i for i in range 0,360,60)

	buttons.fetch  = new Button W/2,  H/2,  'fetch', "fetchPath()", '#ff04'
	buttons.mark   = new Button x[0], y[0], 'mark', "mark()", '#ff04'
	buttons.delete = new Button x[1], y[1], 'delete', "deletePath()", '#ff04'
	buttons.clear  = new Button x[2], y[2], 'clear', "clearPath()", '#ff04'
	buttons.record = new Button x[3], y[3], 'record', "recordPath()", '#ff04'
	buttons.play   = new Button x[4], y[4], 'play', "playPath()", '#ff04'
	buttons.share  = new Button x[5], y[5], 'share', "sharePath()", '#ff04'
	
	initTrail()
	more()
	drawMap()

startup()
