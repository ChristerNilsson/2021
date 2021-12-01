body = document.getElementById "body"
div = null
command = ''
start = new Date()

addButton = (title) =>
	button = document.createElement 'button'
	body.appendChild button
	button.innerHTML = title
	button.style = "width:300px;height:300px"
	button.ontouchend = (event) =>
		t = new Date()
		command += title + "#{t-start} "
		div.innerHTML = command
		start = t
		false
	button.onclick = button.ontouchend

addButton 'A'
addButton 'B'
div = document.createElement 'div'
body.appendChild div
div.innerHTML = '107'
