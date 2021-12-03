SYMBOLS = '0123456789abcdef'
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
assert 2432902008176640000, candidates 20,20

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
	if answer == '0000' then historyx.push ["Solved in #{historyx.length} guesses!","",[]]
	command = ''
handler = => handleGuess command

setup = =>
	createCanvas 600,800
	angleMode DEGREES
	newGame()
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
	#text dialogues.length,width/2,height-50

drawTable = =>
	y0 = 100
	for h,i in historyx
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

menu1 = -> # Main Menu
	dialogue = new Dialogue()
	for ch in SYMBOLS.substring 0,N
		do (ch) -> dialogue.add ch, =>
			dialogue.disable ch
			command += ch
			for button in dialogue.buttons
				if button.title == 'back' then button.active = command.length > 0
				else if button.title == 'ok' then button.active = command.length == M
				else button.active = command.length < M and button.title not in command

	dialogue.add 'ok', =>
		handler()
		dialogues.pop()

	dialogue.add 'back', =>
		command = command.substring 0,command.length-1
		for button in dialogue.buttons
			if button.title == 'back' then button.active = command.length > 0
			else if button.title == 'ok' then button.active = command.length == M
			else if button.title not in command then button.active = true
	dialogue.disable 'back'

	buttons = dialogue.buttons
	n = buttons.length
	bs = buttons.splice n-2, 1
	buttons.splice 1,0,bs[0]

	dialogue.clock '005',true
	dialogue.add "new", => menu2()
	button = _.last dialogue.buttons
	button.x = width/2-50
	button.y = height/2-50
	button.r = 50

	dialogue.disable 'ok'
	dialogue.textSize *= 1.5

menu2 = -> # new Game
	dialogue = new Dialogue()
	dialogue.add 'new', =>
		newGame()
		dialogues.pop()
		dialogues.pop()
		menu1()
		xdraw()
	dialogue.add '-2', => if N > 2 and N > M then N-=2
	dialogue.add '+2', => if N < SYMBOLS.length then N+=2
	dialogue.add '+1', => if M < N then M++
	dialogue.add '-1', => if M > 1 then M--
	dialogue.clock ' ',true

######

doit = ->
	if dialogues.length > 0
		dialogue = _.last dialogues
		dialogue.execute mouseX,mouseY
	else
		menu1()

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
