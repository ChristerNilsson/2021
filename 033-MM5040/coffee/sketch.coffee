SYMBOLS = '0123456789abcdef'
M = 4
N = 10
command = ""
facit = ""
guess = ""
cands = []
errors = []
headers = []
historyx = []

input = null
div = null

assert = console.assert
log = console.log
pack = (digits) => digits.join ""
init = => _(SYMBOLS.substring(0,N)).permutations(M).map((v) => _.join(v, '')).value()

removeAllChildNodes = (parent) =>
	while parent.firstChild
		parent.removeChild parent.firstChild

newGame = (cmds) => 
	historyx = []
	if cmds.length > 1 then M = parseInt cmds[1]
	if cmds.length > 2 then N = parseInt cmds[2]
	if N > 16
		errors = ["Second number must be less or equal to 16"]
		show()
		return
	
	if M > 6
		errors = ["First number must be less or equal to 6"]
		show()
		return
	
	facit = SYMBOLS.substring 0,N
	facit = _.shuffle facit
	facit = pack facit.slice 0,M
	guess = ""
	cands = init()

	headers = []
	headers.push "Select #{M} unique digits from #{SYMBOLS.substring(0,N)}!"
	headers.push "Candidates: #{cands.length}"
	headers = headers
	command = ""
	input.value ""

makeAnswer = (f,g) => # facit,guess
	m = f.length
	res = []
	for i in _.range m
		for j in _.range m
			if f[i] == g[j]
				res.push Math.abs i-j
	res.sort()
	return pack res

assert ""     == makeAnswer "1234","5678"
assert "0"    == makeAnswer "1234","1678"
assert "00"   == makeAnswer "1234","1278"
assert "000"  == makeAnswer "1234","1235"
assert "0000" == makeAnswer "1234","1234"
assert "0123" == makeAnswer "1234","3241"
assert "1133" == makeAnswer "1234","4321"
assert "2222" == makeAnswer "1234","3412"
assert "33"   == makeAnswer "1234","4561"

reduce = (cands,guess) => 
	res = []
	answer1 = makeAnswer facit,guess
	for cand in cands
		answer2 = makeAnswer cand, guess
		if answer1 == answer2
			res.push cand
	return res

handleGuess = (guess) => 
	if guess.length != M || _.uniq(guess).length != M
		if guess.length > 0
			errors = ["Select #{M} unique digits from #{SYMBOLS.substring(0,N)}!"]
		else 
			errors = []
		return

	answer = makeAnswer facit,guess
	cands = reduce cands,guess
	historyx.push "#{guess} [#{answer}] (#{cands.length})"
	if answer == '0000' then historyx.push "Solved in #{historyx.length} guesses!"
	historyx = historyx
	command=''
	input.value ""

handler = => 
	errors = []
	cmds = command.split ' '
	if cmds.length == 0
		errors = []
	else if cmds[0]=='n'
		newGame cmds
	else
		handleGuess cmds[0]

show = ->
	removeAllChildNodes div.elt
	for h in errors
		d = createDiv h
		d.elt.style.color = 'red'
		div.child d
	for h in headers
		div.child createDiv h
	for h in historyx
		div.child createDiv h

help = => 
	headers = []
	headers.push 'n = new Game'
	headers.push 'n 4 = new Game selecting 4 digits'
	headers.push 'n 4 10 = new Game selecting 4 digits from 0123456789'
	headers.push 'Hit enter to continue'

setup = =>
	noCanvas()
	input = createInput command
	input.input => command = input.value()
	div = createDiv()
	help()
	show()

keyPressed = ->
	if key == 'Enter'
		handler()
		show()
