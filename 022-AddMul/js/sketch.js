// Generated by CoffeeScript 2.5.1
var Button, LONG, N, SHORT, a, ass, b, buttons, draw, getParts, handle, inp, keyPressed, mousePressed, newGame, player, range, score, setup, start, state;

LONG = 60; // seconds before no player wins

SHORT = 20; // seconds player may enter the answer

N = 20;

a = null;

b = null;

inp = null;

score = [0, 0];

buttons = [];

state = -1; // -2:start -1:visible 0:Left player 1:Right player 2:show score

range = _.range;

start = null; // starttid. 60 sek för första, 20 sek för andra

Button = class Button {
  constructor(prompt, x, y, click) {
    this.prompt = prompt;
    this.x = x;
    this.y = y;
    this.click = click;
    this.r = 50;
  }

  draw() {
    circle(this.x, this.y, 2 * this.r);
    return text(this.prompt, this.x, this.y);
  }

  inside(mx, my) {
    return this.r > dist(this.x, this.y, mx, my);
  }

};

ass = function(a, b) {
  if (_.isEqual(a, b)) {
    return;
  }
  console.log("");
  console.log(a);
  return console.log(b);
};

newGame = function() {
  a = _.random(-N, N);
  b = _.random(-N, N);
  return start = new Date(); // LONG
};

draw = function() {
  var button, j, len, nextstate, ref, secs;
  nextstate = state;
  background(128);
  if (state === 0 || state === 1) {
    buttons[2].draw();
    secs = Math.floor((new Date() - start) / 1000); // seconds
    text(SHORT - secs, width / 2, 50);
    if (secs >= SHORT) {
      score[1 - state] += 1;
      inp.hide();
      nextstate = -2;
    }
  }
  if (state === (-1) || state === 0 || state === 1 || state === 2) {
    text(`a*b = ${a * b}`, width / 2, 150);
    text(`a+b = ${a + b}`, width / 2, 250);
  }
  if (state === (-2) || state === 2) {
    buttons[2].draw();
    inp.hide();
  }
  if (state === -1) {
    ref = [buttons[0], buttons[1]];
    for (j = 0, len = ref.length; j < len; j++) {
      button = ref[j];
      button.draw();
    }
    secs = Math.floor((new Date() - start) / 1000); // seconds
    text(LONG - secs, width / 2, 50);
    if (secs >= LONG) {
      inp.hide();
      nextstate = -2;
    }
  }
  text(score[0], 50, 50);
  text(score[1], width - 50, 50);
  return state = nextstate;
};

getParts = function(arr) {
  var minus, space;
  space = arr.lastIndexOf(' ');
  minus = arr.lastIndexOf('-');
  if (space > 0) {
    return [arr.slice(0, space), arr.slice(space + 1)];
  } else if (minus >= 0) {
    return [arr.slice(0, minus), arr.slice(minus)];
  } else {
    return [];
  }
};

ass(["1", "-7"], getParts("1-7"));

ass(["1", "-7"], getParts("1 -7"));

ass(["-7", "1"], getParts("-7 1"));

ass(["1", "7"], getParts("1 7"));

ass(["-7", "-7"], getParts("-7-7"));

player = function(i) {
  state = i;
  if (state === 0 || state === 1) {
    inp.show();
    inp.elt.focus();
    event.preventDefault();
    inp.value();
    return start = new Date(); // SHORT
  }
};

keyPressed = function(event) {
  return handle(key);
};

handle = function(key) {
  var arr, c, d, success;
  if (state === -2) {
    if (key === 'Enter') {
      newGame();
      return state = -1;
    }
  } else if (state === -1) {
    if (key === 'z') {
      player(0);
    }
    if (key === 'm') {
      return player(1);
    }
  } else if (state === 0 || state === 1) {
    if (key === 'Enter') {
      arr = inp.value();
      inp.value("");
      inp.hide();
      arr = getParts(arr);
      success = false;
      if (arr.length === 2) {
        c = parseInt(arr[0]);
        d = parseInt(arr[1]);
        success = a === c && b === d || a === d && b === c;
      }
      if (success) {
        score[state] += 1;
      } else {
        score[1 - state] += 1;
      }
      return state = 2;
    }
  } else if (state === 2) {
    if (key === 'Enter') {
      newGame();
      return state = -1;
    }
  }
};

setup = function() {
  createCanvas(600, 600);
  textSize(40);
  textAlign(CENTER, CENTER);
  score = [0, 0];
  buttons.push(new Button('z', 60, height - 60, function() {
    return player(0);
  }));
  buttons.push(new Button('m', width - 60, height - 60, function() {
    return player(1);
  }));
  buttons.push(new Button('enter', width / 2, height - 60, function() {
    return handle('Enter');
  }));
  inp = createInput('');
  inp.id = 'input';
  inp.hide();
  inp.style('font-size', '30px', 'color', '#ff0000');
  inp.position(width / 2 - 50, 350);
  inp.size(100);
  return newGame();
};

mousePressed = function() {
  var button, j, len, results;
  results = [];
  for (j = 0, len = buttons.length; j < len; j++) {
    button = buttons[j];
    if (button.inside(mouseX, mouseY)) {
      results.push(button.click());
    } else {
      results.push(void 0);
    }
  }
  return results;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQTs7QUFBQSxJQUFBLEdBQU8sR0FBUDs7QUFDQSxLQUFBLEdBQVEsR0FEUjs7QUFHQSxDQUFBLEdBQUk7O0FBRUosQ0FBQSxHQUFJOztBQUNKLENBQUEsR0FBSTs7QUFDSixHQUFBLEdBQU07O0FBQ04sS0FBQSxHQUFRLENBQUMsQ0FBRCxFQUFHLENBQUg7O0FBRVIsT0FBQSxHQUFVOztBQUVWLEtBQUEsR0FBUSxDQUFDLEVBWlQ7O0FBY0EsS0FBQSxHQUFRLENBQUMsQ0FBQzs7QUFFVixLQUFBLEdBQVEsS0FoQlI7O0FBa0JNLFNBQU4sTUFBQSxPQUFBO0VBQ0MsV0FBYyxPQUFBLEdBQUEsR0FBQSxPQUFBLENBQUE7SUFBQyxJQUFDLENBQUE7SUFBTyxJQUFDLENBQUE7SUFBRSxJQUFDLENBQUE7SUFBRSxJQUFDLENBQUE7SUFBVSxJQUFDLENBQUEsQ0FBRCxHQUFLO0VBQS9COztFQUNkLElBQU8sQ0FBQSxDQUFBO0lBQ04sTUFBQSxDQUFPLElBQUMsQ0FBQSxDQUFSLEVBQVUsSUFBQyxDQUFBLENBQVgsRUFBYSxDQUFBLEdBQUUsSUFBQyxDQUFBLENBQWhCO1dBQ0EsSUFBQSxDQUFLLElBQUMsQ0FBQSxNQUFOLEVBQWEsSUFBQyxDQUFBLENBQWQsRUFBZ0IsSUFBQyxDQUFBLENBQWpCO0VBRk07O0VBR1AsTUFBUyxDQUFDLEVBQUQs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LFNBQXhDO0VBQ0EsR0FBRyxDQUFDLFFBQUosQ0FBYSxLQUFBLEdBQU0sQ0FBTixHQUFRLEVBQXJCLEVBQXlCLEdBQXpCO0VBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxHQUFUO1NBRUEsT0FBQSxDQUFBO0FBakJPOztBQW1CUixZQUFBLEdBQWUsUUFBQSxDQUFBLENBQUE7QUFDZixNQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO0FBQUM7RUFBQSxLQUFBLHlDQUFBOztJQUNDLElBQUcsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFkLEVBQXFCLE1BQXJCLENBQUg7bUJBQ0MsTUFBTSxDQUFDLEtBQVAsQ0FBQSxHQUREO0tBQUEsTUFBQTsyQkFBQTs7RUFERCxDQUFBOztBQURjIiwic291cmNlc0NvbnRlbnQiOlsiTE9ORyA9IDYwICMgc2Vjb25kcyBiZWZvcmUgbm8gcGxheWVyIHdpbnNcclxuU0hPUlQgPSAyMCAjIHNlY29uZHMgcGxheWVyIG1heSBlbnRlciB0aGUgYW5zd2VyXHJcblxyXG5OID0gMjBcclxuXHJcbmEgPSBudWxsXHJcbmIgPSBudWxsXHJcbmlucCA9IG51bGxcclxuc2NvcmUgPSBbMCwwXVxyXG5cclxuYnV0dG9ucyA9IFtdXHJcblxyXG5zdGF0ZSA9IC0xICMgLTI6c3RhcnQgLTE6dmlzaWJsZSAwOkxlZnQgcGxheWVyIDE6UmlnaHQgcGxheWVyIDI6c2hvdyBzY29yZVxyXG5cclxucmFuZ2UgPSBfLnJhbmdlXHJcblxyXG5zdGFydCA9IG51bGwgIyBzdGFydHRpZC4gNjAgc2VrIGbDtnIgZsO2cnN0YSwgMjAgc2VrIGbDtnIgYW5kcmFcclxuXHJcbmNsYXNzIEJ1dHRvblxyXG5cdGNvbnN0cnVjdG9yIDogKEBwcm9tcHQsQHgsQHksQGNsaWNrKSAtPiBAciA9IDUwXHJcblx0ZHJhdyA6IC0+XHJcblx0XHRjaXJjbGUgQHgsQHksMipAclxyXG5cdFx0dGV4dCBAcHJvbXB0LEB4LEB5XHJcblx0aW5zaWRlIDogKG14LG15KSAtPiBAciA+IGRpc3QgQHgsQHksbXgsbXlcclxuXHJcbmFzcyA9IChhLCBiKSAtPlxyXG5cdGlmIF8uaXNFcXVhbCBhLCBiIHRoZW4gcmV0dXJuXHJcblx0Y29uc29sZS5sb2cgXCJcIlxyXG5cdGNvbnNvbGUubG9nIGFcclxuXHRjb25zb2xlLmxvZyBiXHJcblxyXG5uZXdHYW1lID0gLT5cclxuXHRhID0gXy5yYW5kb20gLU4sTlxyXG5cdGIgPSBfLnJhbmRvbSAtTixOXHJcblx0c3RhcnQgPSBuZXcgRGF0ZSgpICMgTE9OR1xyXG5cclxuZHJhdyA9IC0+XHJcblx0bmV4dHN0YXRlID0gc3RhdGUgXHJcblx0YmFja2dyb3VuZCAxMjhcclxuXHJcblx0aWYgc3RhdGUgaW4gWzAsMV1cclxuXHRcdGJ1dHRvbnNbMl0uZHJhdygpXHJcblx0XHRzZWNzID0gKG5ldyBEYXRlKCkgLSBzdGFydCkgLy8gMTAwMCAjIHNlY29uZHNcclxuXHRcdHRleHQgU0hPUlQgLSBzZWNzLHdpZHRoLzIsNTBcclxuXHRcdGlmIHNlY3MgPj0gU0hPUlQgXHJcblx0XHRcdHNjb3JlWzEtc3RhdGVdICs9IDFcclxuXHRcdFx0aW5wLmhpZGUoKVxyXG5cdFx0XHRuZXh0c3RhdGUgPSAtMlxyXG5cclxuXHRpZiBzdGF0ZSBpbiBbLTEsMCwxLDJdXHJcblx0XHR0ZXh0IFwiYSpiID0gI3thKmJ9XCIsd2lkdGgvMiwxNTBcclxuXHRcdHRleHQgXCJhK2IgPSAje2ErYn1cIix3aWR0aC8yLDI1MFxyXG5cclxuXHRpZiBzdGF0ZSBpbiBbLTIsMl1cclxuXHRcdGJ1dHRvbnNbMl0uZHJhdygpXHJcblx0XHRpbnAuaGlkZSgpXHJcblxyXG5cdGlmIHN0YXRlID09IC0xXHJcblx0XHRmb3IgYnV0dG9uIGluIFtidXR0b25zWzBdLGJ1dHRvbnNbMV1dXHJcblx0XHRcdGJ1dHRvbi5kcmF3KClcclxuXHRcdHNlY3MgPSAobmV3IERhdGUoKSAtIHN0YXJ0KSAvLyAxMDAwICMgc2Vjb25kc1xyXG5cdFx0dGV4dCBMT05HLXNlY3Msd2lkdGgvMiw1MFxyXG5cdFx0aWYgc2VjcyA+PSBMT05HXHJcblx0XHRcdGlucC5oaWRlKClcclxuXHRcdFx0bmV4dHN0YXRlID0gLTJcclxuXHJcblx0dGV4dCBzY29yZVswXSw1MCw1MFxyXG5cdHRleHQgc2NvcmVbMV0sd2lkdGgtNTAsNTBcclxuXHRzdGF0ZSA9IG5leHRzdGF0ZVxyXG5cclxuZ2V0UGFydHMgPSAoYXJyKSAtPlxyXG5cdHNwYWNlID0gYXJyLmxhc3RJbmRleE9mICcgJ1xyXG5cdG1pbnVzID0gYXJyLmxhc3RJbmRleE9mICctJ1xyXG5cdGlmIHNwYWNlID4gMCB0aGVuIHJldHVybiBbYXJyLnNsaWNlKDAsc3BhY2UpLCBhcnIuc2xpY2Ugc3BhY2UrMSBdXHJcblx0ZWxzZSBpZiBtaW51cyA+PSAwIHRoZW4gcmV0dXJuIFthcnIuc2xpY2UoMCxtaW51cyksIGFyci5zbGljZSBtaW51cyBdXHJcblx0ZWxzZSByZXR1cm4gW11cclxuXHJcbmFzcyBbXCIxXCIsXCItN1wiXSwgZ2V0UGFydHMgXCIxLTdcIlxyXG5hc3MgW1wiMVwiLFwiLTdcIl0sIGdldFBhcnRzIFwiMSAtN1wiXHJcbmFzcyBbXCItN1wiLFwiMVwiXSwgZ2V0UGFydHMgXCItNyAxXCJcclxuYXNzIFtcIjFcIixcIjdcIl0sIGdldFBhcnRzIFwiMSA3XCJcclxuYXNzIFtcIi03XCIsXCItN1wiXSwgZ2V0UGFydHMgXCItNy03XCJcclxuXHJcbnBsYXllciA9IChpKSAtPlxyXG5cdHN0YXRlID0gaVxyXG5cdGlmIHN0YXRlIGluIFswLDFdXHJcblx0XHRpbnAuc2hvdygpXHJcblx0XHRpbnAuZWx0LmZvY3VzKClcclxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdGlucC52YWx1ZSgpXHJcblx0XHRzdGFydCA9IG5ldyBEYXRlKCkgIyBTSE9SVFxyXG5cclxua2V5UHJlc3NlZCA9IChldmVudCkgLT4gaGFuZGxlIGtleVxyXG5cclxuaGFuZGxlID0gKGtleSkgLT5cclxuXHRpZiBzdGF0ZSA9PSAtMlxyXG5cdFx0aWYga2V5ID09ICdFbnRlcidcclxuXHRcdFx0bmV3R2FtZSgpXHJcblx0XHRcdHN0YXRlID0gLTFcclxuXHRlbHNlIGlmIHN0YXRlID09IC0xXHJcblx0XHRpZiBrZXkgPT0gJ3onIHRoZW4gcGxheWVyIDBcclxuXHRcdGlmIGtleSA9PSAnbScgdGhlbiBwbGF5ZXIgMVxyXG5cdGVsc2UgaWYgc3RhdGUgaW4gWzAsMV1cclxuXHRcdGlmIGtleSA9PSAnRW50ZXInXHJcblx0XHRcdGFyciA9IGlucC52YWx1ZSgpXHJcblx0XHRcdGlucC52YWx1ZSBcIlwiXHJcblx0XHRcdGlucC5oaWRlKClcclxuXHRcdFx0YXJyID0gZ2V0UGFydHMgYXJyXHJcblx0XHRcdHN1Y2Nlc3MgPSBmYWxzZVxyXG5cdFx0XHRpZiBhcnIubGVuZ3RoID09IDJcclxuXHRcdFx0XHRjID0gcGFyc2VJbnQgYXJyWzBdXHJcblx0XHRcdFx0ZCA9IHBhcnNlSW50IGFyclsxXVxyXG5cdFx0XHRcdHN1Y2Nlc3MgPSBhPT1jIGFuZCBiPT1kIG9yIGE9PWQgYW5kIGI9PWNcclxuXHRcdFx0aWYgc3VjY2VzcyB0aGVuIHNjb3JlW3N0YXRlXSArPSAxIGVsc2Ugc2NvcmVbMS1zdGF0ZV0gKz0gMVxyXG5cdFx0XHRzdGF0ZSA9IDJcclxuXHRlbHNlIGlmIHN0YXRlID09IDJcclxuXHRcdGlmIGtleSA9PSAnRW50ZXInXHJcblx0XHRcdG5ld0dhbWUoKVxyXG5cdFx0XHRzdGF0ZSA9IC0xXHJcblxyXG5zZXR1cCA9IC0+XHJcblx0Y3JlYXRlQ2FudmFzIDYwMCw2MDBcclxuXHR0ZXh0U2l6ZSA0MFxyXG5cdHRleHRBbGlnbiBDRU5URVIsQ0VOVEVSXHJcblx0c2NvcmUgPSBbMCwwXVxyXG5cclxuXHRidXR0b25zLnB1c2ggbmV3IEJ1dHRvbiAneicsNjAsICAgICAgaGVpZ2h0LTYwLCAtPiBwbGF5ZXIgMFxyXG5cdGJ1dHRvbnMucHVzaCBuZXcgQnV0dG9uICdtJyx3aWR0aC02MCxoZWlnaHQtNjAsIC0+IHBsYXllciAxXHJcblx0YnV0dG9ucy5wdXNoIG5ldyBCdXR0b24gJ2VudGVyJyx3aWR0aC8yLGhlaWdodC02MCwgLT4gaGFuZGxlICdFbnRlcidcclxuXHJcblx0aW5wID0gY3JlYXRlSW5wdXQgJydcclxuXHRpbnAuaWQgPSAnaW5wdXQnXHJcblx0aW5wLmhpZGUoKVxyXG5cdGlucC5zdHlsZSAnZm9udC1zaXplJywgJzMwcHgnLCAnY29sb3InLCAnI2ZmMDAwMCdcclxuXHRpbnAucG9zaXRpb24gd2lkdGgvMi01MCwgMzUwXHJcblx0aW5wLnNpemUgMTAwXHJcblxyXG5cdG5ld0dhbWUoKVxyXG5cclxubW91c2VQcmVzc2VkID0gLT5cclxuXHRmb3IgYnV0dG9uIGluIGJ1dHRvbnNcclxuXHRcdGlmIGJ1dHRvbi5pbnNpZGUgbW91c2VYLG1vdXNlWVxyXG5cdFx0XHRidXR0b24uY2xpY2soKVxyXG4iXX0=
//# sourceURL=c:\github\2021\022-AddMul\coffee\sketch.coffee