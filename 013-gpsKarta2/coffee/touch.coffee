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

texts = (add 'text',svg, {x:100, y:20*(i+1), stroke:'black', 'stroke-width':1, 'text-anchor':'middle'} for i in range 20)

makeText = (prompt) ->
	counter = (counter+1) % 20
	texts[counter].textContent = prompt

useEventType = if (typeof window.PointerEvent == 'function') then 'pointer' else 'mouse'
listeners = ['click','touchstart','touchend', 'touchmove' ,"#{useEventType}enter","#{useEventType}leave", "#{useEventType}move"]

pointerHandler = (event) ->
	event.preventDefault()
	makeText "#{event.type} #{event.x} #{event.y}"  
	console.log event

listeners.map (etype) -> svg.addEventListener etype, pointerHandler

# btn.addEventListener('click', (event) => {
#   output.innerHTML = '';
# });

# toggle.addEventListener('change', (event) => {
#   event.target.checked ? circ.setAttribute('fill', '#D79CFD') : circ.setAttribute('fill', 'none');
# });