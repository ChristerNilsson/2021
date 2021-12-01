body = document.getElementById "body"
div = null
command = ''
start = new Date()

connect = (button,handler) =>
	button.ontouchend = handler
	button.onclick = handler

addButton = (title) =>
	button = document.createElement 'button'
	body.appendChild button
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
div = document.createElement 'div'
body.appendChild div
div.innerHTML = '109'
