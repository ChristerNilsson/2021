// Generated by CoffeeScript 2.4.1
//n = points.length
var clock, curr, findNearest, initSpeaker, lastword, say, sayHint, speaker;

curr = 0;

lastword = '';

speaker = null;

initSpeaker = function() {
  var index;
  index = 4; //int getParameters().speaker || 5
  speaker = new SpeechSynthesisUtterance();
  speaker.voiceURI = "native";
  speaker.volume = 1;
  speaker.rate = 1.0;
  speaker.pitch = 0;
  speaker.text = '';
  speaker.lang = 'en-GB';
  messages.push("Welcome!");
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
  if (lastword !== word) {
    messages.push(`sayHint ${curr} of ${points.length} points:${points[curr]} word:${word} diff:${diff} dist:${dist}`);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcaGludHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLElBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBOztBQUVBLElBQUEsR0FBTzs7QUFDUCxRQUFBLEdBQVc7O0FBQ1gsT0FBQSxHQUFVOztBQUVWLFdBQUEsR0FBYyxRQUFBLENBQUEsQ0FBQTtBQUNiLE1BQUE7RUFBQSxLQUFBLEdBQVEsRUFBUjtFQUNBLE9BQUEsR0FBVSxJQUFJLHdCQUFKLENBQUE7RUFDVixPQUFPLENBQUMsUUFBUixHQUFtQjtFQUNuQixPQUFPLENBQUMsTUFBUixHQUFpQjtFQUNqQixPQUFPLENBQUMsSUFBUixHQUFlO0VBQ2YsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7RUFDaEIsT0FBTyxDQUFDLElBQVIsR0FBZTtFQUNmLE9BQU8sQ0FBQyxJQUFSLEdBQWU7RUFDZixRQUFRLENBQUMsSUFBVCxDQUFjLFVBQWQ7U0FDQSxHQUFBLENBQUksVUFBSjtBQVZhOztBQVlkLEdBQUEsR0FBTSxRQUFBLENBQUMsQ0FBRCxDQUFBO0VBQ0wsSUFBRyxPQUFBLEtBQVcsSUFBZDtBQUF3QixXQUF4Qjs7RUFDQSxlQUFlLENBQUMsTUFBaEIsQ0FBQTtFQUNBLE9BQU8sQ0FBQyxJQUFSLEdBQWU7U0FDZixlQUFlLENBQUMsS0FBaEIsQ0FBc0IsT0FBdEI7QUFKSzs7QUFNTixLQUFBLEdBQVEsUUFBQSxDQUFDLENBQUQsQ0FBQTtBQUNQLE1BQUE7RUFBQSxHQUFBLEdBQU0sQ0FBQyxFQUFBLEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUUsRUFBYixDQUFOLENBQUEsR0FBeUI7RUFDL0IsSUFBRyxHQUFBLEtBQUssQ0FBUjtJQUFlLEdBQUEsR0FBTSxHQUFyQjs7U0FDQTtBQUhPOztBQUlSLEdB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Q0FBRixHQUFPO0lBQ1osRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztJQUNaLENBQUEsR0FBSSxFQUFBLEdBQUcsRUFBSCxHQUFRLEVBQUEsR0FBRztJQUNmLElBQUcsQ0FBQSxHQUFJLElBQVA7TUFDQyxJQUFBLEdBQU87TUFDUCxLQUFBLEdBQVEsRUFGVDs7RUFMRDtTQVFBLENBQUMsS0FBRCxFQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQVgsQ0FBUjtBQWZhOztBQXREZCIsInNvdXJjZXNDb250ZW50IjpbIiNuID0gcG9pbnRzLmxlbmd0aFxyXG5cclxuY3VyciA9IDBcclxubGFzdHdvcmQgPSAnJ1xyXG5zcGVha2VyID0gbnVsbFxyXG5cclxuaW5pdFNwZWFrZXIgPSAtPlxyXG5cdGluZGV4ID0gNCAjaW50IGdldFBhcmFtZXRlcnMoKS5zcGVha2VyIHx8IDVcclxuXHRzcGVha2VyID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSgpXHJcblx0c3BlYWtlci52b2ljZVVSSSA9IFwibmF0aXZlXCJcclxuXHRzcGVha2VyLnZvbHVtZSA9IDFcclxuXHRzcGVha2VyLnJhdGUgPSAxLjBcclxuXHRzcGVha2VyLnBpdGNoID0gMFxyXG5cdHNwZWFrZXIudGV4dCA9ICcnXHJcblx0c3BlYWtlci5sYW5nID0gJ2VuLUdCJ1xyXG5cdG1lc3NhZ2VzLnB1c2ggXCJXZWxjb21lIVwiXHJcblx0c2F5IFwiV2VsY29tZSFcIlxyXG5cclxuc2F5ID0gKG0pIC0+XHJcblx0aWYgc3BlYWtlciA9PSBudWxsIHRoZW4gcmV0dXJuXHJcblx0c3BlZWNoU3ludGhlc2lzLmNhbmNlbCgpXHJcblx0c3BlYWtlci50ZXh0ID0gbVxyXG5cdHNwZWVjaFN5bnRoZXNpcy5zcGVhayBzcGVha2VyXHJcblxyXG5jbG9jayA9IChkKSAtPlxyXG5cdHJlcyA9ICgxMiArIE1hdGgucm91bmQgZC8zMCkgJSAxMlxyXG5cdGlmIHJlcz09MCB0aGVuIHJlcyA9IDEyXHJcblx0cmVzXHRcclxuYXNzIDExLCBjbG9jayAtMzBcclxuYXNzIDEyLCBjbG9jayAtMTRcclxuYXNzIDEyLCBjbG9jayAwXHJcbmFzcyAxMiwgY2xvY2sgMTRcclxuYXNzIDEsIGNsb2NrIDMwXHJcbmFzcyAxLCBjbG9jayA0NFxyXG5hc3MgMiwgY2xvY2sgNDZcclxuXHJcbnNheUhpbnQgPSAoZ3BzKSAtPlxyXG5cdE4gPSAzXHJcblx0aWYgbm90IGN1cnJlbnRQYXRoIHRoZW4gcmV0dXJuXHJcblx0cG9pbnRzID0gY3VycmVudFBhdGgucG9pbnRzXHJcblx0W2N1cnIsZGlzdF0gPSBmaW5kTmVhcmVzdCBncHMscG9pbnRzXHJcblx0YjAgPSBiZWFyaW5nKHBvaW50c1tjdXJyK04gIF0scG9pbnRzW2N1cnIgIF0pXHJcblx0YjEgPSBiZWFyaW5nKHBvaW50c1tjdXJyKzIqTl0scG9pbnRzW2N1cnIrTl0pXHJcblx0ZGlmZiA9IGNsb2NrIGIxLWIwXHJcblxyXG5cdGlmIGRpZmYgaW4gWzEwLDksOCw3XSB0aGVuIHdvcmQgPSAnbGVmdCdcclxuXHRlbHNlIGlmIGRpZmYgaW4gWzIsMyw0LDVdIHRoZW4gd29yZCA9ICdyaWdodCdcclxuXHRlbHNlIHdvcmQgPSAnc3RyYWlnaHQnXHJcblxyXG5cdGlmIGxhc3R3b3JkICE9IHdvcmRcclxuXHRcdG1lc3NhZ2VzLnB1c2ggXCJzYXlIaW50ICN7Y3Vycn0gb2YgI3twb2ludHMubGVuZ3RofSBwb2ludHM6I3twb2ludHNbY3Vycl19IHdvcmQ6I3t3b3JkfSBkaWZmOiN7ZGlmZn0gZGlzdDoje2Rpc3R9XCJcclxuXHRcdHNheSB3b3JkXHJcblx0bGFzdHdvcmQgPSB3b3JkXHJcblxyXG5maW5kTmVhcmVzdCA9IChwMSxwb2x5Z29uKSAtPlxyXG5cdGluZGV4ID0gMFxyXG5cdFt4LHldID0gcDFcclxuXHRwID0gcG9seWdvblswXVxyXG5cdGR4ID0gcFswXSAtIHhcclxuXHRkeSA9IHBbMV0gLSB5XHJcblx0YmVzdCA9IGR4KmR4ICsgZHkqZHlcclxuXHRmb3IgaSBpbiByYW5nZSBwb2x5Z29uLmxlbmd0aFxyXG5cdFx0cCA9IHBvbHlnb25baV1cclxuXHRcdGR4ID0gcFswXSAtIHhcclxuXHRcdGR5ID0gcFsxXSAtIHlcclxuXHRcdGQgPSBkeCpkeCArIGR5KmR5XHJcblx0XHRpZiBkIDwgYmVzdFxyXG5cdFx0XHRiZXN0ID0gZFxyXG5cdFx0XHRpbmRleCA9IGlcclxuXHRbaW5kZXgsIE1hdGgucm91bmQgTWF0aC5zcXJ0IGJlc3RdXHJcblxyXG4jcGF0aCA9ICczMDAsMzAwLEIwMGFBYjBiMGFiYWEwYUFBMGEwYjBiMGJhYTBjYWdhaWJoY2piZ2JmY2RkYWMwYmFiYWRBYUFiQWNBY0FiQWFBYkFiQWJBYkFhQWNBYkFhQWJBYkFjQmIwYUFjQWFBYUFiQmJCYkJiQmJBYUFiQmJBYkFhQWFBYkFhQWMwY0FhMGRBYzBiQWNhZ2FoQ2ZCZUNlQWNDYkNiQ2JBYUEwQ2IwYUNiRGdFZERlQmVCZUFjMGIwY2NiYWUwYzBjQWNBY0NkRGVDZkVkRWNFY0ZiQzBDMEEwQ2FEYUJhQmFBYUEwQmFBYkJhQWJCYUEwQmJCYUJhQmJCYUFhRmZFYkRhQWFCMENhQmFBMENhQmFFYUdhRjBHYUdiRmVEZkRmRWZFZUZlR2NGZEZkRWNCZDBlYmQwZEFmQmdDZ0JmMGdiZ2NlY2VhMGJiY2ZkZmRnZGVlZWZkZGVkZ2FnMGgwZzBnYmdiZmJmYWNjZGNlYmJhYmFjMGEwQUEwYWEwYmFjMGEwYTBjYWIwYWFhMGJhYmFjMGIwYjBiMGIwZGhqMGUwZjBjMGMwZWFjMGQwY0FhMGNBYkFsQmZCZWFkQWIwYkFiQmVCaEJmQWZCZkRkQmNBYkNkRWVGZkZmRmVFZUVlRWVFZUVlRGREZURkQ2RBZGFkYWRiZWJlMGIwYzBhMGNBZ0FlQWNCZEVkSGNIYUdhR2FHYUdBRkFGQkVCREREREZERkVGREZDRkJFMEJiQTBEZUZkRmFGQUMwQjBEMEFhQmJBYkJiMGFBYjBlQWdBZkFmQmVEZUZlRmNGY0VkRGRBYUFkQmZDZkRmRWZFZkdkRmVFZEZjRmRGY0ZlRWVEZUVkRWNEY0RiRGNDY0RkRGNFZEQwRkFEQjBiQkJCQUIwQ0FBMENCQkJBQUJDQUFCQkFDQkZCR0FGQUZBRjBFYUJhQTBCYUIwQ0FBMENBQzBDMEJBQzBCMEJBQTBBQkNCQUEwQjBCMEMwQTBDMEEwQTBCMDBBQmFBMEIwMGFBMEFhQWFBYkFhQmFBYkFiQWFBYkFhQWJBYUFiMGFBYTBhQWIwYTBhQWEwYkEwMGFBYkFhQWEwYUFhMGEwYUEwQWJBYUNhQWFBMEJhMGFCYTBhQTBBYUEwQTBBYUEwQjBBYUIwQWFBMEEwQWFBMDBhQWFBYTBhQWFBYkFhQWEwYUJiMGEwYUEwMGEwYjBhMGIwYTBiMGEwYkFhQWEwYTBhMGFhMDBhMGFhYWFhMGEwYTBhQWFBMEFhQTBBYUNiQmFGY0VhQmFEY0ZkR2VGZUVjRGIwY0NiQ2FEY0VkRGNDYUFhQTBEYURiQmJBYUNiQmFDYUNhQmFDYkJhQmFCYUEwQmFBYUJiQmJCYkJjQ2NCYUJiQWFBYkJiQmFBYkFiQWFBYkJiQWFCYUJhQWFDYkNiQWFCYkJjQWJCYkFjQmNBY0FhQmIwYjBjMGIwYTBhMGIwYjBhMGFhYTBhQWEwYUFiQWJBYzBhQWJBYTBjQWNBYzBhMGIwYWFiMGEwYmFhMGFhYTBhMGFhMDBhMGEwYTBhQTAwYkFhQWFBYkFhMGFBYkFhQWJBYTBhQWIwYkFhMGMwYjBhQWEwYTBhQWEwYUFhQWJBYjBhMGFBMDBiMGIwYTBiMGEwY0FhMGNBYUJiQmNBYkFhQmFBYkFiQmFBY0FhQmJBYUJjRGQwYUNiMGFCYkFhQmNBY0JjQmMwYUFhQmJCMDBhQWFBYUFhQWFBYUFhQWEwYTBhMGEwYjBiQWFBY0FhQmJBYUFiQ2NDYkEwQmFCYUMwQjBiMGEwYTBhYWEwYTBiQWJBYTBhQjBCMEFBQkFCQUFBQkFBQUFDQUEwQTBBYUEwQWFCYUNjQWJBYUFiMGFCYUIwQ2FBMEVhQzBBYUQwRGFCMEFiQWFBYkFhQWFCZEFjQWFBYUFjQWFBYkFhQWJCYkFjQWFBYkFhQWNBY0JjQWJBYkJjQWJCYkJjQWFBMENhQ2FDY0djRmRGY0ZkRmNFY0VjRWNEYkRhQkJDMEZBSEFHQkhBR0FHMEZBRUFEQUJEQWFCYUJiQmNBYUFhQmJDY0RjQmIwYUFjQWFBYUIwQTBBMEJBQTBCQUJBQkFDQUNBQ0JDQUJCQTBCQkREQkQwQ2FCYUNiQ2JBY0NjQ2JDMEFiQjBCMEIwQmFDQUJCRkJIQ0lBSGFIYkhiSGJFMENBMDBCMEIwQTBBMEIwQzBCYUIwQjBEMEFBQ0FDQkZBRUFDQkJCREJDQ0RCQkJBQ0REQkJCQkFDQkVCRkJGQkZBRkJFQkNBMEFCQ0VEREREQUEwQzBBQUJBQ0FCQURBRkFFMEUwRmFFQUFCQ0NCQkZDRkRGQ0ZERUNFQ0REQ0RCQUJBQUJhQ2FBYUJjQmdFZkZjR2NGYUdhSDBGQUdCRkJFQ0FBMEhjSDBIMEgwSEFHQkhBR0NHQkdERkNHREZDR0NGQ0hCR0JHMEcwRjBGYUZiRGNCY0FkQ2NFY0VjRmJFYTBhQ2FCYkFhQ2JCMENhR0NHMEZhR0FHQkdCRUFFQkVCRUFGMEdCRkJGQkZBRWFFY0hhRkFHQ0ZDR0RHQ0ZDR0JGQ0ZDRkRGREVERkRERURFQ0ZDRkRHQ0ZDR0JHQ0ZDR0JGQkZBRUJFQ0dDRkNFREVERUNFRENFQ0NBQUIwQ2NBY2FhMGJhZmllaGRnZWdkZ2NlZWRkYmRCZURmRWZFZkVmRGZEZkRmRGZEZkRlRGZEZkRmQ2VEZkRnQ2VEZURkRGREZERkQ2NDY0FkYWRiZGNiY2RjQTBhYUIwYUFiQWFBYUFiQmNCZURlRWREZERjQ2JCYzBjYWJhYzBiMGMwYjBhQmEwY0NiQmJCMEFiQmJBYUJiRGFCMEIwQTBBMEJBQUFCMEJBQjBCMEFBQzBFMEMwQWFCYUNhQmFCYUFiQmFBYUFhQmFBYUIwQTBCMEFBQkFBQUJBQTBFMEFkQ2VFZEVlRWVGZUVkRWNEYUYwRTBFQUVDQ0RERkNGQ0VERERFRkRFREREREJEQURhRWRFZEVkRWVFZUVlRmVFZUZlRmVFZkVmRGhCZ0NmQ2dFZkRmRWdEZkRmRWZFZkRmRmdFZ0VnRWZGaEZnRmdGZkZmRGZFZENiQmFDQUEwQTBBMEFhQmJCMEFBQWFBYUJpSmRHY0hiR2JIYUdhSGFHMEhhSDBIYUdiSGFHYkhiR2JHYUdjRmJFY0YwRkFHQkdCR0NGREdDRkNHQ0ZDR0NGREZCRUFDY0FkYWFjMGZhaGNnZGdjZ2NmY2diZmNnY2ZjZmNkZmJlQWZDZkRmRGdEZ0RmRGdEZ0RnRWdEZkVlRGJEQ0VDR0RHQ0hCR0FHQUcwRzBHYkdhR2JGY0dlRmZEZkRmQ2dDZ0NmRGZEZkRnQ2dDZkRoRGdDZ0NnQ2dCZ0JoQWdCZ0JnQmdCZ0NmQ2dBZ0NnQ2dCZ0NnQmdCZ0NnQmhDZ0JnQmZCZ0JmQmdBZkJlQmVCZUJlQ2ZDZUNkRGVEZENlRGZEZkRmQ2VEZENiQ2JCYkNhQWJBY0FjQmMwZ0ZmRWZFZkVmRWZEZkNnQmYwYmFhYmFiZGNhYmJnMGdhZmJiY2NkZGRhYzBsamhlaGNoY2hjZ2JnYmdhZ2JnYmhhaGFnYWdBZ0JoQmdDZ0NmQ2VBZ0JlQmVCZUFjMGViZGJmZGdkaGRnZGdjZ2NnZGZkZWRjZ2JnYWhhZWNkZGVkZWRlYmcwZ2FoQmdDZ0FpMGgwZmNlZWRmYmhhZ2FnYWVBZUFnQWdBZzBmYWVhZ2JoYmZhaGFpYmZhZjBoRWdEaERnRGdEaENoQ2hDaEVnRGZEZkNnRGZEZUNnRGhEaERoQ2dCZ0RmRGhDaERpQ2hCaEFoQWgwaWFpMGhiaGFmMGZBZkJmQmZBZUJlQmZBZUFmQWZCZkJlQmNDYkFBMDBhMEEwYUEwMGEnXHJcbiNwb2ludHMgPSBkZWNvZGVBbGwgcGF0aFxyXG4jIGFzcyBbMCwwXSwgICAgZmluZE5lYXJlc3QgWzMwMCwzMDBdLCBwb2ludHNcclxuIyBhc3MgWzU1LDEyXSwgIGZpbmROZWFyZXN0IFsyNjAsMjAwXSwgcG9pbnRzXHJcbiMgYXNzIFsxNDA5LDRdLCBmaW5kTmVhcmVzdCBbNjcwLDE5MF0sIHBvaW50c1xyXG4jIGFzcyBbMTQ1Niw2NV0sZmluZE5lYXJlc3QgWzM1MCwzNTBdLCBwb2ludHNcclxuIyBhc3MgWzE0NjksMF0sIGZpbmROZWFyZXN0IFszMDYsMjk2XSwgcG9pbnRzXHJcbiJdfQ==
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\hints.coffee