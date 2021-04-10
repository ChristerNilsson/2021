svgurl = "http://www.w3.org/2000/svg"

counter = 0

range = _.range

svg = document.getElementById 'svgOne'

setAttrs = (obj,attrs) ->
	for key of attrs
		obj.setAttributeNS null, key, attrs[key]

add = (type,parent,attrs) ->
	obj = document.createElementNS svgurl, type
	parent.appendChild obj
	setAttrs obj,attrs
	obj

add 'rect',svg,{width:1080, height:1080, fill:'green'}
circle = add 'circle',svg, {cx:800, cy:800, r:100, fill:'#fff', stroke:'black', 'stroke-width':1, onclick:click}

texts = (add 'text',svg, {x:400, y:40*(i+1), stroke:'black', 'stroke-width':1, 'text-anchor':'middle'} for i in range 20)

makeText = (prompt) ->
	counter = (counter+1) % 20
	texts[counter].textContent = prompt
	texts[counter].style.fontSize = '25px'

#useEventType = if (typeof window.PointerEvent == 'function') then 'pointer' else 'mouse'
#listeners = ['click','touchstart','touchend', 'touchmove' ,"#{useEventType}enter","#{useEventType}leave", "#{useEventType}move"]

pretty = (lst) -> "#{Math.round t.clientX} #{Math.round t.clientY}" for t in lst

click = (event) ->
	event.preventDefault()
	makeText 'circle'

touchstart = (event) ->
	event.preventDefault()
	makeText "#{event.type} #{pretty event.touches}"

touchend = (event) ->
	event.preventDefault()
	makeText "#{event.type} #{pretty event.touches}"

touchmove = (event) ->
	event.preventDefault()
	makeText "#{event.type} #{pretty event.touches}"

svg.addEventListener 'touchstart', touchstart
svg.addEventListener 'touchmove',  touchmove
svg.addEventListener 'touchend',   touchend
circle.addEventListener 'click', click 