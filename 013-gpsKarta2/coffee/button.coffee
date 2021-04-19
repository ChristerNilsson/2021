class Button 
	constructor : (@x,@y,@prompt,event,color='#f000') ->
		@r = 128
		@circle0 = add 'circle',svg, {cx:@x, cy:@y, r:@r, fill:'none', stroke:'black', 'stroke-width':1}
		if @prompt != ""
			@text = add 'text',svg, {x:@x, y:@y+10, stroke:'black', fill:'black', 'stroke-width':1, 'text-anchor':'middle'}
			@text.textContent = @prompt
			@text.style.fontSize = '50px'
			@text.style.userSelect = 'none'
		@circle1 = add 'circle',svg, {cx:@x, cy:@y, r:@r, fill:color, stroke:'black', 'stroke-width':1, ontouchstart:event, onclick:event}
	setColor : (color) -> setAttrs @circle1, {fill:color}
	setTextFill : (color) -> setAttrs @text, {fill:color}
	enable : -> 
		setAttrs @circle0, {cx:@x}
		setAttrs @circle1, {cx:@x}
		if @prompt!='' then setAttrs @text, {x:@x}
	disable : -> 
		setAttrs @circle0, {cx:INVISIBLE}
		setAttrs @circle1, {cx:INVISIBLE}
		if @prompt!='' then setAttrs @text, {x:INVISIBLE}

class TargetButton extends Button
	constructor : (x,y,event,color) ->
		super x,y,'',event,color
		@vline = add 'line',svg, {x1:x-@r, y1:y, x2:x+@r, y2:y, stroke:'black', 'stroke-width':1}
		@hline = add 'line',svg, {x1:x, y1:y-@r, x2:x, y2:y+@r, stroke:'black', 'stroke-width':1}

	move : ->
		if target.length == 0 then return
		dx = target[0] - center[0]
		dy = target[1] - center[1]
		antal = SIZE/TILE
		x = W/2 + dx / antal
		y = H/2 - dy / antal
		@moveHard x,y

	moveHard : (x,y) ->
		setAttrs @circle1, {cx:x, cy:y}
		setAttrs @vline, {x1:x-@r, y1:y, x2:x+@r, y2:y}
		setAttrs @hline, {x1:x, y1:y-@r, x2:x, y2:y+@r}
