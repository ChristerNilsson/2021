curr = 0
lastWord = ''
lastSpoken = ''
speaker = null
hints = {}

started = false
ended = false
startingTimePlay = null
endingTime = null
elapsedTime = 0
userDistancePlay = 0
userDistanceRecord = 0
onTrack = true

voices = null
lastETA = 0
lastETAtimestamp = 0 # seconds since startingTimePlay
ETA = 0

window.speechSynthesis.onvoiceschanged = -> voices = window.speechSynthesis.getVoices()

initSpeaker = ->
	index = 5
	speaker = new SpeechSynthesisUtterance()
	speaker.voiceURI = "native"
	speaker.volume = 1
	speaker.rate = 1.0
	speaker.pitch = 0
	speaker.text = ''
	speaker.lang = 'en-GB'
	if voices and index <= voices.length-1 then speaker.voice = voices[index]
	say "#{VERSION}"

say = (m) ->
	if speaker == null then return
	speechSynthesis.cancel()
	speaker.text = m
	speechSynthesis.speak speaker
	messages.push 'SAY ' + m

diffToWord = (diff) ->
	WORDS = ['turn around','sharp left','medium left','left','','right','medium right','sharp right','turn around']
	WORDS[4 + Math.round diff/45]
ass 'turn around',diffToWord -180
ass 'sharp left',diffToWord -157
ass 'sharp left',diffToWord -113
ass 'left',diffToWord -67
ass 'left',diffToWord -23
ass '',diffToWord -22
ass '',diffToWord 22
ass 'right',diffToWord 23
ass 'right',diffToWord 67
ass 'medium right',diffToWord 68
ass 'medium right',diffToWord 112
ass 'sharp right',diffToWord 113
ass 'sharp right',diffToWord 157
ass 'turn around',diffToWord 158
ass 'turn around',diffToWord 180

sayETA = (gpsPoints) ->
	if gpsPoints.length < 2 then return
	if startingTimePlay == null then return
	if playPath.distance == 0 then return

	n = gpsPoints.length
	userDistancePlay += distance gpsPoints[n-2],gpsPoints[n-1]
	if userDistancePlay == 0 then return 
	progress = userDistancePlay / playPath.distance
	currTime = new Date()
	usedTime = currTime - startingTimePlay
	ETA = usedTime * playPath.distance / userDistancePlay # ms
	ETA /= 1000 # secs
	resolution = if progress < 0.5 then 60 else 10
	if resolution == 60 then nextETA = "#{ETA // 60}"
	if resolution == 10 then nextETA = "#{ETA // 60} #{myRound(ETA,-1) % 60}"
	if lastETA != nextETA and usedTime - lastETAtimestamp > 10000 # 10 seconds
		lastETAtimestamp = usedTime
		lastETA = nextETA
		say nextETA

sayHint = (gpsPoints) ->
	N = 5
	if not playPath or gpsPoints.length == 0 then return
	points = playPath.points
	last = gpsPoints.length-1
	gps = gpsPoints[last]
	[curr,dist] = findNearest gps,points
	if started and not ended then messages.push "gps #{curr} #{dist}"
	word = ''

	if not started and 25 > distance gps,points[0]
		started = true
		startingTimePlay = new Date()
		messages.push "trackStarted #{startingTimePlay.toLocaleString 'sv'}"
		say 'track started!'
		userDistancePlay = 0
		onTrack = true
		return

	if started and not ended and 10 > distance gps,points[points.length-1]
		ended = true
		endingTime = new Date()
		elapsedTime = endingTime - startingTimePlay
		messages.push "elapsedTime #{elapsedTime}"
		say 'track ended!'
		return

	if not started then return
	if ended then return

	try
		sayETA gpsPoints
	catch err
		messages.push "#{err}"
		messages.push "#{err.stack}"

	if not onTrack and dist < 10 # meters
		word = 'track found!'
		onTrack = true
	else if dist > 25 # meters
		word = 'track lost!'
		onTrack = false 
	else
		word = if curr+N of hints then hints[curr+N] else ''
	if lastSpoken != word
		messages.push "HINT #{curr} #{points[curr]} #{word} #{dist}"
		say word
		lastSpoken = word

findNearest = (p1,polygon) ->
	index = 0
	[x,y] = p1
	p = polygon[0]
	dx = p[0] - x
	dy = p[1] - y
	best = dx*dx + dy*dy
	for i in range polygon.length
		p = polygon[i]
		dx = p[0] - x
		dy = p[1] - y
		d = dx*dx + dy*dy
		if d < best
			best = d
			index = i
	[index, Math.round Math.sqrt best]

makeHints = ->
	console.log 'makeHints'
	hints = {}
	points = playPath.points
	console.log points
	for i in range 2,points.length - 3
		b0 = bearing points[i-2],points[i]
		b1 = bearing points[i],points[i+2]
		diff = b1 - b0 + 180
		diff = diff %% 360 - 180

		word = diffToWord diff
		if word != '' then hints[i] = word
	console.log hints
