ass = (a,b) -> if chai.assert.deepEqual a,b then console.log a,b
range = _.range

n = null
ANCHORS = null
nSel = null
iSel = null
jSel = null

makeANCHORS = (n0) -> 
	n = n0
	ANCHORS = [[[n//2,0],[0,n]],[[0,n//2],[n,0]],[[n-1,n//2],[-n,0]],[[n//2,n-1],[0,-n]]]

nr = (i,j) -> if (i+j) % 2 == 0 then even i,j else odd i,j
even = (i,j) -> x(i,j) // 2 + 1 + n * (y(i,j) // 2)
odd = (i,j) -> [di,dj] = didj(i,j)[1]; even i+di,j+dj
x = (i,j) -> i-j+n-1
y = (i,j) -> 2*n-2-i-j
manhattan = (a,b,c,d) -> Math.abs(a-c) + Math.abs(b-d)
didj = (i,j) -> _.minBy ANCHORS, ([[a,b],[c,d]]) -> manhattan a,b,i,j

rowsum = (j) -> 
	res = 0
	for i in range n
		res += nr i,j
	res

class Button
	constructor : (@prompt,@x,@y,@click) ->
		@w=50
		@h=20
	draw : ->
		rect @x-@w/2,@y-@h/2,@w,@h
		text @prompt,@x,@y
	inside : (x,y) -> @x-@w/2 < x < @x+@w/2 and @y-@h/2 < y < @y+@h/2

class Selector
	constructor : (@prompt,@value,@x,@y,@min,@max,@delta=1) ->
		self = @
		@buttons = []
		d = 60
		@buttons.push new Button '-1000',@x-4*d,@y, => @adjust -1000
		@buttons.push new Button '-100',@x-3*d,@y, => @adjust -100
		@buttons.push new Button '-10',@x-2*d,@y, => @adjust -10
		@buttons.push new Button "-#{@delta}",@x-d,@y, => @adjust -@delta
		@buttons.push new Button "+#{@delta}",@x+d,@y, => @adjust @delta
		@buttons.push new Button '+10',@x+2*d,@y, => @adjust 10
		@buttons.push new Button '+100',@x+3*d,@y, => @adjust 100
		@buttons.push new Button '+1000',@x+4*d,@y, => @adjust 1000

	adjust : (delta) -> if @min <= @value + delta <= @max then @value += delta
	draw : ->
		for button in @buttons
			button.draw()
		push()
		if @prompt=='i' then fill 'red'
		if @prompt=='j' then fill 0,128+64,0
		text "#{@prompt}:#{@value}",@x,@y
		pop()

setup = ->
	createCanvas 600,350
	makeANCHORS 5
	textAlign CENTER,CENTER
	nSel = new Selector 'n',3,width/2,30,3,100000,2
	iSel = new Selector 'i',0,width/2,60,0,100000-5,1
	jSel = new Selector 'j',0,width/2,90,0,100000-5,1

draw = ->
	background 128

	iSel.value = min iSel.value, nSel.value-5
	jSel.value = min jSel.value, nSel.value-5
	if iSel.value < 0 then iSel.value = 0
	if jSel.value < 0 then jSel.value = 0
	iSel.max = nSel.value-5
	jSel.max = nSel.value-5

	for selector in [nSel,iSel,jSel]
		selector.draw()

	makeANCHORS nSel.value

	m = min 5,n
	xOff = width/2-200
	if m==3 then xOff = width/2-100
	if m==4 then xOff = width/2-150
	push()
	textSize 16
	for i in range m
		for j in range m
			text nr(iSel.value+i,jSel.value+j), xOff+100*i, 150+40*j
	push()

	fill 'red'
	for i in range m
		text iSel.value+i, xOff+100*i, 120

	fill 0,128+64,0
	for j in range m
		text jSel.value+j, 30, 150+40*j

	pop()
	pop()
	
	text "cells:#{n*n}",width*0.33,height-15
	text "row/col/diag sum:#{n*(1+n*n//2)}",width*0.67,height-15

mousePressed = ->
	for selector in [nSel,iSel,jSel]
		for button in selector.buttons
			if button.inside(mouseX,mouseY) 
				button.click()

#### Tests ####

start = new Date()

ass [1,0], _.minBy [[1,0],[0,1]], ([a,b]) -> b
ass 3, 7//2
ass 5, manhattan 3,5,1,2

makeANCHORS 5
ass 23, nr 0,0
ass 6, nr 1,0
ass 10, nr 0,1
ass 25, nr 2,3
ass 16, nr 4,3
ass n*(1+n*n//2), rowsum 0
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4

makeANCHORS 7
ass 5, x 2,3
ass 7, y 2,3
ass 22, even 0,6
ass 15, even 1,7
ass 46, nr 0,0
ass 15, nr 1,0
ass 21, nr 0,1
ass 7, nr 2,3
ass 4, nr 6,6
ass 48, nr 2,5
ass 43, nr 4,3
ass n*(1+n*n//2), rowsum 0
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4
ass n*(1+n*n//2), rowsum 5
ass n*(1+n*n//2), rowsum 6

makeANCHORS 9
ass 77, nr 0,0
ass 28, nr 1,0
ass 36, nr 0,1
ass 18, nr 2,3
ass 23, nr 6,6
ass 8, nr 2,5
ass 1, nr 4,3
ass 369,n*(1+n*n//2)
ass n*(1+n*n//2), rowsum 0
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4
ass n*(1+n*n//2), rowsum 5
ass n*(1+n*n//2), rowsum 6

makeANCHORS 101
ass 10151, nr 0,0
ass 4950, nr 1,0
ass 5050, nr 0,1
ass 4848, nr 2,3
ass 9545, nr 6,6
ass 4746, nr 2,5
ass 4647, nr 4,3

makeANCHORS 1001
ass 1001501, nr 0,0
ass 499500, nr 1,0
ass 500500, nr 0,1
ass 498498, nr 2,3
ass 995495, nr 6,6
ass 497496, nr 2,5
ass 496497, nr 4,3
ass 501502001,n*(1+n*n//2)
ass n*(1+n*n//2), rowsum 0
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4
ass n*(1+n*n//2), rowsum 5
ass n*(1+n*n//2), rowsum 6

makeANCHORS 10001
ass 100015001, nr 0,0
ass 49995000, nr 1,0
ass 50005000, nr 0,1
ass 49984998, nr 2,3
ass 99954995, nr 6,6
ass 49974996, nr 2,5
ass 49964997, nr 4,3
ass 500150020001,n*(1+n*n//2) # row sum
ass n*(1+n*n//2), rowsum 0
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4
ass n*(1+n*n//2), rowsum 5
ass n*(1+n*n//2), rowsum 6

makeANCHORS 100001
ass 10000200001,n*n # cell count
ass 10000150001, nr 0,0 # cell
ass 4999950000, nr 1,0
ass 5000050000, nr 0,1
ass 4999849998, nr 2,3
ass 9999549995, nr 6,6
ass 4999749996, nr 2,5
ass 4999649997, nr 4,3
ass 500015000200001,n*(1+n*n//2) # row sum, col sum, diag sum
ass n*(1+n*n//2), rowsum 0 # row sum
ass n*(1+n*n//2), rowsum 1
ass n*(1+n*n//2), rowsum 2
ass n*(1+n*n//2), rowsum 3
ass n*(1+n*n//2), rowsum 4
ass n*(1+n*n//2), rowsum 5
ass n*(1+n*n//2), rowsum 6

console.log new Date() - start