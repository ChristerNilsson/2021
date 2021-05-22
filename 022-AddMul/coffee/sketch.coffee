LONG = 60 # seconds before no player wins
SHORT = 20 # seconds player may enter the answer

N = 20

a = null
b = null
inp = null
score = [0,0]

buttons = []

state = -1 # -2:start -1:visible 0:Left player 1:Right player 2:show score

range = _.range

start = null # starttid. 60 sek för första, 20 sek för andra

class Button
	constructor : (@prompt,@x,@y,@click) -> @r = 50
	draw : ->
		circle @x,@y,2*@r
		text @prompt,@x,@y
	inside : (mx,my) -> @r > dist @x,@y,mx,my

ass = (a, b) ->
	if _.isEqual a, b then return
	console.log ""
	console.log a
	console.log b

newGame = ->
	a = _.random -N,N
	b = _.random -N,N
	start = new Date() # LONG

draw = ->
	nextstate = state 
	background 128

	if state in [0,1]
		buttons[2].draw()
		secs = (new Date() - start) // 1000 # seconds
		text SHORT - secs,width/2,50
		if secs >= SHORT 
			score[1-state] += 1
			inp.hide()
			nextstate = -2

	if state in [-1,0,1,2]
		text "a*b = #{a*b}",width/2,150
		text "a+b = #{a+b}",width/2,250

	if state == 2
		buttons[2].draw()
		inp.hide()

	if state == -1
		for button in [buttons[0],buttons[1]]
			button.draw()
		secs = (new Date() - start) // 1000 # seconds
		text LONG-secs,width/2,50
		if secs >= LONG
			inp.hide()
			nextstate = -2

	text score[0],50,50
	text score[1],width-50,50
	state = nextstate

getParts = (arr) ->
	space = arr.lastIndexOf ' '
	minus = arr.lastIndexOf '-'
	if space > 0 then return [arr.slice(0,space), arr.slice space+1 ]
	else if minus >= 0 then return [arr.slice(0,minus), arr.slice minus ]
	else return []

ass ["1","-7"], getParts "1-7"
ass ["1","-7"], getParts "1 -7"
ass ["-7","1"], getParts "-7 1"
ass ["1","7"], getParts "1 7"
ass ["-7","-7"], getParts "-7-7"

player = (i) ->
	state = i
	if state in [0,1]
		inp.show()
		inp.elt.focus()
		event.preventDefault()
		inp.value()
		start = new Date() # SHORT

keyPressed = (event) -> handle key

handle = (key) ->
	if state == -2
		if key == 'Enter'
			newGame()
			state = -1
	else if state == -1
		if key == 'z' then player 0
		if key == 'm' then player 1
	else if state in [0,1]
		if key == 'Enter'
			arr = inp.value()
			inp.value ""
			inp.hide()
			arr = getParts arr
			success = false
			if arr.length == 2
				c = parseInt arr[0]
				d = parseInt arr[1]
				success = a==c and b==d or a==d and b==c
			if success then score[state] += 1 else score[1-state] += 1
			state = 2
	else if state == 2
		if key == 'Enter'
			newGame()
			state = -1

setup = ->
	createCanvas 600,600
	textSize 40
	textAlign CENTER,CENTER
	score = [0,0]

	buttons.push new Button 'z',60,      height-60, -> player 0
	buttons.push new Button 'm',width-60,height-60, -> player 1
	buttons.push new Button 'enter',width/2,height-60, -> handle 'Enter'

	inp = createInput ''
	inp.id = 'input'
	inp.hide()
	inp.style 'font-size', '30px', 'color', '#ff0000'
	inp.position width/2-50, 350
	inp.size 100

	newGame()

mousePressed = ->
	for button in buttons
		if button.inside mouseX,mouseY
			button.click()
