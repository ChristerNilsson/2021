// Generated by CoffeeScript 2.5.1
var CANDS, M, N, SYMBOLS, candidates, cands, command, connect, crap, dialogues, doit, drawTable, errors, facit, guess, handleGuess, handler, headers, historyx, init, makeAnswer, menu1, menu2, mousePressed, mouseReleased, newGame, pack, reduce, released, setup, showDialogue, touchStarted, xdraw,
  indexOf = [].indexOf;

SYMBOLS = '0123456789abcdefghij';

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

dialogues = [];

//backButton = null
//okButton = null
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
  var i, j, k, l, len, len1, m, ref, ref1, res;
  m = f.length;
  res = [];
  ref = _.range(m);
  for (k = 0, len = ref.length; k < len; k++) {
    i = ref[k];
    ref1 = _.range(m);
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      j = ref1[l];
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
  var answer1, answer2, cand, k, len, res;
  if (cands === null) {
    return null;
  }
  res = [];
  answer1 = makeAnswer(facit, guess);
  for (k = 0, len = cands.length; k < len; k++) {
    cand = cands[k];
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

xdraw = function() {
  noStroke();
  background(128);
  fill(0);
  textSize(40);
  textAlign(LEFT);
  text(`${M} of ${N}`, 10, height - 10);
  text(command, 50, 40);
  textAlign(RIGHT);
  fill(64 + 32);
  text(CANDS, width - 10, 50);
  textAlign(LEFT);
  drawTable();
  return showDialogue();
};

//text dialogues.length,width/2,height-50
drawTable = () => {
  var a, b, c, h, i, k, len, results, y0;
  y0 = 100;
  results = [];
  for (i = k = 0, len = historyx.length; k < len; i = ++k) {
    h = historyx[i];
    [a, b, c] = h;
    textAlign(LEFT);
    fill(0);
    text(a, 10, y0 + i * 40);
    textAlign(CENTER);
    fill(255, 255, 0);
    text(b, 0.5 * width, y0 + i * 40);
    if (c) {
      textAlign(RIGHT);
      fill(64 + 32);
      results.push(text(c.length, width - 10, y0 + i * 40));
    } else {
      results.push(void 0);
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
  var bs, button, buttons, ch, dialogue, k, len, n, ref;
  dialogue = new Dialogue();
  ref = SYMBOLS.substring(0, N);
  for (k = 0, len = ref.length; k < len; k++) {
    ch = ref[k];
    (function(ch) {
      return dialogue.add(ch, () => {
        var button, l, len1, ref1, ref2, results;
        dialogue.disable(ch);
        command += ch;
        ref1 = dialogue.buttons;
        results = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          button = ref1[l];
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
    var button, l, len1, ref1, ref2, results;
    command = command.substring(0, command.length - 1);
    ref1 = dialogue.buttons;
    results = [];
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      button = ref1[l];
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
  doit();
  return xdraw();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxZQUFBLEVBQUEsYUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxLQUFBO0VBQUE7O0FBQUEsT0FBQSxHQUFVOztBQUNWLENBQUEsR0FBSTs7QUFDSixDQUFBLEdBQUk7O0FBQ0osS0FBQSxHQUFROztBQUNSLE9BQUEsR0FBVTs7QUFDVixLQUFBLEdBQVE7O0FBQ1IsS0FBQSxHQUFROztBQUNSLEtBQUEsR0FBUTs7QUFDUixNQUFBLEdBQVM7O0FBQ1QsT0FBQSxHQUFVOztBQUNWLFFBQUEsR0FBVzs7QUFFWCxTQUFBLEdBQVksR0FaWjs7OztBQWVBLFFBQUEsR0FBVzs7QUFFWCxJQUFBLEdBQU8sQ0FBQyxNQUFELEVBQVMsSUFBVCxDQUFBLEdBQUE7U0FBa0IsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBbkI7QUFBbEI7O0FBQ1AsT0FBQSxHQUFVLENBQUMsTUFBRCxFQUFTLE9BQVQsQ0FBQSxHQUFBO1NBQXFCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CO0FBQTFEOztBQUNWLElBQUEsR0FBTyxDQUFDLE1B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QUFBO0VBQ2QsSUFBRyxDQUFDLFFBQUo7QUFBa0IsV0FBbEI7O0VBQ0EsUUFBQSxHQUFXO0VBQ1gsSUFBQSxDQUFBO1NBQ0EsS0FBQSxDQUFBO0FBSmMiLCJzb3VyY2VzQ29udGVudCI6WyJTWU1CT0xTID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqJ1xyXG5NID0gNFxyXG5OID0gMTBcclxuQ0FORFMgPSAwXHJcbmNvbW1hbmQgPSBcIlwiXHJcbmZhY2l0ID0gXCJcIlxyXG5ndWVzcyA9IFwiXCJcclxuY2FuZHMgPSBudWxsXHJcbmVycm9ycyA9IFtdXHJcbmhlYWRlcnMgPSBbXVxyXG5oaXN0b3J5eCA9IFtdXHJcblxyXG5kaWFsb2d1ZXMgPSBbXVxyXG4jYmFja0J1dHRvbiA9IG51bGxcclxuI29rQnV0dG9uID0gbnVsbFxyXG5yZWxlYXNlZCA9IHRydWVcclxuXHJcbmNyYXAgPSAocGFyZW50LCB0eXBlKSA9PiBwYXJlbnQuYXBwZW5kQ2hpbGQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCB0eXBlXHJcbmNvbm5lY3QgPSAoYnV0dG9uLCBoYW5kbGVyKSA9PiBidXR0b24ub25jbGljayA9IGJ1dHRvbi5vbnRvdWNoZW5kID0gaGFuZGxlclxyXG5wYWNrID0gKGRpZ2l0cykgPT4gZGlnaXRzLmpvaW4gXCJcIlxyXG5pbml0ID0gPT4gXyhTWU1CT0xTLnN1YnN0cmluZygwLE4pKS5wZXJtdXRhdGlvbnMoTSkubWFwKCh2KSA9PiBfLmpvaW4odiwgJycpKS52YWx1ZSgpXHJcbmNhbmRpZGF0ZXMgPSAobSxuKSA9PiBfLnJlZHVjZSByYW5nZShuLG4tbSwtMSksIChhLGIpID0+IGEqYlxyXG5hc3NlcnQgNTA0MCwgY2FuZGlkYXRlcyA0LDEwXHJcbmFzc2VydCAxMTg4MCwgY2FuZGlkYXRlcyA0LDEyXHJcbmFzc2VydCAyMTYyMTYwLCBjYW5kaWRhdGVzIDYsMTRcclxuYXNzZXJ0IDUxODkxODQwMCwgY2FuZGlkYXRlcyA4LDE2XHJcbmFzc2VydCAyNDMyOTAyMDA4MTc2NjQwMDAwLCBjYW5kaWRhdGVzIDIwLDIwXHJcblxyXG5uZXdHYW1lID0gPT5cclxuXHRoaXN0b3J5eCA9IFtdXHJcblx0Z3Vlc3MgPSBcIlwiXHJcblx0Y29tbWFuZCA9IFwiXCJcclxuXHRmYWNpdCA9IF8uc2h1ZmZsZSBTWU1CT0xTLnN1YnN0cmluZyAwLE5cclxuXHRmYWNpdCA9IHBhY2sgZmFjaXQuc2xpY2UgMCxNXHJcblx0Y2FuZHMgPSBudWxsXHJcblx0Q0FORFMgPSBjYW5kaWRhdGVzKE0sTilcclxuXHRpZiBjYW5kaWRhdGVzKE0sTikgPD0gMTAwMDAwMCB0aGVuIGNhbmRzID0gaW5pdCgpXHJcblxyXG5tYWtlQW5zd2VyID0gKGYsZykgPT4gIyBmYWNpdCxndWVzc1xyXG5cdG0gPSBmLmxlbmd0aFxyXG5cdHJlcyA9IFtdXHJcblx0Zm9yIGkgaW4gXy5yYW5nZSBtXHJcblx0XHRmb3IgaiBpbiBfLnJhbmdlIG1cclxuXHRcdFx0aWYgZltpXSA9PSBnW2pdXHJcblx0XHRcdFx0cmVzLnB1c2ggU1lNQk9MU1tNYXRoLmFicyBpLWpdXHJcblx0cmVzLnNvcnQoKVxyXG5cdHBhY2sgcmVzXHJcbmFzc2VydCBcIlwiICAgICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI1Njc4XCJcclxuYXNzZXJ0IFwiMFwiICAgICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjE2NzhcIlxyXG5hc3NlcnQgXCIwMFwiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMTI3OFwiXHJcbmFzc2VydCBcIjAwMFwiICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCIxMjM1XCJcclxuYXNzZXJ0IFwiMDAwMFwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjEyMzRcIlxyXG5hc3NlcnQgXCIwMTIzXCIgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMzI0MVwiXHJcbmFzc2VydCBcIjExMzNcIiAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI0MzIxXCJcclxuYXNzZXJ0IFwiMjIyMlwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjM0MTJcIlxyXG5hc3NlcnQgXCIzM1wiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiNDU2MVwiXHJcblxyXG5yZWR1Y2UgPSAoY2FuZHMsZ3Vlc3MpID0+XHJcblx0aWYgY2FuZHMgPT0gbnVsbCB0aGVuIHJldHVybiBudWxsXHJcblx0cmVzID0gW11cclxuXHRhbnN3ZXIxID0gbWFrZUFuc3dlciBmYWNpdCxndWVzc1xyXG5cdGZvciBjYW5kIGluIGNhbmRzXHJcblx0XHRhbnN3ZXIyID0gbWFrZUFuc3dlciBjYW5kLCBndWVzc1xyXG5cdFx0aWYgYW5zd2VyMSA9PSBhbnN3ZXIyXHJcblx0XHRcdHJlcy5wdXNoIGNhbmRcclxuXHRyZXNcclxuXHJcbmhhbmRsZUd1ZXNzID0gKGd1ZXNzKSA9PiBcclxuXHRhbnN3ZXIgPSBtYWtlQW5zd2VyIGZhY2l0LGd1ZXNzXHJcblx0Y2FuZHMgPSByZWR1Y2UgY2FuZHMsZ3Vlc3NcclxuXHRoaXN0b3J5eC5wdXNoIFtndWVzcyxhbnN3ZXIsY2FuZHNdXHJcblx0aWYgYW5zd2VyID09ICcwMDAwJyB0aGVuIGhpc3Rvcnl4LnB1c2ggW1wiU29sdmVkIGluICN7aGlzdG9yeXgubGVuZ3RofSBndWVzc2VzIVwiLFwiXCIsW11dXHJcblx0Y29tbWFuZCA9ICcnXHJcbmhhbmRsZXIgPSA9PiBoYW5kbGVHdWVzcyBjb21tYW5kXHJcblxyXG5zZXR1cCA9ID0+XHJcblx0Y3JlYXRlQ2FudmFzIDYwMCw4MDBcclxuXHRhbmdsZU1vZGUgREVHUkVFU1xyXG5cdG5ld0dhbWUoKVxyXG5cdHhkcmF3KClcclxuXHJcbnhkcmF3ID0gLT5cclxuXHRub1N0cm9rZSgpXHJcblx0YmFja2dyb3VuZCAxMjhcclxuXHRmaWxsIDBcclxuXHR0ZXh0U2l6ZSA0MFxyXG5cdHRleHRBbGlnbiBMRUZUXHJcblx0dGV4dCBcIiN7TX0gb2YgI3tOfVwiLCAxMCxoZWlnaHQtMTBcclxuXHR0ZXh0IGNvbW1hbmQsNTAsNDBcclxuXHR0ZXh0QWxpZ24gUklHSFRcclxuXHRmaWxsIDY0KzMyXHJcblx0dGV4dCBDQU5EUyx3aWR0aC0xMCw1MFxyXG5cdHRleHRBbGlnbiBMRUZUXHJcblx0ZHJhd1RhYmxlKClcclxuXHRzaG93RGlhbG9ndWUoKVxyXG5cdCN0ZXh0IGRpYWxvZ3Vlcy5sZW5ndGgsd2lkdGgvMixoZWlnaHQtNTBcclxuXHJcbmRyYXdUYWJsZSA9ID0+XHJcblx0eTAgPSAxMDBcclxuXHRmb3IgaCxpIGluIGhpc3Rvcnl4XHJcblx0XHRbYSxiLGNdID0gaFxyXG5cdFx0XHJcblx0XHR0ZXh0QWxpZ24gTEVGVFxyXG5cdFx0ZmlsbCAwXHJcblx0XHR0ZXh0IGEsMTAseTAraSo0MFxyXG5cclxuXHRcdHRleHRBbGlnbiBDRU5URVJcclxuXHRcdGZpbGwgMjU1LDI1NSwwXHJcblx0XHR0ZXh0IGIsMC41KndpZHRoLHkwK2kqNDBcclxuXHJcblx0XHRpZiBjXHJcblx0XHRcdHRleHRBbGlnbiBSSUdIVFxyXG5cdFx0XHRmaWxsIDY0KzMyXHJcblx0XHRcdHRleHQgYy5sZW5ndGgsd2lkdGgtMTAseTAraSo0MFxyXG5cclxuc2hvd0RpYWxvZ3VlID0gLT4gaWYgZGlhbG9ndWVzLmxlbmd0aCA+IDAgdGhlbiAoXy5sYXN0IGRpYWxvZ3Vlcykuc2hvdygpXHJcblxyXG5tZW51MSA9IC0+ICMgTWFpbiBNZW51XHJcblx0ZGlhbG9ndWUgPSBuZXcgRGlhbG9ndWUoKVxyXG5cdGZvciBjaCBpbiBTWU1CT0xTLnN1YnN0cmluZyAwLE5cclxuXHRcdGRvIChjaCkgLT4gZGlhbG9ndWUuYWRkIGNoLCA9PlxyXG5cdFx0XHRkaWFsb2d1ZS5kaXNhYmxlIGNoXHJcblx0XHRcdGNvbW1hbmQgKz0gY2hcclxuXHRcdFx0Zm9yIGJ1dHRvbiBpbiBkaWFsb2d1ZS5idXR0b25zXHJcblx0XHRcdFx0aWYgYnV0dG9uLnRpdGxlID09ICdiYWNrJyB0aGVuIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRlbHNlIGlmIGJ1dHRvbi50aXRsZSA9PSAnb2snIHRoZW4gYnV0dG9uLmFjdGl2ZSA9IGNvbW1hbmQubGVuZ3RoID09IE1cclxuXHRcdFx0XHRlbHNlIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA8IE0gYW5kIGJ1dHRvbi50aXRsZSBub3QgaW4gY29tbWFuZFxyXG5cclxuXHRkaWFsb2d1ZS5hZGQgJ29rJywgPT5cclxuXHRcdGhhbmRsZXIoKVxyXG5cdFx0ZGlhbG9ndWVzLnBvcCgpXHJcblxyXG5cdGRpYWxvZ3VlLmFkZCAnYmFjaycsID0+XHJcblx0XHRjb21tYW5kID0gY29tbWFuZC5zdWJzdHJpbmcgMCxjb21tYW5kLmxlbmd0aC0xXHJcblx0XHRmb3IgYnV0dG9uIGluIGRpYWxvZ3VlLmJ1dHRvbnNcclxuXHRcdFx0aWYgYnV0dG9uLnRpdGxlID09ICdiYWNrJyB0aGVuIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA+IDBcclxuXHRcdFx0ZWxzZSBpZiBidXR0b24udGl0bGUgPT0gJ29rJyB0aGVuIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA9PSBNXHJcblx0XHRcdGVsc2UgaWYgYnV0dG9uLnRpdGxlIG5vdCBpbiBjb21tYW5kIHRoZW4gYnV0dG9uLmFjdGl2ZSA9IHRydWVcclxuXHRkaWFsb2d1ZS5kaXNhYmxlICdiYWNrJ1xyXG5cclxuXHRidXR0b25zID0gZGlhbG9ndWUuYnV0dG9uc1xyXG5cdG4gPSBidXR0b25zLmxlbmd0aFxyXG5cdGJzID0gYnV0dG9ucy5zcGxpY2Ugbi0yLCAxXHJcblx0YnV0dG9ucy5zcGxpY2UgMSwwLGJzWzBdXHJcblxyXG5cdGRpYWxvZ3VlLmNsb2NrICcwMDUnLHRydWVcclxuXHRkaWFsb2d1ZS5hZGQgXCJuZXdcIiwgPT4gbWVudTIoKVxyXG5cdGJ1dHRvbiA9IF8ubGFzdCBkaWFsb2d1ZS5idXR0b25zXHJcblx0YnV0dG9uLnggPSB3aWR0aC8yLTUwXHJcblx0YnV0dG9uLnkgPSBoZWlnaHQvMi01MFxyXG5cdGJ1dHRvbi5yID0gNTBcclxuXHJcblx0ZGlhbG9ndWUuZGlzYWJsZSAnb2snXHJcblx0ZGlhbG9ndWUudGV4dFNpemUgKj0gMS41XHJcblxyXG5tZW51MiA9IC0+ICMgbmV3IEdhbWVcclxuXHRkaWFsb2d1ZSA9IG5ldyBEaWFsb2d1ZSgpXHJcblx0ZGlhbG9ndWUuYWRkICduZXcnLCA9PlxyXG5cdFx0bmV3R2FtZSgpXHJcblx0XHRkaWFsb2d1ZXMucG9wKClcclxuXHRcdGRpYWxvZ3Vlcy5wb3AoKVxyXG5cdFx0bWVudTEoKVxyXG5cdFx0eGRyYXcoKVxyXG5cdGRpYWxvZ3VlLmFkZCAnLTInLCA9PiBpZiBOID4gMiBhbmQgTiA+IE0gdGhlbiBOLT0yXHJcblx0ZGlhbG9ndWUuYWRkICcrMicsID0+IGlmIE4gPCBTWU1CT0xTLmxlbmd0aCB0aGVuIE4rPTJcclxuXHRkaWFsb2d1ZS5hZGQgJysxJywgPT4gaWYgTSA8IE4gdGhlbiBNKytcclxuXHRkaWFsb2d1ZS5hZGQgJy0xJywgPT4gaWYgTSA+IDEgdGhlbiBNLS1cclxuXHRkaWFsb2d1ZS5jbG9jayAnICcsdHJ1ZVxyXG5cclxuIyMjIyMjXHJcblxyXG5kb2l0ID0gLT5cclxuXHRpZiBkaWFsb2d1ZXMubGVuZ3RoID4gMFxyXG5cdFx0ZGlhbG9ndWUgPSBfLmxhc3QgZGlhbG9ndWVzXHJcblx0XHRkaWFsb2d1ZS5leGVjdXRlIG1vdXNlWCxtb3VzZVlcclxuXHRlbHNlXHJcblx0XHRtZW51MSgpXHJcblxyXG5tb3VzZVJlbGVhc2VkID0gLT4gIyB0byBtYWtlIEFuZHJvaWQgd29yayBcclxuXHRyZWxlYXNlZCA9IHRydWUgXHJcblx0ZmFsc2VcclxuXHJcbnRvdWNoU3RhcnRlZCA9IC0+IFxyXG5cdGRvaXQoKVxyXG5cdHhkcmF3KClcclxuXHJcbm1vdXNlUHJlc3NlZCA9IC0+XHJcblx0aWYgIXJlbGVhc2VkIHRoZW4gcmV0dXJuICMgdG8gbWFrZSBBbmRyb2lkIHdvcmsgXHJcblx0cmVsZWFzZWQgPSBmYWxzZVxyXG5cdGRvaXQoKVxyXG5cdHhkcmF3KClcclxuIl19
//# sourceURL=c:\github\2021\033-MM5040\coffee\sketch.coffee