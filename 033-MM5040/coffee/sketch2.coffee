body = document.getElementById "body"
div = null
command = ''
start = new Date()

crap = (parent, type) => parent.appendChild document.createElement type

connect = (button, handler) =>
	button.ontouchend = handler
	button.onclick = handler

addButton = (title) =>
	button = crap body,'button'
	button.innerHTML = title
	button.style = "width:300px;height:300px"
	connect button,(event) =>
		t = new Date()
		command += title + "#{t-start} "
		div.innerHTML = command
		start = t
		false

addButton 'A'
addButton 'B'
div = crap body,'div'
div.innerHTML = '111'
