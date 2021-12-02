start = new Date()
released = true
lista = []

setup = =>
	createCanvas 600,600
	lista.push 'setup 001'
	xdraw()

xdraw = =>
	background 128
	for s,i in lista
		text s,100,25+25*i

mouseReleased = -> # to make Android work 
	released = true 
	false

touchStarted = -> 
	lista.push "touchStarted"
	xdraw()

mousePressed = ->
	if !released then return # to make Android work 
	released = false
	lista.push "mousePressed"
	xdraw()

# keyPressed = ->
# 	player.keyPressed(key) for player in g.players
# 	if key == ' ' 
# 		autolevel()
# 		g.createProblem()
# 	#xdraw()
