// Generated by CoffeeScript 2.4.1
var Button, H, INVISIBLE, SIZE, TILE, TargetButton, W, add, aimButton, aimEvent, ass, bearing, center, centrera, click, convert, degrees, distance, drawMap, images, interpolate, makeText, mouse, mousedown, mousemove, mouseup, position, range, rec, recButton, recEvent, rects, setAttrs, startup, svg, svgurl, target, targetButton, texts, touchend, touchmove, touchstart;

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
      onclick: event
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsTUFBQSxFQUFBLENBQUEsRUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxLQUFBLEVBQUEsUUFBQSxFQUFBLFNBQUEsRUFBQTs7QUFBQSxDQUFBLEdBQUksS0FBSjs7QUFDQSxDQUFBLEdBQUksS0FESjs7QUFFQSxTQUFBLEdBQVksQ0FBQzs7QUFDYixJQUFBLEdBQU8sSUFIUDs7QUFJQSxJQUFBLEdBQU8sSUFKUDs7QUFNQSxLQUFBLEdBQVEsQ0FBQyxDQUFDOztBQUNWLEdBQUEsR0FBTSxRQUFBLENBQUMsQ0FBRCxFQUFHLElBQUUsSUFBTCxDQUFBO1NBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQWQ7O0FBRU4sTUFBQSxHQUFTOztBQUNULEdBQUEsR0FBTSxRQUFRLENBQUMsY0FBVCxDQUF3QixRQUF4Qjs7QUFFTixRQUFBLEdBQVc7RUFBQyxpQkFBRDtFQUFvQixnQkFBcEI7OztBQUVYLE1BQUEsR0FBUyxHQWRUOztBQWVBLE1B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LGdCQUFBLENBQWlCLE9BQUEsR0FBUSxHQUF6QixFQUE2QixNQUFBLEdBQU8sR0FBcEMsQ0FBWjtFQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0JBQUEsQ0FBaUIsT0FBQSxHQUFRLEdBQUEsR0FBSSxHQUE3QixFQUFpQyxNQUFBLEdBQU8sR0FBQSxHQUFJLEdBQTVDLENBQVo7U0FDQSxPQUFBLENBQUE7QUFoQ1M7O0FBa0NWLE9BQUEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlcgPSAxMDI0ICMgd2luZG93LmlubmVyV2lkdGhcclxuSCA9IDEwMjQgIyB3aW5kb3cuaW5uZXJIZWlnaHRcclxuSU5WSVNJQkxFID0gLTEwMFxyXG5TSVpFID0gMjU2ICMgMTI4Li42NTUzNiAjIHJ1dG9ybmFzIHN0b3JsZWsgaSBtZXRlclxyXG5USUxFID0gMjU2ICMgcnV0b3JuYXMgc3RvcmxlayBpIHBpeGVsc1xyXG5cclxucmFuZ2UgPSBfLnJhbmdlXHJcbmFzcyA9IChhLGI9dHJ1ZSkgLT4gY2hhaS5hc3NlcnQuZGVlcEVxdWFsIGEsIGJcclxuXHJcbnN2Z3VybCA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG5zdmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCAnc3ZnT25lJ1xyXG5cclxucG9zaXRpb24gPSBbNTkuMDk0NDMwODcyOTQxNzQsIDE3LjcxNDI5NzUyOTQ4ODRdICMgMTI4IG1ldGVyIGluLiAobGF0IGxvbmcpXHJcblxyXG5jZW50ZXIgPSBbXSAjIHNrw6RybWVucyBtaXR0cHVua3QgKHN3ZXJlZikuIFDDpXZlcmthcyBhdiBwYW4gKHggeSkgKDYgNylcclxudGFyZ2V0ID0gW10gIyBtw6Vsa29vcmRpbmF0ZXIgKHN3ZXJlZilcclxudGFyZ2V0QnV0dG9uID0gbnVsbFxyXG5cclxubW91c2UgPSBbXVxyXG5cclxuaW1hZ2VzID0gW11cclxucmVjdHMgPSBbXVxyXG50ZXh0cyA9IFtdXHJcblxyXG5yZWNCdXR0b24gPSBudWxsXHJcbnJlYyA9IDBcclxuYWltQnV0dG9uID0gbnVsbFxyXG5cclxuZGVncmVlcyA9IChyYWRpYW5zKSAtPiByYWRpYW5zICogMTgwIC8gTWF0aC5QSVxyXG5cclxuZGlzdGFuY2UgPSAocCxxKSAtPlxyXG5cdGlmIHAubGVuZ3RoICE9IDIgb3IgcS5sZW5ndGggIT0gMiB0aGVuIHJldHVybiAwXHJcblxyXG5cdGR4ID0gcFswXSAtIHFbMF1cclxuXHRkeSA9IHBbMV0gLSBxWzFdXHJcblx0TWF0aC5yb3VuZCBNYXRoLnNxcnQgZHggKiBkeCArIGR5ICogZHlcclxuXHJcbmJlYXJpbmcgPSAocCxxKSAtPlxyXG5cdGlmIHAubGVuZ3RoIT0yIG9yIHEubGVuZ3RoIT0yIHRoZW4gcmV0dXJuIDBcclxuXHRkeCA9IHBbMF0gLSBxWzBdXHJcblx0ZHkgPSBwWzFdIC0gcVsxXVxyXG5cdHJlcyA9IDM2MCArIE1hdGgucm91bmQgZGVncmVlcyBNYXRoLmF0YW4yIGR4LGR5XHJcblx0cmVzICUgMzYwXHJcblxyXG5jbGFzcyBCdXR0b24gXHJcblx0Y29uc3RydWN0b3IgOiAoeCx5LHByb21wdCxldmVudCxjb2xvcj0nI2YwMDAnKSAtPlxyXG5cdFx0QHIgPSA1MFxyXG5cdFx0aWYgcHJvbXB0ICE9IFwiXCJcclxuXHRcdFx0QHRleHQgPSBhZGQgJ3RleHQnLHN2Zywge3g6eCwgeTp5KzEwLCBzdHJva2U6J2JsYWNrJywgJ3N0cm9rZS13aWR0aCc6MSwgJ3RleHQtYW5jaG9yJzonbWlkZGxlJ31cclxuXHRcdFx0QHRleHQudGV4dENvbnRlbnQgPSBwcm9tcHRcclxuXHRcdFx0QHRleHQuc3R5bGUuZm9udFNpemUgPSAnNTBweCdcclxuXHRcdEBjaXJjbGUgPSBhZGQgJ2NpcmNsZScsc3ZnLCB7Y3g6eCwgY3k6eSwgcjpAciwgZmlsbDpjb2xvciwgc3Ryb2tlOidibGFjaycsICdzdHJva2Utd2lkdGgnOjEsIG9uY2xpY2s6ZXZlbnR9XHJcblxyXG5jbGFzcyBUYXJnZXRCdXR0b24gZXh0ZW5kcyBCdXR0b25cclxuXHRjb25zdHJ1Y3RvciA6ICh4LHksZXZlbnQsY29sb3IpIC0+XHJcblx0XHRzdXBlciB4LHksJycsZXZlbnQsY29sb3JcclxuXHRcdEB2bGluZSA9IGFkZCAnbGluZScsc3ZnLCB7eDE6eC1AciwgeTE6eSwgeDI6eCtAciwgeTI6eSwgc3Ryb2tlOidibGFjaycsICdzdHJva2Utd2lkdGgnOjF9XHJcblx0XHRAaGxpbmUgPSBhZGQgJ2xpbmUnLHN2Zywge3gxOngsIHkxOnktQHIsIHgyOngsIHkyOnkrQHIsIHN0cm9rZTonYmxhY2snLCAnc3Ryb2tlLXdpZHRoJzoxfVxyXG5cclxuXHRtb3ZlIDogLT5cclxuXHRcdGlmIHRhcmdldC5sZW5ndGggPT0gMCB0aGVuIHJldHVyblxyXG5cdFx0ZHggPSB0YXJnZXRbMF0gLSBjZW50ZXJbMF1cclxuXHRcdGR5ID0gdGFyZ2V0WzFdIC0gY2VudGVyWzFdXHJcblx0XHRhbnRhbCA9IFNJWkUvVElMRVxyXG5cdFx0eCA9IFcvMiArIGR4IC8gYW50YWxcclxuXHRcdHkgPSBILzIgLSBkeSAvIGFudGFsXHJcblx0XHRAbW92ZUhhcmQgeCx5XHJcblxyXG5cdG1vdmVIYXJkIDogKHgseSkgLT5cclxuXHRcdHNldEF0dHJzIEBjaXJjbGUsIHtjeDp4LCBjeTp5fVxyXG5cdFx0c2V0QXR0cnMgQHZsaW5lLCB7eDE6eC1AciwgeTE6eSwgeDI6eCtAciwgeTI6eX1cclxuXHRcdHNldEF0dHJzIEBobGluZSwge3gxOngsIHkxOnktQHIsIHgyOngsIHkyOnkrQHJ9XHJcblxyXG5hZGQgPSAodHlwZSxwYXJlbnQsYXR0cnMpIC0+XHJcblx0b2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TIHN2Z3VybCwgdHlwZVxyXG5cdHBhcmVudC5hcHBlbmRDaGlsZCBvYmpcclxuXHRzZXRBdHRycyBvYmosYXR0cnNcclxuXHRvYmpcclxuXHJcbnNldEF0dHJzID0gKG9iaixhdHRycykgLT5cclxuXHRmb3Iga2V5IG9mIGF0dHJzXHJcblx0XHRvYmouc2V0QXR0cmlidXRlTlMgbnVsbCwga2V5LCBhdHRyc1trZXldXHJcblxyXG5jbGljayA9IChzKSAtPiBcclxuXHRpZiBzPT0naW4nICBhbmQgU0laRSA+IDEyOCB0aGVuIFNJWkUgLy89IDJcclxuXHRpZiBzPT0nb3V0JyBhbmQgU0laRSA8IDY1NTM2IHRoZW4gU0laRSAqPSAyXHJcblx0aWYgcz09J2N0cicgdGhlbiBjZW50cmVyYSgpXHJcblx0aWYgcz09J2FpbScgdGhlbiBhaW1FdmVudCgpXHJcblx0ZHJhd01hcCgpXHJcblxyXG5tb3VzZWRvd24gPSAoZXZlbnQpIC0+IFxyXG5cdHRvdWNoZXMgPSBldmVudC50YXJnZXRUb3VjaGVzIFxyXG5cdGlmIHRvdWNoZXMubGVuZ3RoICE9IDEgdGhlbiByZXR1cm5cclxuXHR0b3VjaCA9IHRvdWNoZXNbMF1cclxuXHRtb3VzZSA9IFt0b3VjaC5jbGllbnRYLHRvdWNoLmNsaWVudFldXHJcblx0XHJcbm1vdXNldXAgICA9IChldmVudCkgLT4gXHJcblx0bW91c2UgPSBbXVxyXG5cdGRyYXdNYXAoKVxyXG5cclxubW91c2Vtb3ZlID0gKGV2ZW50KSAtPlxyXG5cdGlmIG1vdXNlLmxlbmd0aCA9PSAwIHRoZW4gcmV0dXJuXHJcblx0dG91Y2hlcyA9IGV2ZW50LnRhcmdldFRvdWNoZXMgXHJcblx0aWYgdG91Y2hlcy5sZW5ndGggIT0gMSB0aGVuIHJldHVyblxyXG5cdHRvdWNoID0gdG91Y2hlc1swXVxyXG5cdGZhY3RvciA9IDJcclxuXHRpZiBTSVpFID09IDEyOCB0aGVuIGZhY3RvciA9IDAuNVxyXG5cdGlmIFNJWkUgPT0gMjU2IHRoZW4gZmFjdG9yID0gMVxyXG5cclxuXHQjIGR4ID0gZXZlbnQubW92ZW1lbnRYXHJcblx0IyBkeSA9IGV2ZW50Lm1vdmVtZW50WVxyXG5cdGR4ID0gdG91Y2guY2xpZW50WCAtIG1vdXNlWzBdXHJcblx0ZHkgPSB0b3VjaC5jbGllbnRZIC0gbW91c2VbMV1cclxuXHRtb3VzZSA9IFt0b3VjaC5jbGllbnRYLHRvdWNoLmNsaWVudFldXHJcblx0Y2VudGVyWzBdIC09IE1hdGgucm91bmQgZHggKiBmYWN0b3JcclxuXHRjZW50ZXJbMV0gKz0gTWF0aC5yb3VuZCBkeSAqIGZhY3RvclxyXG5cclxuXHRkcmF3TWFwKClcclxuXHQjbW92ZU1hcCgpXHJcblxyXG50b3VjaHN0YXJ0ID0gKGV2ZW50KSAtPlxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRtb3VzZWRvd24gZXZlbnRcclxuXHJcbnRvdWNoZW5kID0gKGV2ZW50KSAtPlxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRtb3VzZXVwIGV2ZW50XHJcblxyXG50b3VjaG1vdmUgPSAoZXZlbnQpIC0+XHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdG1vdXNlbW92ZSBldmVudFxyXG5cclxuc3ZnLmFkZEV2ZW50TGlzdGVuZXIgJ3RvdWNoc3RhcnQnLCB0b3VjaHN0YXJ0XHJcbnN2Zy5hZGRFdmVudExpc3RlbmVyICd0b3VjaG1vdmUnLCAgdG91Y2htb3ZlXHJcbnN2Zy5hZGRFdmVudExpc3RlbmVyICd0b3VjaGVuZCcsICAgdG91Y2hlbmRcclxuXHJcbmludGVycG9sYXRlID0gKGEsIGIsIGMsIGQsIHZhbHVlKSAtPiBjICsgdmFsdWUvYiAqIChkLWMpXHJcbmFzcyAxNiwgaW50ZXJwb2xhdGUgMCwxMDI0LDAsMjU2LDY0XHJcbmFzcyAyNDAsIGludGVycG9sYXRlIDAsMTAyNCwyNTYsMCw2NFxyXG5cclxuY29udmVydCA9IChbeCx5XSxzaXplPVNJWkUpIC0+ICMgc3dlcmVmIHB1bmt0XHJcblxyXG5cdGR4ID0geCAlIFNJWkUgIyBiZXLDpGtuYSB2ZWt0b3IgZHgsZHkgKHN3ZXJlZilcclxuXHRkeSA9IHkgJSBTSVpFXHJcblx0eCAtPSBkeCAgICAgICAjIGJlcsOka25hIHJ1dGFucyBTVyBow7ZybiB4LHkgKHN3ZXJlZilcclxuXHR5IC09IGR5XHJcblxyXG5cdGlmIFNJWkUgaW4gWzEyOCwyNTZdXHJcblx0XHRkeCA9IGludGVycG9sYXRlIDAsU0laRSwgVElMRSwwLCBkeFxyXG5cdFx0ZHkgPSBpbnRlcnBvbGF0ZSAwLFNJWkUsIDAsVElMRSwgZHlcclxuXHRlbHNlXHJcblx0XHRkeCA9IGludGVycG9sYXRlIDAsU0laRSwgU0laRS8vMiwwLCBkeFxyXG5cdFx0ZHkgPSBpbnRlcnBvbGF0ZSAwLFNJWkUsIDAsU0laRS8vMiwgZHlcclxuXHJcblx0ZHggPSBNYXRoLnJvdW5kIGR4XHJcblx0ZHkgPSBNYXRoLnJvdW5kIGR5XHJcblxyXG5cdFt4LHksIGR4LGR5XVxyXG5cclxuIyBtb3ZlTWFwID0gLT5cclxuIyBcdG4gPSAyXHJcbiMgXHRbYmFzZVgsYmFzZVksZHgsZHldID0gY29udmVydCBjZW50ZXJcclxuIyBcdGZvciBqIGluIHJhbmdlIDIqbisxXHJcbiMgXHRcdCN5ID0gYmFzZVkgKyAoai1uKSAqIFNJWkVcclxuIyBcdFx0cHkgPSBUSUxFKihuLWorMSkrZHlcclxuIyBcdFx0Zm9yIGkgaW4gcmFuZ2UgMipuKzFcclxuIyBcdFx0XHQjeCA9IGJhc2VYICsgKGktbikgKiBTSVpFXHJcbiMgXHRcdFx0cHggPSBUSUxFKihpLW4rMSkrZHhcclxuIyBcdFx0XHQjaHJlZiA9IFwibWFwc1xcXFwje1NJWkV9XFxcXCN7eX0tI3t4fS0je1NJWkV9LmpwZ1wiXHJcbiMgXHRcdFx0c2V0QXR0cnMgaW1hZ2VzW2pdW2ldLCB7eDpweCwgeTpweX0gXHJcbiMgXHRcdFx0c2V0QXR0cnMgcmVjdHNbal1baV0sICB7eDpweCwgeTpweX1cclxuIyBcdHRleHRzWzBdLnRleHRDb250ZW50ID0gXCJDOiN7Y2VudGVyfSBUOiN7dGFyZ2V0fSBEOiN7ZGlzdGFuY2UodGFyZ2V0LGNlbnRlcil9IEI6I3tiZWFyaW5nKHRhcmdldCxjZW50ZXIpfVwiXHJcbiMgXHR0ZXh0c1sxXS50ZXh0Q29udGVudCA9IFwiWjoje1NJWkV9IEI6I3tbYmFzZVgsYmFzZVldfSBEWDoje2R4fSBEWToje2R5fVwiXHJcbiMgXHR0YXJnZXRCdXR0b24ubW92ZSgpXHJcblxyXG5kcmF3TWFwID0gLT5cclxuXHRuID0gMlxyXG5cdFtiYXNlWCxiYXNlWSxkeCxkeV0gPSBjb252ZXJ0IGNlbnRlclxyXG5cdGZvciBqIGluIHJhbmdlIDIqbisxXHJcblx0XHR5ID0gYmFzZVkgKyAoai1uKSAqIFNJWkVcclxuXHRcdHB5ID0gVElMRSoobi1qKzEpK2R5XHJcblx0XHRmb3IgaSBpbiByYW5nZSAyKm4rMVxyXG5cdFx0XHR4ID0gYmFzZVggKyAoaS1uKSAqIFNJWkVcclxuXHRcdFx0cHggPSBUSUxFKihpLW4rMSkrZHhcclxuXHRcdFx0aHJlZiA9IFwibWFwc1xcXFwje1NJWkV9XFxcXCN7eX0tI3t4fS0je1NJWkV9LmpwZ1wiXHJcblx0XHRcdHNldEF0dHJzIGltYWdlc1tqXVtpXSwge3g6cHgsIHk6cHksIGhyZWY6aHJlZn0gXHJcblx0XHRcdHNldEF0dHJzIHJlY3RzW2pdW2ldLCAge3g6cHgsIHk6cHl9XHJcblx0dGV4dHNbMF0udGV4dENvbnRlbnQgPSBcIkM6I3tjZW50ZXJ9IFQ6I3t0YXJnZXR9IEQ6I3tkaXN0YW5jZSh0YXJnZXQsY2VudGVyKX0gQjoje2JlYXJpbmcodGFyZ2V0LGNlbnRlcil9XCJcclxuXHR0ZXh0c1sxXS50ZXh0Q29udGVudCA9IFwiWjoje1NJWkV9IEI6I3tbYmFzZVgsYmFzZVldfSBEWDoje2R4fSBEWToje2R5fVwiXHJcblx0dGFyZ2V0QnV0dG9uLm1vdmUoKVxyXG5cclxuY2VudHJlcmEgPSAtPlxyXG5cdGdyaWQgPSBnZW9kZXRpY190b19ncmlkIHBvc2l0aW9uWzBdLHBvc2l0aW9uWzFdXHJcblx0Y2VudGVyID0gKE1hdGgucm91bmQgZyBmb3IgZyBpbiBncmlkKVxyXG5cdGNlbnRlci5yZXZlcnNlKClcclxuXHRkcmF3TWFwKClcclxuXHJcbmFpbUV2ZW50ID0gLT5cclxuXHRpZiB0YXJnZXQubGVuZ3RoID09IDBcclxuXHRcdHRhcmdldCA9IGNlbnRlci5zbGljZSgpXHJcblx0XHR0YXJnZXRCdXR0b24ubW92ZUhhcmQgVy8yLEgvMlxyXG5cdGVsc2VcclxuXHRcdHRhcmdldCA9IFtdXHJcblx0XHR0YXJnZXRCdXR0b24ubW92ZUhhcmQgSU5WSVNJQkxFLCBJTlZJU0lCTEVcclxuXHJcbnJlY0V2ZW50ID0gLT5cclxuXHRyZWMgPSAxIC0gcmVjXHJcblx0cmVjQnV0dG9uLnNldEF0dHJpYnV0ZU5TIG51bGwsICdmaWxsJyxbJyNmMDA4JywnI2YwMDAnXVtyZWNdXHJcblxyXG5tYWtlVGV4dCA9ICh4LHkpIC0+XHJcblx0dGV4dCA9IGFkZCAndGV4dCcsc3ZnLCB7eDp4LCB5OnksIHN0cm9rZTonYmxhY2snLCAnc3Ryb2tlLXdpZHRoJzoxLCAndGV4dC1hbmNob3InOidtaWRkbGUnfVxyXG5cdHRleHQuc3R5bGUuZm9udFNpemUgPSAnMjVweCdcclxuXHR0ZXh0cy5wdXNoIHRleHRcclxuXHJcbnN0YXJ0dXAgPSAtPlxyXG5cdGFkZCAncmVjdCcsc3ZnLHt3aWR0aDpXLCBoZWlnaHQ6SCwgZmlsbDonZ3JlZW4nfVxyXG5cdGdyaWQgPSBnZW9kZXRpY190b19ncmlkIHBvc2l0aW9uWzBdLHBvc2l0aW9uWzFdXHJcblx0Y2VudGVyID0gKE1hdGgucm91bmQgZyBmb3IgZyBpbiBncmlkKVxyXG5cdGNlbnRlci5yZXZlcnNlKClcclxuXHJcblx0aW1hZ2VzID0gW11cclxuXHRyZWN0cyA9IFtdXHJcblx0dGV4dHMgPSBbXVxyXG5cclxuXHRuID0gMlxyXG5cdGZvciBfIGluIHJhbmdlIDIqbisxXHJcblx0XHRpcm93ID0gW11cclxuXHRcdHJyb3cgPSBbXVxyXG5cdFx0Zm9yIF8gaW4gcmFuZ2UgMipuKzFcclxuXHRcdFx0aXJvdy5wdXNoIGFkZCAnaW1hZ2UnLHN2Zywge31cclxuXHRcdFx0cnJvdy5wdXNoIGFkZCAncmVjdCcsIHN2Zywge3dpZHRoOlRJTEUsIGhlaWdodDpUSUxFLCBzdHJva2U6J2JsYWNrJywgJ3N0cm9rZS13aWR0aCc6MSwgZmlsbDonbm9uZSd9XHJcblx0XHRpbWFnZXMucHVzaCBpcm93XHJcblx0XHRyZWN0cy5wdXNoIHJyb3dcclxuXHJcblx0bWFrZVRleHQgVy8yLCA0MFxyXG5cdG1ha2VUZXh0IFcvMiwgSC0zMFxyXG5cclxuXHR0YXJnZXRCdXR0b24gPSBuZXcgVGFyZ2V0QnV0dG9uIElOVklTSUJMRSwgSU5WSVNJQkxFLCAnJywgJyNmMDA4J1xyXG5cdGFpbUJ1dHRvbiA9IG5ldyBUYXJnZXRCdXR0b24gVy8yLCBILzIsIFwiY2xpY2soJ2FpbScpXCJcclxuXHRuZXcgQnV0dG9uIDYwLCAgIDYwLCAnaW4nLCAgXCJjbGljaygnaW4nKVwiXHJcblx0bmV3IEJ1dHRvbiBXLTYwLCA2MCwgJ291dCcsIFwiY2xpY2soJ291dCcpXCJcclxuXHRuZXcgQnV0dG9uIDYwLCBILTYwLCAnY3RyJywgXCJjbGljaygnY3RyJylcIlxyXG5cdHJlY0J1dHRvbiA9IG5ldyBCdXR0b24gVy02MCwgSC02MCwgJ3JlYycsIFwicmVjRXZlbnQoKVwiXHJcblxyXG5cdGNvbnNvbGUubG9nIGdyaWRfdG9fZ2VvZGV0aWMgNjU1MzYwMCsxMjgsNjU1MzYwKzEyOFxyXG5cdGNvbnNvbGUubG9nIGdyaWRfdG9fZ2VvZGV0aWMgNjU1MzYwMCszLjUqMTI4LDY1NTM2MCszLjUqMTI4XHJcblx0ZHJhd01hcCgpXHJcblxyXG5zdGFydHVwKClcclxuXHJcbiJdfQ==
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\sketch.coffee