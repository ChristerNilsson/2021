// Generated by CoffeeScript 2.4.1
var add, circle, click, counter, i, makeText, nada, pretty, range, setAttrs, svg, svgurl, texts, touchend, touchmove, touchstart, touchstartCircle;

svgurl = "http://www.w3.org/2000/svg";

counter = 0;

range = _.range;

svg = document.getElementById('svgOne');

setAttrs = function(obj, attrs) {
  var key, results;
  results = [];
  for (key in attrs) {
    results.push(obj.setAttributeNS(null, key, attrs[key]));
  }
  return results;
};

add = function(type, parent, attrs) {
  var obj;
  obj = document.createElementNS(svgurl, type);
  parent.appendChild(obj);
  setAttrs(obj, attrs);
  return obj;
};

add('rect', svg, {
  width: 1080,
  height: 1080,
  fill: 'green'
});

circle = add('circle', svg, {
  cx: 800,
  cy: 800,
  r: 100,
  fill: '#fff',
  stroke: 'black',
  'stroke-width': 1
});

texts = (function() {
  var j, len, ref, results;
  ref = range(20);
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    results.push(add('text', svg, {
      x: 400,
      y: 40 * (i + 1),
      stroke: 'black',
      'stroke-width': 1,
      'text-anchor': 'middle'
    }));
  }
  return results;
})();

makeText = function(prompt) {
  counter = (counter + 1) % 20;
  texts[counter].textContent = prompt;
  return texts[counter].style.fontSize = '25px';
};

pretty = function(lst) {
  var j, len, results, t;
  results = [];
  for (j = 0, len = lst.length; j < len; j++) {
    t = lst[j];
    results.push(`${Math.round(t.clientX)} ${Math.round(t.clientY)}`);
  }
  return results;
};

click = function(event) {
  event.preventDefault();
  makeText('circle');
  return event.stopPropagation();
};

touchstart = function(event) {
  event.preventDefault();
  return makeText(`${event.type} ${pretty(event.targetTouches)}`);
};

touchend = function(event) {
  event.preventDefault();
  return makeText(`${event.type} ${pretty(event.targetTouches)}`);
};

touchmove = function(event) {
  event.preventDefault();
  return makeText(`${event.type} ${pretty(event.targetTouches)}`);
};

svg.addEventListener('touchstart', touchstart);

svg.addEventListener('touchmove', touchmove);

svg.addEventListener('touchend', touchend);

//circle.addEventListener 'click', click 

//###############
nada = function(event) {
  event.preventDefault();
  return event.stopPropagation();
};

touchstartCircle = function(event) {
  event.preventDefault();
  makeText(`${event.type} ${pretty(event.targetTouches)}`);
  return event.stopPropagation();
};

// touchendCircle = (event) ->
// 	event.preventDefault()
// 	makeText "#{event.type} #{pretty event.targetTouches}"
// 	event.stopPropagation()

// touchmoveCircle = (event) ->
// 	event.preventDefault()
// 	makeText "#{event.type} #{pretty event.targetTouches}"
// 	event.stopPropagation()
circle.addEventListener('touchstart', touchstartCircle);

circle.addEventListener('touchmove', nada);

circle.addEventListener('touchend', nada);

makeText('c');

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91Y2guanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcdG91Y2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFVBQUEsRUFBQTs7QUFBQSxNQUFBLEdBQVM7O0FBQ1QsT0FBQSxHQUFVOztBQUNWLEtBQUEsR0FBUSxDQUFDLENBQUM7O0FBQ1YsR0FBQSxHQUFNLFFBQVEsQ0FBQyxjQUFULENBQXdCLFFBQXhCOztBQUVOLFFBQUEsR0FBVyxRQUFBLENBQUMsR0FBRCxFQUFLLEtBQUwsQ0FBQTtBQUNWLE1BQUEsR0FBQSxFQUFBO0FBQUE7RUFBQSxLQUFBLFlBQUE7aUJBQ0MsR0FBRyxDQUFDLGNBQUosQ0FBbUIsSUFBbkIsRUFBeUIsR0FBekIsRUFBOEIsS0FBTSxDQUFBLEdBQUEsQ0FBcEM7RUFERCxDQUFBOztBQURVOztBQUlYLEdBQUEsR0FBTSxRQUFBLENBQUMsSUFBRCxFQUFNLE1BQU4sRUFBYSxLQUFiLENBQUE7QUFDTCxNQUFBO0VBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxlQUFULENBQXlCLE1BQXpCLEVBQWlDLElBQWpDO0VBQ04sTUFBTSxDQUFDLFdBQVAsQ0FBbUIsR0FBbkI7RUFDQSxRQUFBLENBQVMsR0FBVCxFQUFhLEtBQWI7U0FDQTtBQUpLOztBQU1OLEdBQUEsQ0FBSSxNQUFKLEVBQVcsR0FBWCxFQUFlO0VBQUMsS0FBQSxFQUFNLElBQVA7RUFBYSxNQUFBLEVBQU8sSUFBcEI7RUFBMEIsSUFBQSxFQUFLO0FBQS9CLENBQWY7O0FBQ0EsTUFBQSxHQUFTLEdBQUEsQ0FBSSxRQUFKLEVBQWEsR0FBYixFQUFrQjtFQUFD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QSxDQUFUO1NBQ0EsS0FBSyxDQUFDLGVBQU4sQ0FBQTtBQUhrQixFQXREbkI7Ozs7Ozs7Ozs7O0FBcUVBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQyxnQkFBdEM7O0FBQ0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXNDLElBQXRDOztBQUNBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixVQUF4QixFQUFzQyxJQUF0Qzs7QUFFQSxRQUFBLENBQVMsR0FBVCIsInNvdXJjZXNDb250ZW50IjpbInN2Z3VybCA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG5jb3VudGVyID0gMFxyXG5yYW5nZSA9IF8ucmFuZ2Vcclxuc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ3N2Z09uZSdcclxuXHJcbnNldEF0dHJzID0gKG9iaixhdHRycykgLT5cclxuXHRmb3Iga2V5IG9mIGF0dHJzXHJcblx0XHRvYmouc2V0QXR0cmlidXRlTlMgbnVsbCwga2V5LCBhdHRyc1trZXldXHJcblxyXG5hZGQgPSAodHlwZSxwYXJlbnQsYXR0cnMpIC0+XHJcblx0b2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TIHN2Z3VybCwgdHlwZVxyXG5cdHBhcmVudC5hcHBlbmRDaGlsZCBvYmpcclxuXHRzZXRBdHRycyBvYmosYXR0cnNcclxuXHRvYmpcclxuXHJcbmFkZCAncmVjdCcsc3ZnLHt3aWR0aDoxMDgwLCBoZWlnaHQ6MTA4MCwgZmlsbDonZ3JlZW4nfVxyXG5jaXJjbGUgPSBhZGQgJ2NpcmNsZScsc3ZnLCB7Y3g6ODAwLCBjeTo4MDAsIHI6MTAwLCBmaWxsOicjZmZmJywgc3Ryb2tlOidibGFjaycsICdzdHJva2Utd2lkdGgnOjF9XHJcbnRleHRzID0gKGFkZCAndGV4dCcsc3ZnLCB7eDo0MDAsIHk6NDAqKGkrMSksIHN0cm9rZTonYmxhY2snLCAnc3Ryb2tlLXdpZHRoJzoxLCAndGV4dC1hbmNob3InOidtaWRkbGUnfSBmb3IgaSBpbiByYW5nZSAyMClcclxuXHJcbm1ha2VUZXh0ID0gKHByb21wdCkgLT5cclxuXHRjb3VudGVyID0gKGNvdW50ZXIrMSkgJSAyMFxyXG5cdHRleHRzW2NvdW50ZXJdLnRleHRDb250ZW50ID0gcHJvbXB0XHJcblx0dGV4dHNbY291bnRlcl0uc3R5bGUuZm9udFNpemUgPSAnMjVweCdcclxuXHJcbnByZXR0eSA9IChsc3QpIC0+IFwiI3tNYXRoLnJvdW5kIHQuY2xpZW50WH0gI3tNYXRoLnJvdW5kIHQuY2xpZW50WX1cIiBmb3IgdCBpbiBsc3RcclxuXHJcbmNsaWNrID0gKGV2ZW50KSAtPlxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRtYWtlVGV4dCAnY2lyY2xlJ1xyXG5cdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG50b3VjaHN0YXJ0ID0gKGV2ZW50KSAtPlxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRtYWtlVGV4dCBcIiN7ZXZlbnQudHlwZX0gI3twcmV0dHkgZXZlbnQudGFyZ2V0VG91Y2hlc31cIlxyXG5cclxudG91Y2hlbmQgPSAoZXZlbnQpIC0+XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdG1ha2VUZXh0IFwiI3tldmVudC50eXBlfSAje3ByZXR0eSBldmVudC50YXJnZXRUb3VjaGVzfVwiXHJcblxyXG50b3VjaG1vdmUgPSAoZXZlbnQpIC0+XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdG1ha2VUZXh0IFwiI3tldmVudC50eXBlfSAje3ByZXR0eSBldmVudC50YXJnZXRUb3VjaGVzfVwiXHJcblxyXG5zdmcuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRcclxuc3ZnLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNobW92ZScsICB0b3VjaG1vdmVcclxuc3ZnLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNoZW5kJywgICB0b3VjaGVuZFxyXG4jY2lyY2xlLmFkZEV2ZW50TGlzdGVuZXIgJ2NsaWNrJywgY2xpY2sgXHJcblxyXG4jIyMjIyMjIyMjIyMjIyMjXHJcblxyXG5uYWRhID0gKGV2ZW50KSAtPlxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxudG91Y2hzdGFydENpcmNsZSA9IChldmVudCkgLT5cclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0bWFrZVRleHQgXCIje2V2ZW50LnR5cGV9ICN7cHJldHR5IGV2ZW50LnRhcmdldFRvdWNoZXN9XCJcclxuXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuIyB0b3VjaGVuZENpcmNsZSA9IChldmVudCkgLT5cclxuIyBcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuIyBcdG1ha2VUZXh0IFwiI3tldmVudC50eXBlfSAje3ByZXR0eSBldmVudC50YXJnZXRUb3VjaGVzfVwiXHJcbiMgXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuIyB0b3VjaG1vdmVDaXJjbGUgPSAoZXZlbnQpIC0+XHJcbiMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiMgXHRtYWtlVGV4dCBcIiN7ZXZlbnQudHlwZX0gI3twcmV0dHkgZXZlbnQudGFyZ2V0VG91Y2hlc31cIlxyXG4jIFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbmNpcmNsZS5hZGRFdmVudExpc3RlbmVyICd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydENpcmNsZVxyXG5jaXJjbGUuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2htb3ZlJywgIG5hZGFcclxuY2lyY2xlLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNoZW5kJywgICBuYWRhXHJcblxyXG5tYWtlVGV4dCAnYyciXX0=
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\touch.coffee