label = null
input = null
lista = null
errorlabel = null
bToggle = null
toggleMode = 1
answers = {}

range = _.range

memory = {'a':12,'b':23,'c':3,'d':4,'e':5,'add':'a+b','mul':'a*b', 'sq': 'a*a', 'f': '(x) -> x*x', 'g':'f 9','h':'i*i for i in range a'}

config = {}

getParameters = (h = window.location.href) ->
	arr = h.split '?'
	if arr.length != 2 then return {}
	s = arr[1]
	if s=='' then return {}
	pairs = (f.split '=' for f in s.split '&')
	pairs = ([key, decodeURIComponent value] for [key,value] in pairs)
	_.fromPairs pairs

encode = ->
	s = encodeURI JSON.stringify memory
	s = s.replace /=/g,'%3D'
	s = s.replace /\?/g,'%3F'
	window.open '?content=' + s + '&config=' + encodeURI JSON.stringify config

decode = ->
	memory = {}
	if '?' in window.location.href
		parameters = getParameters()
		if parameters.content
			memory = parameters.content
			memory = JSON.parse memory
		if parameters.config
			config = JSON.parse parameters.config

button = (prompt,click) ->
	res = document.createElement 'button'
	res.innerHTML = prompt
	res.style= 'width:80px; font-family:courier;'
	res.onclick = click
	document.body.appendChild res
	res

updateList = () ->
	label.innerHTML = ""
	lista.size = _.size memory
	lista.length = 0
	for key of memory
		row = memory[key]
		if key == 'ans'
			if typeof answers.ans == 'function'
				label.innerHTML = row
			else
				if answers.ans == ''
					label.innerHTML = answers.ans
				else
					label.innerHTML = JSON.stringify answers.ans
		else
			option = document.createElement "option"
			if typeof answers[key] == 'function'
				option.innerText = "#{key} = #{row}"
			else if toggleMode == 0
				option.innerText = "#{key} = #{row}"
			else
				option.innerText = "#{key} = #{JSON.stringify answers[key]}"
			option.value = key
			lista.appendChild option

execute = ->
	label.innerHTML = ''
	answers.ans = ""
	errorlabel.innerHTML = ""

	try

		arr = input.value.split ' = '
		arr = (item.trim() for item in arr)

		# delete?
		if input.value.slice(-1) == '='
			delete memory[arr[0]]
			delete answers[arr[0]]
			eval "#{arr[0]}=undefined"
			updateList()
			return 

		if arr.length == 2 and arr[0] of memory
			memory[arr[0]] = arr[1]

		s = ("answers.#{key} = (#{key} = (#{memory[key]}))" for key of memory when key!='ans')
		if arr.length == 1 and arr[0] != '' then s.push "answers.ans = (#{arr[0]})"
		if arr.length == 2 then s.push "answers.#{arr[0]} = (#{arr[0]} = (#{arr[1]}))"
		eval transpile s.join ';'

		if arr.length == 1 then memory.ans = arr[0]
		if arr.length == 2 then memory[arr[0]] = arr[1]

		updateList()
		input.select()

	catch err
		errorlabel.innerHTML = err.message

transpile = (code) ->
	result = CoffeeScript.compile code, {bare: true}
	result.replace /\n/g,''

clickList = (item) ->
	key = item.srcElement.value
	if key then input.value = "#{key} = #{memory[key]}"

toggle = () ->
	toggleMode = 1 - toggleMode
	bToggle.innerHTML = ['formulas','values'][toggleMode]
	updateList()

clear = ->
	input.value = ""
	label.innerHTML = ""

document.body.onload = ->

	decode()

	clear = button 'clear', clear
	bToggle = button 'values', toggle
	bShare = button 'share', -> encode()

	label = document.createElement "p"
	label.style = 'font-family:courier; height:10px; width:99%;'

	document.body.appendChild label

	input = document.createElement "input"
	input.style = 'width:97%; font-family:courier; margin:5px;'
	document.body.appendChild input
	input.onkeypress = (e) -> if e.which == 13 then execute()

	lista = document.createElement "select"
	lista.onclick = clickList
	lista.size = 20
	lista.style= 'width:99%;  overflow-y:auto; font-family:courier; margin:5px;'
	document.body.appendChild lista

	errorlabel = document.createElement "p"
	errorlabel.style = 'font-family:courier; color:red; width:99%'
	document.body.appendChild errorlabel

	execute()
