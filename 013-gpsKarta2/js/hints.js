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
  if (dist > 50) { // meters
    word = 'Track is gone';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcaGludHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBLElBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsV0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBOztBQUVBLElBQUEsR0FBTzs7QUFDUCxRQUFBLEdBQVc7O0FBQ1gsT0FBQSxHQUFVOztBQUVWLFdBQUEsR0FBYyxRQUFBLENBQUEsQ0FBQTtBQUNiLE1BQUE7RUFBQSxLQUFBLEdBQVEsRUFBUjtFQUNBLE9BQUEsR0FBVSxJQUFJLHdCQUFKLENBQUE7RUFDVixPQUFPLENBQUMsUUFBUixHQUFtQjtFQUNuQixPQUFPLENBQUMsTUFBUixHQUFpQjtFQUNqQixPQUFPLENBQUMsSUFBUixHQUFlO0VBQ2YsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7RUFDaEIsT0FBTyxDQUFDLElBQVIsR0FBZTtFQUNmLE9BQU8sQ0FBQyxJQUFSLEdBQWU7RUFDZixRQUFRLENBQUMsSUFBVCxDQUFjLFVBQWQ7U0FDQSxHQUFBLENBQUksVUFBSjtBQVZhOztBQVlkLEdBQUEsR0FBTSxRQUFBLENBQUMsQ0FBRCxDQUFBO0VBQ0wsSUFBRyxPQUFBLEtBQVcsSUFBZDtBQUF3QixXQUF4Qjs7RUFDQSxlQUFlLENBQUMsTUFBaEIsQ0FBQTtFQUNBLE9BQU8sQ0FBQyxJQUFSLEdBQWU7U0FDZixlQUFlLENBQUMsS0FBaEIsQ0FBc0IsT0FBdEI7QUFKSzs7QUFNTixLQUFBLEdBQVEsUUFBQSxDQUFDLENBQUQsQ0FBQTtBQUNQLE1BQUE7RUFBQSxHQUFBLEdBQU0sQ0FBQyxFQUFBLEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUUsRUFBYixDQUFOLENBQUEsR0FBeUI7RUFDL0IsSUFBRyxHQUFBLEtBQUssQ0FBUjtJQUFlLEdBQUEsR0FBTSxHQUFyQjs7U0FDQTtBQUhPOztBQUlSLEdB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O0lBQ0MsQ0FBQSxHQUFJLE9BQVEsQ0FBQSxDQUFBO0lBQ1osRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztJQUNaLEVBQUEsR0FBSyxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU87SUFDWixDQUFBLEdBQUksRUFBQSxHQUFHLEVBQUgsR0FBUSxFQUFBLEdBQUc7SUFDZixJQUFHLENBQUEsR0FBSSxJQUFQO01BQ0MsSUFBQSxHQUFPO01BQ1AsS0FBQSxHQUFRLEVBRlQ7O0VBTEQ7U0FRQSxDQUFDLEtBQUQsRUFBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUFYLENBQVI7QUFmYTs7QUExRGQiLCJzb3VyY2VzQ29udGVudCI6WyIjbiA9IHBvaW50cy5sZW5ndGhcclxuXHJcbmN1cnIgPSAwXHJcbmxhc3R3b3JkID0gJydcclxuc3BlYWtlciA9IG51bGxcclxuXHJcbmluaXRTcGVha2VyID0gLT5cclxuXHRpbmRleCA9IDQgI2ludCBnZXRQYXJhbWV0ZXJzKCkuc3BlYWtlciB8fCA1XHJcblx0c3BlYWtlciA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UoKVxyXG5cdHNwZWFrZXIudm9pY2VVUkkgPSBcIm5hdGl2ZVwiXHJcblx0c3BlYWtlci52b2x1bWUgPSAxXHJcblx0c3BlYWtlci5yYXRlID0gMS4wXHJcblx0c3BlYWtlci5waXRjaCA9IDBcclxuXHRzcGVha2VyLnRleHQgPSAnJ1xyXG5cdHNwZWFrZXIubGFuZyA9ICdlbi1HQidcclxuXHRtZXNzYWdlcy5wdXNoIFwiV2VsY29tZSFcIlxyXG5cdHNheSBcIldlbGNvbWUhXCJcclxuXHJcbnNheSA9IChtKSAtPlxyXG5cdGlmIHNwZWFrZXIgPT0gbnVsbCB0aGVuIHJldHVyblxyXG5cdHNwZWVjaFN5bnRoZXNpcy5jYW5jZWwoKVxyXG5cdHNwZWFrZXIudGV4dCA9IG1cclxuXHRzcGVlY2hTeW50aGVzaXMuc3BlYWsgc3BlYWtlclxyXG5cclxuY2xvY2sgPSAoZCkgLT5cclxuXHRyZXMgPSAoMTIgKyBNYXRoLnJvdW5kIGQvMzApICUgMTJcclxuXHRpZiByZXM9PTAgdGhlbiByZXMgPSAxMlxyXG5cdHJlc1x0XHJcbmFzcyAxMSwgY2xvY2sgLTMwXHJcbmFzcyAxMiwgY2xvY2sgLTE0XHJcbmFzcyAxMiwgY2xvY2sgMFxyXG5hc3MgMTIsIGNsb2NrIDE0XHJcbmFzcyAxLCBjbG9jayAzMFxyXG5hc3MgMSwgY2xvY2sgNDRcclxuYXNzIDIsIGNsb2NrIDQ2XHJcblxyXG5zYXlIaW50ID0gKGdwcykgLT5cclxuXHROID0gM1xyXG5cdGlmIG5vdCBjdXJyZW50UGF0aCB0aGVuIHJldHVyblxyXG5cdHBvaW50cyA9IGN1cnJlbnRQYXRoLnBvaW50c1xyXG5cdFtjdXJyLGRpc3RdID0gZmluZE5lYXJlc3QgZ3BzLHBvaW50c1xyXG5cclxuXHRpZiBkaXN0ID4gNTAgIyBtZXRlcnNcclxuXHRcdHdvcmQgPSAnVHJhY2sgaXMgZ29uZSdcclxuXHRlbHNlXHJcblx0XHRiMCA9IGJlYXJpbmcocG9pbnRzW2N1cnIrTiAgXSxwb2ludHNbY3VyciAgXSlcclxuXHRcdGIxID0gYmVhcmluZyhwb2ludHNbY3VycisyKk5dLHBvaW50c1tjdXJyK05dKVxyXG5cdFx0ZGlmZiA9IGNsb2NrIGIxLWIwXHJcblxyXG5cdFx0aWYgZGlmZiBpbiBbMTAsOSw4LDddIHRoZW4gd29yZCA9ICdsZWZ0J1xyXG5cdFx0ZWxzZSBpZiBkaWZmIGluIFsyLDMsNCw1XSB0aGVuIHdvcmQgPSAncmlnaHQnXHJcblx0XHRlbHNlIHdvcmQgPSAnc3RyYWlnaHQnXHJcblxyXG5cdGlmIGxhc3R3b3JkICE9IHdvcmRcclxuXHRcdG1lc3NhZ2VzLnB1c2ggXCJzYXlIaW50ICN7Y3Vycn0gb2YgI3twb2ludHMubGVuZ3RofSBwb2ludHM6I3twb2ludHNbY3Vycl19IHdvcmQ6I3t3b3JkfSBkaWZmOiN7ZGlmZn0gZGlzdDoje2Rpc3R9XCJcclxuXHRcdHNheSB3b3JkXHJcblx0bGFzdHdvcmQgPSB3b3JkXHJcblxyXG5maW5kTmVhcmVzdCA9IChwMSxwb2x5Z29uKSAtPlxyXG5cdGluZGV4ID0gMFxyXG5cdFt4LHldID0gcDFcclxuXHRwID0gcG9seWdvblswXVxyXG5cdGR4ID0gcFswXSAtIHhcclxuXHRkeSA9IHBbMV0gLSB5XHJcblx0YmVzdCA9IGR4KmR4ICsgZHkqZHlcclxuXHRmb3IgaSBpbiByYW5nZSBwb2x5Z29uLmxlbmd0aFxyXG5cdFx0cCA9IHBvbHlnb25baV1cclxuXHRcdGR4ID0gcFswXSAtIHhcclxuXHRcdGR5ID0gcFsxXSAtIHlcclxuXHRcdGQgPSBkeCpkeCArIGR5KmR5XHJcblx0XHRpZiBkIDwgYmVzdFxyXG5cdFx0XHRiZXN0ID0gZFxyXG5cdFx0XHRpbmRleCA9IGlcclxuXHRbaW5kZXgsIE1hdGgucm91bmQgTWF0aC5zcXJ0IGJlc3RdXHJcblxyXG4jcGF0aCA9ICczMDAsMzAwLEIwMGFBYjBiMGFiYWEwYUFBMGEwYjBiMGJhYTBjYWdhaWJoY2piZ2JmY2RkYWMwYmFiYWRBYUFiQWNBY0FiQWFBYkFiQWJBYkFhQWNBYkFhQWJBYkFjQmIwYUFjQWFBYUFiQmJCYkJiQmJBYUFiQmJBYkFhQWFBYkFhQWMwY0FhMGRBYzBiQWNhZ2FoQ2ZCZUNlQWNDYkNiQ2JBYUEwQ2IwYUNiRGdFZERlQmVCZUFjMGIwY2NiYWUwYzBjQWNBY0NkRGVDZkVkRWNFY0ZiQzBDMEEwQ2FEYUJhQmFBYUEwQmFBYkJhQWJCYUEwQmJCYUJhQmJCYUFhRmZFYkRhQWFCMENhQmFBMENhQmFFYUdhRjBHYUdiRmVEZkRmRWZFZUZlR2NGZEZkRWNCZDBlYmQwZEFmQmdDZ0JmMGdiZ2NlY2VhMGJiY2ZkZmRnZGVlZWZkZGVkZ2FnMGgwZzBnYmdiZmJmYWNjZGNlYmJhYmFjMGEwQUEwYWEwYmFjMGEwYTBjYWIwYWFhMGJhYmFjMGIwYjBiMGIwZGhqMGUwZjBjMGMwZWFjMGQwY0FhMGNBYkFsQmZCZWFkQWIwYkFiQmVCaEJmQWZCZkRkQmNBYkNkRWVGZkZmRmVFZUVlRWVFZUVlRGREZURkQ2RBZGFkYWRiZWJlMGIwYzBhMGNBZ0FlQWNCZEVkSGNIYUdhR2FHYUdBRkFGQkVCREREREZERkVGREZDRkJFMEJiQTBEZUZkRmFGQUMwQjBEMEFhQmJBYkJiMGFBYjBlQWdBZkFmQmVEZUZlRmNGY0VkRGRBYUFkQmZDZkRmRWZFZkdkRmVFZEZjRmRGY0ZlRWVEZUVkRWNEY0RiRGNDY0RkRGNFZEQwRkFEQjBiQkJCQUIwQ0FBMENCQkJBQUJDQUFCQkFDQkZCR0FGQUZBRjBFYUJhQTBCYUIwQ0FBMENBQzBDMEJBQzBCMEJBQTBBQkNCQUEwQjBCMEMwQTBDMEEwQTBCMDBBQmFBMEIwMGFBMEFhQWFBYkFhQmFBYkFiQWFBYkFhQWJBYUFiMGFBYTBhQWIwYTBhQWEwYkEwMGFBYkFhQWEwYUFhMGEwYUEwQWJBYUNhQWFBMEJhMGFCYTBhQTBBYUEwQTBBYUEwQjBBYUIwQWFBMEEwQWFBMDBhQWFBYTBhQWFBYkFhQWEwYUJiMGEwYUEwMGEwYjBhMGIwYTBiMGEwYkFhQWEwYTBhMGFhMDBhMGFhYWFhMGEwYTBhQWFBMEFhQTBBYUNiQmFGY0VhQmFEY0ZkR2VGZUVjRGIwY0NiQ2FEY0VkRGNDYUFhQTBEYURiQmJBYUNiQmFDYUNhQmFDYkJhQmFCYUEwQmFBYUJiQmJCYkJjQ2NCYUJiQWFBYkJiQmFBYkFiQWFBYkJiQWFCYUJhQWFDYkNiQWFCYkJjQWJCYkFjQmNBY0FhQmIwYjBjMGIwYTBhMGIwYjBhMGFhYTBhQWEwYUFiQWJBYzBhQWJBYTBjQWNBYzBhMGIwYWFiMGEwYmFhMGFhYTBhMGFhMDBhMGEwYTBhQTAwYkFhQWFBYkFhMGFBYkFhQWJBYTBhQWIwYkFhMGMwYjBhQWEwYTBhQWEwYUFhQWJBYjBhMGFBMDBiMGIwYTBiMGEwY0FhMGNBYUJiQmNBYkFhQmFBYkFiQmFBY0FhQmJBYUJjRGQwYUNiMGFCYkFhQmNBY0JjQmMwYUFhQmJCMDBhQWFBYUFhQWFBYUFhQWEwYTBhMGEwYjBiQWFBY0FhQmJBYUFiQ2NDYkEwQmFCYUMwQjBiMGEwYTBhYWEwYTBiQWJBYTBhQjBCMEFBQkFCQUFBQkFBQUFDQUEwQTBBYUEwQWFCYUNjQWJBYUFiMGFCYUIwQ2FBMEVhQzBBYUQwRGFCMEFiQWFBYkFhQWFCZEFjQWFBYUFjQWFBYkFhQWJCYkFjQWFBYkFhQWNBY0JjQWJBYkJjQWJCYkJjQWFBMENhQ2FDY0djRmRGY0ZkRmNFY0VjRWNEYkRhQkJDMEZBSEFHQkhBR0FHMEZBRUFEQUJEQWFCYUJiQmNBYUFhQmJDY0RjQmIwYUFjQWFBYUIwQTBBMEJBQTBCQUJBQkFDQUNBQ0JDQUJCQTBCQkREQkQwQ2FCYUNiQ2JBY0NjQ2JDMEFiQjBCMEIwQmFDQUJCRkJIQ0lBSGFIYkhiSGJFMENBMDBCMEIwQTBBMEIwQzBCYUIwQjBEMEFBQ0FDQkZBRUFDQkJCREJDQ0RCQkJBQ0REQkJCQkFDQkVCRkJGQkZBRkJFQkNBMEFCQ0VEREREQUEwQzBBQUJBQ0FCQURBRkFFMEUwRmFFQUFCQ0NCQkZDRkRGQ0ZERUNFQ0REQ0RCQUJBQUJhQ2FBYUJjQmdFZkZjR2NGYUdhSDBGQUdCRkJFQ0FBMEhjSDBIMEgwSEFHQkhBR0NHQkdERkNHREZDR0NGQ0hCR0JHMEcwRjBGYUZiRGNCY0FkQ2NFY0VjRmJFYTBhQ2FCYkFhQ2JCMENhR0NHMEZhR0FHQkdCRUFFQkVCRUFGMEdCRkJGQkZBRWFFY0hhRkFHQ0ZDR0RHQ0ZDR0JGQ0ZDRkRGREVERkRERURFQ0ZDRkRHQ0ZDR0JHQ0ZDR0JGQkZBRUJFQ0dDRkNFREVERUNFRENFQ0NBQUIwQ2NBY2FhMGJhZmllaGRnZWdkZ2NlZWRkYmRCZURmRWZFZkVmRGZEZkRmRGZEZkRlRGZEZkRmQ2VEZkRnQ2VEZURkRGREZERkQ2NDY0FkYWRiZGNiY2RjQTBhYUIwYUFiQWFBYUFiQmNCZURlRWREZERjQ2JCYzBjYWJhYzBiMGMwYjBhQmEwY0NiQmJCMEFiQmJBYUJiRGFCMEIwQTBBMEJBQUFCMEJBQjBCMEFBQzBFMEMwQWFCYUNhQmFCYUFiQmFBYUFhQmFBYUIwQTBCMEFBQkFBQUJBQTBFMEFkQ2VFZEVlRWVGZUVkRWNEYUYwRTBFQUVDQ0RERkNGQ0VERERFRkRFREREREJEQURhRWRFZEVkRWVFZUVlRmVFZUZlRmVFZkVmRGhCZ0NmQ2dFZkRmRWdEZkRmRWZFZkRmRmdFZ0VnRWZGaEZnRmdGZkZmRGZFZENiQmFDQUEwQTBBMEFhQmJCMEFBQWFBYUJpSmRHY0hiR2JIYUdhSGFHMEhhSDBIYUdiSGFHYkhiR2JHYUdjRmJFY0YwRkFHQkdCR0NGREdDRkNHQ0ZDR0NGREZCRUFDY0FkYWFjMGZhaGNnZGdjZ2NmY2diZmNnY2ZjZmNkZmJlQWZDZkRmRGdEZ0RmRGdEZ0RnRWdEZkVlRGJEQ0VDR0RHQ0hCR0FHQUcwRzBHYkdhR2JGY0dlRmZEZkRmQ2dDZ0NmRGZEZkRnQ2dDZkRoRGdDZ0NnQ2dCZ0JoQWdCZ0JnQmdCZ0NmQ2dBZ0NnQ2dCZ0NnQmdCZ0NnQmhDZ0JnQmZCZ0JmQmdBZkJlQmVCZUJlQ2ZDZUNkRGVEZENlRGZEZkRmQ2VEZENiQ2JCYkNhQWJBY0FjQmMwZ0ZmRWZFZkVmRWZEZkNnQmYwYmFhYmFiZGNhYmJnMGdhZmJiY2NkZGRhYzBsamhlaGNoY2hjZ2JnYmdhZ2JnYmhhaGFnYWdBZ0JoQmdDZ0NmQ2VBZ0JlQmVCZUFjMGViZGJmZGdkaGRnZGdjZ2NnZGZkZWRjZ2JnYWhhZWNkZGVkZWRlYmcwZ2FoQmdDZ0FpMGgwZmNlZWRmYmhhZ2FnYWVBZUFnQWdBZzBmYWVhZ2JoYmZhaGFpYmZhZjBoRWdEaERnRGdEaENoQ2hDaEVnRGZEZkNnRGZEZUNnRGhEaERoQ2dCZ0RmRGhDaERpQ2hCaEFoQWgwaWFpMGhiaGFmMGZBZkJmQmZBZUJlQmZBZUFmQWZCZkJlQmNDYkFBMDBhMEEwYUEwMGEnXHJcbiNwb2ludHMgPSBkZWNvZGVBbGwgcGF0aFxyXG4jIGFzcyBbMCwwXSwgICAgZmluZE5lYXJlc3QgWzMwMCwzMDBdLCBwb2ludHNcclxuIyBhc3MgWzU1LDEyXSwgIGZpbmROZWFyZXN0IFsyNjAsMjAwXSwgcG9pbnRzXHJcbiMgYXNzIFsxNDA5LDRdLCBmaW5kTmVhcmVzdCBbNjcwLDE5MF0sIHBvaW50c1xyXG4jIGFzcyBbMTQ1Niw2NV0sZmluZE5lYXJlc3QgWzM1MCwzNTBdLCBwb2ludHNcclxuIyBhc3MgWzE0NjksMF0sIGZpbmROZWFyZXN0IFszMDYsMjk2XSwgcG9pbnRzXHJcbiJdfQ==
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\hints.coffee