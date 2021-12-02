start = new Date()
released = true
lista = []

setup = =>
	createCanvas 600,600
	lista.push 'setup 002'
	xdraw()

xdraw = =>
	background 128
	for s,i in lista
		text "#{i} #{s}",100,25+25*i

mouseReleased = -> # to make Android work 
	released = true 
	false

touchStarted = -> 
	t = new Date()
	lista.push "touchStarted #{t-start}"
	start = new Date()
	xdraw()

mousePressed = ->
	if !released then return # to make Android work 
	released = false
	t = new Date()
	lista.push "mousePressed #{t-start}"
	start = new Date()
	xdraw()

# keyPressed = ->
# 	player.keyPressed(key) for player in g.players
# 	if key == ' ' 
# 		autolevel()
# 		g.createProblem()
# 	#xdraw()
