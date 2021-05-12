label = null
input = null
up = null
down = null
exec = null
curr = -1
lista = null
errorlabel = null
bToggle = null
toggleMode = 1
answers = {}

range = _.range

memory = {} #{'a':12,'b':23,'c':3,'d':4,'e':5,'add':'a+b','mul':'a*b', 'sq': 'a*a', 'f': '(x) -> x*x', 'g':'f 9','h':0}

button = (prompt,click) ->
	res = document.createElement 'button'
	res.innerHTML = prompt
	res.style= 'width:80px; font-family:courier;'
	res.onclick = click
	document.body.appendChild res
	res

updateList = () ->
	lista.size = -1 + _.size memory
	lista.length = 0
	for key of memory
		row = memory[key]
		if key == 'ans'
			if typeof answers.ans == 'function'
				label.innerText = JSON.stringify row
			else
				label.innerText = JSON.stringify answers[key]
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
	errorlabel.innerHTML = ""

	try
		if input.value.length > 0

			arr = input.value.split '='
			arr = (item.trim() for item in arr)

			# delete?
			if input.value.slice(-1) == '='
				delete memory[arr[0]]
				delete answers[arr[0]]
				eval "#{arr[0]}=undefined"
				updateList()
				return 

			arr = input.value.split '='
			arr = (item.trim() for item in arr)
			[key,value] = arr
			if not value
				answers.ans = eval "ans = " + transpile "#{key}"
				memory.ans = key
			else
				val = eval "#{key} = " + transpile "#{value}"
				answers[key] = val
				answers.ans = val
				memory[key] = value
				memory.ans = value

		for key of memory
			answers[key] = eval "#{key} = " + transpile "#{memory[key]}"

		updateList()
		input.select()
	catch err
		errorlabel.innerHTML = err

transpile = (code) ->
	result = CoffeeScript.compile code, {bare: true}
	result.replace /\n/g,''

safeeval = (key,value) ->
	try
		label.innerHTML = if key == '' then transpile eval value else transpile key + '=' + value
		true
	catch err
		errorlabel.innerHTML = err
		false

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

	clear = button 'clear', clear
	bToggle = button 'values', toggle
	bShare = button 'share', ->

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
