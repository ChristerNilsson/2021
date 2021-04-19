// Generated by CoffeeScript 2.4.1
//n = points.length
var clock, curr, findNearest, initSpeaker, lastword, say, sayHint, speaker, voices;

curr = 0;

lastword = '';

speaker = null;

voices = null;

window.speechSynthesis.onvoiceschanged = function() {
  return voices = window.speechSynthesis.getVoices();
};

initSpeaker = function() {
  var index;
  index = 5; //int getParameters().speaker || 5
  speaker = new SpeechSynthesisUtterance();
  speaker.voiceURI = "native";
  speaker.volume = 1;
  speaker.rate = 1.0;
  speaker.pitch = 0;
  speaker.text = '';
  speaker.lang = 'en-GB';
  if (voices && index <= voices.length - 1) {
    speaker.voice = voices[index];
  }
  messages.push("Welcome! B");
  return say("Welcome!");
};

say = function(m) {
  if (speaker === null) {
    return;
  }
  speechSynthesis.cancel();
  speaker.text = m;
  return speechSynthesis.speak(speaker);
};

clock = function(d) {
  var res;
  res = (12 + Math.round(d / 30)) % 12;
  if (res === 0) {
    res = 12;
  }
  return res;
};

ass(11, clock(-30));

ass(12, clock(-14));

ass(12, clock(0));

ass(12, clock(14));

ass(1, clock(30));

ass(1, clock(44));

ass(2, clock(46));

sayHint = function(gps) {
  var N, b0, b1, diff, dist, points, word;
  N = 3;
  if (!currentPath) {
    return;
  }
  points = currentPath.points;
  [curr, dist] = findNearest(gps, points);
  messages.push(`sayHint ${curr} ${dist} ${gps}`);
  if (dist > 50) { // meters
    word = 'Track is gone';
    diff = 'nix';
  } else {
    b0 = bearing(points[curr + N], points[curr]);
    b1 = bearing(points[curr + 2 * N], points[curr + N]);
    diff = clock(b1 - b0);
    if (diff === 10 || diff === 9 || diff === 8 || diff === 7) {
      word = 'left';
    } else if (diff === 2 || diff === 3 || diff === 4 || diff === 5) {
      word = 'right';
    } else {
      word = 'straight';
    }
  }
  if (lastword !== word) {
    messages.push(`sayHint ${curr} of ${points.length} points:${points[curr]}\n word:${word}\n diff:${diff} dist:${dist}`);
    say(word);
  }
  return lastword = word;
};

findNearest = function(p1, polygon) {
  var best, d, dx, dy, i, index, j, len, p, ref, x, y;
  index = 0;
  [x, y] = p1;
  p = polygon[0];
  dx = p[0] - x;
  dy = p[1] - y;
  best = dx * dx + dy * dy;
  ref = range(polygon.length);
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    p = polygon[i];
    dx = p[0] - x;
    dy = p[1] - y;
    d = dx * dx + dy * dy;
    if (d < best) {
      best = d;
      index = i;
    }
  }
  return [index, Math.round(Math.sqrt(best))];
};

//path = '300,300,B00aAb0b0abaa0aAA0a0b0b0baa0cagaibhcjbgbfcddac0babadAaAbAcAcAbAaAbAbAbAbAaAcAbAaAbAbAcBb0aAcAaAaAbBbBbBbBbAaAbBbAbAaAaAbAaAc0cAa0dAc0bAcagahCfBeCeAcCbCbCbAaA0Cb0aCbDgEdDeBeBeAc0b0ccbae0c0cAcAcCdDeCfEdEcEcFbC0C0A0CaDaBaBaAaA0BaAbBaAbBaA0BbBaBaBbBaAaFfEbDaAaB0CaBaA0CaBaEaGaF0GaGbFeDfDfEfEeFeGcFdFdEcBd0ebd0dAfBgCgBf0gbgcecea0bbcfdfdgdeeefddedgag0h0g0gbgbfbfaccdcebbabac0a0AA0aa0bac0a0a0cab0aaa0babac0b0b0b0b0dhj0e0f0c0c0eac0d0cAa0cAbAlBfBeadAb0bAbBeBhBfAfBfDdBcAbCdEeFfFfFeEeEeEeEeEeDdDeDdCdAdadadbebe0b0c0a0cAgAeAcBdEdHcHaGaGaGaGAFAFBEBDDDDFDFEFDFCFBE0BbA0DeFdFaFAC0B0D0AaBbAbBb0aAb0eAgAfAfBeDeFeFcFcEdDdAaAdBfCfDfEfEfGdFeEdFcFdFcFeEeDeEdEcDcDbDcCcDdDcEdD0FADB0bBBBAB0CAA0CBBBAABCAABBACBFBGAFAFAF0EaBaA0BaB0CAA0CAC0C0BAC0B0BAA0ABCBAA0B0B0C0A0C0A0A0B00ABaA0B00aA0AaAaAbAaBaAbAbAaAbAaAbAaAb0aAa0aAb0a0aAa0bA00aAbAaAa0aAa0a0aA0AbAaCaAaA0Ba0aBa0aA0AaA0A0AaA0B0AaB0AaA0A0AaA00aAaAa0aAaAbAaAa0aBb0a0aA00a0b0a0b0a0b0a0bAaAa0a0a0aa00a0aaaaa0a0a0aAaA0AaA0AaCbBaFcEaBaDcFdGeFeEcDb0cCbCaDcEdDcCaAaA0DaDbBbAaCbBaCaCaBaCbBaBaBaA0BaAaBbBbBbBcCcBaBbAaAbBbBaAbAbAaAbBbAaBaBaAaCbCbAaBbBcAbBbAcBcAcAaBb0b0c0b0a0a0b0b0a0aaa0aAa0aAbAbAc0aAbAa0cAcAc0a0b0aab0a0baa0aaa0a0aa00a0a0a0aA00bAaAaAbAa0aAbAaAbAa0aAb0bAa0c0b0aAa0a0aAa0aAaAbAb0a0aA00b0b0a0b0a0cAa0cAaBbBcAbAaBaAbAbBaAcAaBbAaBcDd0aCb0aBbAaBcAcBcBc0aAaBbB00aAaAaAaAaAaAaAa0a0a0a0b0bAaAcAaBbAaAbCcCbA0BaBaC0B0b0a0a0aaa0a0bAbAa0aB0B0AABABAAABAAAACAA0A0AaA0AaBaCcAbAaAb0aBaB0CaA0EaC0AaD0DaB0AbAaAbAaAaBdAcAaAaAcAaAbAaAbBbAcAaAbAaAcAcBcAbAbBcAbBbBcAaA0CaCaCcGcFdFcFdFcEcEcEcDbDaBBC0FAHAGBHAGAG0FAEADABDAaBaBbBcAaAaBbCcDcBb0aAcAaAaB0A0A0BAA0BABABACACACBCABBA0BBDDBD0CaBaCbCbAcCcCbC0AbB0B0B0BaCABBFBHCIAHaHbHbHbE0CA00B0B0A0A0B0C0BaB0B0D0AACACBFAEACBBBDBCCDBBBACDDBBBBACBEBFBFBFAFBEBCA0ABCEDDDDAA0C0AABACABADAFAE0E0FaEAABCCBBFCFDFCFDECECDDCDBABAABaCaAaBcBgEfFcGcFaGaH0FAGBFBECAA0HcH0H0H0HAGBHAGCGBGDFCGDFCGCFCHBGBG0G0F0FaFbDcBcAdCcEcEcFbEa0aCaBbAaCbB0CaGCG0FaGAGBGBEAEBEBEAF0GBFBFBFAEaEcHaFAGCFCGDGCFCGBFCFCFDFDEDFDDEDECFCFDGCFCGBGCFCGBFBFAEBECGCFCEDEDECEDCECCAAB0CcAcaa0bafiehdgegdgceeddbdBeDfEfEfEfDfDfDfDfDfDeDfDfDfCeDfDgCeDeDdDdDdDdCcCcAdadbdcbcdcA0aaB0aAbAaAaAbBcBeDeEdDdDcCbBc0cabac0b0c0b0aBa0cCbBbB0AbBbAaBbDaB0B0A0A0BAAAB0BAB0B0AAC0E0C0AaBaCaBaBaAbBaAaAaBaAaB0A0B0AABAAABAA0E0AdCeEdEeEeFeEdEcDaF0E0EAECCDDFCFCEDDDEFDEDDDDBDADaEdEdEdEeEeEeFeEeFeFeEfEfDhBgCfCgEfDfEgDfDfEfEfDfFgEgEgEfFhFgFgFfFfDfEdCbBaCAA0A0A0AaBbB0AAAaAaBiJdGcHbGbHaGaHaG0HaH0HaGbHaGbHbGbGaGcFbEcF0FAGBGBGCFDGCFCGCFCGCFDFBEACcAdaac0fahcgdgcgcfcgbfcgcfcfcdfbeAfCfDfDgDgDfDgDgDgEgDfEeDbDCECGDGCHBGAGAG0G0GbGaGbFcGeFfDfDfCgCgCfDfDfDgCgCfDhDgCgCgCgBgBhAgBgBgBgBgCfCgAgCgCgBgCgBgBgCgBhCgBgBfBgBfBgAfBeBeBeBeCfCeCdDeDdCeDfDfDfCeDdCbCbBbCaAbAcAcBc0gFfEfEfEfEfDfCgBf0baababdcabbg0gafbbccdddac0ljhehchchcgbgbgagbgbhahagagAgBhBgCgCfCeAgBeBeBeAc0ebdbfdgdhdgdgcgcgdfdedcgbgahaecddededebg0gahBgCgAi0h0fceedfbhagagaeAeAgAgAg0faeagbhbfahaibfaf0hEgDhDgDgDhChChChEgDfDfCgDfDeCgDhDhDhCgBgDfDhChDiChBhAhAh0iai0hbhaf0fAfBfBfAeBeBfAeAfAfBfBeBcCbAA00a0A0aA00a'
//points = decodeAll path
// ass [0,0],    findNearest [300,300], points
// ass [55,12],  findNearest [260,200], points
// ass [1409,4], findNearest [670,190], points
// ass [1456,65],findNearest [350,350], points
// ass [1469,0], findNearest [306,296], points

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcaGludHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLElBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQTs7QUFFQSxJQUFBLEdBQU87O0FBQ1AsUUFBQSxHQUFXOztBQUNYLE9BQUEsR0FBVTs7QUFFVixNQUFBLEdBQVM7O0FBRVQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxlQUF2QixHQUF5QyxRQUFBLENBQUEsQ0FBQTtTQUFHLE1BQUEsR0FBUyxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQXZCLENBQUE7QUFBWjs7QUFFekMsV0FBQSxHQUFjLFFBQUEsQ0FBQSxDQUFBO0FBQ2IsTUFBQTtFQUFBLEtBQUEsR0FBUSxFQUFSO0VBQ0EsT0FBQSxHQUFVLElBQUksd0JBQUosQ0FBQTtFQUNWLE9BQU8sQ0FBQyxRQUFSLEdBQW1CO0VBQ25CLE9BQU8sQ0FBQyxNQUFSLEdBQWlCO0VBQ2pCLE9BQU8sQ0FBQyxJQUFSLEdBQWU7RUFDZixPQUFPLENBQUMsS0FBUixHQUFnQjtFQUNoQixPQUFPLENBQUMsSUFBUixHQUFlO0VBQ2YsT0FBTyxDQUFDLElBQVIsR0FBZTtFQUNmLElBQUcsTUFBQSxJQUFXLEtBQUEsSUFBUyxNQUFNLENBQUMsTUFBUCxHQUFjLENBQXJDO0lBQTRDLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLE1BQU8sQ0FBQSxLQUFBLEVBQW5FOztFQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsWUFBZDtTQUNBLEdBQUEsQ0FBSSxVQUFKO0FBWGE7O0FBYWQsR0FBQSxHQUFNLFFBQUEsQ0FBQyxDQUFELENBQUE7RUFDTCxJQUFHLE9BQUEsS0FBVyxJQUFkO0FBQXdCLFdBQXhCOztFQUNBLGVBQWUsQ0FBQyxNQUFoQixDQUFBO0VBQ0EsT0FBTyxDQUFDLElBQVIsR0FBZTtTQUNmLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixPQUF0QjtBQUpLOztBQU1OLEtBQUEsR0FBUSxRQUFBLENBQUMsQ0FBRCxDQUFBO0FBQ1AsTUFBQTtFQUFBLEdBQUEsR0FBTSxDQUFDLEVBQUEsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBRSxFQUFiLENBQU4sQ0FBQSxHQUF5QjtFQUMvQixJQUFHLEdBQUEsS0FBSyxDQUFSO0lBQWUsR0FBQSxHQUFNLEdBQXJCOztTQUNBO0FBSE87O0FBSVIsR0FBQSxDQUFJLEVBQUosRUFBUSxLQUFBLENBQU0sQ0FBQyxFQUFQLENBQVI7O0FBQ0EsR0FBQSxDQUFJLEVBQUosRUFBUSxLQUFBLENBQU0sQ0FBQyxFQUFQLENBQVI7O0FBQ0EsR0FBQSxDQUFJLEVBQUosRUFBUSxLQUFBLENBQU0sQ0FBTixDQUFSOztBQUNBLEdBQUEsQ0FBSSxFQUFKLEVBQVEsS0FBQSxDQUFNLEVBQU4sQ0FBUjs7QUFDQSxHQUFBLENBQUksQ0FBSixFQUFPLEtBQUEsQ0FBTSxFQUFOLENBQVA7O0FBQ0EsR0FBQSxDQUFJLENBQUosRUFBTyxLQUFBLENBQU0sRUFBTixDQUFQOztBQUNBLEdBQUEsQ0FBSSxDQUFKLEVBQU8sS0FBQSxDQUFNLEVBQU4sQ0FBUDs7QUFFQSxPQUFBLEdBQVUsUUFBQSxDQUFDLEdBQUQsQ0FBQTtBQUNULE1BQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUE7RUFBQSxDQUFBLEdBQUk7RUFDSixJQUFHLENBQUksV0FBUDtBQUF3QixXQUF4Qjs7RUFDQSxNQUFBLEdBQVMsV0FBVyxDQUFDO0VBQ3JCLENBQUMsSUFBRCxFQUFNLElBQU4sQ0FBQSxHQUFjLFdBQUEsQ0FBWSxHQUFaLEVBQWdCLE1BQWhCO0VBQ2QsUUFBUSxDQUFDLElBQVQsQ0FBYyxDQUFBLFFBQUEsQ0FBQSxDQUFXLElBQVgsRUFBQSxDQUFBLENBQW1CLElBQW5CLEVBQUEsQ0FBQSxDQUEyQixHQUEzQixDQUFBLENBQWQ7RUFFQSxJQUFHLElBQUEsR0FBTyxFQUFWO0lBQ0MsSUFBQSxHQUFPO0lBQ1AsSUFBQSxHQUFPLE1BRlI7R0FBQSxNQUFBO0lBSUMsRUFBQSxHQUFLLE9BQUEsQ0FBUSxNQUFPLENBQUEsSUFBQSxHQUFLLENBQUwsQ0FBZixFQUF5QixNQUFPLENBQUEsSUFBQSxDQUFoQztJQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBTyxDQUFBLElBQUEsR0FBSyxDQUFBLEdBQUUsQ0FBUCxDQUFmLEVBQXlCLE1BQU8sQ0FBQSxJQUFBLEdBQUssQ0FBTCxDQUFoQztJQUNMLElBQUEsR0FBTyxLQUFBLENBQU0sRUFBQSxHQUFHLEVBQVQ7SUFFUCxJQUFHLElBQUEsS0FBUyxFQUFULElBQUEsSUFBQSxLQUFZLENBQVosSUFBQSxJQUFBLEtBQWMsQ0FBZCxJQUFBLElBQUEsS0FBZ0IsQ0FBbkI7TUFBMkIsSUFBQSxHQUFPLE9BQWxDO0tBQUEsTUFDSyxJQUFHLElBQUEsS0FBUyxDQUFULElBQUEsSUFBQSxLQUFXLENBQVgsSUFBQSxJQUFBLEtBQWEsQ0FBYixJQUFBLElBQUEsS0FBZSxDQUFsQjtNQUEwQixJQUFBLEdBQU8sUUFBakM7S0FBQSxNQUFBO01BQ0EsSUFBQSxHQUFPLFdBRFA7S0FUTjs7RUFZQSxJQUFHLFFBQUEsS0FBWSxJQUFmO0lBQ0MsUUFBUSxDQUFDLElBQVQsQ0FBYyxDQUFBLFFBQUEsQ0FBQSxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBQSxDQUFzQixNQUFNLENBQUMsTUFBN0IsQ0FBb0MsUUFBcEMsQ0FBQSxDQUE4QyxNQUFPLENBQUEsSUFBQSxDQUFyRCxDQUEyRCxRQUEzRCxDQUFBLENBQXFFLElBQXJFLENBQTBFLFFBQTFFLENBQUEsQ0FBb0YsSUFBcEYsQ0FBeUYsTUFBekYsQ0FBQSxDQUFpRyxJQUFqRyxDQUFBLENBQWQ7SUFDQSxHQUFBLENBQUksSUFBSixFQUZEOztTQUdBLFFBQUEsR0FBVztBQXRCRjs7QUF3QlYsV0FBQSxHQUFjLFFBQUEsQ0FBQyxFQUFELEVBQUksT0FBSixDQUFBO0FBQ2IsTUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0VBQUEsS0FBQSxHQUFRO0VBQ1IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFBLEdBQVE7RUFDUixDQUFBLEdBQUksT0FBUSxDQUFBLENBQUE7RUFDWixFQUFBLEdBQUssQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPO0VBQ1osRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztFQUNaLElBQUEsR0FBTyxFQUFBLEdBQUcsRUFBSCxHQUFRLEVBQUEsR0FBRztBQUNsQjtFQUFBLEtBQUEscUNBQUE7O0lBQ0MsQ0FBQSxHQUFJLE9BQVEsQ0FBQSxDQUFBO0lBQ1osRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztJQUNaLEVBQUEsR0FBSyxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87SUFDWixDQUFBLEdBQUksRUFBQSxHQUFHLEVBQUgsR0FBUSxFQUFBLEdBQUc7SUFDZixJQUFHLENBQUEsR0FBSSxJQUFQO01BQ0MsSUFBQSxHQUFPO01BQ1AsS0FBQSxHQUFRLEVBRlQ7O0VBTEQ7U0FRQSxDQUFDLEtBQUQsRUFBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFYLENBQVI7QUFmYTs7QUFqRWQiLCJzb3VyY2VzQ29udGVudCI6WyIjbiA9IHBvaW50cy5sZW5ndGhcclxuXHJcbmN1cnIgPSAwXHJcbmxhc3R3b3JkID0gJydcclxuc3BlYWtlciA9IG51bGxcclxuXHJcbnZvaWNlcyA9IG51bGxcclxuXHJcbndpbmRvdy5zcGVlY2hTeW50aGVzaXMub252b2ljZXNjaGFuZ2VkID0gLT4gdm9pY2VzID0gd2luZG93LnNwZWVjaFN5bnRoZXNpcy5nZXRWb2ljZXMoKVxyXG5cclxuaW5pdFNwZWFrZXIgPSAtPlxyXG5cdGluZGV4ID0gNSAjaW50IGdldFBhcmFtZXRlcnMoKS5zcGVha2VyIHx8IDVcclxuXHRzcGVha2VyID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSgpXHJcblx0c3BlYWtlci52b2ljZVVSSSA9IFwibmF0aXZlXCJcclxuXHRzcGVha2VyLnZvbHVtZSA9IDFcclxuXHRzcGVha2VyLnJhdGUgPSAxLjBcclxuXHRzcGVha2VyLnBpdGNoID0gMFxyXG5cdHNwZWFrZXIudGV4dCA9ICcnXHJcblx0c3BlYWtlci5sYW5nID0gJ2VuLUdCJ1xyXG5cdGlmIHZvaWNlcyBhbmQgaW5kZXggPD0gdm9pY2VzLmxlbmd0aC0xIHRoZW4gc3BlYWtlci52b2ljZSA9IHZvaWNlc1tpbmRleF1cclxuXHRtZXNzYWdlcy5wdXNoIFwiV2VsY29tZSEgQlwiXHJcblx0c2F5IFwiV2VsY29tZSFcIlxyXG5cclxuc2F5ID0gKG0pIC0+XHJcblx0aWYgc3BlYWtlciA9PSBudWxsIHRoZW4gcmV0dXJuXHJcblx0c3BlZWNoU3ludGhlc2lzLmNhbmNlbCgpXHJcblx0c3BlYWtlci50ZXh0ID0gbVxyXG5cdHNwZWVjaFN5bnRoZXNpcy5zcGVhayBzcGVha2VyXHJcblxyXG5jbG9jayA9IChkKSAtPlxyXG5cdHJlcyA9ICgxMiArIE1hdGgucm91bmQgZC8zMCkgJSAxMlxyXG5cdGlmIHJlcz09MCB0aGVuIHJlcyA9IDEyXHJcblx0cmVzXHRcclxuYXNzIDExLCBjbG9jayAtMzBcclxuYXNzIDEyLCBjbG9jayAtMTRcclxuYXNzIDEyLCBjbG9jayAwXHJcbmFzcyAxMiwgY2xvY2sgMTRcclxuYXNzIDEsIGNsb2NrIDMwXHJcbmFzcyAxLCBjbG9jayA0NFxyXG5hc3MgMiwgY2xvY2sgNDZcclxuXHJcbnNheUhpbnQgPSAoZ3BzKSAtPlxyXG5cdE4gPSAzXHJcblx0aWYgbm90IGN1cnJlbnRQYXRoIHRoZW4gcmV0dXJuXHJcblx0cG9pbnRzID0gY3VycmVudFBhdGgucG9pbnRzXHJcblx0W2N1cnIsZGlzdF0gPSBmaW5kTmVhcmVzdCBncHMscG9pbnRzXHJcblx0bWVzc2FnZXMucHVzaCBcInNheUhpbnQgI3tjdXJyfSAje2Rpc3R9ICN7Z3BzfVwiXHJcblxyXG5cdGlmIGRpc3QgPiA1MCAjIG1ldGVyc1xyXG5cdFx0d29yZCA9ICdUcmFjayBpcyBnb25lJ1xyXG5cdFx0ZGlmZiA9ICduaXgnXHJcblx0ZWxzZVxyXG5cdFx0YjAgPSBiZWFyaW5nKHBvaW50c1tjdXJyK04gIF0scG9pbnRzW2N1cnIgIF0pXHJcblx0XHRiMSA9IGJlYXJpbmcocG9pbnRzW2N1cnIrMipOXSxwb2ludHNbY3VycitOXSlcclxuXHRcdGRpZmYgPSBjbG9jayBiMS1iMFxyXG5cclxuXHRcdGlmIGRpZmYgaW4gWzEwLDksOCw3XSB0aGVuIHdvcmQgPSAnbGVmdCdcclxuXHRcdGVsc2UgaWYgZGlmZiBpbiBbMiwzLDQsNV0gdGhlbiB3b3JkID0gJ3JpZ2h0J1xyXG5cdFx0ZWxzZSB3b3JkID0gJ3N0cmFpZ2h0J1xyXG5cclxuXHRpZiBsYXN0d29yZCAhPSB3b3JkXHJcblx0XHRtZXNzYWdlcy5wdXNoIFwic2F5SGludCAje2N1cnJ9IG9mICN7cG9pbnRzLmxlbmd0aH0gcG9pbnRzOiN7cG9pbnRzW2N1cnJdfVxcbiB3b3JkOiN7d29yZH1cXG4gZGlmZjoje2RpZmZ9IGRpc3Q6I3tkaXN0fVwiXHJcblx0XHRzYXkgd29yZFxyXG5cdGxhc3R3b3JkID0gd29yZFxyXG5cclxuZmluZE5lYXJlc3QgPSAocDEscG9seWdvbikgLT5cclxuXHRpbmRleCA9IDBcclxuXHRbeCx5XSA9IHAxXHJcblx0cCA9IHBvbHlnb25bMF1cclxuXHRkeCA9IHBbMF0gLSB4XHJcblx0ZHkgPSBwWzFdIC0geVxyXG5cdGJlc3QgPSBkeCpkeCArIGR5KmR5XHJcblx0Zm9yIGkgaW4gcmFuZ2UgcG9seWdvbi5sZW5ndGhcclxuXHRcdHAgPSBwb2x5Z29uW2ldXHJcblx0XHRkeCA9IHBbMF0gLSB4XHJcblx0XHRkeSA9IHBbMV0gLSB5XHJcblx0XHRkID0gZHgqZHggKyBkeSpkeVxyXG5cdFx0aWYgZCA8IGJlc3RcclxuXHRcdFx0YmVzdCA9IGRcclxuXHRcdFx0aW5kZXggPSBpXHJcblx0W2luZGV4LCBNYXRoLnJvdW5kIE1hdGguc3FydCBiZXN0XVxyXG5cclxuI3BhdGggPSAnMzAwLDMwMCxCMDBhQWIwYjBhYmFhMGFBQTBhMGIwYjBiYWEwY2FnYWliaGNqYmdiZmNkZGFjMGJhYmFkQWFBYkFjQWNBYkFhQWJBYkFiQWJBYUFjQWJBYUFiQWJBY0JiMGFBY0FhQWFBYkJiQmJCYkJiQWFBYkJiQWJBYUFhQWJBYUFjMGNBYTBkQWMwYkFjYWdhaENmQmVDZUFjQ2JDYkNiQWFBMENiMGFDYkRnRWREZUJlQmVBYzBiMGNjYmFlMGMwY0FjQWNDZERlQ2ZFZEVjRWNGYkMwQzBBMENhRGFCYUJhQWFBMEJhQWJCYUFiQmFBMEJiQmFCYUJiQmFBYUZmRWJEYUFhQjBDYUJhQTBDYUJhRWFHYUYwR2FHYkZlRGZEZkVmRWVGZUdjRmRGZEVjQmQwZWJkMGRBZkJnQ2dCZjBnYmdjZWNlYTBiYmNmZGZkZ2RlZWVmZGRlZGdhZzBoMGcwZ2JnYmZiZmFjY2RjZWJiYWJhYzBhMEFBMGFhMGJhYzBhMGEwY2FiMGFhYTBiYWJhYzBiMGIwYjBiMGRoajBlMGYwYzBjMGVhYzBkMGNBYTBjQWJBbEJmQmVhZEFiMGJBYkJlQmhCZkFmQmZEZEJjQWJDZEVlRmZGZkZlRWVFZUVlRWVFZURkRGVEZENkQWRhZGFkYmViZTBiMGMwYTBjQWdBZUFjQmRFZEhjSGFHYUdhR2FHQUZBRkJFQkRERERGREZFRkRGQ0ZCRTBCYkEwRGVGZEZhRkFDMEIwRDBBYUJiQWJCYjBhQWIwZUFnQWZBZkJlRGVGZUZjRmNFZERkQWFBZEJmQ2ZEZkVmRWZHZEZlRWRGY0ZkRmNGZUVlRGVFZEVjRGNEYkRjQ2NEZERjRWREMEZBREIwYkJCQkFCMENBQTBDQkJCQUFCQ0FBQkJBQ0JGQkdBRkFGQUYwRWFCYUEwQmFCMENBQTBDQUMwQzBCQUMwQjBCQUEwQUJDQkFBMEIwQjBDMEEwQzBBMEEwQjAwQUJhQTBCMDBhQTBBYUFhQWJBYUJhQWJBYkFhQWJBYUFiQWFBYjBhQWEwYUFiMGEwYUFhMGJBMDBhQWJBYUFhMGFBYTBhMGFBMEFiQWFDYUFhQTBCYTBhQmEwYUEwQWFBMEEwQWFBMEIwQWFCMEFhQTBBMEFhQTAwYUFhQWEwYUFhQWJBYUFhMGFCYjBhMGFBMDBhMGIwYTBiMGEwYjBhMGJBYUFhMGEwYTBhYTAwYTBhYWFhYTBhMGEwYUFhQTBBYUEwQWFDYkJhRmNFYUJhRGNGZEdlRmVFY0RiMGNDYkNhRGNFZERjQ2FBYUEwRGFEYkJiQWFDYkJhQ2FDYUJhQ2JCYUJhQmFBMEJhQWFCYkJiQmJCY0NjQmFCYkFhQWJCYkJhQWJBYkFhQWJCYkFhQmFCYUFhQ2JDYkFhQmJCY0FiQmJBY0JjQWNBYUJiMGIwYzBiMGEwYTBiMGIwYTBhYWEwYUFhMGFBYkFiQWMwYUFiQWEwY0FjQWMwYTBiMGFhYjBhMGJhYTBhYWEwYTBhYTAwYTBhMGEwYUEwMGJBYUFhQWJBYTBhQWJBYUFiQWEwYUFiMGJBYTBjMGIwYUFhMGEwYUFhMGFBYUFiQWIwYTBhQTAwYjBiMGEwYjBhMGNBYTBjQWFCYkJjQWJBYUJhQWJBYkJhQWNBYUJiQWFCY0RkMGFDYjBhQmJBYUJjQWNCY0JjMGFBYUJiQjAwYUFhQWFBYUFhQWFBYUFhMGEwYTBhMGIwYkFhQWNBYUJiQWFBYkNjQ2JBMEJhQmFDMEIwYjBhMGEwYWFhMGEwYkFiQWEwYUIwQjBBQUJBQkFBQUJBQUFBQ0FBMEEwQWFBMEFhQmFDY0FiQWFBYjBhQmFCMENhQTBFYUMwQWFEMERhQjBBYkFhQWJBYUFhQmRBY0FhQWFBY0FhQWJBYUFiQmJBY0FhQWJBYUFjQWNCY0FiQWJCY0FiQmJCY0FhQTBDYUNhQ2NHY0ZkRmNGZEZjRWNFY0VjRGJEYUJCQzBGQUhBR0JIQUdBRzBGQUVBREFCREFhQmFCYkJjQWFBYUJiQ2NEY0JiMGFBY0FhQWFCMEEwQTBCQUEwQkFCQUJBQ0FDQUNCQ0FCQkEwQkJEREJEMENhQmFDYkNiQWNDY0NiQzBBYkIwQjBCMEJhQ0FCQkZCSENJQUhhSGJIYkhiRTBDQTAwQjBCMEEwQTBCMEMwQmFCMEIwRDBBQUNBQ0JGQUVBQ0JCQkRCQ0NEQkJCQUNEREJCQkJBQ0JFQkZCRkJGQUZCRUJDQTBBQkNFREREREFBMEMwQUFCQUNBQkFEQUZBRTBFMEZhRUFBQkNDQkJGQ0ZERkNGREVDRUNERENEQkFCQUFCYUNhQWFCY0JnRWZGY0djRmFHYUgwRkFHQkZCRUNBQTBIY0gwSDBIMEhBR0JIQUdDR0JHREZDR0RGQ0dDRkNIQkdCRzBHMEYwRmFGYkRjQmNBZENjRWNFY0ZiRWEwYUNhQmJBYUNiQjBDYUdDRzBGYUdBR0JHQkVBRUJFQkVBRjBHQkZCRkJGQUVhRWNIYUZBR0NGQ0dER0NGQ0dCRkNGQ0ZERkRFREZEREVERUNGQ0ZER0NGQ0dCR0NGQ0dCRkJGQUVCRUNHQ0ZDRURFREVDRURDRUNDQUFCMENjQWNhYTBiYWZpZWhkZ2VnZGdjZWVkZGJkQmVEZkVmRWZFZkRmRGZEZkRmRGZEZURmRGZEZkNlRGZEZ0NlRGVEZERkRGREZENjQ2NBZGFkYmRjYmNkY0EwYWFCMGFBYkFhQWFBYkJjQmVEZUVkRGREY0NiQmMwY2FiYWMwYjBjMGIwYUJhMGNDYkJiQjBBYkJiQWFCYkRhQjBCMEEwQTBCQUFBQjBCQUIwQjBBQUMwRTBDMEFhQmFDYUJhQmFBYkJhQWFBYUJhQWFCMEEwQjBBQUJBQUFCQUEwRTBBZENlRWRFZUVlRmVFZEVjRGFGMEUwRUFFQ0NEREZDRkNFRERERUZERURERERCREFEYUVkRWRFZEVlRWVFZUZlRWVGZUZlRWZFZkRoQmdDZkNnRWZEZkVnRGZEZkVmRWZEZkZnRWdFZ0VmRmhGZ0ZnRmZGZkRmRWRDYkJhQ0FBMEEwQTBBYUJiQjBBQUFhQWFCaUpkR2NIYkdiSGFHYUhhRzBIYUgwSGFHYkhhR2JIYkdiR2FHY0ZiRWNGMEZBR0JHQkdDRkRHQ0ZDR0NGQ0dDRkRGQkVBQ2NBZGFhYzBmYWhjZ2RnY2djZmNnYmZjZ2NmY2ZjZGZiZUFmQ2ZEZkRnRGdEZkRnRGdEZ0VnRGZFZURiRENFQ0dER0NIQkdBR0FHMEcwR2JHYUdiRmNHZUZmRGZEZkNnQ2dDZkRmRGZEZ0NnQ2ZEaERnQ2dDZ0NnQmdCaEFnQmdCZ0JnQmdDZkNnQWdDZ0NnQmdDZ0JnQmdDZ0JoQ2dCZ0JmQmdCZkJnQWZCZUJlQmVCZUNmQ2VDZERlRGRDZURmRGZEZkNlRGRDYkNiQmJDYUFiQWNBY0JjMGdGZkVmRWZFZkVmRGZDZ0JmMGJhYWJhYmRjYWJiZzBnYWZiYmNjZGRkYWMwbGpoZWhjaGNoY2diZ2JnYWdiZ2JoYWhhZ2FnQWdCaEJnQ2dDZkNlQWdCZUJlQmVBYzBlYmRiZmRnZGhkZ2RnY2djZ2RmZGVkY2diZ2FoYWVjZGRlZGVkZWJnMGdhaEJnQ2dBaTBoMGZjZWVkZmJoYWdhZ2FlQWVBZ0FnQWcwZmFlYWdiaGJmYWhhaWJmYWYwaEVnRGhEZ0RnRGhDaENoQ2hFZ0RmRGZDZ0RmRGVDZ0RoRGhEaENnQmdEZkRoQ2hEaUNoQmhBaEFoMGlhaTBoYmhhZjBmQWZCZkJmQWVCZUJmQWVBZkFmQmZCZUJjQ2JBQTAwYTBBMGFBMDBhJ1xyXG4jcG9pbnRzID0gZGVjb2RlQWxsIHBhdGhcclxuIyBhc3MgWzAsMF0sICAgIGZpbmROZWFyZXN0IFszMDAsMzAwXSwgcG9pbnRzXHJcbiMgYXNzIFs1NSwxMl0sICBmaW5kTmVhcmVzdCBbMjYwLDIwMF0sIHBvaW50c1xyXG4jIGFzcyBbMTQwOSw0XSwgZmluZE5lYXJlc3QgWzY3MCwxOTBdLCBwb2ludHNcclxuIyBhc3MgWzE0NTYsNjVdLGZpbmROZWFyZXN0IFszNTAsMzUwXSwgcG9pbnRzXHJcbiMgYXNzIFsxNDY5LDBdLCBmaW5kTmVhcmVzdCBbMzA2LDI5Nl0sIHBvaW50c1xyXG4iXX0=
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\hints.coffee