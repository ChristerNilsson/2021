body = document.getElementById "body"
d = null
command = ''

f = (title) =>
	res = document.createElement 'button'
	res.innerHTML = title
	res.style = "width:300px;height:300px"
	body.appendChild res
	res.onclick = =>
		command += title
		d.innerHTML = command

f 'A'
f 'B'
d = document.createElement 'div'
d.innerHTML = '103'
body.appendChild d
f 'C'
f 'D'
