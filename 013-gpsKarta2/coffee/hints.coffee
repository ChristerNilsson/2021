ZONE6 = false
ZONE8 = true

curr = 0
lastWord = ''
lastSpoken = ''
speaker = null
hints = {}

started = false
ended = false
startingTime = null
endingTime = null
elapsedTime = null
userDistance = null

voices = null

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
	messages.push "Welcome! B"
	say "Welcome!"

say = (m) ->
	if speaker == null then return
	speechSynthesis.cancel()
	speaker.text = m
	speechSynthesis.speak speaker

# clock = (d) ->
# 	res = (12 + Math.round d/30) % 12
# 	if res==0 then res = 12
# 	res	
# ass 11, clock -30
# ass 12, clock -14
# ass 12, clock 0
# ass 12, clock 14
# ass 1, clock 30
# ass 1, clock 44
# ass 2, clock 46

diffToWord = (diff) ->
	res = ''
	if ZONE6 # 6 * 60 degrees
		if -150 < diff <= -90 then res = 'sharp left'
		else if -90 < diff <= -30 then res = 'left'
		else if -30 < diff <= 30 then res = ''
		else if 30 < diff <= 90 then res = 'right'
		else if 90 < diff <= 150 then res = 'sharp right'
		else if 150 < diff or diff <= -150 then res = 'turn around'
		# if lastSpoken == 'sharp left'  and res == 'left'  then res = ''
		# else if lastSpoken == 'sharp right' and res == 'right' then res = ''

	if ZONE8 # 8 * 45 degrees
		if -157.5 < diff <= -112.5 then res = 'sharp left'
		else if -112.5 < diff <= -67.5 then res = 'left'
		else if -67.5 < diff <= -22.5 then res = 'slight left'
		else if -22.5 < diff <= 22.5 then res = ''
		else if 22.5 < diff <= 67.5 then res = 'slight right'
		else if 67.5 < diff <= 112.5 then res = 'right'
		else if 112.5 < diff <= 157.5 then res = 'sharp right'
		else if 157.5 < diff or diff <= -157.5 then res = 'turn around'

		# if lastSpoken == 'sharp left' and res == 'left' then res = ''
		# else if lastSpoken == 'sharp left' and res == 'slight left' then res = ''
		# else if lastSpoken == 'left'       and res == 'slight left' then res = ''
		# else if lastSpoken == 'sharp right' and res == 'right' then res = ''
		# else if lastSpoken == 'sharp right' and res == 'slight right' then res = ''
		# else if lastSpoken == 'right'       and res == 'slight right' then res = ''
	res

# sayHint = (gpsPoints) ->
# 	N = 5
# 	if not currentPath or gpsPoints.length == 0 then return
# 	points = currentPath.points
# 	last = gpsPoints.length-1
# 	gps = gpsPoints[last]
# 	[curr,dist] = findNearest gps,points

# 	if dist > 25 # meters
# 		word = 'No Track'
# 		diff = 'nix'
# 	else
# 		if gpsPoints.length < N then return 
# 		b0 = bearing gpsPoints[last],gpsPoints[last-N]
# 		#b1 = bearing points[curr+2*N],points[curr+N]
# 		b1 = bearing points[curr+N],points[curr]
# 		diff = b1 - b0 + 180
# 		diff = diff %% 360 - 180
# 		word = diffToWord diff

# 	if lastSpoken != word and word != ''
# 		messages.push "sayHint #{curr} of #{points.length} points:#{points[curr]} word:#{word} diff:#{diff} dist:#{dist}"
# 		say word
# 		lastSpoken = word
# 	lastWord = word

sayHint = (gpsPoints) ->
	N = 5
	if not currentPath or gpsPoints.length == 0 then return
	points = currentPath.points
	last = gpsPoints.length-1
	gps = gpsPoints[last]
	[curr,dist] = findNearest gps,points
	word = ''

	if not started and dist < 25 and curr==0
		started = true
		startingTime = new Date()
		say 'track started'
		userDistance = 0
		return

	if not started and dist < 25 and curr==points.length-1
		current.path.reverse()
		makeHints()
		points = current.path
		started = true
		startingTime = new Date()
		say 'reverse track started'
		userDistance = 0
		return

	if not ended and curr == points.length-1
		ended = true
		endingTime = new Date()
		elapsedTime = endingTime - startingTime
		messages.push "elapsedTime #{elapsedTime}"
		say 'track ended'
		return

	if not started then return
	if ended then return

	if last >= 1
		userDistance += distance gpsPoints[last-1],gpsPoints[last]

	if userDistance / currentPath.distance > 0.1
		usedTime = new Date() - startingTime
		ETA = usedTime * currentPath.distance / userDistance
		messages.push "ETA #{ETA} = #{usedTime} * #{currentPath.distance} / #{userDistance}"

	if dist > 25 # meters
		word = 'no track'
	else
		if curr+N of hints
			word = hints[curr+N]
			messages.push "sayHint #{curr} of #{points.length} points:#{points[curr]} word:#{word} dist:#{dist}"
		else
			word = ''
	if lastSpoken != word
		say word
		lastSpoken = word

		# if gpsPoints.length < N then return 
		# b0 = bearing gpsPoints[last],gpsPoints[last-N]
		# #b1 = bearing points[curr+2*N],points[curr+N]
		# b1 = bearing points[curr+N],points[curr]
		# diff = b1 - b0 + 180
		# diff = diff %% 360 - 180
		# word = diffToWord diff

	# if lastSpoken != word and word != ''
	# 	messages.push "sayHint #{curr} of #{points.length} points:#{points[curr]} word:#{word} diff:#{diff} dist:#{dist}"
	# 	say word
	# 	lastSpoken = word
	# lastWord = word

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
	points = currentPath.points
	for i in range 2,points.length - 3
		b0 = bearing points[i-2],points[i]
		b1 = bearing points[i],points[i+2]
		diff = b1 - b0 + 180
		diff = diff %% 360 - 180

		word = diffToWord diff
		if word != '' then hints[i] = word
			#console.log "#{i} #{points[i]} #{b0} #{b1} #{diff} #{word}"
			#messages.push "#{i} #{word}"

#path = '300,300,B00aAb0b0abaa0aAA0a0b0b0baa0cagaibhcjbgbfcddac0babadAaAbAcAcAbAaAbAbAbAbAaAcAbAaAbAbAcBb0aAcAaAaAbBbBbBbBbAaAbBbAbAaAaAbAaAc0cAa0dAc0bAcagahCfBeCeAcCbCbCbAaA0Cb0aCbDgEdDeBeBeAc0b0ccbae0c0cAcAcCdDeCfEdEcEcFbC0C0A0CaDaBaBaAaA0BaAbBaAbBaA0BbBaBaBbBaAaFfEbDaAaB0CaBaA0CaBaEaGaF0GaGbFeDfDfEfEeFeGcFdFdEcBd0ebd0dAfBgCgBf0gbgcecea0bbcfdfdgdeeefddedgag0h0g0gbgbfbfaccdcebbabac0a0AA0aa0bac0a0a0cab0aaa0babac0b0b0b0b0dhj0e0f0c0c0eac0d0cAa0cAbAlBfBeadAb0bAbBeBhBfAfBfDdBcAbCdEeFfFfFeEeEeEeEeEeDdDeDdCdAdadadbebe0b0c0a0cAgAeAcBdEdHcHaGaGaGaGAFAFBEBDDDDFDFEFDFCFBE0BbA0DeFdFaFAC0B0D0AaBbAbBb0aAb0eAgAfAfBeDeFeFcFcEdDdAaAdBfCfDfEfEfGdFeEdFcFdFcFeEeDeEdEcDcDbDcCcDdDcEdD0FADB0bBBBAB0CAA0CBBBAABCAABBACBFBGAFAFAF0EaBaA0BaB0CAA0CAC0C0BAC0B0BAA0ABCBAA0B0B0C0A0C0A0A0B00ABaA0B00aA0AaAaAbAaBaAbAbAaAbAaAbAaAb0aAa0aAb0a0aAa0bA00aAbAaAa0aAa0a0aA0AbAaCaAaA0Ba0aBa0aA0AaA0A0AaA0B0AaB0AaA0A0AaA00aAaAa0aAaAbAaAa0aBb0a0aA00a0b0a0b0a0b0a0bAaAa0a0a0aa00a0aaaaa0a0a0aAaA0AaA0AaCbBaFcEaBaDcFdGeFeEcDb0cCbCaDcEdDcCaAaA0DaDbBbAaCbBaCaCaBaCbBaBaBaA0BaAaBbBbBbBcCcBaBbAaAbBbBaAbAbAaAbBbAaBaBaAaCbCbAaBbBcAbBbAcBcAcAaBb0b0c0b0a0a0b0b0a0aaa0aAa0aAbAbAc0aAbAa0cAcAc0a0b0aab0a0baa0aaa0a0aa00a0a0a0aA00bAaAaAbAa0aAbAaAbAa0aAb0bAa0c0b0aAa0a0aAa0aAaAbAb0a0aA00b0b0a0b0a0cAa0cAaBbBcAbAaBaAbAbBaAcAaBbAaBcDd0aCb0aBbAaBcAcBcBc0aAaBbB00aAaAaAaAaAaAaAa0a0a0a0b0bAaAcAaBbAaAbCcCbA0BaBaC0B0b0a0a0aaa0a0bAbAa0aB0B0AABABAAABAAAACAA0A0AaA0AaBaCcAbAaAb0aBaB0CaA0EaC0AaD0DaB0AbAaAbAaAaBdAcAaAaAcAaAbAaAbBbAcAaAbAaAcAcBcAbAbBcAbBbBcAaA0CaCaCcGcFdFcFdFcEcEcEcDbDaBBC0FAHAGBHAGAG0FAEADABDAaBaBbBcAaAaBbCcDcBb0aAcAaAaB0A0A0BAA0BABABACACACBCABBA0BBDDBD0CaBaCbCbAcCcCbC0AbB0B0B0BaCABBFBHCIAHaHbHbHbE0CA00B0B0A0A0B0C0BaB0B0D0AACACBFAEACBBBDBCCDBBBACDDBBBBACBEBFBFBFAFBEBCA0ABCEDDDDAA0C0AABACABADAFAE0E0FaEAABCCBBFCFDFCFDECECDDCDBABAABaCaAaBcBgEfFcGcFaGaH0FAGBFBECAA0HcH0H0H0HAGBHAGCGBGDFCGDFCGCFCHBGBG0G0F0FaFbDcBcAdCcEcEcFbEa0aCaBbAaCbB0CaGCG0FaGAGBGBEAEBEBEAF0GBFBFBFAEaEcHaFAGCFCGDGCFCGBFCFCFDFDEDFDDEDECFCFDGCFCGBGCFCGBFBFAEBECGCFCEDEDECEDCECCAAB0CcAcaa0bafiehdgegdgceeddbdBeDfEfEfEfDfDfDfDfDfDeDfDfDfCeDfDgCeDeDdDdDdDdCcCcAdadbdcbcdcA0aaB0aAbAaAaAbBcBeDeEdDdDcCbBc0cabac0b0c0b0aBa0cCbBbB0AbBbAaBbDaB0B0A0A0BAAAB0BAB0B0AAC0E0C0AaBaCaBaBaAbBaAaAaBaAaB0A0B0AABAAABAA0E0AdCeEdEeEeFeEdEcDaF0E0EAECCDDFCFCEDDDEFDEDDDDBDADaEdEdEdEeEeEeFeEeFeFeEfEfDhBgCfCgEfDfEgDfDfEfEfDfFgEgEgEfFhFgFgFfFfDfEdCbBaCAA0A0A0AaBbB0AAAaAaBiJdGcHbGbHaGaHaG0HaH0HaGbHaGbHbGbGaGcFbEcF0FAGBGBGCFDGCFCGCFCGCFDFBEACcAdaac0fahcgdgcgcfcgbfcgcfcfcdfbeAfCfDfDgDgDfDgDgDgEgDfEeDbDCECGDGCHBGAGAG0G0GbGaGbFcGeFfDfDfCgCgCfDfDfDgCgCfDhDgCgCgCgBgBhAgBgBgBgBgCfCgAgCgCgBgCgBgBgCgBhCgBgBfBgBfBgAfBeBeBeBeCfCeCdDeDdCeDfDfDfCeDdCbCbBbCaAbAcAcBc0gFfEfEfEfEfDfCgBf0baababdcabbg0gafbbccdddac0ljhehchchcgbgbgagbgbhahagagAgBhBgCgCfCeAgBeBeBeAc0ebdbfdgdhdgdgcgcgdfdedcgbgahaecddededebg0gahBgCgAi0h0fceedfbhagagaeAeAgAgAg0faeagbhbfahaibfaf0hEgDhDgDgDhChChChEgDfDfCgDfDeCgDhDhDhCgBgDfDhChDiChBhAhAh0iai0hbhaf0fAfBfBfAeBeBfAeAfAfBfBeBcCbAA00a0A0aA00a'
#points = decodeAll path
# ass [0,0],    findNearest [300,300], points
# ass [55,12],  findNearest [260,200], points
# ass [1409,4], findNearest [670,190], points
# ass [1456,65],findNearest [350,350], points
# ass [1469,0], findNearest [306,296], points
