// Generated by CoffeeScript 2.5.1
var M, N, SYMBOLS, backButton, candidates, cands, command, dialogues, draw, drawTable, errors, facit, guess, handleGuess, handler, headers, historyx, init, makeAnswer, menu1, menu2, menuButton, mousePressed, newGame, okButton, pack, reduce, setup, showDialogue,
  indexOf = [].indexOf;

SYMBOLS = '0123456789abcdefghij';

M = 4;

N = 10;

command = "";

facit = "";

guess = "";

cands = null;

errors = [];

headers = [];

historyx = [];

dialogues = [];

menuButton = null;

backButton = null;

okButton = null;

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
  menuButton = new MenuButton(width - 160);
  return newGame();
};

draw = function() {
  noStroke();
  background(128);
  fill(0);
  textSize(40);
  textAlign(LEFT);
  text(`${M} of ${N}`, 10, height - 10);
  text(command, 50, 40);
  textAlign(RIGHT);
  fill(64 + 32);
  text(candidates(M, N), width - 10, 50);
  textAlign(LEFT);
  drawTable();
  menuButton.draw();
  return showDialogue();
};

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
  var button, ch, dialogue, k, len, ref;
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
          if (button.title === 'Back') {
            results.push(button.active = command.length > 0);
          } else if (button.title === 'Ok') {
            results.push(button.active = command.length === M);
          } else {
            results.push(button.active = command.length < M && (ref2 = button.title, indexOf.call(command, ref2) < 0));
          }
        }
        return results;
      });
    })(ch);
  }
  dialogue.add('Back', () => {
    var button, l, len1, ref1, ref2, results;
    command = command.substring(0, command.length - 1);
    ref1 = dialogue.buttons;
    results = [];
    for (l = 0, len1 = ref1.length; l < len1; l++) {
      button = ref1[l];
      if (button.title === 'Back') {
        results.push(button.active = command.length > 0);
      } else if (button.title === 'Ok') {
        results.push(button.active = command.length === M);
      } else if (ref2 = button.title, indexOf.call(command, ref2) < 0) {
        results.push(button.active = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  });
  dialogue.disable('Back');
  dialogue.add('Ok', () => {
    handler();
    return dialogues.pop();
  });
  dialogue.clock(' ', true);
  dialogue.add("New", () => {
    return menu2();
  });
  button = _.last(dialogue.buttons);
  button.x = width / 2 - 50;
  button.y = height / 2 - 50;
  button.r = 35;
  dialogue.disable('Ok');
  return dialogue.textSize *= 1.5;
};

menu2 = function() { // new Game
  var dialogue;
  dialogue = new Dialogue();
  dialogue.add('New', () => {
    newGame();
    return dialogues.pop();
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

mousePressed = function() {
  var dialogue;
  if (menuButton.inside(mouseX, mouseY)) {
    menuButton.click();
    return false;
  }
  if (dialogues.length > 0) {
    dialogue = _.last(dialogues);
    //if not dialogue.execute mouseX,mouseY then dialogues.pop()
    return dialogue.execute(mouseX, mouseY); // then dialogues.pop()
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLFlBQUE7RUFBQTs7QUFBQSxPQUFBLEdBQVU7O0FBQ1YsQ0FBQSxHQUFJOztBQUNKLENBQUEsR0FBSTs7QUFDSixPQUFBLEdBQVU7O0FBQ1YsS0FBQSxHQUFROztBQUNSLEtBQUEsR0FBUTs7QUFDUixLQUFBLEdBQVE7O0FBQ1IsTUFBQSxHQUFTOztBQUNULE9BQUEsR0FBVTs7QUFDVixRQUFBLEdBQVc7O0FBRVgsU0FBQSxHQUFZOztBQUNaLFVBQUEsR0FBYTs7QUFDYixVQUFBLEdBQWE7O0FBQ2IsUUFBQSxHQUFXOztBQUVYLElBQUEsR0FBTyxDQUFDLE1BQUQsQ0FBQSxHQUFBO1NBQVksTUFBTSxDQUFDLElBQVAsQ0FBWSxFQUFaO0FBQVo7O0FBQ1AsSUFBQSxHQUFPLENBQUEsQ0FBQSxHQUFBO1NBQUcsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQWxCLEVBQW9CLENBQXBCLENBQUYsQ0FBeUIsQ0FBQyxZQUExQixDQUF1QyxDQUF2QyxDQUF5QyxDQUFDLEdBQTFDLENBQThDLENBQUMsQ0FBRCxDQUFBLEdBQUE7V0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLENBQVAsRUFB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QUFILENBQW5CO1NBQ0EsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLEVBQW1CLElBQW5CO0FBVE87O0FBV1IsWUFBQSxHQUFlLFFBQUEsQ0FBQSxDQUFBO0FBQ2YsTUFBQTtFQUFDLElBQUcsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsTUFBbEIsRUFBeUIsTUFBekIsQ0FBSDtJQUNDLFVBQVUsQ0FBQyxLQUFYLENBQUE7QUFDQSxXQUFPLE1BRlI7O0VBR0EsSUFBRyxTQUFTLENBQUMsTUFBVixHQUFtQixDQUF0QjtJQUNDLFFBQUEsR0FBVyxDQUFDLENBQUMsSUFBRixDQUFPLFNBQVAsRUFBYjs7V0FFRSxRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFqQixFQUF3QixNQUF4QixFQUhEOztBQUpjIiwic291cmNlc0NvbnRlbnQiOlsiU1lNQk9MUyA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpaidcclxuTSA9IDRcclxuTiA9IDEwXHJcbmNvbW1hbmQgPSBcIlwiXHJcbmZhY2l0ID0gXCJcIlxyXG5ndWVzcyA9IFwiXCJcclxuY2FuZHMgPSBudWxsXHJcbmVycm9ycyA9IFtdXHJcbmhlYWRlcnMgPSBbXVxyXG5oaXN0b3J5eCA9IFtdXHJcblxyXG5kaWFsb2d1ZXMgPSBbXVxyXG5tZW51QnV0dG9uID0gbnVsbFxyXG5iYWNrQnV0dG9uID0gbnVsbFxyXG5va0J1dHRvbiA9IG51bGxcclxuXHJcbnBhY2sgPSAoZGlnaXRzKSA9PiBkaWdpdHMuam9pbiBcIlwiXHJcbmluaXQgPSA9PiBfKFNZTUJPTFMuc3Vic3RyaW5nKDAsTikpLnBlcm11dGF0aW9ucyhNKS5tYXAoKHYpID0+IF8uam9pbih2LCAnJykpLnZhbHVlKClcclxuY2FuZGlkYXRlcyA9IChtLG4pID0+IF8ucmVkdWNlIHJhbmdlKG4sbi1tLC0xKSwgKGEsYikgPT4gYSpiXHJcbmFzc2VydCA1MDQwLCBjYW5kaWRhdGVzIDQsMTBcclxuYXNzZXJ0IDExODgwLCBjYW5kaWRhdGVzIDQsMTJcclxuYXNzZXJ0IDIxNjIxNjAsIGNhbmRpZGF0ZXMgNiwxNFxyXG5hc3NlcnQgNTE4OTE4NDAwLCBjYW5kaWRhdGVzIDgsMTZcclxuYXNzZXJ0IDI0MzI5MDIwMDgxNzY2NDAwMDAsIGNhbmRpZGF0ZXMgMjAsMjBcclxuXHJcbm5ld0dhbWUgPSA9PlxyXG5cdGhpc3Rvcnl4ID0gW11cclxuXHRndWVzcyA9IFwiXCJcclxuXHRjb21tYW5kID0gXCJcIlxyXG5cdGZhY2l0ID0gXy5zaHVmZmxlIFNZTUJPTFMuc3Vic3RyaW5nIDAsTlxyXG5cdGZhY2l0ID0gcGFjayBmYWNpdC5zbGljZSAwLE1cclxuXHRjYW5kcyA9IG51bGxcclxuXHRpZiBjYW5kaWRhdGVzKE0sTikgPD0gMTAwMDAwMCB0aGVuIGNhbmRzID0gaW5pdCgpXHJcblxyXG5tYWtlQW5zd2VyID0gKGYsZykgPT4gIyBmYWNpdCxndWVzc1xyXG5cdG0gPSBmLmxlbmd0aFxyXG5cdHJlcyA9IFtdXHJcblx0Zm9yIGkgaW4gXy5yYW5nZSBtXHJcblx0XHRmb3IgaiBpbiBfLnJhbmdlIG1cclxuXHRcdFx0aWYgZltpXSA9PSBnW2pdXHJcblx0XHRcdFx0cmVzLnB1c2ggU1lNQk9MU1tNYXRoLmFicyBpLWpdXHJcblx0cmVzLnNvcnQoKVxyXG5cdHBhY2sgcmVzXHJcbmFzc2VydCBcIlwiICAgICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI1Njc4XCJcclxuYXNzZXJ0IFwiMFwiICAgICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjE2NzhcIlxyXG5hc3NlcnQgXCIwMFwiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMTI3OFwiXHJcbmFzc2VydCBcIjAwMFwiICAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCIxMjM1XCJcclxuYXNzZXJ0IFwiMDAwMFwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjEyMzRcIlxyXG5hc3NlcnQgXCIwMTIzXCIgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiMzI0MVwiXHJcbmFzc2VydCBcIjExMzNcIiAsIG1ha2VBbnN3ZXIgXCIxMjM0XCIsXCI0MzIxXCJcclxuYXNzZXJ0IFwiMjIyMlwiICwgbWFrZUFuc3dlciBcIjEyMzRcIixcIjM0MTJcIlxyXG5hc3NlcnQgXCIzM1wiICAgLCBtYWtlQW5zd2VyIFwiMTIzNFwiLFwiNDU2MVwiXHJcblxyXG5yZWR1Y2UgPSAoY2FuZHMsZ3Vlc3MpID0+XHJcblx0aWYgY2FuZHMgPT0gbnVsbCB0aGVuIHJldHVybiBudWxsXHJcblx0cmVzID0gW11cclxuXHRhbnN3ZXIxID0gbWFrZUFuc3dlciBmYWNpdCxndWVzc1xyXG5cdGZvciBjYW5kIGluIGNhbmRzXHJcblx0XHRhbnN3ZXIyID0gbWFrZUFuc3dlciBjYW5kLCBndWVzc1xyXG5cdFx0aWYgYW5zd2VyMSA9PSBhbnN3ZXIyXHJcblx0XHRcdHJlcy5wdXNoIGNhbmRcclxuXHRyZXNcclxuXHJcbmhhbmRsZUd1ZXNzID0gKGd1ZXNzKSA9PiBcclxuXHRhbnN3ZXIgPSBtYWtlQW5zd2VyIGZhY2l0LGd1ZXNzXHJcblx0Y2FuZHMgPSByZWR1Y2UgY2FuZHMsZ3Vlc3NcclxuXHRoaXN0b3J5eC5wdXNoIFtndWVzcyxhbnN3ZXIsY2FuZHNdXHJcblx0aWYgYW5zd2VyID09ICcwMDAwJyB0aGVuIGhpc3Rvcnl4LnB1c2ggW1wiU29sdmVkIGluICN7aGlzdG9yeXgubGVuZ3RofSBndWVzc2VzIVwiLFwiXCIsW11dXHJcblx0Y29tbWFuZCA9ICcnXHJcbmhhbmRsZXIgPSA9PiBoYW5kbGVHdWVzcyBjb21tYW5kXHJcblxyXG5zZXR1cCA9ID0+XHJcblx0Y3JlYXRlQ2FudmFzIDYwMCw4MDBcclxuXHRhbmdsZU1vZGUgREVHUkVFU1xyXG5cdG1lbnVCdXR0b24gPSBuZXcgTWVudUJ1dHRvbiB3aWR0aC0xNjBcclxuXHRuZXdHYW1lKClcclxuXHJcbmRyYXcgPSAtPlxyXG5cdG5vU3Ryb2tlKClcclxuXHRiYWNrZ3JvdW5kIDEyOFxyXG5cdGZpbGwgMFxyXG5cdHRleHRTaXplIDQwXHJcblx0dGV4dEFsaWduIExFRlRcclxuXHR0ZXh0IFwiI3tNfSBvZiAje059XCIsIDEwLGhlaWdodC0xMFxyXG5cdHRleHQgY29tbWFuZCw1MCw0MFxyXG5cdHRleHRBbGlnbiBSSUdIVFxyXG5cdGZpbGwgNjQrMzJcclxuXHR0ZXh0IGNhbmRpZGF0ZXMoTSxOKSx3aWR0aC0xMCw1MFxyXG5cdHRleHRBbGlnbiBMRUZUXHJcblx0ZHJhd1RhYmxlKClcclxuXHRtZW51QnV0dG9uLmRyYXcoKVxyXG5cdHNob3dEaWFsb2d1ZSgpXHJcblxyXG5kcmF3VGFibGUgPSA9PlxyXG5cdHkwID0gMTAwXHJcblx0Zm9yIGgsaSBpbiBoaXN0b3J5eFxyXG5cdFx0W2EsYixjXSA9IGhcclxuXHRcdFxyXG5cdFx0dGV4dEFsaWduIExFRlRcclxuXHRcdGZpbGwgMFxyXG5cdFx0dGV4dCBhLDEwLHkwK2kqNDBcclxuXHJcblx0XHR0ZXh0QWxpZ24gQ0VOVEVSXHJcblx0XHRmaWxsIDI1NSwyNTUsMFxyXG5cdFx0dGV4dCBiLDAuNSp3aWR0aCx5MCtpKjQwXHJcblxyXG5cdFx0aWYgY1xyXG5cdFx0XHR0ZXh0QWxpZ24gUklHSFRcclxuXHRcdFx0ZmlsbCA2NCszMlxyXG5cdFx0XHR0ZXh0IGMubGVuZ3RoLHdpZHRoLTEwLHkwK2kqNDBcclxuXHJcbnNob3dEaWFsb2d1ZSA9IC0+IGlmIGRpYWxvZ3Vlcy5sZW5ndGggPiAwIHRoZW4gKF8ubGFzdCBkaWFsb2d1ZXMpLnNob3coKVxyXG5cclxubWVudTEgPSAtPiAjIE1haW4gTWVudVxyXG5cdGRpYWxvZ3VlID0gbmV3IERpYWxvZ3VlKClcclxuXHRmb3IgY2ggaW4gU1lNQk9MUy5zdWJzdHJpbmcgMCxOXHJcblx0XHRkbyAoY2gpIC0+IGRpYWxvZ3VlLmFkZCBjaCwgPT5cclxuXHRcdFx0ZGlhbG9ndWUuZGlzYWJsZSBjaFxyXG5cdFx0XHRjb21tYW5kICs9IGNoXHJcblx0XHRcdGZvciBidXR0b24gaW4gZGlhbG9ndWUuYnV0dG9uc1xyXG5cdFx0XHRcdGlmIGJ1dHRvbi50aXRsZSA9PSAnQmFjaycgdGhlbiBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPiAwXHJcblx0XHRcdFx0ZWxzZSBpZiBidXR0b24udGl0bGUgPT0gJ09rJyB0aGVuIGJ1dHRvbi5hY3RpdmUgPSBjb21tYW5kLmxlbmd0aCA9PSBNXHJcblx0XHRcdFx0ZWxzZSBidXR0b24uYWN0aXZlID0gY29tbWFuZC5sZW5ndGggPCBNIGFuZCBidXR0b24udGl0bGUgbm90IGluIGNvbW1hbmRcclxuXHJcblx0ZGlhbG9ndWUuYWRkICdCYWNrJywgPT5cclxuXHRcdGNvbW1hbmQgPSBjb21tYW5kLnN1YnN0cmluZyAwLGNvbW1hbmQubGVuZ3RoLTFcclxuXHRcdGZvciBidXR0b24gaW4gZGlhbG9ndWUuYnV0dG9uc1xyXG5cdFx0XHRpZiBidXR0b24udGl0bGUgPT0gJ0JhY2snIHRoZW4gYnV0dG9uLmFjdGl2ZSA9IGNvbW1hbmQubGVuZ3RoID4gMFxyXG5cdFx0XHRlbHNlIGlmIGJ1dHRvbi50aXRsZSA9PSAnT2snIHRoZW4gYnV0dG9uLmFjdGl2ZSA9IGNvbW1hbmQubGVuZ3RoID09IE1cclxuXHRcdFx0ZWxzZSBpZiBidXR0b24udGl0bGUgbm90IGluIGNvbW1hbmQgdGhlbiBidXR0b24uYWN0aXZlID0gdHJ1ZVxyXG5cdGRpYWxvZ3VlLmRpc2FibGUgJ0JhY2snXHJcblxyXG5cdGRpYWxvZ3VlLmFkZCAnT2snLCA9PlxyXG5cdFx0aGFuZGxlcigpXHJcblx0XHRkaWFsb2d1ZXMucG9wKClcclxuXHJcblx0ZGlhbG9ndWUuY2xvY2sgJyAnLHRydWVcclxuXHRkaWFsb2d1ZS5hZGQgXCJOZXdcIiwgPT4gbWVudTIoKVxyXG5cdGJ1dHRvbiA9IF8ubGFzdCBkaWFsb2d1ZS5idXR0b25zXHJcblx0YnV0dG9uLnggPSB3aWR0aC8yLTUwXHJcblx0YnV0dG9uLnkgPSBoZWlnaHQvMi01MFxyXG5cdGJ1dHRvbi5yID0gMzVcclxuXHJcblx0ZGlhbG9ndWUuZGlzYWJsZSAnT2snXHJcblx0ZGlhbG9ndWUudGV4dFNpemUgKj0gMS41XHJcblxyXG5tZW51MiA9IC0+ICMgbmV3IEdhbWVcclxuXHRkaWFsb2d1ZSA9IG5ldyBEaWFsb2d1ZSgpXHJcblx0ZGlhbG9ndWUuYWRkICdOZXcnLCA9PiBcclxuXHRcdG5ld0dhbWUoKVxyXG5cdFx0ZGlhbG9ndWVzLnBvcCgpXHJcblx0ZGlhbG9ndWUuYWRkICctMicsID0+IGlmIE4gPiAyIGFuZCBOID4gTSB0aGVuIE4tPTJcclxuXHRkaWFsb2d1ZS5hZGQgJysyJywgPT4gaWYgTiA8IFNZTUJPTFMubGVuZ3RoIHRoZW4gTis9MlxyXG5cdGRpYWxvZ3VlLmFkZCAnKzEnLCA9PiBpZiBNIDwgTiB0aGVuIE0rK1xyXG5cdGRpYWxvZ3VlLmFkZCAnLTEnLCA9PiBpZiBNID4gMSB0aGVuIE0tLVxyXG5cdGRpYWxvZ3VlLmNsb2NrICcgJyx0cnVlXHJcblxyXG5tb3VzZVByZXNzZWQgPSAtPlxyXG5cdGlmIG1lbnVCdXR0b24uaW5zaWRlIG1vdXNlWCxtb3VzZVlcclxuXHRcdG1lbnVCdXR0b24uY2xpY2soKVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0aWYgZGlhbG9ndWVzLmxlbmd0aCA+IDBcclxuXHRcdGRpYWxvZ3VlID0gXy5sYXN0IGRpYWxvZ3Vlc1xyXG5cdFx0I2lmIG5vdCBkaWFsb2d1ZS5leGVjdXRlIG1vdXNlWCxtb3VzZVkgdGhlbiBkaWFsb2d1ZXMucG9wKClcclxuXHRcdGRpYWxvZ3VlLmV4ZWN1dGUgbW91c2VYLG1vdXNlWSAjIHRoZW4gZGlhbG9ndWVzLnBvcCgpXHJcbiJdfQ==
//# sourceURL=c:\github\2021\033-MM5040\coffee\sketch.coffee