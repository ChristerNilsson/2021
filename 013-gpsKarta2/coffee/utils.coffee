range = _.range
ass = (a,b=true) -> chai.assert.deepEqual a, b
myRound = (x,dec=0) -> Math.round(x*10**dec)/10**dec

map = (x, x0, x1, y0, y1) -> (x - x0) / (x1 - x0) * (y1 - y0) + y0
ass 325,map 150,100,200,300,350
ass 375,map 250,100,200,300,350

getParameters = (h = window.location.href) ->
	h = decodeURI h
	arr = h.split('?')
	if arr.length != 2 then return {}
	s = arr[1]
	if s=='' then return {}
	_.object(f.split '=' for f in s.split('&'))
