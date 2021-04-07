range = _.range
svgurl = "http://www.w3.org/2000/svg"
svg = document.getElementById 'svgOne'

#position = [59.26519880996387, 18.132755831664422] # lat,lng y,x Home
position = [59.26698746068617, 18.128352823008175] # Skarpnäcks Torg
#position = [59.2631917949656, 18.12265887424414] # Elhuset
center = [] # sweref för skärmens mittpunkt. Påverkas av pan
offset = [32,320] 
mouse = []
images = []

ass = (a, b, msg='') -> chai.assert.deepEqual a, b, msg

button = (x,y,prompt,event) ->
	text = add 'text',svg, {x:x+25, y:y+30, stroke:'black', 'stroke-width':1, 'text-anchor':'middle'}
	text.textContent = prompt
	text.style.fontSize = '25px'
	add 'circle',svg, {cx:x+25, cy:y+25, r:25, fill:'#f000', stroke:'black', 'stroke-width':1, onclick:event}

crosshair = (x,y) ->
	add 'circle',svg, {cx:x, cy:y, r:25, fill:'#f000', stroke:'black', 'stroke-width':1}
	add 'line',svg, {x1:x-25, y1:y, x2:x+25, y2:y, stroke:'black', 'stroke-width':1}
	add 'line',svg, {x1:x, y1:y-25, x2:x, y2:y+25, stroke:'black', 'stroke-width':1}

add = (type,parent,attrs) ->
	obj = document.createElementNS svgurl, type
	parent.appendChild obj
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]
	obj


click  = (s) -> console.log s
mousedown = (evt) -> mouse = [evt.x,evt.y]
mousemove = (evt) -> 
	if mouse.length == 0 then return
	center[0] += evt.movementX
	center[1] += evt.movementY
	#console.log origin
	drawMap()
mouseup = (evt) -> mouse = []

convert = ([x,y]) ->
	x -= 32
	y -= 320
	dx = x % 512
	dy = y % 512
	x += 32 - dx
	y += 320 - dy
	[x, y, 128-dy//2, dx//2-128]
#ass [6573600,678208,90,174], convert [6573780,678556]
#ass [6572064,676672,50,0], convert [6572064-32+100,676672-320]

drawMap = ->
	# for i in range svg.childNodes.length-1,-1,-1
	# 	svg.childNodes[i].remove()
	for i in range 3
		for j in range 3
			x = 256*i #+origin[0]
			y = 256*j #+origin[1]
			href = "maps\\#{center[0]+(i-1)*512}-#{center[1]-(j-1)*512}.jpg"
			#console.log href
			image = images[i][j]
			image.setAttributeNS null,'x', x
			image.setAttributeNS null,'y', y
			image.setAttributeNS null,'href', href
			#add 'image',svg, {x:256*i+origin[0], y:256*j+origin[1], href:href}
			add 'rect',svg,{x:256*i+origin[0], y:256*j+origin[1], width:256, height:256, stroke:'black', 'stroke-width':2, fill:'none'}

startup = ->
	W = 768
	H = 768

	add 'rect',svg,{x:0, y:0, width:W, height:H, stroke:'black', 'stroke-width':2, fill:'green'}
	grid = geodetic_to_grid position[0],position[1] # TURN!
	center = (Math.round g for g in grid)
	[baseX,baseY,dx,dy] = convert center
	images = []

	for i in range 3
		row = []
		x = baseX + (1-i) * 512
		for j in range 3
			y = baseY + (j-1) * 512
			href = "maps\\#{y}-#{x}.jpg" # TURN!
			console.log href
			row.push add 'image',svg, {x:256*j+dx, y:256*i+dy, href:href}
			add 'rect',svg,{x:256*j+dx, y:256*i+dy, width:256, height:256, stroke:'black', 'stroke-width':1, fill:'none'}
		images.push row

	button 10,     10, 'in',  "click('in!')"
	button W-60,   10, 'out', "click('out!')"
	button 10,   H-60, 'ctr', "click('ctr!')"
	button W-60, H-60, 'aim', "click('aim!')"
	crosshair 768/2,768/2

	#	x,y = grid_to_geodetic center[0],center[1]
	#drawMap()

startup()
