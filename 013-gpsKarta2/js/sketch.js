// Generated by CoffeeScript 2.4.1
var Button, H, INVISIBLE, SIZE, TILE, TargetButton, W, add, aimButton, aimEvent, ass, bearing, center, centrera, click, convert, degrees, distance, drawMap, images, interpolate, makeText, mouse, mousedown, mousemove, mouseup, nada, position, range, rec, recButton, recEvent, rects, setAttrs, startup, svg, svgurl, target, targetButton, texts, touchend, touchmove, touchstart;

W = 1024; // window.innerWidth

H = 1024; // window.innerHeight

INVISIBLE = -100;

SIZE = 256; // 128..65536 # rutornas storlek i meter

TILE = 256; // rutornas storlek i pixels

range = _.range;

ass = function(a, b = true) {
  return chai.assert.deepEqual(a, b);
};

svgurl = "http://www.w3.org/2000/svg";

svg = document.getElementById('svgOne');

position = [
  59.09443087294174,
  17.7142975294884 // 128 meter in. (lat long)
];

center = []; // skärmens mittpunkt (sweref). Påverkas av pan (x y) (6 7)

target = []; // målkoordinater (sweref)

targetButton = null;

mouse = [];

images = [];

rects = [];

texts = [];

recButton = null;

rec = 0;

aimButton = null;

degrees = function(radians) {
  return radians * 180 / Math.PI;
};

distance = function(p, q) {
  var dx, dy;
  if (p.length !== 2 || q.length !== 2) {
    return 0;
  }
  dx = p[0] - q[0];
  dy = p[1] - q[1];
  return Math.round(Math.sqrt(dx * dx + dy * dy));
};

bearing = function(p, q) {
  var dx, dy, res;
  if (p.length !== 2 || q.length !== 2) {
    return 0;
  }
  dx = p[0] - q[0];
  dy = p[1] - q[1];
  res = 360 + Math.round(degrees(Math.atan2(dx, dy)));
  return res % 360;
};

Button = class Button {
  constructor(x, y, prompt, event, color = '#f000') {
    this.r = 50;
    if (prompt !== "") {
      this.text = add('text', svg, {
        x: x,
        y: y + 10,
        stroke: 'black',
        'stroke-width': 1,
        'text-anchor': 'middle'
      });
      this.text.textContent = prompt;
      this.text.style.fontSize = '50px';
    }
    this.circle = add('circle', svg, {
      cx: x,
      cy: y,
      r: this.r,
      fill: color,
      stroke: 'black',
      'stroke-width': 1,
      ontouchstart: event //, ontouchmove:'nada(evt)', ontouchend:'nada(evt)'}
    });
  }

};

TargetButton = class TargetButton extends Button {
  constructor(x, y, event, color) {
    super(x, y, '', event, color);
    this.vline = add('line', svg, {
      x1: x - this.r,
      y1: y,
      x2: x + this.r,
      y2: y,
      stroke: 'black',
      'stroke-width': 1
    });
    this.hline = add('line', svg, {
      x1: x,
      y1: y - this.r,
      x2: x,
      y2: y + this.r,
      stroke: 'black',
      'stroke-width': 1
    });
  }

  move() {
    var antal, dx, dy, x, y;
    if (target.length === 0) {
      return;
    }
    dx = target[0] - center[0];
    dy = target[1] - center[1];
    antal = SIZE / TILE;
    x = W / 2 + dx / antal;
    y = H / 2 - dy / antal;
    return this.moveHard(x, y);
  }

  moveHard(x, y) {
    setAttrs(this.circle, {
      cx: x,
      cy: y
    });
    setAttrs(this.vline, {
      x1: x - this.r,
      y1: y,
      x2: x + this.r,
      y2: y
    });
    return setAttrs(this.hline, {
      x1: x,
      y1: y - this.r,
      x2: x,
      y2: y + this.r
    });
  }

};

add = function(type, parent, attrs) {
  var obj;
  obj = document.createElementNS(svgurl, type);
  parent.appendChild(obj);
  setAttrs(obj, attrs);
  return obj;
};

setAttrs = function(obj, attrs) {
  var key, results;
  results = [];
  for (key in attrs) {
    results.push(obj.setAttributeNS(null, key, attrs[key]));
  }
  return results;
};

click = function(s) {
  if (s === 'in' && SIZE > 128) {
    SIZE = Math.floor(SIZE / 2);
  }
  if (s === 'out' && SIZE < 65536) {
    SIZE *= 2;
  }
  if (s === 'ctr') {
    centrera();
  }
  if (s === 'aim') {
    aimEvent();
  }
  return drawMap();
};

mousedown = function(event) {
  var touch, touches;
  touches = event.targetTouches;
  if (touches.length !== 1) {
    return;
  }
  touch = touches[0];
  return mouse = [touch.clientX, touch.clientY];
};

mouseup = function(event) {
  mouse = [];
  return drawMap();
};

mousemove = function(event) {
  var dx, dy, factor, touch, touches;
  if (mouse.length === 0) {
    return;
  }
  touches = event.targetTouches;
  if (touches.length !== 1) {
    return;
  }
  touch = touches[0];
  factor = 2;
  if (SIZE === 128) {
    factor = 0.5;
  }
  if (SIZE === 256) {
    factor = 1;
  }
  // dx = event.movementX
  // dy = event.movementY
  dx = touch.clientX - mouse[0];
  dy = touch.clientY - mouse[1];
  mouse = [touch.clientX, touch.clientY];
  center[0] -= Math.round(dx * factor);
  center[1] += Math.round(dy * factor);
  return drawMap();
};

//moveMap()
touchstart = function(event) {
  event.preventDefault();
  return mousedown(event);
};

touchend = function(event) {
  event.preventDefault();
  return mouseup(event);
};

touchmove = function(event) {
  event.preventDefault();
  return mousemove(event);
};

svg.addEventListener('touchstart', touchstart);

svg.addEventListener('touchmove', touchmove);

svg.addEventListener('touchend', touchend);

interpolate = function(a, b, c, d, value) {
  return c + value / b * (d - c);
};

ass(16, interpolate(0, 1024, 0, 256, 64));

ass(240, interpolate(0, 1024, 256, 0, 64));

convert = function([x, y], size = SIZE) { // sweref punkt
  var dx, dy;
  dx = x % SIZE; // beräkna vektor dx,dy (sweref)
  dy = y % SIZE;
  x -= dx; // beräkna rutans SW hörn x,y (sweref)
  y -= dy;
  if (SIZE === 128 || SIZE === 256) {
    dx = interpolate(0, SIZE, TILE, 0, dx);
    dy = interpolate(0, SIZE, 0, TILE, dy);
  } else {
    dx = interpolate(0, SIZE, Math.floor(SIZE / 2), 0, dx);
    dy = interpolate(0, SIZE, 0, Math.floor(SIZE / 2), dy);
  }
  dx = Math.round(dx);
  dy = Math.round(dy);
  return [x, y, dx, dy];
};

// moveMap = ->
// 	n = 2
// 	[baseX,baseY,dx,dy] = convert center
// 	for j in range 2*n+1
// 		#y = baseY + (j-n) * SIZE
// 		py = TILE*(n-j+1)+dy
// 		for i in range 2*n+1
// 			#x = baseX + (i-n) * SIZE
// 			px = TILE*(i-n+1)+dx
// 			#href = "maps\\#{SIZE}\\#{y}-#{x}-#{SIZE}.jpg"
// 			setAttrs images[j][i], {x:px, y:py} 
// 			setAttrs rects[j][i],  {x:px, y:py}
// 	texts[0].textContent = "C:#{center} T:#{target} D:#{distance(target,center)} B:#{bearing(target,center)}"
// 	texts[1].textContent = "Z:#{SIZE} B:#{[baseX,baseY]} DX:#{dx} DY:#{dy}"
// 	targetButton.move()
drawMap = function() {
  var baseX, baseY, dx, dy, href, i, j, k, l, len, len1, n, px, py, ref, ref1, x, y;
  n = 2;
  [baseX, baseY, dx, dy] = convert(center);
  ref = range(2 * n + 1);
  for (k = 0, len = ref.length; k < len; k++) {
    j = ref[k];
    y = baseY + (j - n) * SIZE;
    py = TILE * (n - j + 1) + dy;
    ref1 = range(2 * n + 1);
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      i = ref1[l];
      x = baseX + (i - n) * SIZE;
      px = TILE * (i - n + 1) + dx;
      href = `maps\\${SIZE}\\${y}-${x}-${SIZE}.jpg`;
      setAttrs(images[j][i], {
        x: px,
        y: py,
        href: href
      });
      setAttrs(rects[j][i], {
        x: px,
        y: py
      });
    }
  }
  texts[0].textContent = `C:${center} T:${target} D:${distance(target, center)} B:${bearing(target, center)}`;
  texts[1].textContent = `Z:${SIZE} B:${[baseX, baseY]} DX:${dx} DY:${dy}`;
  return targetButton.move();
};

centrera = function() {
  var g, grid;
  grid = geodetic_to_grid(position[0], position[1]);
  center = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = grid.length; k < len; k++) {
      g = grid[k];
      results.push(Math.round(g));
    }
    return results;
  })();
  center.reverse();
  return drawMap();
};

aimEvent = function() {
  if (target.length === 0) {
    target = center.slice();
    return targetButton.moveHard(W / 2, H / 2);
  } else {
    target = [];
    return targetButton.moveHard(INVISIBLE, INVISIBLE);
  }
};

recEvent = function() {
  rec = 1 - rec;
  return recButton.setAttributeNS(null, 'fill', ['#f008', '#f000'][rec]);
};

makeText = function(x, y) {
  var text;
  text = add('text', svg, {
    x: x,
    y: y,
    stroke: 'black',
    'stroke-width': 1,
    'text-anchor': 'middle'
  });
  text.style.fontSize = '25px';
  return texts.push(text);
};

nada = function(event) {
  event.preventDefault();
  return event.stopPropagation();
};

startup = function() {
  var _, g, grid, irow, k, l, len, len1, n, ref, ref1, rrow;
  add('rect', svg, {
    width: W,
    height: H,
    fill: 'green'
  });
  grid = geodetic_to_grid(position[0], position[1]);
  center = (function() {
    var k, len, results;
    results = [];
    for (k = 0, len = grid.length; k < len; k++) {
      g = grid[k];
      results.push(Math.round(g));
    }
    return results;
  })();
  center.reverse();
  images = [];
  rects = [];
  texts = [];
  n = 2;
  ref = range(2 * n + 1);
  for (k = 0, len = ref.length; k < len; k++) {
    _ = ref[k];
    irow = [];
    rrow = [];
    ref1 = range(2 * n + 1);
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      _ = ref1[l];
      irow.push(add('image', svg, {}));
      rrow.push(add('rect', svg, {
        width: TILE,
        height: TILE,
        stroke: 'black',
        'stroke-width': 1,
        fill: 'none'
      }));
    }
    images.push(irow);
    rects.push(rrow);
  }
  makeText(W / 2, 40);
  makeText(W / 2, H - 30);
  // touchstartCircle = (event) ->
  // 	event.preventDefault()
  // 	#makeText "#{event.type} #{pretty event.targetTouches}"
  // 	event.stopPropagation()

  // circle.addEventListener 'touchstart', touchstartCircle
  // circle.addEventListener 'touchmove',  nada
  // circle.addEventListener 'touchend',   nada
  targetButton = new TargetButton(INVISIBLE, INVISIBLE, '', '#f008');
  aimButton = new TargetButton(W / 2, H / 2, "click('aim')");
  new Button(60, 60, 'in', "click('in')");
  new Button(W - 60, 60, 'out', "click('out')");
  new Button(60, H - 60, 'ctr', "click('ctr')");
  recButton = new Button(W - 60, H - 60, 'rec', "recEvent()");
  console.log(grid_to_geodetic(6553600 + 128, 655360 + 128));
  console.log(grid_to_geodetic(6553600 + 3.5 * 128, 655360 + 3.5 * 128));
  return drawMap();
};

startup();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsTUFBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxTQUFBLEVBQUE7O0FBQUEsQ0FBQSxHQUFJLEtBQUo7O0FBQ0EsQ0FBQSxHQUFJLEtBREo7O0FBRUEsU0FBQSxHQUFZLENBQUM7O0FBQ2IsSUFBQSxHQUFPLElBSFA7O0FBSUEsSUFBQSxHQUFPLElBSlA7O0FBTUEsS0FBQSxHQUFRLENBQUMsQ0FBQzs7QUFDVixHQUFBLEdBQU0sUUFBQSxDQUFDLENBQUQsRUFBRyxJQUFFLElBQUwsQ0FBQTtTQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixDQUF0QixFQUF5QixDQUF6QjtBQUFkOztBQUVOLE1BQUEsR0FBUzs7QUFDVCxHQUFBLEdBQU0sUUFBUSxDQUFDLGNBQVQsQ0FBd0IsUUFBeEI7O0FBRU4sUUFBQSxHQUFXO0VBQUMsaUJBQUQ7RUFBb0IsZ0JBQXBCOzs7QUFFWCxNQUFBLEdBQVMsR0Fk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Y0FBNUI7RUFDQSxTQUFBLEdBQVksSUFBSSxNQUFKLENBQVcsQ0FBQSxHQUFFLEVBQWIsRUFBaUIsQ0FBQSxHQUFFLEVBQW5CLEVBQXVCLEtBQXZCLEVBQThCLFlBQTlCO0VBRVosT0FBTyxDQUFDLEdBQVIsQ0FBWSxnQkFBQSxDQUFpQixPQUFBLEdBQVEsR0FBekIsRUFBNkIsTUFBQSxHQUFPLEdBQXBDLENBQVo7RUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFBLENBQWlCLE9BQUEsR0FBUSxHQUFBLEdBQUksR0FBN0IsRUFBaUMsTUFBQSxHQUFPLEdBQUEsR0FBSSxHQUE1QyxDQUFaO1NBQ0EsT0FBQSxDQUFBO0FBNUNTOztBQThDVixPQUFBLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJXID0gMTAyNCAjIHdpbmRvdy5pbm5lcldpZHRoXHJcbkggPSAxMDI0ICMgd2luZG93LmlubmVySGVpZ2h0XHJcbklOVklTSUJMRSA9IC0xMDBcclxuU0laRSA9IDI1NiAjIDEyOC4uNjU1MzYgIyBydXRvcm5hcyBzdG9ybGVrIGkgbWV0ZXJcclxuVElMRSA9IDI1NiAjIHJ1dG9ybmFzIHN0b3JsZWsgaSBwaXhlbHNcclxuXHJcbnJhbmdlID0gXy5yYW5nZVxyXG5hc3MgPSAoYSxiPXRydWUpIC0+IGNoYWkuYXNzZXJ0LmRlZXBFcXVhbCBhLCBiXHJcblxyXG5zdmd1cmwgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuc3ZnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgJ3N2Z09uZSdcclxuXHJcbnBvc2l0aW9uID0gWzU5LjA5NDQzMDg3Mjk0MTc0LCAxNy43MTQyOTc1Mjk0ODg0XSAjIDEyOCBtZXRlciBpbi4gKGxhdCBsb25nKVxyXG5cclxuY2VudGVyID0gW10gIyBza8Okcm1lbnMgbWl0dHB1bmt0IChzd2VyZWYpLiBQw6V2ZXJrYXMgYXYgcGFuICh4IHkpICg2IDcpXHJcbnRhcmdldCA9IFtdICMgbcOlbGtvb3JkaW5hdGVyIChzd2VyZWYpXHJcbnRhcmdldEJ1dHRvbiA9IG51bGxcclxuXHJcbm1vdXNlID0gW11cclxuXHJcbmltYWdlcyA9IFtdXHJcbnJlY3RzID0gW11cclxudGV4dHMgPSBbXVxyXG5cclxucmVjQnV0dG9uID0gbnVsbFxyXG5yZWMgPSAwXHJcbmFpbUJ1dHRvbiA9IG51bGxcclxuXHJcbmRlZ3JlZXMgPSAocmFkaWFucykgLT4gcmFkaWFucyAqIDE4MCAvIE1hdGguUElcclxuXHJcbmRpc3RhbmNlID0gKHAscSkgLT5cclxuXHRpZiBwLmxlbmd0aCAhPSAyIG9yIHEubGVuZ3RoICE9IDIgdGhlbiByZXR1cm4gMFxyXG5cclxuXHRkeCA9IHBbMF0gLSBxWzBdXHJcblx0ZHkgPSBwWzFdIC0gcVsxXVxyXG5cdE1hdGgucm91bmQgTWF0aC5zcXJ0IGR4ICogZHggKyBkeSAqIGR5XHJcblxyXG5iZWFyaW5nID0gKHAscSkgLT5cclxuXHRpZiBwLmxlbmd0aCE9MiBvciBxLmxlbmd0aCE9MiB0aGVuIHJldHVybiAwXHJcblx0ZHggPSBwWzBdIC0gcVswXVxyXG5cdGR5ID0gcFsxXSAtIHFbMV1cclxuXHRyZXMgPSAzNjAgKyBNYXRoLnJvdW5kIGRlZ3JlZXMgTWF0aC5hdGFuMiBkeCxkeVxyXG5cdHJlcyAlIDM2MFxyXG5cclxuY2xhc3MgQnV0dG9uIFxyXG5cdGNvbnN0cnVjdG9yIDogKHgseSxwcm9tcHQsZXZlbnQsY29sb3I9JyNmMDAwJykgLT5cclxuXHRcdEByID0gNTBcclxuXHRcdGlmIHByb21wdCAhPSBcIlwiXHJcblx0XHRcdEB0ZXh0ID0gYWRkICd0ZXh0JyxzdmcsIHt4OngsIHk6eSsxMCwgc3Ryb2tlOidibGFjaycsICdzdHJva2Utd2lkdGgnOjEsICd0ZXh0LWFuY2hvcic6J21pZGRsZSd9XHJcblx0XHRcdEB0ZXh0LnRleHRDb250ZW50ID0gcHJvbXB0XHJcblx0XHRcdEB0ZXh0LnN0eWxlLmZvbnRTaXplID0gJzUwcHgnXHJcblx0XHRAY2lyY2xlID0gYWRkICdjaXJjbGUnLHN2Zywge2N4OngsIGN5OnksIHI6QHIsIGZpbGw6Y29sb3IsIHN0cm9rZTonYmxhY2snLCAnc3Ryb2tlLXdpZHRoJzoxLCBvbnRvdWNoc3RhcnQ6ZXZlbnR9ICMsIG9udG91Y2htb3ZlOiduYWRhKGV2dCknLCBvbnRvdWNoZW5kOiduYWRhKGV2dCknfVxyXG5cclxuY2xhc3MgVGFyZ2V0QnV0dG9uIGV4dGVuZHMgQnV0dG9uXHJcblx0Y29uc3RydWN0b3IgOiAoeCx5LGV2ZW50LGNvbG9yKSAtPlxyXG5cdFx0c3VwZXIgeCx5LCcnLGV2ZW50LGNvbG9yXHJcblx0XHRAdmxpbmUgPSBhZGQgJ2xpbmUnLHN2Zywge3gxOngtQHIsIHkxOnksIHgyOngrQHIsIHkyOnksIHN0cm9rZTonYmxhY2snLCAnc3Ryb2tlLXdpZHRoJzoxfVxyXG5cdFx0QGhsaW5lID0gYWRkICdsaW5lJyxzdmcsIHt4MTp4LCB5MTp5LUByLCB4Mjp4LCB5Mjp5K0ByLCBzdHJva2U6J2JsYWNrJywgJ3N0cm9rZS13aWR0aCc6MX1cclxuXHJcblx0bW92ZSA6IC0+XHJcblx0XHRpZiB0YXJnZXQubGVuZ3RoID09IDAgdGhlbiByZXR1cm5cclxuXHRcdGR4ID0gdGFyZ2V0WzBdIC0gY2VudGVyWzBdXHJcblx0XHRkeSA9IHRhcmdldFsxXSAtIGNlbnRlclsxXVxyXG5cdFx0YW50YWwgPSBTSVpFL1RJTEVcclxuXHRcdHggPSBXLzIgKyBkeCAvIGFudGFsXHJcblx0XHR5ID0gSC8yIC0gZHkgLyBhbnRhbFxyXG5cdFx0QG1vdmVIYXJkIHgseVxyXG5cclxuXHRtb3ZlSGFyZCA6ICh4LHkpIC0+XHJcblx0XHRzZXRBdHRycyBAY2lyY2xlLCB7Y3g6eCwgY3k6eX1cclxuXHRcdHNldEF0dHJzIEB2bGluZSwge3gxOngtQHIsIHkxOnksIHgyOngrQHIsIHkyOnl9XHJcblx0XHRzZXRBdHRycyBAaGxpbmUsIHt4MTp4LCB5MTp5LUByLCB4Mjp4LCB5Mjp5K0ByfVxyXG5cclxuYWRkID0gKHR5cGUscGFyZW50LGF0dHJzKSAtPlxyXG5cdG9iaiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyBzdmd1cmwsIHR5cGVcclxuXHRwYXJlbnQuYXBwZW5kQ2hpbGQgb2JqXHJcblx0c2V0QXR0cnMgb2JqLGF0dHJzXHJcblx0b2JqXHJcblxyXG5zZXRBdHRycyA9IChvYmosYXR0cnMpIC0+XHJcblx0Zm9yIGtleSBvZiBhdHRyc1xyXG5cdFx0b2JqLnNldEF0dHJpYnV0ZU5TIG51bGwsIGtleSwgYXR0cnNba2V5XVxyXG5cclxuY2xpY2sgPSAocykgLT4gXHJcblx0aWYgcz09J2luJyAgYW5kIFNJWkUgPiAxMjggdGhlbiBTSVpFIC8vPSAyXHJcblx0aWYgcz09J291dCcgYW5kIFNJWkUgPCA2NTUzNiB0aGVuIFNJWkUgKj0gMlxyXG5cdGlmIHM9PSdjdHInIHRoZW4gY2VudHJlcmEoKVxyXG5cdGlmIHM9PSdhaW0nIHRoZW4gYWltRXZlbnQoKVxyXG5cdGRyYXdNYXAoKVxyXG5cclxubW91c2Vkb3duID0gKGV2ZW50KSAtPiBcclxuXHR0b3VjaGVzID0gZXZlbnQudGFyZ2V0VG91Y2hlcyBcclxuXHRpZiB0b3VjaGVzLmxlbmd0aCAhPSAxIHRoZW4gcmV0dXJuXHJcblx0dG91Y2ggPSB0b3VjaGVzWzBdXHJcblx0bW91c2UgPSBbdG91Y2guY2xpZW50WCx0b3VjaC5jbGllbnRZXVxyXG5cclxubW91c2V1cCAgID0gKGV2ZW50KSAtPiBcclxuXHRtb3VzZSA9IFtdXHJcblx0ZHJhd01hcCgpXHJcblxyXG5tb3VzZW1vdmUgPSAoZXZlbnQpIC0+XHJcblx0aWYgbW91c2UubGVuZ3RoID09IDAgdGhlbiByZXR1cm5cclxuXHR0b3VjaGVzID0gZXZlbnQudGFyZ2V0VG91Y2hlcyBcclxuXHRpZiB0b3VjaGVzLmxlbmd0aCAhPSAxIHRoZW4gcmV0dXJuXHJcblx0dG91Y2ggPSB0b3VjaGVzWzBdXHJcblx0ZmFjdG9yID0gMlxyXG5cdGlmIFNJWkUgPT0gMTI4IHRoZW4gZmFjdG9yID0gMC41XHJcblx0aWYgU0laRSA9PSAyNTYgdGhlbiBmYWN0b3IgPSAxXHJcblxyXG5cdCMgZHggPSBldmVudC5tb3ZlbWVudFhcclxuXHQjIGR5ID0gZXZlbnQubW92ZW1lbnRZXHJcblx0ZHggPSB0b3VjaC5jbGllbnRYIC0gbW91c2VbMF1cclxuXHRkeSA9IHRvdWNoLmNsaWVudFkgLSBtb3VzZVsxXVxyXG5cdG1vdXNlID0gW3RvdWNoLmNsaWVudFgsdG91Y2guY2xpZW50WV1cclxuXHRjZW50ZXJbMF0gLT0gTWF0aC5yb3VuZCBkeCAqIGZhY3RvclxyXG5cdGNlbnRlclsxXSArPSBNYXRoLnJvdW5kIGR5ICogZmFjdG9yXHJcblxyXG5cdGRyYXdNYXAoKVxyXG5cdCNtb3ZlTWFwKClcclxuXHJcbnRvdWNoc3RhcnQgPSAoZXZlbnQpIC0+XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdG1vdXNlZG93biBldmVudFxyXG5cclxudG91Y2hlbmQgPSAoZXZlbnQpIC0+XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdG1vdXNldXAgZXZlbnRcclxuXHJcbnRvdWNobW92ZSA9IChldmVudCkgLT5cclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0bW91c2Vtb3ZlIGV2ZW50XHJcblxyXG5zdmcuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRcclxuc3ZnLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNobW92ZScsICB0b3VjaG1vdmVcclxuc3ZnLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNoZW5kJywgICB0b3VjaGVuZFxyXG5cclxuaW50ZXJwb2xhdGUgPSAoYSwgYiwgYywgZCwgdmFsdWUpIC0+IGMgKyB2YWx1ZS9iICogKGQtYylcclxuYXNzIDE2LCBpbnRlcnBvbGF0ZSAwLDEwMjQsMCwyNTYsNjRcclxuYXNzIDI0MCwgaW50ZXJwb2xhdGUgMCwxMDI0LDI1NiwwLDY0XHJcblxyXG5jb252ZXJ0ID0gKFt4LHldLHNpemU9U0laRSkgLT4gIyBzd2VyZWYgcHVua3RcclxuXHJcblx0ZHggPSB4ICUgU0laRSAjIGJlcsOka25hIHZla3RvciBkeCxkeSAoc3dlcmVmKVxyXG5cdGR5ID0geSAlIFNJWkVcclxuXHR4IC09IGR4ICAgICAgICMgYmVyw6RrbmEgcnV0YW5zIFNXIGjDtnJuIHgseSAoc3dlcmVmKVxyXG5cdHkgLT0gZHlcclxuXHJcblx0aWYgU0laRSBpbiBbMTI4LDI1Nl1cclxuXHRcdGR4ID0gaW50ZXJwb2xhdGUgMCxTSVpFLCBUSUxFLDAsIGR4XHJcblx0XHRkeSA9IGludGVycG9sYXRlIDAsU0laRSwgMCxUSUxFLCBkeVxyXG5cdGVsc2VcclxuXHRcdGR4ID0gaW50ZXJwb2xhdGUgMCxTSVpFLCBTSVpFLy8yLDAsIGR4XHJcblx0XHRkeSA9IGludGVycG9sYXRlIDAsU0laRSwgMCxTSVpFLy8yLCBkeVxyXG5cclxuXHRkeCA9IE1hdGgucm91bmQgZHhcclxuXHRkeSA9IE1hdGgucm91bmQgZHlcclxuXHJcblx0W3gseSwgZHgsZHldXHJcblxyXG4jIG1vdmVNYXAgPSAtPlxyXG4jIFx0biA9IDJcclxuIyBcdFtiYXNlWCxiYXNlWSxkeCxkeV0gPSBjb252ZXJ0IGNlbnRlclxyXG4jIFx0Zm9yIGogaW4gcmFuZ2UgMipuKzFcclxuIyBcdFx0I3kgPSBiYXNlWSArIChqLW4pICogU0laRVxyXG4jIFx0XHRweSA9IFRJTEUqKG4taisxKStkeVxyXG4jIFx0XHRmb3IgaSBpbiByYW5nZSAyKm4rMVxyXG4jIFx0XHRcdCN4ID0gYmFzZVggKyAoaS1uKSAqIFNJWkVcclxuIyBcdFx0XHRweCA9IFRJTEUqKGktbisxKStkeFxyXG4jIFx0XHRcdCNocmVmID0gXCJtYXBzXFxcXCN7U0laRX1cXFxcI3t5fS0je3h9LSN7U0laRX0uanBnXCJcclxuIyBcdFx0XHRzZXRBdHRycyBpbWFnZXNbal1baV0sIHt4OnB4LCB5OnB5fSBcclxuIyBcdFx0XHRzZXRBdHRycyByZWN0c1tqXVtpXSwgIHt4OnB4LCB5OnB5fVxyXG4jIFx0dGV4dHNbMF0udGV4dENvbnRlbnQgPSBcIkM6I3tjZW50ZXJ9IFQ6I3t0YXJnZXR9IEQ6I3tkaXN0YW5jZSh0YXJnZXQsY2VudGVyKX0gQjoje2JlYXJpbmcodGFyZ2V0LGNlbnRlcil9XCJcclxuIyBcdHRleHRzWzFdLnRleHRDb250ZW50ID0gXCJaOiN7U0laRX0gQjoje1tiYXNlWCxiYXNlWV19IERYOiN7ZHh9IERZOiN7ZHl9XCJcclxuIyBcdHRhcmdldEJ1dHRvbi5tb3ZlKClcclxuXHJcbmRyYXdNYXAgPSAtPlxyXG5cdG4gPSAyXHJcblx0W2Jhc2VYLGJhc2VZLGR4LGR5XSA9IGNvbnZlcnQgY2VudGVyXHJcblx0Zm9yIGogaW4gcmFuZ2UgMipuKzFcclxuXHRcdHkgPSBiYXNlWSArIChqLW4pICogU0laRVxyXG5cdFx0cHkgPSBUSUxFKihuLWorMSkrZHlcclxuXHRcdGZvciBpIGluIHJhbmdlIDIqbisxXHJcblx0XHRcdHggPSBiYXNlWCArIChpLW4pICogU0laRVxyXG5cdFx0XHRweCA9IFRJTEUqKGktbisxKStkeFxyXG5cdFx0XHRocmVmID0gXCJtYXBzXFxcXCN7U0laRX1cXFxcI3t5fS0je3h9LSN7U0laRX0uanBnXCJcclxuXHRcdFx0c2V0QXR0cnMgaW1hZ2VzW2pdW2ldLCB7eDpweCwgeTpweSwgaHJlZjpocmVmfSBcclxuXHRcdFx0c2V0QXR0cnMgcmVjdHNbal1baV0sICB7eDpweCwgeTpweX1cclxuXHR0ZXh0c1swXS50ZXh0Q29udGVudCA9IFwiQzoje2NlbnRlcn0gVDoje3RhcmdldH0gRDoje2Rpc3RhbmNlKHRhcmdldCxjZW50ZXIpfSBCOiN7YmVhcmluZyh0YXJnZXQsY2VudGVyKX1cIlxyXG5cdHRleHRzWzFdLnRleHRDb250ZW50ID0gXCJaOiN7U0laRX0gQjoje1tiYXNlWCxiYXNlWV19IERYOiN7ZHh9IERZOiN7ZHl9XCJcclxuXHR0YXJnZXRCdXR0b24ubW92ZSgpXHJcblxyXG5jZW50cmVyYSA9IC0+XHJcblx0Z3JpZCA9IGdlb2RldGljX3RvX2dyaWQgcG9zaXRpb25bMF0scG9zaXRpb25bMV1cclxuXHRjZW50ZXIgPSAoTWF0aC5yb3VuZCBnIGZvciBnIGluIGdyaWQpXHJcblx0Y2VudGVyLnJldmVyc2UoKVxyXG5cdGRyYXdNYXAoKVxyXG5cclxuYWltRXZlbnQgPSAtPlxyXG5cdGlmIHRhcmdldC5sZW5ndGggPT0gMFxyXG5cdFx0dGFyZ2V0ID0gY2VudGVyLnNsaWNlKClcclxuXHRcdHRhcmdldEJ1dHRvbi5tb3ZlSGFyZCBXLzIsSC8yXHJcblx0ZWxzZVxyXG5cdFx0dGFyZ2V0ID0gW11cclxuXHRcdHRhcmdldEJ1dHRvbi5tb3ZlSGFyZCBJTlZJU0lCTEUsIElOVklTSUJMRVxyXG5cclxucmVjRXZlbnQgPSAtPlxyXG5cdHJlYyA9IDEgLSByZWNcclxuXHRyZWNCdXR0b24uc2V0QXR0cmlidXRlTlMgbnVsbCwgJ2ZpbGwnLFsnI2YwMDgnLCcjZjAwMCddW3JlY11cclxuXHJcbm1ha2VUZXh0ID0gKHgseSkgLT5cclxuXHR0ZXh0ID0gYWRkICd0ZXh0JyxzdmcsIHt4OngsIHk6eSwgc3Ryb2tlOidibGFjaycsICdzdHJva2Utd2lkdGgnOjEsICd0ZXh0LWFuY2hvcic6J21pZGRsZSd9XHJcblx0dGV4dC5zdHlsZS5mb250U2l6ZSA9ICcyNXB4J1xyXG5cdHRleHRzLnB1c2ggdGV4dFxyXG5cclxubmFkYSA9IChldmVudCkgLT5cclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbnN0YXJ0dXAgPSAtPlxyXG5cdGFkZCAncmVjdCcsc3ZnLHt3aWR0aDpXLCBoZWlnaHQ6SCwgZmlsbDonZ3JlZW4nfVxyXG5cdGdyaWQgPSBnZW9kZXRpY190b19ncmlkIHBvc2l0aW9uWzBdLHBvc2l0aW9uWzFdXHJcblx0Y2VudGVyID0gKE1hdGgucm91bmQgZyBmb3IgZyBpbiBncmlkKVxyXG5cdGNlbnRlci5yZXZlcnNlKClcclxuXHJcblx0aW1hZ2VzID0gW11cclxuXHRyZWN0cyA9IFtdXHJcblx0dGV4dHMgPSBbXVxyXG5cclxuXHRuID0gMlxyXG5cdGZvciBfIGluIHJhbmdlIDIqbisxXHJcblx0XHRpcm93ID0gW11cclxuXHRcdHJyb3cgPSBbXVxyXG5cdFx0Zm9yIF8gaW4gcmFuZ2UgMipuKzFcclxuXHRcdFx0aXJvdy5wdXNoIGFkZCAnaW1hZ2UnLHN2Zywge31cclxuXHRcdFx0cnJvdy5wdXNoIGFkZCAncmVjdCcsIHN2Zywge3dpZHRoOlRJTEUsIGhlaWdodDpUSUxFLCBzdHJva2U6J2JsYWNrJywgJ3N0cm9rZS13aWR0aCc6MSwgZmlsbDonbm9uZSd9XHJcblx0XHRpbWFnZXMucHVzaCBpcm93XHJcblx0XHRyZWN0cy5wdXNoIHJyb3dcclxuXHJcblx0bWFrZVRleHQgVy8yLCA0MFxyXG5cdG1ha2VUZXh0IFcvMiwgSC0zMFxyXG5cclxuXHJcblxyXG5cclxuIyB0b3VjaHN0YXJ0Q2lyY2xlID0gKGV2ZW50KSAtPlxyXG4jIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4jIFx0I21ha2VUZXh0IFwiI3tldmVudC50eXBlfSAje3ByZXR0eSBldmVudC50YXJnZXRUb3VjaGVzfVwiXHJcbiMgXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuIyBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hzdGFydCcsIHRvdWNoc3RhcnRDaXJjbGVcclxuIyBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2htb3ZlJywgIG5hZGFcclxuIyBjaXJjbGUuYWRkRXZlbnRMaXN0ZW5lciAndG91Y2hlbmQnLCAgIG5hZGFcclxuXHJcblx0dGFyZ2V0QnV0dG9uID0gbmV3IFRhcmdldEJ1dHRvbiBJTlZJU0lCTEUsIElOVklTSUJMRSwgJycsICcjZjAwOCdcclxuXHRhaW1CdXR0b24gPSBuZXcgVGFyZ2V0QnV0dG9uIFcvMiwgSC8yLCBcImNsaWNrKCdhaW0nKVwiXHJcblx0bmV3IEJ1dHRvbiA2MCwgICA2MCwgJ2luJywgIFwiY2xpY2soJ2luJylcIlxyXG5cdG5ldyBCdXR0b24gVy02MCwgNjAsICdvdXQnLCBcImNsaWNrKCdvdXQnKVwiXHJcblx0bmV3IEJ1dHRvbiA2MCwgSC02MCwgJ2N0cicsIFwiY2xpY2soJ2N0cicpXCJcclxuXHRyZWNCdXR0b24gPSBuZXcgQnV0dG9uIFctNjAsIEgtNjAsICdyZWMnLCBcInJlY0V2ZW50KClcIlxyXG5cclxuXHRjb25zb2xlLmxvZyBncmlkX3RvX2dlb2RldGljIDY1NTM2MDArMTI4LDY1NTM2MCsxMjhcclxuXHRjb25zb2xlLmxvZyBncmlkX3RvX2dlb2RldGljIDY1NTM2MDArMy41KjEyOCw2NTUzNjArMy41KjEyOFxyXG5cdGRyYXdNYXAoKVxyXG5cclxuc3RhcnR1cCgpXHJcblxyXG4iXX0=
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\sketch.coffee