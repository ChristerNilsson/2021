W = window.innerWidth
H = window.innerHeight

INVISIBLE = -100
SIZE = 256 # 64..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

nw = W//TILE
nh = H//TILE

updateMode = 0 # 0=manual 1=gps
points = []
trail = null # M256,256 l100,100 l50,0

range = _.range
ass = (a,b=true) -> chai.assert.deepEqual a, b
myRound = (x,dec=0) -> Math.round(x*10**dec)/10**dec

map = (x, x0, x1, y0, y1) -> (x - x0) / (x1 - x0) * (y1 - y0) + y0
ass 325,map 150,100,200,300,350
ass 375,map 250,100,200,300,350

sendMail = (subject,body) ->
	mail.href = "mailto:janchrister.nilsson@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
	mail.click()

getParameters = (h = window.location.href) ->
	h = decodeURI h
	arr = h.split('?')
	if arr.length != 2 then return {}
	s = arr[1]
	if s=='' then return {}
	_.object(f.split '=' for f in s.split('&'))

#merp = (y1,y2,i,x1=0,x2=1) -> map i,x1,x2,y1,y2
# interpolate = (a, b, c, d, value) -> c + value/b * (d-c)
# ass 16, interpolate 0,1024,0,256,64
# ass 240, interpolate 0,1024,256,0,64

setAttrs = (obj,attrs) ->
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

#position = [59.09443087294174, 17.7142975294884] # 6553600,655360
position = [59.265196, 18.132748] # Home (lat long)

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
	#Math.round Math.sqrt dx * dx + dy * dy
	Math.sqrt dx * dx + dy * dy

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
	setColor : (color) -> setAttrs @circle, {fill:color}

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
	event.preventDefault()
	if s=='in'  and SIZE > 64 then SIZE //= 2
	if s=='out' and SIZE < 65536 then SIZE *= 2
	if s=='ctr' then centrera()
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
	# center[0] -= Math.round dx * factor
	# center[1] += Math.round dy * factor
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
	# center[0] -= Math.round dx * factor
	# center[1] += Math.round dy * factor
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
	# dx = Math.round map dx, 0,size, 0,TILE # map n,start1,stop1,start2,stop2
	# dy = Math.round map dy, 0,size, 0,TILE
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

# baseX, baseY,  dx, dy, x0,    x1,    y0,     y1,     x,     y       xx   yy
# 678400 6573568 155 212 678272 678784 6573440 6573952 679448 6574343 1880 1194.5
updateTrail = (baseX,baseY,dx,dy) ->
#	console.log 'updateTrail in',baseX,baseY,dx,dy
	s = []
	# x0 = baseX + SIZE/2 - SIZE
	# x1 = baseX + SIZE/2 + SIZE
	# y0 = baseY + SIZE/2 - SIZE
	# y1 = baseY + SIZE/2 + SIZE
	x0 = baseX - SIZE
	x1 = baseX + SIZE
	y0 = baseY - SIZE
	y1 = baseY + SIZE
#	console.log 'updateTrail out',x0,x1,y0,y1

	for [x,y] in points
		xx = map x, x0,x1, W/2 - TILE, W/2 + TILE
		yy = map y, y0,y1, H/2 - TILE, H/2 + TILE
		#if s == '' then s+="M" else s+="L"
#		s += "#{TILE/2+xx-dx},#{-TILE/2+H+dy-yy}"
		s.push "#{xx-dx},#{H+dy-yy}"
		#console.log baseX,baseY,dx,dy, x0,x1,y0,y1, x,y,xx,yy
	console.log s

	#setAttrs trail, {d:s}
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
	# texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
	# texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]} DX:#{dx} DY:#{dy}"

	updateTrail Math.round(baseX),Math.round(baseY),Math.round(dx),Math.round(dy)

	if target.length==2
		texts[0].textContent = "#{bearing(target,center)} º"
		texts[1].textContent = "#{distance(target,center)} m"
	texts[2].textContent = "#{points.length}"
	texts[3].textContent = "#{SIZE} #{updateMode}"
	texts[4].textContent = "#{position[0]}"
	texts[5].textContent = "#{position[1]}"
	if points.length > 0
		p = points[points.length-1]
		texts[6].textContent = "#{Math.round p[0]}"
		texts[7].textContent = "#{Math.round p[1]}"
	targetButton.move()

centrera = ->
	updateMode = 1
	grid = geodetic_to_grid position[0],position[1]
	#center = (Math.round g for g in grid)
	center = (g for g in grid)
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
	if rec == 1
		data = ("#{x},#{y}" for [x,y] in points).join "|"
		sendMail "Path:#{points.length}", "#{window.location}?path=#{data}"
		#points = []
	rec = 1 - rec
	recButton.setColor ['#f000','#f008'][rec]

makeText = (x,y) ->
	text = add 'text',svg, {x:x, y:y, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '50px'
	texts.push text

nada = (event) ->
	event.preventDefault()
	event.stopPropagation()

locationUpdateFail = (error) ->	if error.code == error.PERMISSION_DENIED then messages = ['','','','','','Check location permissions']

locationUpdate = (p) ->
	position = [myRound(p.coords.latitude,6), myRound(p.coords.longitude,6)]
	grid = geodetic_to_grid position[0],position[1]
	#temp = (Math.round g for g in grid)
	temp = (Math.round(g) for g in grid)
	temp.reverse()
	#points.push temp.slice()
	if updateMode == 1 then center = temp
	drawMap()

	# pLat = myRound p.coords.latitude,6
	# pLon = myRound p.coords.longitude,6
	# if storage.trail.length == 0
	# 	gpsLat = pLat
	# 	gpsLon = pLon
	# messages[5] = gpsCount++
	# decreaseQueue()
	# increaseQueue p # meters
	# uppdatera pLat, pLon

# uppdatera = (pLat, pLon) ->
# 	dump.store ""
# 	dump.store "LU #{pLat} #{pLon}"
# 	[x,y] = w2b.convert pLon,pLat
# 	updateTrack pLat, pLon, x,y
# 	updateTrail pLat, pLon, x,y

initGPS = ->
	navigator.geolocation.watchPosition locationUpdate, locationUpdateFail,
		enableHighAccuracy: true
		maximumAge: 30000
		timeout: 27000

initTrail = ->
	# trail = add 'path', svg, {d:"", stroke:'blue', 'stroke-width':1, fill:'none'}
	marker = add 'marker', svg, {id:'dot', viewBox:"0 0 10 10", refX:"5", refY:"5", markerWidth:"5", markerHeight:"5" }
	add 'circle', marker, {cx:"5", cy:"5", r:"5", fill:"red"}
	trail = add 'polyline', svg, 
		points : "15,80 29,50 43,60 57,30 71,40 85,15"
		fill : "none"
		stroke : "black"
		'marker-start' : "url(#dot)"
		'marker-mid' : "url(#dot)"
		'marker-end' : "url(#dot)"
				# <!-- <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
				# 	<circle cx="5" cy="5" r="5" fill="red" />
				# </marker>
				# <polyline points="15,80 29,50 43,60 57,30 71,40 85,15" fill="none" stroke="black"
				# 	marker-start="url(#dot)" marker-mid="url(#dot)" marker-end="url(#dot)" /> -->
				# <!-- <circle cx=50 cy=50 r=30 stroke=black fill=red></circle>	 -->
	console.log trail

startup = ->
	parameters = getParameters()
	if parameters.path 
		points = (pair for pair in parameters.path.split '|')
		points = (p.split ',' for p in points)
		points = ([parseInt(p[0]),parseInt(p[1])] for p in points)
		points.shift()
	console.log points
	initGPS()
	console.log W,H,nw,nh
	add 'rect',svg,{width:W, height:H, fill:'green'}

	#position = (myRound p,6 for p in position)

	grid = geodetic_to_grid position[0],position[1]
	#center = (Math.round g for g in grid)
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

	initTrail()

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
