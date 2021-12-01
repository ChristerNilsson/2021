d = null
command = ''

f = (title) =>
	res = createButton title
	res.size 100,100
	res.mousePressed => 
		command += title
		d.html command

setup = =>
	noCanvas()
	f 'A'
	f 'B'
	d = createDiv ''
	f 'C'
	f 'D'

	d.html 'yxa'
