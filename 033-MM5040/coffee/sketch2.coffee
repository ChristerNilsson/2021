body = null
d = null
command = ''

#createButton = =>


f = (title) =>
	res = document.createElement 'button' # title
	res.innerHTML = title
	res.style = "width:100px;height:100px"
	body.appendChild res
	res.onclick = =>
		command += title
		d.innerHTML = command

body = document.getElementById "body"
f 'A'
f 'B'
d = document.createElement 'div'
body.appendChild d
f 'C'
f 'D'

d.innerHTML = '100'
