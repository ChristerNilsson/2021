SYMBOLS = '0123456789abcdefghij'
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

dialogues = []
menuButton = null
backButton = null
okButton = null

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
	canvas = createCanvas 600,800
	canvas.touchEnded touchEnded
	angleMode DEGREES
	menuButton = new MenuButton width-160
	newGame()

draw = ->
	noStroke()
	background 128
	fill 0
	textSize 40
	textAlign LEFT
	text "#{M} of #{N}", 10,height-10
	text command,50,40
	textAlign RIGHT
	fill 64+32
	text CANDS,width-10,50
	textAlign LEFT
	drawTable()
	menuButton.draw()
	showDialogue()
	text int(frameRate()),width/2,height-50

drawTable = =>
	y0 = 100
	for h,i in historyx
		[a,b,c] = h
		
		textAlign LEFT
		fill 0
		text a,10,y0+i*40

		textAlign CENTER
		fill 255,255,0
		text b,0.5*width,y0+i*40

		if c
			textAlign RIGHT
			fill 64+32
			text c.length,width-10,y0+i*40

showDialogue = -> if dialogues.length > 0 then (_.last dialogues).show()

menu1 = -> # Main Menu
	dialogue = new Dialogue()
	for ch in SYMBOLS.substring 0,N
		do (ch) -> dialogue.add ch, =>
			dialogue.disable ch
			command += ch
			for button in dialogue.buttons
				if button.title == 'Back' then button.active = command.length > 0
				else if button.title == 'Ok' then button.active = command.length == M
				else button.active = command.length < M and button.title not in command

	dialogue.add 'Back', =>
		command = command.substring 0,command.length-1
		for button in dialogue.buttons
			if button.title == 'Back' then button.active = command.length > 0
			else if button.title == 'Ok' then button.active = command.length == M
			else if button.title not in command then button.active = true
	dialogue.disable 'Back'

	dialogue.add 'Ok', =>
		handler()
		dialogues.pop()

	dialogue.clock '003',true
	dialogue.add "New", => menu2()
	button = _.last dialogue.buttons
	button.x = width/2-50
	button.y = height/2-50
	button.r = 35

	dialogue.disable 'Ok'
	dialogue.textSize *= 1.5

menu2 = -> # new Game
	dialogue = new Dialogue()
	dialogue.add 'New', => 
		newGame()
		dialogues.pop()
	dialogue.add '-2', => if N > 2 and N > M then N-=2
	dialogue.add '+2', => if N < SYMBOLS.length then N+=2
	dialogue.add '+1', => if M < N then M++
	dialogue.add '-1', => if M > 1 then M--
	dialogue.clock ' ',true

touchEnded = -> # mousePressed
	console.log 'touchEnded'
	if menuButton.inside mouseX,mouseY
		menuButton.click()
		return false
	if dialogues.length > 0
		dialogue = _.last dialogues
		#if not dialogue.execute mouseX,mouseY then dialogues.pop()
		dialogue.execute mouseX,mouseY # then dialogues.pop()

######

