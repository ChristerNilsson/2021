body = document.getElementById "body"
d = null
command = ''
start = new Date()

f = (title) =>
	res = document.createElement 'button'
	res.innerHTML = title
	res.style = "width:300px;height:300px"
	body.appendChild res
	res.ontouchstart = =>
		t = new Date()
		command += title + "#{t-start} "
		d.innerHTML = command
		start = t

f 'A'
f 'B'
d = document.createElement 'div'
d.innerHTML = '104'
body.appendChild d
