range = _.range
ass = (a,b=true) -> chai.assert.deepEqual a, b
myRound = (x,dec=0) -> Math.round(x*10**dec)/10**dec

map = (x, x0, x1, y0, y1) -> (x - x0) / (x1 - x0) * (y1 - y0) + y0
ass 325,map 150,100,200,300,350
ass 375,map 250,100,200,300,350

degrees = (radians) -> radians * 180 / Math.PI

#merp = (y1,y2,i,x1=0,x2=1) -> map i,x1,x2,y1,y2
# interpolate = (a, b, c, d, value) -> c + value/b * (d-c)
# ass 16, interpolate 0,1024,0,256,64
# ass 240, interpolate 0,1024,256,0,64

getParameters = (h = window.location.href) ->
	h = decodeURI h
	arr = h.split('?')
	if arr.length != 2 then return {}
	s = arr[1]
	if s=='' then return {}
	_.object(f.split '=' for f in s.split('&'))
