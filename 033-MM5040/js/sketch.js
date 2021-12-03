// Generated by CoffeeScript 2.5.1
var CANDS, M, N, SYMBOLS, candidates, cands, command, connect, crap, dialogues, doit, drawTable, errors, facit, guess, handleGuess, handler, headers, historyx, init, interpolate, makeAnswer, menu1, menu2, mousePressed, mouseReleased, newGame, pack, reduce, released, setup, showDialogue, touchStarted, ts, xdraw,
  indexOf = [].indexOf;

SYMBOLS = '0123456789abcdef';

M = 4;

N = 10;

CANDS = 0;

command = "";

facit = "";

guess = "";

cands = null;

errors = [];

headers = [];

historyx = [];

ts = 20;

dialogues = [];

released = true;

crap = (parent, type) => {
  return parent.appendChild(document.createElement(type));
};

connect = (button, handler) => {
  return button.onclick = button.ontouchend = handler;
};

pack = (digits) => {
  return digits.join("");
};

init = () => {
  return _(SYMBOLS.substring(0, N)).permutations(M).map((v) => {
    return _.join(v, '');
  }).value();
};

candidates = (m, n) => {
  return _.reduce(range(n, n - m, -1), (a, b) => {
    return a * b;
  });
};

assert(5040, candidates(4, 10));

assert(11880, candidates(4, 12));

assert(2162160, candidates(6, 14));

assert(518918400, candidates(8, 16));

assert(2432902008176640000, candidates(20, 20));

newGame = () => {
  historyx = [];
  guess = "";
  command = "";
  facit = _.shuffle(SYMBOLS.substring(0, N));
  facit = pack(facit.slice(0, M));
  cands = null;
  CANDS = candidates(M, N);
  if (candidates(M, N) <= 1000000) {
    return cands = init();
  }
};

makeAnswer = (f, g) => { // facit,guess
  var i, j, l, len, len1, m, o, ref, ref1, res;
  m = f.length;
  res = [];
  ref = _.range(m);
  for (l = 0, len = ref.length; l < len; l++) {
    i = ref[l];
    ref1 = _.range(m);
    for (o = 0, len1 = ref1.length; o < len1; o++) {
      j = ref1[o];
      if (f[i] === g[j]) {
        res.push(SYMBOLS[Math.abs(i - j)]);
      }
    }
  }
  res.sort();
  return pack(res);
};

assert("", makeAnswer("1234", "5678"));

assert("0", makeAnswer("1234", "1678"));

assert("00", makeAnswer("1234", "1278"));

assert("000", makeAnswer("1234", "1235"));

assert("0000", makeAnswer("1234", "1234"));

assert("0123", makeAnswer("1234", "3241"));

assert("1133", makeAnswer("1234", "4321"));

assert("2222", makeAnswer("1234", "3412"));

assert("33", makeAnswer("1234", "4561"));

reduce = (cands, guess) => {
  var answer1, answer2, cand, l, len, res;
  if (cands === null) {
    return null;
  }
  res = [];
  answer1 = makeAnswer(facit, guess);
  for (l = 0, len = cands.length; l < len; l++) {
    cand = cands[l];
    answer2 = makeAnswer(cand, guess);
    if (answer1 === answer2) {
      res.push(cand);
    }
  }
  return res;
};

handleGuess = (guess) => {
  var answer;
  answer = makeAnswer(facit, guess);
  cands = reduce(cands, guess);
  historyx.push([guess, answer, cands]);
  if (answer === '0000') {
    historyx.push([`Solved in ${historyx.length} guesses!`, "", []]);
  }
  return command = '';
};

handler = () => {
  return handleGuess(command);
};

setup = () => {
  createCanvas(600, 800);
  angleMode(DEGREES);
  newGame();
  return xdraw();
};

interpolate = (x0, y0, x1, y1, x) => {
  var dx, dy, k, m;
  dy = y1 - y0;
  dx = x1 - x0;
  k = dy / dx;
  m = y0 - k * x0;
  return k * x + m;
};

xdraw = function() {
  var x0, x1, y0, y1;
  background(128);
  noStroke();
  fill(0);
  x0 = width / 2 / 1;
  x1 = width / 2 / 16;
  y0 = 60;
  y1 = 30;
  ts = interpolate(x0, y0, x1, y1, width / 2 / M);
  textSize(ts);
  textAlign(LEFT, TOP);
  text(command, 5, 5);
  textAlign(RIGHT, TOP);
  fill(64 + 32);
  text(CANDS, width - 5, 5);
  textAlign(LEFT, BOTTOM);
  text(`${M} of ${N}`, 5, height - 5);
  drawTable();
  return showDialogue();
};

//text dialogues.length,width/2,height-50
drawTable = () => {
  var a, b, c, h, i, l, len, results, y0;
  y0 = 100;
  results = [];
  for (i = l = 0, len = historyx.length; l < len; i = ++l) {
    h = historyx[i];
    [a, b, c] = h;
    textAlign(LEFT);
    fill(0);
    text(a, 5, 5 + (i + 2) * ts);
    if (c) {
      textAlign(CENTER);
      fill(255, 255, 0);
      text(b, 0.5 * width, 5 + (i + 2) * ts);
      textAlign(RIGHT);
      fill(64 + 32);
      results.push(text(c.length, width - 5, 5 + (i + 2) * ts));
    } else {
      textAlign(RIGHT);
      fill(255, 255, 0);
      results.push(text(b, width - 5, 5 + (i + 2) * ts));
    }
  }
  return results;
};

showDialogue = function() {
  if (dialogues.length > 0) {
    return (_.last(dialogues)).show();
  }
};

menu1 = function() { // Main Menu
  var bs, button, buttons, ch, dialogue, l, len, n, ref;
  dialogue = new Dialogue();
  ref = SYMBOLS.substring(0, N);
  for (l = 0, len = ref.length; l < len; l++) {
    ch = ref[l];
    (function(ch) {
      return dialogue.add(ch, () => {
        var button, len1, o, ref1, ref2, results;
        dialogue.disable(ch);
        command += ch;
        ref1 = dialogue.buttons;
        results = [];
        for (o = 0, len1 = ref1.length; o < len1; o++) {
          button = ref1[o];
          if (button.title === 'back') {
            results.push(button.active = command.length > 0);
          } else if (button.title === 'ok') {
            results.push(button.active = command.length === M);
          } else {
            results.push(button.active = command.length < M && (ref2 = button.title, indexOf.call(command, ref2) < 0));
          }
        }
        return results;
      });
    })(ch);
  }
  dialogue.add('ok', () => {
    handler();
    return dialogues.pop();
  });
  dialogue.add('back', () => {
    var button, len1, o, ref1, ref2, results;
    command = command.substring(0, command.length - 1);
    ref1 = dialogue.buttons;
    results = [];
    for (o = 0, len1 = ref1.length; o < len1; o++) {
      button = ref1[o];
      if (button.title === 'back') {
        results.push(button.active = command.length > 0);
      } else if (button.title === 'ok') {
        results.push(button.active = command.length === M);
      } else if (ref2 = button.title, indexOf.call(command, ref2) < 0) {
        results.push(button.active = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
  dialogue.disable('back');
  buttons = dialogue.buttons;
  n = buttons.length;
  bs = buttons.splice(n - 2, 1);
  buttons.splice(1, 0, bs[0]);
  dialogue.clock('005', true);
  dialogue.add("new", () => {
    return menu2();
  });
  button = _.last(dialogue.buttons);
  button.x = width / 2 - 50;
  button.y = height / 2 - 50;
  button.r = 50;
  dialogue.disable('ok');
  return dialogue.textSize *= 1.5;
};

menu2 = function() { // new Game
  var dialogue;
  dialogue = new Dialogue();
  dialogue.add('new', () => {
    newGame();
    dialogues.pop();
    dialogues.pop();
    menu1();
    return xdraw();
  });
  dialogue.add('-2', () => {
    if (N > 2 && N > M) {
      return N -= 2;
    }
  });
  dialogue.add('+2', () => {
    if (N < SYMBOLS.length) {
      return N += 2;
    }
  });
  dialogue.add('+1', () => {
    if (M < N) {
      return M++;
    }
  });
  dialogue.add('-1', () => {
    if (M > 1) {
      return M--;
    }
  });
  return dialogue.clock(' ', true);
};

//#####
doit = function() {
  var dialogue;
  if (dialogues.length > 0) {
    dialogue = _.last(dialogues);
    return dialogue.execute(mouseX, mouseY);
  } else {
    return menu1();
  }
};

mouseReleased = function() { // to make Android work 
  released = true;
  return false;
};

touchStarted = function() {
  doit();
  return xdraw();
};

mousePressed = function() {
  if (!released) { // to make Android work 
    return;
  }
  released = false;
  return touchStarted();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUEsRUFBQSxFQUFBLEtBQUE7RUFBQTs7QUFBQSxPQUFBLEdBQVU7O0FBQ1YsQ0FBQSxHQUFJOztBQUNKLENBQUEsR0FBSTs7QUFDSixLQUFBLEdBQVE7O0FBQ1IsT0FBQSxHQUFVOztBQUNWLEtBQUEsR0FBUTs7QUFDUixLQUFBLEdBQVE7O0FBQ1IsS0FBQSxHQUFROztBQUNSLE1BQUEsR0FBUzs7QUFDVCxPQUFBLEdBQVU7O0FBQ1YsUUFBQSxHQUFXOztBQUNYLEVBQUEsR0FBSzs7QUFFTCxTQUFBLEdBQVk7O0FBQ1osUUFBQSxHQUFXOztBQUVYLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxJQUFULENBQUEsR0FBQTtTQUFrQixNQUFNLENBQUMsV0FBUCxDQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUFuQjtBQUFsQjs7QUFDUCxPQUFBLEdBQVUsQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUFBLEdBQUE7U0FBcUIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLFVBQVAsR0FBb0I7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IDEwXHJcbkNBTkRTID0gMFxyXG5jb21tYW5kID0gXCJcIlxyXG5mYWNpdCA9IFwiXCJcclxuZ3Vlc3MgPSBcIlwiXHJcbmNhbmRzID0gbnVsbFxyXG5lcnJvcnMgPSBbXVxyXG5oZWFkZXJzID0gW11cclxuaGlzdG9yeXggPSBbXVxyXG50cyA9IDIwXHJcblxyXG5kaWFsb2d1ZXMgPSBbXVxyXG5yZWxlYXNlZCA9IHRydWVcclxuXHJcbmNyYXAgPSAocGFyZW50LCB0eXBlKSA9PiBwYXJlbnQuYXBwZW5kQ2hpbGQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCB0eXBlXHJcbmNvbm5lY3QgPSAoYnV0dG9uLCBoYW5kbGVyKSA9PiBidXR0b24ub25jbGljayA9IGJ1dHRvbi5vbnRvdWNoZW5kID0gaGFuZGxlclxyXG5wYWNrID0gKGRpZ2l0cykgPT4gZGlnaXRzLmpvaW4gXCJcIlxyXG5pbml0ID0gPT4gXyhTWU1CT0xTLnN1YnN0cmluZygwLE4pKS5wZXJtdXRhdGlvbnMoTSkubWFwKCh2KSA9PiBfLmpvaW4odiwgJycpKS52YWx1ZSgpXHJcbmNhbmRpZGF0ZXMgPSAobSxuKSA9PiBfLnJlZHVjZSByYW5nZShuLG4tbSwtMSksIChhLGIpID0+IGEqYlxyXG5hc3NlcnQgNTA0MCwgY2FuZGlkYXRlcyA0LDEwXHJcbmFzc2VydCAxMTg4MCwgY2FuZGlkYXRlcyA0LDEyXHJcbmFzc2VydCAyMTYyMTYwLCBjYW5kaWRhdGVzIDYsMTRcclxuYXNzZXJ0IDUxODkxODQwMCwgY2FuZGlkYXRlcyA4LDE2XHJcbmFzc2VydCAyNDMyOTAyMDA4MTc2NjQwMDAwLCBjYW5kaWRhdGVzIDIwLDIwXHJcblxyXG5uZXdHYW1lID0gPT5cclxuXHRoaXN0b3J5eCA9IFtdXHJcblx0Z3Vlc3MgPSBcIlwiXHJcblx0Y29tbWFuZCA9IFwiXCJcclxuXHRmYWNpdCA9IF8uc2h1ZmZsZSBTWU1CT0xTLnN1YnN0cmluZyAwLE5cclxuXHRmYWNpdCA9IHBhY2sgZmFjaXQuc2xpY2UgMCxNXHJcblx0Y2FuZHMgPSBudWxsXHJcblx0Q0FORFMgPSBjYW5kaWRhdGVzKE0sTilcclxuXHRpZiBjYW5kaWRhdGVzKE0sTikgPD0gMTAwMDAwMCB0aGVuIGNhbmRzID0gaW5pdCgpXHJcblxyXG5tYWtlQW5zd2VyID0gKGYsZykgPT4gIyBmYWNpdCxndWVzc1xyXG5cdG0gPSBmLmxlbmd0aFxyXG5cdHJlcyA9IFtdXHJcblx0Zm9yIGkgaW4gXy5yYW5nZSBtXHJcblx0XHRmb3IgaiBpbiBfLnJhbmdlIG1cclxuXHRcdFx0aWYgZltpXSA9PSBnW2pdXHJcblx0XHRcdFx0cmVzLnB1c2ggU1lNQk9MU1tNYXRoLmFicyBpLWpdXHJcblx0cmVzLnNvcnQoKVxyXG5cdHBhY2sgcmVzXHJcbmFzc2VydCBcIlwiICAgICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI1Njc4XCJcclxuYXNzZXJ0IFwiMFwiICAgICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjE2NzhcIlxyXG5hc3NlcnQgXCIwMFwiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMTI3OFwiXHJcbmFzc2VydCBcIjAwMFwiICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCIxMjM1XCJcclxuYXNzZXJ0IFwiMDAwMFwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjEyMzRcIlxyXG5hc3NlcnQgXCIwMTIzXCIgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMzI0MVwiXHJcbmFzc2VydCBcIjExMzNcIiAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI0MzIxXCJcclxuYXNzZXJ0IFwiMjIyMlwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjM0MTJcIlxyXG5hc3NlcnQgXCIzM1wiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiNDU2MVwiXHJcblxyXG5yZWR1Y2UgPSAoY2FuZHMsZ3Vlc3MpID0+XHJcblx0aWYgY2FuZHMgPT0gbnVsbCB0aGVuIHJldHVybiBudWxsXHJcblx0cmVzID0gW11cclxuXHRhbnN3ZXIxID0gbWFrZUFuc3dlciBmYWNpdCxndWVzc1xyXG5cdGZvciBjYW5kIGluIGNhbmRzXHJcblx0XHRhbnN3ZXIyID0gbWFrZUFuc3dlciBjYW5kLCBndWVzc1xyXG5cdFx0aWYgYW5zd2VyMSA9PSBhbnN3ZXIyXHJcblx0XHRcdHJlcy5wdXNoIGNhbmRcclxuXHRyZXNcclxuXHJcbmhhbmRsZUd1ZXNzID0gKGd1ZXNzKSA9PiBcclxuXHRhbnN3ZXIgPSBtYWtlQW5zd2VyIGZhY2l0LGd1ZXNzXHJcblx0Y2FuZHMgPSByZWR1Y2UgY2FuZHMsZ3Vlc3NcclxuXHRoaXN0b3J5eC5wdXNoIFtndWVzcyxhbnN3ZXIsY2FuZHNdXHJcblx0aWYgYW5zd2VyID09ICcwMDAwJyB0aGVuIGhpc3Rvcnl4LnB1c2ggW1wiU29sdmVkIGluICN7aGlzdG9yeXgubGVuZ3RofSBndWVzc2VzIVwiLFwiXCIsW11dXHJcblx0Y29tbWFuZCA9ICcnXHJcbmhhbmRsZXIgPSA9PiBoYW5kbGVHdWVzcyBjb21tYW5kXHJcblxyXG5zZXR1cCA9ID0+XHJcblx0Y3JlYXRlQ2FudmFzIDYwMCw4MDBcclxuXHRhbmdsZU1vZGUgREVHUkVFU1xyXG5cdG5ld0dhbWUoKVxyXG5cdHhkcmF3KClcclxuXHJcbmludGVycG9sYXRlID0gKHgwLHkwLHgxLHkxLHgpID0+XHJcblx0ZHkgPSB5MS15MFxyXG5cdGR4ID0geDEteDBcclxuXHRrID0gZHkvZHhcclxuXHRtID0geTAtayp4MFxyXG5cdGsqeCttXHJcblxyXG54ZHJhdyA9IC0+XHJcblx0YmFja2dyb3VuZCAxMjhcclxuXHRub1N0cm9rZSgpXHJcblx0ZmlsbCAwXHJcblxyXG5cdHgwID0gd2lkdGgvMi8xXHJcblx0eDEgPSB3aWR0aC8yLzE2XHJcblx0eTAgPSA2MFxyXG5cdHkxID0gMzBcclxuXHR0cyA9IGludGVycG9sYXRlIHgwLHkwLHgxLHkxLHdpZHRoLzIvTVxyXG5cdHRleHRTaXplIHRzXHJcblxyXG5cdHRleHRBbGlnbiBMRUZULFRPUFxyXG5cdHRleHQgY29tbWFuZCw1LDVcclxuXHJcblx0dGV4dEFsaWduIFJJR0hULFRPUFxyXG5cdGZpbGwgNjQrMzJcclxuXHR0ZXh0IENBTkRTLHdpZHRoLTUsNVxyXG5cclxuXHR0ZXh0QWxpZ24gTEVGVCxCT1RUT01cclxuXHR0ZXh0IFwiI3tNfSBvZiAje059XCIsIDUsaGVpZ2h0LTVcclxuXHJcblx0ZHJhd1RhYmxlKClcclxuXHRzaG93RGlhbG9ndWUoKVxyXG5cdCN0ZXh0IGRpYWxvZ3Vlcy5sZW5ndGgsd2lkdGgvMixoZWlnaHQtNTBcclxuXHJcbmRyYXdUYWJsZSA9ID0+XHJcblx0eTAgPSAxMDBcclxuXHRmb3IgaCxpIGluIGhpc3Rvcnl4XHJcblx0XHRbYSxiLGNdID0gaFxyXG5cdFx0XHJcblx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0ZmlsbCAwXHJcblx0XHR0ZXh0IGEsNSw1KyhpKzIpKnRzXHJcblxyXG5cdFx0aWYgY1xyXG5cdFx0XHR0ZXh0QWxpZ24gQ0VOVEVSXHJcblx0XHRcdGZpbGwgMjU1LDI1NSwwXHJcblx0XHRcdHRleHQgYiwwLjUqd2lkdGgsNSsoaSsyKSp0c1xyXG5cclxuXHRcdFx0dGV4dEFsaWduIFJJR0hUXHJcblx0XHRcdGZpbGwgNjQrMzJcclxuXHRcdFx0dGV4dCBjLmxlbmd0aCx3aWR0aC01LDUrKGkrMikqdHNcclxuXHRcdGVsc2VcclxuXHRcdFx0dGV4dEFsaWduIFJJR0hUXHJcblx0XHRcdGZpbGwgMjU1LDI1NSwwXHJcblx0XHRcdHRleHQgYix3aWR0aC01LDUrKGkrMikqdHNcclxuXHJcbnNob3dEaWFsb2d1ZSA9IC0+IGlmIGRpYWxvZ3Vlcy5sZW5ndGggPiAwIHRoZW4gKF8ubGFzdCBkaWFsb2d1ZXMpLnNob3coKVxyXG5cclxubWVudTEgPSAtPiAjIE1haW4gTWVudVxyXG5cdGRpYWxvZ3VlID0gbmV3IERpYWxvZ3VlKClcclxuXHRmb3IgY2ggaW4gU1lNQk9MUy5zdWJzdHJpbmcgMCxOXHJcblx0XHRkbyAoY2gpIC0+IGRpYWxvZ3VlLmFkZCBjaCwgPT5cclxuXHRcdFx0ZGlhbG9ndWUuZGlzYWJsZSBjaFxyXG5cdFx0XHRjb21tYW5kICs9IGNoXHJcblx0XHRcdGZvciBidXR0b24gaW4gZGlhbG9ndWUuYnV0dG9uc1xyXG5cdFx0XHRcdGlmIGJ1dHRvbi50aXRsZSA9PSAnYmFjaycgdGhlbiBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPiAwXHJcblx0XHRcdFx0ZWxzZSBpZiBidXR0b24udGl0bGUgPT0gJ29rJyB0aGVuIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA9PSBNXHJcblx0XHRcdFx0ZWxzZSBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPCBNIGFuZCBidXR0b24udGl0bGUgbm90IGluIGNvbW1hbmRcclxuXHJcblx0ZGlhbG9ndWUuYWRkICdvaycsID0+XHJcblx0XHRoYW5kbGVyKClcclxuXHRcdGRpYWxvZ3Vlcy5wb3AoKVxyXG5cclxuXHRkaWFsb2d1ZS5hZGQgJ2JhY2snLCA9PlxyXG5cdFx0Y29tbWFuZCA9IGNvbW1hbmQuc3Vic3RyaW5nIDAsY29tbWFuZC5sZW5ndGgtMVxyXG5cdFx0Zm9yIGJ1dHRvbiBpbiBkaWFsb2d1ZS5idXR0b25zXHJcblx0XHRcdGlmIGJ1dHRvbi50aXRsZSA9PSAnYmFjaycgdGhlbiBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPiAwXHJcblx0XHRcdGVsc2UgaWYgYnV0dG9uLnRpdGxlID09ICdvaycgdGhlbiBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPT0gTVxyXG5cdFx0XHRlbHNlIGlmIGJ1dHRvbi50aXRsZSBub3QgaW4gY29tbWFuZCB0aGVuIGJ1dHRvbi5hY3RpdmUgPSB0cnVlXHJcblx0ZGlhbG9ndWUuZGlzYWJsZSAnYmFjaydcclxuXHJcblx0YnV0dG9ucyA9IGRpYWxvZ3VlLmJ1dHRvbnNcclxuXHRuID0gYnV0dG9ucy5sZW5ndGhcclxuXHRicyA9IGJ1dHRvbnMuc3BsaWNlIG4tMiwgMVxyXG5cdGJ1dHRvbnMuc3BsaWNlIDEsMCxic1swXVxyXG5cclxuXHRkaWFsb2d1ZS5jbG9jayAnMDA1Jyx0cnVlXHJcblx0ZGlhbG9ndWUuYWRkIFwibmV3XCIsID0+IG1lbnUyKClcclxuXHRidXR0b24gPSBfLmxhc3QgZGlhbG9ndWUuYnV0dG9uc1xyXG5cdGJ1dHRvbi54ID0gd2lkdGgvMi01MFxyXG5cdGJ1dHRvbi55ID0gaGVpZ2h0LzItNTBcclxuXHRidXR0b24uciA9IDUwXHJcblxyXG5cdGRpYWxvZ3VlLmRpc2FibGUgJ29rJ1xyXG5cdGRpYWxvZ3VlLnRleHRTaXplICo9IDEuNVxyXG5cclxubWVudTIgPSAtPiAjIG5ldyBHYW1lXHJcblx0ZGlhbG9ndWUgPSBuZXcgRGlhbG9ndWUoKVxyXG5cdGRpYWxvZ3VlLmFkZCAnbmV3JywgPT5cclxuXHRcdG5ld0dhbWUoKVxyXG5cdFx0ZGlhbG9ndWVzLnBvcCgpXHJcblx0XHRkaWFsb2d1ZXMucG9wKClcclxuXHRcdG1lbnUxKClcclxuXHRcdHhkcmF3KClcclxuXHRkaWFsb2d1ZS5hZGQgJy0yJywgPT4gaWYgTiA+IDIgYW5kIE4gPiBNIHRoZW4gTi09MlxyXG5cdGRpYWxvZ3VlLmFkZCAnKzInLCA9PiBpZiBOIDwgU1lNQk9MUy5sZW5ndGggdGhlbiBOKz0yXHJcblx0ZGlhbG9ndWUuYWRkICcrMScsID0+IGlmIE0gPCBOIHRoZW4gTSsrXHJcblx0ZGlhbG9ndWUuYWRkICctMScsID0+IGlmIE0gPiAxIHRoZW4gTS0tXHJcblx0ZGlhbG9ndWUuY2xvY2sgJyAnLHRydWVcclxuXHJcbiMjIyMjI1xyXG5cclxuZG9pdCA9IC0+XHJcblx0aWYgZGlhbG9ndWVzLmxlbmd0aCA+IDBcclxuXHRcdGRpYWxvZ3VlID0gXy5sYXN0IGRpYWxvZ3Vlc1xyXG5cdFx0ZGlhbG9ndWUuZXhlY3V0ZSBtb3VzZVgsbW91c2VZXHJcblx0ZWxzZVxyXG5cdFx0bWVudTEoKVxyXG5cclxubW91c2VSZWxlYXNlZCA9IC0+ICMgdG8gbWFrZSBBbmRyb2lkIHdvcmsgXHJcblx0cmVsZWFzZWQgPSB0cnVlIFxyXG5cdGZhbHNlXHJcblxyXG50b3VjaFN0YXJ0ZWQgPSAtPiBcclxuXHRkb2l0KClcclxuXHR4ZHJhdygpXHJcblxyXG5tb3VzZVByZXNzZWQgPSAtPlxyXG5cdGlmICFyZWxlYXNlZCB0aGVuIHJldHVybiAjIHRvIG1ha2UgQW5kcm9pZCB3b3JrIFxyXG5cdHJlbGVhc2VkID0gZmFsc2VcclxuXHR0b3VjaFN0YXJ0ZWQoKVxyXG4iXX0=
//# sourceURL=c:\github\2021\033-MM5040\coffee\sketch.coffee