body = document.getElementById "body"
d = null
command = ''

f = (title) =>
	res = document.createElement 'button'
	res.innerHTML = title
	res.style = "width:100px;height:100px"
	body.appendChild res
	res.onclick = =>
		command += title
		d.innerHTML = command

f 'A'
f 'B'
d = document.createElement 'div'
d.innerHTML = '102'
body.appendChild d
f 'C'
f 'D'
