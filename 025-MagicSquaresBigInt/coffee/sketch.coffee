ass = (a,b) -> if chai.assert.deepEqual a,b then console.log a,b
#range = _.range

n = null
ANCHORS = null
nInput = null
colInput = null
rowInput = null
buttons = []
iRow = 0n
iCol = 0n

class Button
	constructor : (@prompt,@x,@y,@click) ->
		@w = 40
		@h = 40
	draw : ->
		rect @x-@w/2,@y-@h/2,@w,@h
		text @prompt,@x,@y
	inside : (x,y) -> @x-@w/2 < x < @x+@w/2 and @y-@h/2 < y < @y+@h/2

makeANCHORS = (n0) -> 
	n = n0
	ANCHORS = [[[n/2n,0n],[0n,n]],[[0n,n/2n],[n,0n]],[[n-1n,n/2n],[-n,0n]],[[n/2n,n-1n],[0n,-n]]]

absx = (x) -> if x < 0n then -x else x
nr = (i,j) -> if (i+j) % 2n == 0n then even i,j else odd i,j
even = (i,j) -> x(i,j) / 2n + 1n + n * (y(i,j) / 2n)
odd = (i,j) -> [di,dj] = didj(i,j)[1]; even i+di,j+dj
x = (i,j) -> i - j + n - 1n
y = (i,j) -> 2n*n-2n-i-j
manhattan = (a,b,c,d) -> absx(a-c) + absx(b-d)
didj = (i,j) -> _.minBy ANCHORS, ([[a,b],[c,d]]) -> manhattan a,b,i,j

# rowsum = (j) -> 
# 	arr = (nr i,j for i in range n)
# 	arr.reduce (a,b) -> a+b

makeInput = (x,y,value) ->
	res = createInput value
	res.style 'font-size', '30px' #, 'color', '#ff0000'
	res.position x, y
	res.size width-12
	res

updateRow = (delta) ->
	iRow += delta
	if iRow < 0 then iRow = 0n
	if iRow >= n then iRow = n-1n
	rowInput.value iRow

updateCol = (delta) ->
	iCol += delta
	if iCol < 0 then iCol = 0n
	if iCol >= n then iCol = n-1n
	colInput.value iCol

setup = ->
	createCanvas windowWidth-20,windowHeight-20
	textSize 30
	textAlign CENTER,CENTER

	nInput   = makeInput 10,10,5
	colInput = makeInput 10,50,0
	rowInput = makeInput 10,90,0

	buttons.push new Button 'U',width/2,150, -> updateRow -1n
	buttons.push new Button 'D',width/2,250, -> updateRow 1n
	buttons.push new Button 'L',30,150,-> updateCol -1n
	buttons.push new Button 'R',width-30,150,-> updateCol 1n

draw = ->
	background 128
	if nInput.value() == ""
		makeANCHORS 3n
	else
		makeANCHORS BigInt nInput.value()
	text nr(iCol,iRow), width/2, 200
	text "cells:",width*0.50,height-120
	text "#{n*n}",width*0.50,height-85
	text "row sum:",width*0.50,height-50
	text "#{n*(1n+n*n/2n)}",width*0.50,height-15
	button.draw() for button in buttons

mousePressed = ->
	for button in buttons
		if button.inside mouseX,mouseY
			button.click()

#### Tests ####

#start = new Date()

# ass [1,0], _.minBy [[1,0],[0,1]], ([a,b]) -> b
# ass 3, 7//2
# ass 5, manhattan 3,5,1,2

# makeANCHORS 5
# ass 23n, nr 0n,0n
# ass 6, nr 1,0
# ass 10, nr 0,1
# ass 25, nr 2,3
# ass 16, nr 4,3
# ass n*(1+n*n//2), rowsum 0
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4

# makeANCHORS 7
# ass 5, x 2,3
# ass 7, y 2,3
# ass 22, even 0,6
# ass 15, even 1,7
# ass 46, nr 0,0
# ass 15, nr 1,0
# ass 21, nr 0,1
# ass 7, nr 2,3
# ass 4, nr 6,6
# ass 48, nr 2,5
# ass 43, nr 4,3
# ass n*(1+n*n//2), rowsum 0
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4
# ass n*(1+n*n//2), rowsum 5
# ass n*(1+n*n//2), rowsum 6

# makeANCHORS 9
# ass 77, nr 0,0
# ass 28, nr 1,0
# ass 36, nr 0,1
# ass 18, nr 2,3
# ass 23, nr 6,6
# ass 8, nr 2,5
# ass 1, nr 4,3
# ass 369,n*(1+n*n//2)
# ass n*(1+n*n//2), rowsum 0
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4
# ass n*(1+n*n//2), rowsum 5
# ass n*(1+n*n//2), rowsum 6

# makeANCHORS 101
# ass 10151, nr 0,0
# ass 4950, nr 1,0
# ass 5050, nr 0,1
# ass 4848, nr 2,3
# ass 9545, nr 6,6
# ass 4746, nr 2,5
# ass 4647, nr 4,3

# makeANCHORS 1001
# ass 1001501, nr 0,0
# ass 499500, nr 1,0
# ass 500500, nr 0,1
# ass 498498, nr 2,3
# ass 995495, nr 6,6
# ass 497496, nr 2,5
# ass 496497, nr 4,3
# ass 501502001,n*(1+n*n//2)
# ass n*(1+n*n//2), rowsum 0
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4
# ass n*(1+n*n//2), rowsum 5
# ass n*(1+n*n//2), rowsum 6

# makeANCHORS 10001
# ass 100015001, nr 0,0
# ass 49995000, nr 1,0
# ass 50005000, nr 0,1
# ass 49984998, nr 2,3
# ass 99954995, nr 6,6
# ass 49974996, nr 2,5
# ass 49964997, nr 4,3
# ass 500150020001,n*(1+n*n//2) # row sum
# ass n*(1+n*n//2), rowsum 0
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4
# ass n*(1+n*n//2), rowsum 5
# ass n*(1+n*n//2), rowsum 6

# makeANCHORS 100001
# ass 10000200001,n*n # cell count
# ass 10000150001, nr 0,0 # cell
# ass 4999950000, nr 1,0
# ass 5000050000, nr 0,1
# ass 4999849998, nr 2,3
# ass 9999549995, nr 6,6
# ass 4999749996, nr 2,5
# ass 4999649997, nr 4,3
# ass 500015000200001,n*(1+n*n//2) # row sum, col sum, diag sum
# ass n*(1+n*n//2), rowsum 0 # row sum
# ass n*(1+n*n//2), rowsum 1
# ass n*(1+n*n//2), rowsum 2
# ass n*(1+n*n//2), rowsum 3
# ass n*(1+n*n//2), rowsum 4
# ass n*(1+n*n//2), rowsum 5
# ass n*(1+n*n//2), rowsum 6

#console.log new Date() - start
