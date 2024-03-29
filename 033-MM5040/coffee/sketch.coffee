SYMBOLS = '0123456789abcdefg'
M = 4
N = 10
CANDS = 0
command = ""
facit = ""
guess = ""
cands = null
errors = []
headers = []
historyx = []
ts = 20

dialogues = []
released = true

crap = (parent, type) => parent.appendChild document.createElement type
connect = (button, handler) => button.onclick = button.ontouchend = handler
pack = (digits) => digits.join ""
init = => _(SYMBOLS.substring(0,N)).permutations(M).map((v) => _.join(v, '')).value()
candidates = (m,n) => _.reduce range(n,n-m,-1), (a,b) => a*b
assert 5040, candidates 4,10
assert 11880, candidates 4,12
assert 2162160, candidates 6,14
assert 518918400, candidates 8,16
assert 20922789888000, candidates 16,16

newGame = =>
	historyx = []
	guess = ""
	command = ""
	facit = _.shuffle SYMBOLS.substring 0,N
	facit = pack facit.slice 0,M
	cands = null
	CANDS = candidates(M,N)
	if candidates(M,N) <= 1000000 then cands = init()

makeAnswer = (f,g) => # facit,guess
	m = f.length
	res = []
	for i in _.range m
		for j in _.range m
			if f[i] == g[j]
				res.push SYMBOLS[Math.abs i-j]
	res.sort()
	pack res
assert ""     , makeAnswer "1234","5678"
assert "0"    , makeAnswer "1234","1678"
assert "00"   , makeAnswer "1234","1278"
assert "000"  , makeAnswer "1234","1235"
assert "0000" , makeAnswer "1234","1234"
assert "0123" , makeAnswer "1234","3241"
assert "1133" , makeAnswer "1234","4321"
assert "2222" , makeAnswer "1234","3412"
assert "33"   , makeAnswer "1234","4561"

reduce = (cands,guess) =>
	if cands == null then return null
	res = []
	answer1 = makeAnswer facit,guess
	for cand in cands
		answer2 = makeAnswer cand, guess
		if answer1 == answer2
			res.push cand
	res

handleGuess = (guess) => 
	answer = makeAnswer facit,guess
	cands = reduce cands,guess
	historyx.push [guess,answer,cands]
	if answer == '0'.repeat M then dialogues.pop()
	command = ''
handler = => handleGuess command

setup = =>
	body.style.overflow = 'hidden'
	body.style.position = 'fixed'
	body.style.top = '0px'
	body.style.width = '100%'
	createCanvas windowWidth, windowHeight
	angleMode DEGREES
	menu0()
	xdraw()

interpolate = (x0,y0,x1,y1,x) =>
	dy = y1-y0
	dx = x1-x0
	k = dy/dx
	m = y0-k*x0
	k*x+m

xdraw = ->
	background 128
	noStroke()
	fill 0

	x0 = width/2/1
	x1 = width/2/16
	y0 = 60
	y1 = 30
	ts = interpolate x0,y0,x1,y1,width/2/M
	textSize ts

	textAlign LEFT,TOP
	text command,5,5

	textAlign RIGHT,TOP
	fill 64+32
	text CANDS,width-5,5

	textAlign LEFT,BOTTOM
	text "#{M} of #{N}", 5,height-5

	drawTable()
	showDialogue()

drawTable = =>
	n = Math.floor height/ts
	n = max 0, n - 2
	antal = min n, historyx.length
	offset = max 0, historyx.length - n

	for i in _.range antal
		h = historyx[offset + i]
		[a,b,c] = h
		
		textAlign LEFT
		fill 0
		text a,5,5+(i+2)*ts

		if c
			textAlign CENTER
			fill 255,255,0
			text b,0.5*width,5+(i+2)*ts

			textAlign RIGHT
			fill 64+32
			text c.length,width-5,5+(i+2)*ts
		else
			textAlign RIGHT
			fill 255,255,0
			text b,width-5,5+(i+2)*ts

showDialogue = -> if dialogues.length > 0 then (_.last dialogues).show()

menu0 = -> # select Game
	dialogue = new Dialogue()
	for i in range 9
		for j in range 1,17
			if j >= 2*i then continue
			do (i,j) =>
				button = new Button dialogue,"#{SYMBOLS[j+1]}:#{SYMBOLS[2*i]}", =>
					M = j+1
					N = 2*i
					newGame()
					menu1()
					xdraw()
				dialogue.buttons.push button
				button.x = 60 * (i-5)
				button.y = 60 * (j-8)
				button.r = 30

menu1 = -> # Main Menu
	dialogue = new Dialogue()
	for ch in SYMBOLS.substring 0,N
		do (ch) -> dialogue.add ch, =>
			dialogue.disable ch
			command += ch
			if command.length == M then handler()
			for button in dialogue.buttons
				if button.title == 'back' then button.active = command.length > 0
				else button.active = command.length < M and button.title not in command

	dialogue.add 'nop', =>

	dialogue.add 'back', =>
		command = command.substring 0,command.length-1
		for button in dialogue.buttons
			if button.title == 'back' then button.active = command.length > 0
			else if button.title not in command then button.active = true
	dialogue.disable 'back'
	dialogue.disable 'nop'

	buttons = dialogue.buttons
	n = buttons.length
	bs = buttons.splice n-2, 1
	buttons.splice 1,0,bs[0]
	dialogue.clock 'exit',true
	dialogue.textSize *= 1.5

doit = ->
	if dialogues.length > 0
		dialogue = _.last dialogues
		dialogue.execute mouseX,mouseY
	else
		menu0()

mouseReleased = -> # to make Android work 
	released = true 
	false

touchStarted = ->
	doit()
	xdraw()

mousePressed = ->
	if !released then return # to make Android work 
	released = false
	touchStarted()
