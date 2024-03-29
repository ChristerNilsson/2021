VERSION = '10'
INVISIBLE = -200
SIZE = 256 # 64..65536 # rutornas storlek i meter
TILE = 256 # rutornas storlek i pixels

RESOLUTION = 5 # separation in meter between gps-points

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

startingTimeRecord = null

svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

#position = [59.09443087294174, 17.7142975294884] # 6553600,655360
position = [59.265196, 18.132748] # Home (lat long)
#grid = []

center = [] # skärmens mittpunkt (sweref). Påverkas av pan (x y) (6 7)
target = [] # målkoordinater (sweref)

mouse = []
images = []
rects = []
texts = []
buttons = {}

sendMail = (subject,body) ->
	mail.href = "mailto:janchrister.nilsson@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
	mail.click()

setAttrs = (obj,attrs) ->
	if not obj then return 
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

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
		#if i % 5 != 0 then continue
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

	updateTexts()

updateTexts = ->
	if texts.length == 8
		texts[0].textContent = if target.length==2 then "#{bearing target,center} º" else ""
		texts[1].textContent = if target.length==2 then "#{Math.round distance target,center} m" else ""

		texts[2].textContent = if playMode==1 then "P ##{curr} of #{playPath.points.length} (#{myRound 100*curr/playPath.points.length}%) #{playPath.distance}m ETA #{myRound ETA}s" else "play off"
		setAttrs texts[2], {fill:['#000f','#060f'][playMode]}

		t = new Date()
		elapsedTime = (t - startingTimeRecord)/1000 # secs
		texts[3].textContent = if record == 1 then "R ##{recordPath.points.length} #{myRound elapsedTime}s #{myRound userDistanceRecord}m" else "record off"
		setAttrs texts[3], {fill:['#000f','#f00f'][record]}

		texts[4].textContent = "Tracks: #{boxes.length}"
		texts[5].textContent = "Z#{SIZE} U#{updateMode} P#{playMode} R#{record} V#{VERSION}"
		texts[6].textContent = "X#{myRound center[0]} Y#{myRound center[1]}"
		texts[7].textContent = "N#{myRound position[0],6} E#{myRound position[1],6}"
		
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
	if record == 1
		recordPath = new Path ""
		startingTimeRecord = new Date()
	if record == 0 then recordPath.save()
	buttons.record.setTextFill ['#000f','#f00f'][record]
	texts[2].textContent = "#{recordPath.points.length}"
	more 0

showBoxes = (body) ->

	total = 0
	for box,i in boxes
		[hash,[[xmin,ymin],[xmax,ymax]]] = box
		bytes = localStorage[hash].length
		body += "Track #{i+1}: xmin=#{xmin} ymin=#{ymin} xmax=#{xmax} ymax=#{ymax} hash=#{hash} bytes=#{bytes}\n"
		total += bytes
	body += "\nSize in bytes: #{total}\n"
	return body

shareThePath = ->
	try # verkar inte hitta undefined variable sv

		header = ''
		body = ''

		messages.push ''
		messages.push 'Explanations: #####'
		messages.push ' HINT index x y (distance in meter)'
		messages.push ' SAY text'
		messages.push ' LU x y (gps location in SWEREF)'
		messages.push ' gps index (distance in meter) closest point in track being played'
		messages.push ' trackStarted yyyy-mm-dd hh:mm:ss'
		messages.push ' trackEnded   yyyy-mm-dd hh:mm:ss'
		messages.push '###################'
		messages.push ''
		messages.push "VERSION #{VERSION}"
		messages.push "RESOLUTION #{RESOLUTION}"
		messages.push "curr #{curr}"
		messages.push "lastWord #{lastWord}"
		messages.push "lastSpoken #{lastSpoken}"
		messages.push "started #{started}"
		messages.push "ended #{ended}"

		if startingTimePlay then messages.push "startingTimePlay #{startingTimePlay.toLocaleString 'sv'}"
		if startingTimeRecord then messages.push "startingTimeRecord #{startingTimeRecord.toLocaleString 'sv'}"
		if endingTime then messages.push "endingTime #{endingTime.toLocaleString 'sv'}"

		messages.push "elapsedTime #{myRound elapsedTime/1000}"
		messages.push "userDistancePlay #{myRound userDistancePlay}"
		messages.push "userDistanceRecord #{myRound userDistanceRecord}"
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
			header += "P #{myRound userDistancePlay} meter #{playPath.points.length} points"
			body += "Play #{window.location.origin + window.location.pathname}?path=#{playPath.path}\n"

		if recordPath and recordPath.points.length > 0
			header += "R #{myRound userDistanceRecord} meter #{recordPath.points.length} points"
			body += "Record #{window.location.origin + window.location.pathname}?path=#{recordPath.path}\n"

		body += "\n"
		body = showBoxes body

		sendMail header, body
		messages.length = 0
		more 0

	catch err
		console.log err
		messages.push "ERROR #{err.message}"
		messages.push "STACK #{err.stack}"

reverseThePath = ->
	playPath.points.reverse()
	messages.push "reverse"
	drawMap()
	more 0

#####

makeText = (x,y,color='black') ->
	text = add 'text',svg, {x:x, y:y, fill:color, stroke:'none', 'stroke-width':1, 'text-anchor':'middle'}
	text.style.fontSize = '40px'
	text.style.userSelect = 'none'
	texts.push text

nada = (event) ->
	event.preventDefault()
	event.stopPropagation()

locationUpdateFail = (error) ->	messages.push "locationUpdateFail #{error}" 

locationUpdate = (p) ->
	position = [p.coords.latitude, p.coords.longitude]
	xy = geodetic_to_grid position[0],position[1]
	xy.reverse()
	n = gpsPoints.length
	if n > 0 and RESOLUTION > distance xy,gpsPoints[n-1] then return
		# messages.push "skipped #{myRound xy[0]} #{myRound xy[1]}"
		# messages.push "."
		# return 
	gpsPoints.push xy.slice()
	if gpsPoints.length > 10 then gpsPoints.shift()
	messages.push "LU #{myRound xy[0]} #{myRound xy[1]}"
	if record == 1
		#recordPath.addPoint xy
		recordPath.points.push xy
		n = gpsPoints.length
		if n > 1 then userDistanceRecord += distance gpsPoints[n-2],gpsPoints[n-1]

	if updateMode == 1 then center = xy
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
		viewBox : "-1 -1 #{2*n+1} #{2*n+1}"
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
		makeMarker 'dot', 4,'yellow'
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
	if speaker == null then initSpeaker()
	names1 = "fetch record mark play clear delete share".split ' '
	names2 = "reverse".split ' '
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

	x0 = 0.36 * W
	x1 = 0.64 * W
	x2 = 0.50 * W

	y0 = H*0.05

	y1 = H*0.75
	y2 = H*0.79
	y3 = H*0.84
	y4 = H*0.89
	y5 = H*0.94
	y6 = H*0.99

	makeText x0, y0 # 0
	makeText x1, y0 # 1

	makeText x2, y1 # 2
	makeText x2, y2, 'red' # 3
	makeText x2, y3 # 4
	makeText x2, y4 # 5
	makeText x2, y5 # 6
	makeText x2, y6 # 7

	x0 = H * 0.10
	x1 = W * 0.50
	x2 = W - x0
	y0 = H * 0.10
	y1 = H * 0.50
	#y2 = 512+128
	y3 = H * 0.90

	buttons.target = new TargetButton INVISIBLE, INVISIBLE, '', '#f008'
	new TargetButton x1, y1, "click('aim')"
	new Button x0, y0, 'in',  "click('in')"
	new Button x2, y0, 'out', "click('out')"
	new Button x0, y3, 'center', "click('center')"
	new Button x2, y3, 'more', "more(-1)"

	x = (W/2 + H*0.2 * Math.cos radians i for i in range 0,360,60)
	y = (H/2 + H*0.2 * Math.sin radians i for i in range 0,360,60)

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
	# console.log boxes.length
	drawMap()

startup()
