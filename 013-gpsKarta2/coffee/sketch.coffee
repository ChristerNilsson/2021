W = window.innerWidth
H = window.innerHeight

INVISIBLE = -200
SIZE = 256 # 64..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

nw = W//TILE
nh = H//TILE

updateMode = 0 # 0=manual 1=gps
moreMode = 0 # 0 1=fetch... 2=reverse
playMode = 0
record = 0

boxes = []
playPath = null
recordPath = null
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
	if not playPath
		setAttrs trail, {points:''}
		return 

	x0 = baseX - SIZE
	x1 = baseX + SIZE
	y0 = baseY - SIZE
	y1 = baseY + SIZE

	s = []
	for [x,y],i in playPath.points
		if i % 5 != 0 then continue
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

		if playPath
			if record == 0 then texts[2].textContent = "#{playPath.points.length}"
			if record == 1 then texts[2].textContent = "Record #{recordPath.points.length}"
		else
			texts[2].textContent = "Boxes: #{boxes.length}"

		texts[3].textContent = "#{SIZE} #{updateMode}"
		texts[4].textContent = "#{myRound position[0],6}"
		texts[5].textContent = "#{myRound position[1],6}"
		texts[6].textContent = "#{myRound center[0]}"
		texts[7].textContent = "#{myRound center[1]}"
		
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

loadThePath = -> # url -> localStorage
	boxes = if localStorage.boxes then JSON.parse localStorage.boxes else []
	parameters = getParameters()
	if not parameters.path then return
	playPath = new Path parameters.path
	playPath.save()

clearThePath = ->
	playPath = null
	drawMap()
	more 0

fetchThePath = -> # visa alla synliga paths. Närmaste gulmarkeras, övriga gråmarkeras
	bestDist = 9999999
	besti = -1
	for [key,[[x0,y0],[x1,y1]]],i in boxes
		for p in [[x0,y0],[x0,y1],[x1,y0],[x1,y1]]
			d = distance p,center
			if d < bestDist
				bestDist = d
				besti = i
	if besti != -1
		playPath = new Path localStorage[boxes[besti][0]]

		console.log playPath.points

		center = playPath.points[0].slice()
	more 0
	drawMap()

mark = -> # Spara center i localStorage
	temp = new Path "#{Math.round center[0]},#{Math.round center[1]}"
	temp.save()
	more 0

playThePath = ->
	playMode = 1 - playMode
	started = false
	ended = false
	makeHints()
	more 0

deleteThePath = -> # tag bort current Path från localStorage
	playPath.delete()
	more 0

recordThePath = -> # start/stopp av inspelning av path
	record = 1 - record
	if record == 1 then recordPath = new Path ""
	if record == 0 then recordPath.save()
	buttons.record.setTextFill ['#000f','#f00f'][record]
	texts[2].textContent = "#{recordPath.points.length}"
	more 0

shareThePath = ->
	header = ''
	body = ''

	messages.push "curr #{curr}"
	messages.push "lastWord #{lastWord}"
	messages.push "lastSpoken #{lastSpoken}"
	messages.push "started #{started}"
	messages.push "ended #{ended}"
	messages.push "startingTime #{startingTime}"
	messages.push "endingTime #{endingTime}"
	messages.push "elapsedTime #{elapsedTime}"
	messages.push "userDistance #{userDistance}"
	messages.push "lastETA #{lastETA}"
	messages.push "updateMode #{updateMode}"
	messages.push "moreMode #{moreMode}"
	messages.push "playMode #{playMode}"
	messages.push "record #{record}"
	messages.push ""
	messages.push "hints: #{_.size hints}"
	for key of hints
		messages.push "#{key} #{hints[key]}"
	messages.push ""

	if messages then body += messages.join "\n"
	body += "\n"

	if playPath and playPath.points.length > 0
		header = "#{myRound elapsedTime/1000} seconds #{myRound userDistance} meter."
		body += "#{window.location.origin + window.location.pathname}?path=#{playPath.path}"

	body += "\n\n"
	for box,i in boxes
		[hash,[[xmin,ymin],[xmax,ymax]]] = box
		body += "Box #{i+1}: xmin=#{xmin} ymin=#{ymin} xmax=#{xmax} ymax=#{ymax} hash=#{hash}\n"

	total = 0
	for i in range localStorage.length
		key = localStorage.key i
		if key=='boxes' then continue
		bytes = localStorage[key].length
		if bytes < 200
			body += "\nLocalStorage #{key} (#{bytes} bytes)\n"
			body += "#{localStorage[key]}\n"
			total += bytes
	body += "\nSize in bytes: #{total}\n"

	sendMail header, body
	messages.length = 0
	more 0

reverseThePath = ->
	playPath.points.reverse()
	messages.push "reverse"
	drawMap()
	more 0

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
	position = [p.coords.latitude, p.coords.longitude]
	grid = geodetic_to_grid position[0],position[1]
	temp = grid
	temp.reverse()
	gpsPoints.push temp.slice()
	if gpsPoints.length > 10 then gpsPoints.shift()
	console.log gpsPoints
	messages.push "locationUpdate #{myRound temp[0]} #{myRound temp[1]}"
	if record == 1 then recordPath.points.push temp.slice()
	if updateMode == 1 then center = temp
	if playMode == 1 then sayHint gpsPoints
	drawMap()

initGPS = ->
	navigator.geolocation.watchPosition locationUpdate, locationUpdateFail,
		enableHighAccuracy: true
		maximumAge: 30000
		timeout: 27000

makeMarker = (name,n,color) ->
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
		fill : color
		stroke : 'black'
	result

initTrail = ->
	if false
		trail = add 'path', svg, {d:"", stroke:'red', 'stroke-width':1, fill:'none'}
	else
		makeMarker 'start', 8, 'green'
		makeMarker 'dot', 2,'yellow'
		makeMarker 'end', 8, 'red'
		trail = add 'polyline', svg, 
			points : ''
			fill : 'none'
			stroke : 'red'
			'stroke-width' : 2
			'marker-start' : "url(#start)"
			'marker-mid' : "url(#dot)"
			'marker-end' : "url(#end)"

more = (next) ->
	#console.log 'moreA',moreMode,next
	if speaker == null then initSpeaker()
	names1 = "fetch record mark play clear delete share".split ' '
	names2 = "reverse".split ' '
	#console.log names1.concat names2
	for name in names1.concat names2
		buttons[name].disable()
	if next == -1 then next = (moreMode+1) % 3
	moreMode = next
	if moreMode == 1
		for name in names1
			buttons[name].enable()
	if moreMode == 2
		for name in names2
			buttons[name].enable()
	#console.log 'moreB',moreMode,next

rensaLocalStorage = ->
	for key in ''.split ' '
		console.log key
		localStorage.removeItem key
	i = boxes.length-1
	while i >= 0
		box = boxes[i]
		#console.log 'rensaLocalStorage',boxes
		[[a,b],[c,d]] = box[1]
		#console.log 'rensaLocalStorage',a,b,c,d
		if a == null or b == null or c == null or d == null
			console.log 'splice',box
			boxes.splice i,1
		i -= 1
	localStorage.boxes = JSON.stringify boxes

startup = ->
	loadThePath()
	rensaLocalStorage()
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
	new Button x2, y3, 'more', "more(-1)"

	x = (W/2 + 400 * Math.cos radians i for i in range 0,360,60)
	y = (H/2 + 400 * Math.sin radians i for i in range 0,360,60)

	buttons.fetch  = new Button W/2,  H/2,  'fetch', "fetchThePath()", '#ff04'
	buttons.mark   = new Button x[0], y[0], 'mark', "mark()", '#ff04'
	buttons.delete = new Button x[1], y[1], 'delete', "deleteThePath()", '#ff04'
	buttons.clear  = new Button x[2], y[2], 'clear', "clearThePath()", '#ff04'
	buttons.record = new Button x[3], y[3], 'record', "recordThePath()", '#ff04'
	buttons.play   = new Button x[4], y[4], 'play', "playThePath()", '#ff04'
	buttons.share  = new Button x[5], y[5], 'share', "shareThePath()", '#ff04'
	
	buttons.reverse  = new Button W/2,  H/2,  'reverse', "reverseThePath()", '#ff04'

	initTrail()
	more 0
	console.log boxes.length
	drawMap()

startup()
