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

			console.log "remove stand stills"
			temp = [@points[0]]
			for [x,y] in @points
				[x0,y0] = temp[temp.length-1]
				if x0!=x or y0!=y then temp.push [x,y]
			@points = temp

			@hash = @hashCode @path
			@distance = @calcDist() # in meters
			@count = @points.length
			@box = @calcBox()

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
		[[myRound(xmin),myRound(ymin)],[myRound(xmax),myRound(ymax)]]

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
			localStorage.boxes = JSON.stringify boxes
			localStorage[@hash] = @path
	
	delete : ->
		localStorage.removeItem @hash
		for i in range boxes.length
			box = boxes[i]
			console.log i,box
			if box[0] == @hash
				boxes.splice i,1
				playPath = null
				localStorage.boxes = JSON.stringify boxes
				return

# temp  = new Path 'Christer'
# ass 1979511370, temp.hashCode 'Christer'
