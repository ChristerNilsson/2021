// Generated by CoffeeScript 2.4.1
var ANCHORS, Button, Selector, ass, didj, draw, even, iSel, jSel, makeANCHORS, manhattan, mousePressed, n, nSel, nr, odd, range, rowsum, setup, start, x, y;

ass = function(a, b) {
  if (chai.assert.deepEqual(a, b)) {
    return console.log(a, b);
  }
};

range = _.range;

n = null;

ANCHORS = null;

nSel = null;

iSel = null;

jSel = null;

makeANCHORS = function(n0) {
  n = n0;
  return ANCHORS = [[[Math.floor(n / 2), 0], [0, n]], [[0, Math.floor(n / 2)], [n, 0]], [[n - 1, Math.floor(n / 2)], [-n, 0]], [[Math.floor(n / 2), n - 1], [0, -n]]];
};

nr = function(i, j) {
  if ((i + j) % 2 === 0) {
    return even(i, j);
  } else {
    return odd(i, j);
  }
};

even = function(i, j) {
  return Math.floor(x(i, j) / 2) + 1 + n * (Math.floor(y(i, j) / 2));
};

odd = function(i, j) {
  var di, dj;
  [di, dj] = didj(i, j)[1];
  return even(i + di, j + dj);
};

x = function(i, j) {
  return i - j + n - 1;
};

y = function(i, j) {
  return 2 * n - 2 - i - j;
};

manhattan = function(a, b, c, d) {
  return Math.abs(a - c) + Math.abs(b - d);
};

didj = function(i, j) {
  return _.minBy(ANCHORS, function([[a, b], [c, d]]) {
    return manhattan(a, b, i, j);
  });
};

rowsum = function(j) {
  var i, k, len, ref, res;
  res = 0;
  ref = range(n);
  for (k = 0, len = ref.length; k < len; k++) {
    i = ref[k];
    res += nr(i, j);
  }
  return res;
};

Button = class Button {
  constructor(prompt, x1, y1, click) {
    this.prompt = prompt;
    this.x = x1;
    this.y = y1;
    this.click = click;
    this.w = 50;
    this.h = 20;
  }

  draw() {
    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    return text(this.prompt, this.x, this.y);
  }

  inside(x, y) {
    return (this.x - this.w / 2 < x && x < this.x + this.w / 2) && (this.y - this.h / 2 < y && y < this.y + this.h / 2);
  }

};

Selector = class Selector {
  constructor(prompt, value, x1, y1, min1, max, delta1 = 1) {
    var d, self;
    this.prompt = prompt;
    this.value = value;
    this.x = x1;
    this.y = y1;
    this.min = min1;
    this.max = max;
    this.delta = delta1;
    self = this;
    this.buttons = [];
    d = 60;
    this.buttons.push(new Button('-1000', this.x - 4 * d, this.y, () => {
      return this.adjust(-1000);
    }));
    this.buttons.push(new Button('-100', this.x - 3 * d, this.y, () => {
      return this.adjust(-100);
    }));
    this.buttons.push(new Button('-10', this.x - 2 * d, this.y, () => {
      return this.adjust(-10);
    }));
    this.buttons.push(new Button(`-${this.delta}`, this.x - d, this.y, () => {
      return this.adjust(-this.delta);
    }));
    this.buttons.push(new Button(`+${this.delta}`, this.x + d, this.y, () => {
      return this.adjust(this.delta);
    }));
    this.buttons.push(new Button('+10', this.x + 2 * d, this.y, () => {
      return this.adjust(10);
    }));
    this.buttons.push(new Button('+100', this.x + 3 * d, this.y, () => {
      return this.adjust(100);
    }));
    this.buttons.push(new Button('+1000', this.x + 4 * d, this.y, () => {
      return this.adjust(1000);
    }));
  }

  adjust(delta) {
    var ref;
    if ((this.min <= (ref = this.value + delta) && ref <= this.max)) {
      return this.value += delta;
    }
  }

  draw() {
    var button, k, len, ref;
    ref = this.buttons;
    for (k = 0, len = ref.length; k < len; k++) {
      button = ref[k];
      button.draw();
    }
    push();
    if (this.prompt === 'i') {
      fill('red');
    }
    if (this.prompt === 'j') {
      fill(0, 128 + 64, 0);
    }
    text(`${this.prompt}:${this.value}`, this.x, this.y);
    return pop();
  }

};

setup = function() {
  createCanvas(600, 350);
  makeANCHORS(5);
  textAlign(CENTER, CENTER);
  nSel = new Selector('n', 3, width / 2, 30, 3, 100000, 2);
  iSel = new Selector('i', 0, width / 2, 60, 0, 100000 - 5, 1);
  return jSel = new Selector('j', 0, width / 2, 90, 0, 100000 - 5, 1);
};

draw = function() {
  var i, j, k, l, len, len1, len2, len3, len4, m, o, p, q, ref, ref1, ref2, ref3, ref4, selector, xOff;
  background(128);
  iSel.value = min(iSel.value, nSel.value - 5);
  jSel.value = min(jSel.value, nSel.value - 5);
  if (iSel.value < 0) {
    iSel.value = 0;
  }
  if (jSel.value < 0) {
    jSel.value = 0;
  }
  iSel.max = nSel.value - 5;
  jSel.max = nSel.value - 5;
  ref = [nSel, iSel, jSel];
  for (k = 0, len = ref.length; k < len; k++) {
    selector = ref[k];
    selector.draw();
  }
  makeANCHORS(nSel.value);
  m = min(5, n);
  xOff = width / 2 - 200;
  if (m === 3) {
    xOff = width / 2 - 100;
  }
  if (m === 4) {
    xOff = width / 2 - 150;
  }
  push();
  textSize(16);
  ref1 = range(m);
  for (l = 0, len1 = ref1.length; l < len1; l++) {
    i = ref1[l];
    ref2 = range(m);
    for (o = 0, len2 = ref2.length; o < len2; o++) {
      j = ref2[o];
      text(nr(iSel.value + i, jSel.value + j), xOff + 100 * i, 150 + 40 * j);
    }
  }
  push();
  fill('red');
  ref3 = range(m);
  for (p = 0, len3 = ref3.length; p < len3; p++) {
    i = ref3[p];
    text(iSel.value + i, xOff + 100 * i, 120);
  }
  fill(0, 128 + 64, 0);
  ref4 = range(m);
  for (q = 0, len4 = ref4.length; q < len4; q++) {
    j = ref4[q];
    text(jSel.value + j, 30, 150 + 40 * j);
  }
  pop();
  pop();
  text(`cells:${n * n}`, width * 0.33, height - 15);
  return text(`row/col/diag sum:${n * (1 + Math.floor(n * n / 2))}`, width * 0.67, height - 15);
};

mousePressed = function() {
  var button, k, len, ref, results, selector;
  ref = [nSel, iSel, jSel];
  results = [];
  for (k = 0, len = ref.length; k < len; k++) {
    selector = ref[k];
    results.push((function() {
      var l, len1, ref1, results1;
      ref1 = selector.buttons;
      results1 = [];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        button = ref1[l];
        if (button.inside(mouseX, mouseY)) {
          results1.push(button.click());
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    })());
  }
  return results;
};

//### Tests ####
start = new Date();

ass([1, 0], _.minBy([[1, 0], [0, 1]], function([a, b]) {
  return b;
}));

ass(3, Math.floor(7 / 2));

ass(5, manhattan(3, 5, 1, 2));

makeANCHORS(5);

ass(23, nr(0, 0));

ass(6, nr(1, 0));

ass(10, nr(0, 1));

ass(25, nr(2, 3));

ass(16, nr(4, 3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

makeANCHORS(7);

ass(5, x(2, 3));

ass(7, y(2, 3));

ass(22, even(0, 6));

ass(15, even(1, 7));

ass(46, nr(0, 0));

ass(15, nr(1, 0));

ass(21, nr(0, 1));

ass(7, nr(2, 3));

ass(4, nr(6, 6));

ass(48, nr(2, 5));

ass(43, nr(4, 3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(5));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(6));

makeANCHORS(9);

ass(77, nr(0, 0));

ass(28, nr(1, 0));

ass(36, nr(0, 1));

ass(18, nr(2, 3));

ass(23, nr(6, 6));

ass(8, nr(2, 5));

ass(1, nr(4, 3));

ass(369, n * (1 + Math.floor(n * n / 2)));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(5));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(6));

makeANCHORS(101);

ass(10151, nr(0, 0));

ass(4950, nr(1, 0));

ass(5050, nr(0, 1));

ass(4848, nr(2, 3));

ass(9545, nr(6, 6));

ass(4746, nr(2, 5));

ass(4647, nr(4, 3));

makeANCHORS(1001);

ass(1001501, nr(0, 0));

ass(499500, nr(1, 0));

ass(500500, nr(0, 1));

ass(498498, nr(2, 3));

ass(995495, nr(6, 6));

ass(497496, nr(2, 5));

ass(496497, nr(4, 3));

ass(501502001, n * (1 + Math.floor(n * n / 2)));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(5));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(6));

makeANCHORS(10001);

ass(100015001, nr(0, 0));

ass(49995000, nr(1, 0));

ass(50005000, nr(0, 1));

ass(49984998, nr(2, 3));

ass(99954995, nr(6, 6));

ass(49974996, nr(2, 5));

ass(49964997, nr(4, 3));

ass(500150020001, n * (1 + Math.floor(n * n / 2))); // row sum

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(5));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(6));

makeANCHORS(100001);

ass(10000200001, n * n); // cell count

ass(10000150001, nr(0, 0)); // cell

ass(4999950000, nr(1, 0));

ass(5000050000, nr(0, 1));

ass(4999849998, nr(2, 3));

ass(9999549995, nr(6, 6));

ass(4999749996, nr(2, 5));

ass(4999649997, nr(4, 3));

ass(500015000200001, n * (1 + Math.floor(n * n / 2))); // row sum, col sum, diag sum

ass(n * (1 + Math.floor(n * n / 2)), rowsum(0)); // row sum

ass(n * (1 + Math.floor(n * n / 2)), rowsum(1));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(2));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(3));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(4));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(5));

ass(n * (1 + Math.floor(n * n / 2)), rowsum(6));

console.log(new Date() - start);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsV0FBQSxFQUFBLFNBQUEsRUFBQSxZQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUE7O0FBQUEsR0FBQSxHQUFNLFFBQUEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFBO0VBQVMsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsQ0FBdEIsRUFBd0IsQ0FBeEIsQ0FBSDtXQUFrQyxPQUFPLENBQUMsR0FBUixDQUFZLENBQVosRUFBYyxDQUFkLEVBQWxDOztBQUFUOztBQUNOLEtBQUEsR0FBUSxDQUFDLENBQUM7O0FBRVYsQ0FBQSxHQUFJOztBQUNKLE9BQUEsR0FBVTs7QUFDVixJQUFBLEdBQU87O0FBQ1AsSUFBQSxHQUFPOztBQUNQLElBQUEsR0FBTzs7QUFFUCxXQUFBLEdBQWMsUUFBQSxDQUFDLEVBQUQsQ0FBQTtFQUNiLENBQUEsR0FBSTtTQUNKLE9BQUEsR0FBVSxDQUFDLENBQUMsWUFBQyxJQUFHLEVBQUosRUFBTSxDQUFOLENBQUQsRUFBVSxDQUFDLENBQUQsRUFBRyxDQUFILENBQVYsQ0FBRCxFQUFrQixDQUFDLENBQUMsQ0FBRCxhQUFHLElBQUcsRUFBTixDQUFELEVBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFWLENBQWxCLEVBQW1DLENBQUMsQ0FBQyxDQUFBLEdBQUUsQ0FBSCxhQUFLLElBQUcsRUFBUixDQUFELEVBQVksQ0FBQyxDQUFDLENBQUYsRUFBSSxDQUFKLENB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Q0EsR0FBQSxDQUFJLENBQUosRUFBTyxFQUFBLENBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBUDs7QUFDQSxHQUFBLENBQUksR0FBSixFQUFRLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQVY7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBRUEsV0FBQSxDQUFZLEdBQVo7O0FBQ0EsR0FBQSxDQUFJLEtBQUosRUFBVyxFQUFBLENBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBWDs7QUFDQSxHQUFBLENBQUksSUFBSixFQUFVLEVBQUEsQ0FBRyxDQUFILEVB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a0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBQ0EsR0FBQSxDQUFJLENBQUEsR0FBRSxDQUFDLENBQUEsY0FBRSxDQUFBLEdBQUUsSUFBRyxFQUFSLENBQU4sRUFBa0IsTUFBQSxDQUFPLENBQVAsQ0FBbEI7O0FBRUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLElBQUosQ0FBQSxDQUFBLEdBQWEsS0FBekIiLCJzb3VyY2VzQ29udGVudCI6WyJhc3MgPSAoYSxiKSAtPiBpZiBjaGFpLmFzc2VydC5kZWVwRXF1YWwgYSxiIHRoZW4gY29uc29sZS5sb2cgYSxiXHJcbnJhbmdlID0gXy5yYW5nZVxyXG5cclxubiA9IG51bGxcclxuQU5DSE9SUyA9IG51bGxcclxublNlbCA9IG51bGxcclxuaVNlbCA9IG51bGxcclxualNlbCA9IG51bGxcclxuXHJcbm1ha2VBTkNIT1JTID0gKG4wKSAtPiBcclxuXHRuID0gbjBcclxuXHRBTkNIT1JTID0gW1tbbi8vMiwwXSxbMCxuXV0sW1swLG4vLzJdLFtuLDBdXSxbW24tMSxuLy8yXSxbLW4sMF1dLFtbbi8vMixuLTFdLFswLC1uXV1dXHJcblxyXG5uciA9IChpLGopIC0+IGlmIChpK2opICUgMiA9PSAwIHRoZW4gZXZlbiBpLGogZWxzZSBvZGQgaSxqXHJcbmV2ZW4gPSAoaSxqKSAtPiB4KGksaikgLy8gMiArIDEgKyBuICogKHkoaSxqKSAvLyAyKVxyXG5vZGQgPSAoaSxqKSAtPiBbZGksZGpdID0gZGlkaihpLGopWzFdOyBldmVuIGkrZGksaitkalxyXG54ID0gKGksaikgLT4gaS1qK24tMVxyXG55ID0gKGksaikgLT4gMipuLTItaS1qXHJcbm1hbmhhdHRhbiA9IChhLGIsYyxkKSAtPiBNYXRoLmFicyhhLWMpICsgTWF0aC5hYnMoYi1kKVxyXG5kaWRqID0gKGksaikgLT4gXy5taW5CeSBBTkNIT1JTLCAoW1thLGJdLFtjLGRdXSkgLT4gbWFuaGF0dGFuIGEsYixpLGpcclxuXHJcbnJvd3N1bSA9IChqKSAtPiBcclxuXHRyZXMgPSAwXHJcblx0Zm9yIGkgaW4gcmFuZ2UgblxyXG5cdFx0cmVzICs9IG5yIGksalxyXG5cdHJlc1xyXG5cclxuY2xhc3MgQnV0dG9uXHJcblx0Y29uc3RydWN0b3IgOiAoQHByb21wdCxAeCxAeSxAY2xpY2spIC0+XHJcblx0XHRAdz01MFxyXG5cdFx0QGg9MjBcclxuXHRkcmF3IDogLT5cclxuXHRcdHJlY3QgQHgtQHcvMixAeS1AaC8yLEB3LEBoXHJcblx0XHR0ZXh0IEBwcm9tcHQsQHgsQHlcclxuXHRpbnNpZGUgOiAoeCx5KSAtPiBAeC1Ady8yIDwgeCA8IEB4K0B3LzIgYW5kIEB5LUBoLzIgPCB5IDwgQHkrQGgvMlxyXG5cclxuY2xhc3MgU2VsZWN0b3JcclxuXHRjb25zdHJ1Y3RvciA6IChAcHJvbXB0LEB2YWx1ZSxAeCxAeSxAbWluLEBtYXgsQGRlbHRhPTEpIC0+XHJcblx0XHRzZWxmID0gQFxyXG5cdFx0QGJ1dHRvbnMgPSBbXVxyXG5cdFx0ZCA9IDYwXHJcblx0XHRAYnV0dG9ucy5wdXNoIG5ldyBCdXR0b24gJy0xMDAwJyxAeC00KmQsQHksID0+IEBhZGp1c3QgLTEwMDBcclxuXHRcdEBidXR0b25zLnB1c2ggbmV3IEJ1dHRvbiAnLTEwMCcsQHgtMypkLEB5LCA9PiBAYWRqdXN0IC0xMDBcclxuXHRcdEBidXR0b25zLnB1c2ggbmV3IEJ1dHRvbiAnLTEwJyxAeC0yKmQsQHksID0+IEBhZGp1c3QgLTEwXHJcblx0XHRAYnV0dG9ucy5wdXNoIG5ldyBCdXR0b24gXCItI3tAZGVsdGF9XCIsQHgtZCxAeSwgPT4gQGFkanVzdCAtQGRlbHRhXHJcblx0XHRAYnV0dG9ucy5wdXNoIG5ldyBCdXR0b24gXCIrI3tAZGVsdGF9XCIsQHgrZCxAeSwgPT4gQGFkanVzdCBAZGVsdGFcclxuXHRcdEBidXR0b25zLnB1c2ggbmV3IEJ1dHRvbiAnKzEwJyxAeCsyKmQsQHksID0+IEBhZGp1c3QgMTBcclxuXHRcdEBidXR0b25zLnB1c2ggbmV3IEJ1dHRvbiAnKzEwMCcsQHgrMypkLEB5LCA9PiBAYWRqdXN0IDEwMFxyXG5cdFx0QGJ1dHRvbnMucHVzaCBuZXcgQnV0dG9uICcrMTAwMCcsQHgrNCpkLEB5LCA9PiBAYWRqdXN0IDEwMDBcclxuXHJcblx0YWRqdXN0IDogKGRlbHRhKSAtPiBpZiBAbWluIDw9IEB2YWx1ZSArIGRlbHRhIDw9IEBtYXggdGhlbiBAdmFsdWUgKz0gZGVsdGFcclxuXHRkcmF3IDogLT5cclxuXHRcdGZvciBidXR0b24gaW4gQGJ1dHRvbnNcclxuXHRcdFx0YnV0dG9uLmRyYXcoKVxyXG5cdFx0cHVzaCgpXHJcblx0XHRpZiBAcHJvbXB0PT0naScgdGhlbiBmaWxsICdyZWQnXHJcblx0XHRpZiBAcHJvbXB0PT0naicgdGhlbiBmaWxsIDAsMTI4KzY0LDBcclxuXHRcdHRleHQgXCIje0Bwcm9tcHR9OiN7QHZhbHVlfVwiLEB4LEB5XHJcblx0XHRwb3AoKVxyXG5cclxuc2V0dXAgPSAtPlxyXG5cdGNyZWF0ZUNhbnZhcyA2MDAsMzUwXHJcblx0bWFrZUFOQ0hPUlMgNVxyXG5cdHRleHRBbGlnbiBDRU5URVIsQ0VOVEVSXHJcblx0blNlbCA9IG5ldyBTZWxlY3RvciAnbicsMyx3aWR0aC8yLDMwLDMsMTAwMDAwLDJcclxuXHRpU2VsID0gbmV3IFNlbGVjdG9yICdpJywwLHdpZHRoLzIsNjAsMCwxMDAwMDAtNSwxXHJcblx0alNlbCA9IG5ldyBTZWxlY3RvciAnaicsMCx3aWR0aC8yLDkwLDAsMTAwMDAwLTUsMVxyXG5cclxuZHJhdyA9IC0+XHJcblx0YmFja2dyb3VuZCAxMjhcclxuXHJcblx0aVNlbC52YWx1ZSA9IG1pbiBpU2VsLnZhbHVlLCBuU2VsLnZhbHVlLTVcclxuXHRqU2VsLnZhbHVlID0gbWluIGpTZWwudmFsdWUsIG5TZWwudmFsdWUtNVxyXG5cdGlmIGlTZWwudmFsdWUgPCAwIHRoZW4gaVNlbC52YWx1ZSA9IDBcclxuXHRpZiBqU2VsLnZhbHVlIDwgMCB0aGVuIGpTZWwudmFsdWUgPSAwXHJcblx0aVNlbC5tYXggPSBuU2VsLnZhbHVlLTVcclxuXHRqU2VsLm1heCA9IG5TZWwudmFsdWUtNVxyXG5cclxuXHRmb3Igc2VsZWN0b3IgaW4gW25TZWwsaVNlbCxqU2VsXVxyXG5cdFx0c2VsZWN0b3IuZHJhdygpXHJcblxyXG5cdG1ha2VBTkNIT1JTIG5TZWwudmFsdWVcclxuXHJcblx0bSA9IG1pbiA1LG5cclxuXHR4T2ZmID0gd2lkdGgvMi0yMDBcclxuXHRpZiBtPT0zIHRoZW4geE9mZiA9IHdpZHRoLzItMTAwXHJcblx0aWYgbT09NCB0aGVuIHhPZmYgPSB3aWR0aC8yLTE1MFxyXG5cdHB1c2goKVxyXG5cdHRleHRTaXplIDE2XHJcblx0Zm9yIGkgaW4gcmFuZ2UgbVxyXG5cdFx0Zm9yIGogaW4gcmFuZ2UgbVxyXG5cdFx0XHR0ZXh0IG5yKGlTZWwudmFsdWUraSxqU2VsLnZhbHVlK2opLCB4T2ZmKzEwMCppLCAxNTArNDAqalxyXG5cdHB1c2goKVxyXG5cclxuXHRmaWxsICdyZWQnXHJcblx0Zm9yIGkgaW4gcmFuZ2UgbVxyXG5cdFx0dGV4dCBpU2VsLnZhbHVlK2ksIHhPZmYrMTAwKmksIDEyMFxyXG5cclxuXHRmaWxsIDAsMTI4KzY0LDBcclxuXHRmb3IgaiBpbiByYW5nZSBtXHJcblx0XHR0ZXh0IGpTZWwudmFsdWUraiwgMzAsIDE1MCs0MCpqXHJcblxyXG5cdHBvcCgpXHJcblx0cG9wKClcclxuXHRcclxuXHR0ZXh0IFwiY2VsbHM6I3tuKm59XCIsd2lkdGgqMC4zMyxoZWlnaHQtMTVcclxuXHR0ZXh0IFwicm93L2NvbC9kaWFnIHN1bToje24qKDErbipuLy8yKX1cIix3aWR0aCowLjY3LGhlaWdodC0xNVxyXG5cclxubW91c2VQcmVzc2VkID0gLT5cclxuXHRmb3Igc2VsZWN0b3IgaW4gW25TZWwsaVNlbCxqU2VsXVxyXG5cdFx0Zm9yIGJ1dHRvbiBpbiBzZWxlY3Rvci5idXR0b25zXHJcblx0XHRcdGlmIGJ1dHRvbi5pbnNpZGUobW91c2VYLG1vdXNlWSkgXHJcblx0XHRcdFx0YnV0dG9uLmNsaWNrKClcclxuXHJcbiMjIyMgVGVzdHMgIyMjI1xyXG5cclxuc3RhcnQgPSBuZXcgRGF0ZSgpXHJcblxyXG5hc3MgWzEsMF0sIF8ubWluQnkgW1sxLDBdLFswLDFdXSwgKFthLGJdKSAtPiBiXHJcbmFzcyAzLCA3Ly8yXHJcbmFzcyA1LCBtYW5oYXR0YW4gMyw1LDEsMlxyXG5cclxubWFrZUFOQ0hPUlMgNVxyXG5hc3MgMjMsIG5yIDAsMFxyXG5hc3MgNiwgbnIgMSwwXHJcbmFzcyAxMCwgbnIgMCwxXHJcbmFzcyAyNSwgbnIgMiwzXHJcbmFzcyAxNiwgbnIgNCwzXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAwXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAxXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAyXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAzXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA0XHJcblxyXG5tYWtlQU5DSE9SUyA3XHJcbmFzcyA1LCB4IDIsM1xyXG5hc3MgNywgeSAyLDNcclxuYXNzIDIyLCBldmVuIDAsNlxyXG5hc3MgMTUsIGV2ZW4gMSw3XHJcbmFzcyA0NiwgbnIgMCwwXHJcbmFzcyAxNSwgbnIgMSwwXHJcbmFzcyAyMSwgbnIgMCwxXHJcbmFzcyA3LCBuciAyLDNcclxuYXNzIDQsIG5yIDYsNlxyXG5hc3MgNDgsIG5yIDIsNVxyXG5hc3MgNDMsIG5yIDQsM1xyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gMFxyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gMVxyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gMlxyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gM1xyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gNFxyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gNVxyXG5hc3MgbiooMStuKm4vLzIpLCByb3dzdW0gNlxyXG5cclxubWFrZUFOQ0hPUlMgOVxyXG5hc3MgNzcsIG5yIDAsMFxyXG5hc3MgMjgsIG5yIDEsMFxyXG5hc3MgMzYsIG5yIDAsMVxyXG5hc3MgMTgsIG5yIDIsM1xyXG5hc3MgMjMsIG5yIDYsNlxyXG5hc3MgOCwgbnIgMiw1XHJcbmFzcyAxLCBuciA0LDNcclxuYXNzIDM2OSxuKigxK24qbi8vMilcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDBcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDFcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDJcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDNcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDRcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDVcclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDZcclxuXHJcbm1ha2VBTkNIT1JTIDEwMVxyXG5hc3MgMTAxNTEsIG5yIDAsMFxyXG5hc3MgNDk1MCwgbnIgMSwwXHJcbmFzcyA1MDUwLCBuciAwLDFcclxuYXNzIDQ4NDgsIG5yIDIsM1xyXG5hc3MgOTU0NSwgbnIgNiw2XHJcbmFzcyA0NzQ2LCBuciAyLDVcclxuYXNzIDQ2NDcsIG5yIDQsM1xyXG5cclxubWFrZUFOQ0hPUlMgMTAwMVxyXG5hc3MgMTAwMTUwMSwgbnIgMCwwXHJcbmFzcyA0OTk1MDAsIG5yIDEsMFxyXG5hc3MgNTAwNTAwLCBuciAwLDFcclxuYXNzIDQ5ODQ5OCwgbnIgMiwzXHJcbmFzcyA5OTU0OTUsIG5yIDYsNlxyXG5hc3MgNDk3NDk2LCBuciAyLDVcclxuYXNzIDQ5NjQ5NywgbnIgNCwzXHJcbmFzcyA1MDE1MDIwMDEsbiooMStuKm4vLzIpXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAwXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAxXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAyXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAzXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA0XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA1XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA2XHJcblxyXG5tYWtlQU5DSE9SUyAxMDAwMVxyXG5hc3MgMTAwMDE1MDAxLCBuciAwLDBcclxuYXNzIDQ5OTk1MDAwLCBuciAxLDBcclxuYXNzIDUwMDA1MDAwLCBuciAwLDFcclxuYXNzIDQ5OTg0OTk4LCBuciAyLDNcclxuYXNzIDk5OTU0OTk1LCBuciA2LDZcclxuYXNzIDQ5OTc0OTk2LCBuciAyLDVcclxuYXNzIDQ5OTY0OTk3LCBuciA0LDNcclxuYXNzIDUwMDE1MDAyMDAwMSxuKigxK24qbi8vMikgIyByb3cgc3VtXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAwXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAxXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAyXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAzXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA0XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA1XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA2XHJcblxyXG5tYWtlQU5DSE9SUyAxMDAwMDFcclxuYXNzIDEwMDAwMjAwMDAxLG4qbiAjIGNlbGwgY291bnRcclxuYXNzIDEwMDAwMTUwMDAxLCBuciAwLDAgIyBjZWxsXHJcbmFzcyA0OTk5OTUwMDAwLCBuciAxLDBcclxuYXNzIDUwMDAwNTAwMDAsIG5yIDAsMVxyXG5hc3MgNDk5OTg0OTk5OCwgbnIgMiwzXHJcbmFzcyA5OTk5NTQ5OTk1LCBuciA2LDZcclxuYXNzIDQ5OTk3NDk5OTYsIG5yIDIsNVxyXG5hc3MgNDk5OTY0OTk5NywgbnIgNCwzXHJcbmFzcyA1MDAwMTUwMDAyMDAwMDEsbiooMStuKm4vLzIpICMgcm93IHN1bSwgY29sIHN1bSwgZGlhZyBzdW1cclxuYXNzIG4qKDErbipuLy8yKSwgcm93c3VtIDAgIyByb3cgc3VtXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAxXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAyXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSAzXHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA0XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA1XHJcbmFzcyBuKigxK24qbi8vMiksIHJvd3N1bSA2XHJcblxyXG5jb25zb2xlLmxvZyBuZXcgRGF0ZSgpIC0gc3RhcnQiXX0=
//# sourceURL=c:\github\2021\024-MagicSquares\coffee\sketch.coffee