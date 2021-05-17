speaker = null

setup = ->
	createCanvas 350,100
	textSize 80
	textAlign CENTER,CENTER
	frameRate 1
	initSpeaker()

initSpeaker = ->
	index = 5
	speaker = new SpeechSynthesisUtterance()
	speaker.voiceURI = "native"
	speaker.volume = 1
	speaker.rate = 1.0
	speaker.pitch = 0
	speaker.text = ''
	speaker.lang = 'en-GB'

say = (m) ->
	console.log m
	if speaker == null then return
	speechSynthesis.cancel()
	speaker.text = m
	speechSynthesis.speak speaker

draw = ->
	background 255
	d = new Date()
	d = d.toLocaleString 'sv'
	d = d.slice 11,20
	text d,width/2,height/2+5
	d = d.slice 0,8
	if d.slice(3,8) in "00:00 30:00".split ' ' then say d.slice 0,5
	#if d.slice(6,8) in "00".split ' ' then say d.slice 0,5
