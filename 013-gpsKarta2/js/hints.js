// Generated by CoffeeScript 2.4.1
var curr, diffToWord, elapsedTime, ended, endingTime, findNearest, hints, initSpeaker, lastETA, lastSpoken, lastWord, makeHints, onTrack, say, sayETA, sayHint, speaker, started, startingTime, userDistance, voices,
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

curr = 0;

lastWord = '';

lastSpoken = '';

speaker = null;

hints = {};

started = false;

ended = false;

startingTime = null;

endingTime = null;

elapsedTime = 0;

userDistance = 0;

onTrack = true;

voices = null;

lastETA = 0;

window.speechSynthesis.onvoiceschanged = function() {
  return voices = window.speechSynthesis.getVoices();
};

initSpeaker = function() {
  var index;
  index = 5;
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
  messages.push("Welcome! Jacob");
  return say("Welcome! Jacob");
};

say = function(m) {
  if (speaker === null) {
    return;
  }
  speechSynthesis.cancel();
  speaker.text = m;
  return speechSynthesis.speak(speaker);
};

diffToWord = function(diff) {
  var WORDS;
  WORDS = ['turn around', 'sharp left', 'medium left', 'left', '', 'right', 'medium right', 'sharp right', 'turn around'];
  return WORDS[4 + Math.round(diff / 45)];
};

ass('turn around', diffToWord(-180));

ass('sharp left', diffToWord(-157));

ass('sharp left', diffToWord(-113));

ass('left', diffToWord(-67));

ass('left', diffToWord(-23));

ass('', diffToWord(-22));

ass('', diffToWord(22));

ass('right', diffToWord(23));

ass('right', diffToWord(67));

ass('medium right', diffToWord(68));

ass('medium right', diffToWord(112));

ass('sharp right', diffToWord(113));

ass('sharp right', diffToWord(157));

ass('turn around', diffToWord(158));

ass('turn around', diffToWord(180));

sayETA = function(gpsPoints) {
  var ETA, n, usedTime;
  messages.push(`sayETA ${gpsPoints.length}`);
  if (gpsPoints.length < 2) {
    return;
  }
  if (startingTime === null) {
    return;
  }
  if (currentPath.distance === 0) {
    return;
  }
  n = gpsPoints.length;
  userDistance += distance(gpsPoints[n - 2], gpsPoints[n - 1]);
  if (userDistance === 0) {
    return;
  }
  if (userDistance / currentPath.distance > 0.1) {
    usedTime = new Date() - startingTime;
    ETA = usedTime * currentPath.distance / userDistance;
    ETA = Math.round(ETA / 1000);
    if (10 <= abs(ETA - lastETA)) {
      messages.push(`ETA ${curr} ${Math.floor(ETA / 60)}m ${ETA % 60}s`);
      return lastETA = ETA; // seconds
    }
  }
};

sayHint = function(gpsPoints) {
  var N, dist, err, gps, last, points, word;
  N = 5;
  if (!currentPath || gpsPoints.length === 0) {
    return;
  }
  points = currentPath.points;
  last = gpsPoints.length - 1;
  gps = gpsPoints[last];
  [curr, dist] = findNearest(gps, points);
  if (started && !ended) {
    messages.push(`gps ${curr} ${dist}`);
  }
  word = '';
  if (!started && 25 > distance(gps, points[0])) {
    started = true;
    startingTime = new Date();
    messages.push(`trackStarted ${startingTime}`);
    say('track started!');
    userDistance = 0;
    onTrack = true;
    return;
  }
  if (started && !ended && 10 > distance(gps, points[points.length - 1])) {
    ended = true;
    endingTime = new Date();
    elapsedTime = endingTime - startingTime;
    messages.push(`elapsedTime ${elapsedTime}`);
    say('track ended!');
    return;
  }
  if (!started) {
    return;
  }
  if (ended) {
    return;
  }
  try {
    sayETA(gpsPoints);
  } catch (error) {
    err = error;
    messages.push(`${err}`);
  }
  if (!onTrack && dist < 10) { // meters
    word = 'track found!';
    onTrack = true;
  } else if (dist > 25) { // meters
    word = 'track lost!';
    onTrack = false;
  } else {
    word = curr + N in hints ? hints[curr + N] : '';
  }
  if (lastSpoken !== word) {
    messages.push(`hint ${curr} ${points[curr]} ${word} ${dist}`);
    say(word);
    return lastSpoken = word;
  }
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

makeHints = function() {
  var b0, b1, diff, i, j, len, points, ref, word;
  console.log('makeHints');
  hints = {};
  points = currentPath.points;
  console.log(points);
  ref = range(2, points.length - 3);
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    b0 = bearing(points[i - 2], points[i]);
    b1 = bearing(points[i], points[i + 2]);
    diff = b1 - b0 + 180;
    diff = modulo(diff, 360) - 180;
    word = diffToWord(diff);
    if (word !== '') {
      hints[i] = word;
    }
  }
  //console.log "#{i} #{points[i]} #{b0} #{b1} #{diff} #{word}"
  //messages.push "#{i} #{word}"
  return console.log(hints);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGludHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcaGludHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUEsTUFBQTtFQUFBOztBQUFBLElBQUEsR0FBTzs7QUFDUCxRQUFBLEdBQVc7O0FBQ1gsVUFBQSxHQUFhOztBQUNiLE9BQUEsR0FBVTs7QUFDVixLQUFBLEdBQVEsQ0FBQTs7QUFFUixPQUFBLEdBQVU7O0FBQ1YsS0FBQSxHQUFROztBQUNSLFlBQUEsR0FBZTs7QUFDZixVQUFBLEdBQWE7O0FBQ2IsV0FBQSxHQUFjOztBQUNkLFlBQUEsR0FBZTs7QUFDZixPQUFBLEdBQVU7O0FBRVYsTUFBQSxHQUFTOztBQUNULE9BQUEsR0FBVTs7QUFFVixNQUFNLENBQUMsZUFBZSxDQUFDLGVBQXZCLEdBQXlDLFFBQUEsQ0FBQSxDQUFBO1NBQUcsTUFBQSxHQUFTLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBdkIsQ0FBQTtBQUFaOztBQUV6QyxXQUFBLEdBQWMsUUFBQSxDQUFBLENBQUE7QUFDYixNQUFBO0VBQUEsS0FBQSxHQUFRO0VBQ1IsT0FBQSxHQUFVLElBQUksd0JBQUosQ0FBQTtFQUNWLE9BQU8sQ0FBQyxRQUFSLEdBQW1CO0VBQ25CLE9BQU8sQ0FBQyxNQUFSLEdBQWlCO0VBQ2pCLE9BQU8sQ0FBQyxJQUFSLEdBQWU7RUFDZixPQUFPLENBQUMsS0FBUixHQUFnQjtFQUNoQixPQUFPLENBQUMsSUFBUixHQUFlO0VBQ2YsT0FBTyxDQUFDLElBQVIs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LE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQTtFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksV0FBWjtFQUNBLEtBQUEsR0FBUSxDQUFBO0VBQ1IsTUFBQSxHQUFTLFdBQVcsQ0FBQztFQUNyQixPQUFPLENBQUMsR0FBUixDQUFZLE1BQVo7QUFDQTtFQUFBLEtBQUEscUNBQUE7O0lBQ0MsRUFBQSxHQUFLLE9BQUEsQ0FBUSxNQUFPLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBZixFQUFvQixNQUFPLENBQUEsQ0FBQSxDQUEzQjtJQUNMLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBTyxDQUFBLENBQUEsQ0FBZixFQUFrQixNQUFPLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBekI7SUFDTCxJQUFBLEdBQU8sRUFBQSxHQUFLLEVBQUwsR0FBVTtJQUNqQixJQUFBLFVBQU8sTUFBUSxJQUFSLEdBQWM7SUFFckIsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFYO0lBQ1AsSUFBRyxJQUFBLEtBQVEsRUFBWDtNQUFtQixLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsS0FBOUI7O0VBUEQsQ0FKQTs7O1NBY0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO0FBZlciLCJzb3VyY2VzQ29udGVudCI6WyJjdXJyID0gMFxyXG5sYXN0V29yZCA9ICcnXHJcbmxhc3RTcG9rZW4gPSAnJ1xyXG5zcGVha2VyID0gbnVsbFxyXG5oaW50cyA9IHt9XHJcblxyXG5zdGFydGVkID0gZmFsc2VcclxuZW5kZWQgPSBmYWxzZVxyXG5zdGFydGluZ1RpbWUgPSBudWxsXHJcbmVuZGluZ1RpbWUgPSBudWxsXHJcbmVsYXBzZWRUaW1lID0gMFxyXG51c2VyRGlzdGFuY2UgPSAwXHJcbm9uVHJhY2sgPSB0cnVlXHJcblxyXG52b2ljZXMgPSBudWxsXHJcbmxhc3RFVEEgPSAwXHJcblxyXG53aW5kb3cuc3BlZWNoU3ludGhlc2lzLm9udm9pY2VzY2hhbmdlZCA9IC0+IHZvaWNlcyA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXMuZ2V0Vm9pY2VzKClcclxuXHJcbmluaXRTcGVha2VyID0gLT5cclxuXHRpbmRleCA9IDVcclxuXHRzcGVha2VyID0gbmV3IFNwZWVjaFN5bnRoZXNpc1V0dGVyYW5jZSgpXHJcblx0c3BlYWtlci52b2ljZVVSSSA9IFwibmF0aXZlXCJcclxuXHRzcGVha2VyLnZvbHVtZSA9IDFcclxuXHRzcGVha2VyLnJhdGUgPSAxLjBcclxuXHRzcGVha2VyLnBpdGNoID0gMFxyXG5cdHNwZWFrZXIudGV4dCA9ICcnXHJcblx0c3BlYWtlci5sYW5nID0gJ2VuLUdCJ1xyXG5cdGlmIHZvaWNlcyBhbmQgaW5kZXggPD0gdm9pY2VzLmxlbmd0aC0xIHRoZW4gc3BlYWtlci52b2ljZSA9IHZvaWNlc1tpbmRleF1cclxuXHRtZXNzYWdlcy5wdXNoIFwiV2VsY29tZSEgSmFjb2JcIlxyXG5cdHNheSBcIldlbGNvbWUhIEphY29iXCJcclxuXHJcbnNheSA9IChtKSAtPlxyXG5cdGlmIHNwZWFrZXIgPT0gbnVsbCB0aGVuIHJldHVyblxyXG5cdHNwZWVjaFN5bnRoZXNpcy5jYW5jZWwoKVxyXG5cdHNwZWFrZXIudGV4dCA9IG1cclxuXHRzcGVlY2hTeW50aGVzaXMuc3BlYWsgc3BlYWtlclxyXG5cclxuZGlmZlRvV29yZCA9IChkaWZmKSAtPlxyXG5cdFdPUkRTID0gWyd0dXJuIGFyb3VuZCcsJ3NoYXJwIGxlZnQnLCdtZWRpdW0gbGVmdCcsJ2xlZnQnLCcnLCdyaWdodCcsJ21lZGl1bSByaWdodCcsJ3NoYXJwIHJpZ2h0JywndHVybiBhcm91bmQnXVxyXG5cdFdPUkRTWzQgKyBNYXRoLnJvdW5kIGRpZmYvNDVdXHJcbmFzcyAndHVybiBhcm91bmQnLGRpZmZUb1dvcmQgLTE4MFxyXG5hc3MgJ3NoYXJwIGxlZnQnLGRpZmZUb1dvcmQgLTE1N1xyXG5hc3MgJ3NoYXJwIGxlZnQnLGRpZmZUb1dvcmQgLTExM1xyXG5hc3MgJ2xlZnQnLGRpZmZUb1dvcmQgLTY3XHJcbmFzcyAnbGVmdCcsZGlmZlRvV29yZCAtMjNcclxuYXNzICcnLGRpZmZUb1dvcmQgLTIyXHJcbmFzcyAnJyxkaWZmVG9Xb3JkIDIyXHJcbmFzcyAncmlnaHQnLGRpZmZUb1dvcmQgMjNcclxuYXNzICdyaWdodCcsZGlmZlRvV29yZCA2N1xyXG5hc3MgJ21lZGl1bSByaWdodCcsZGlmZlRvV29yZCA2OFxyXG5hc3MgJ21lZGl1bSByaWdodCcsZGlmZlRvV29yZCAxMTJcclxuYXNzICdzaGFycCByaWdodCcsZGlmZlRvV29yZCAxMTNcclxuYXNzICdzaGFycCByaWdodCcsZGlmZlRvV29yZCAxNTdcclxuYXNzICd0dXJuIGFyb3VuZCcsZGlmZlRvV29yZCAxNThcclxuYXNzICd0dXJuIGFyb3VuZCcsZGlmZlRvV29yZCAxODBcclxuXHJcbnNheUVUQSA9IChncHNQb2ludHMpIC0+XHJcblx0bWVzc2FnZXMucHVzaCBcInNheUVUQSAje2dwc1BvaW50cy5sZW5ndGh9XCJcclxuXHRpZiBncHNQb2ludHMubGVuZ3RoIDwgMiB0aGVuIHJldHVybiBcclxuXHRpZiBzdGFydGluZ1RpbWUgPT0gbnVsbCB0aGVuIHJldHVyblxyXG5cdGlmIGN1cnJlbnRQYXRoLmRpc3RhbmNlID09IDAgdGhlbiByZXR1cm4gXHJcblxyXG5cdG4gPSBncHNQb2ludHMubGVuZ3RoXHJcblx0dXNlckRpc3RhbmNlICs9IGRpc3RhbmNlIGdwc1BvaW50c1tuLTJdLGdwc1BvaW50c1tuLTFdXHJcblx0aWYgdXNlckRpc3RhbmNlID09IDAgdGhlbiByZXR1cm4gXHJcblx0aWYgdXNlckRpc3RhbmNlIC8gY3VycmVudFBhdGguZGlzdGFuY2UgPiAwLjFcclxuXHRcdHVzZWRUaW1lID0gbmV3IERhdGUoKSAtIHN0YXJ0aW5nVGltZVxyXG5cdFx0RVRBID0gdXNlZFRpbWUgKiBjdXJyZW50UGF0aC5kaXN0YW5jZSAvIHVzZXJEaXN0YW5jZVxyXG5cdFx0RVRBID0gTWF0aC5yb3VuZCBFVEEvMTAwMFxyXG5cdFx0aWYgMTAgPD0gYWJzIEVUQS1sYXN0RVRBXHJcblx0XHRcdG1lc3NhZ2VzLnB1c2ggXCJFVEEgI3tjdXJyfSAje0VUQSAvLyA2MH1tICN7RVRBICUgNjB9c1wiXHJcblx0XHRcdGxhc3RFVEEgPSBFVEEgIyBzZWNvbmRzXHJcblxyXG5zYXlIaW50ID0gKGdwc1BvaW50cykgLT5cclxuXHROID0gNVxyXG5cdGlmIG5vdCBjdXJyZW50UGF0aCBvciBncHNQb2ludHMubGVuZ3RoID09IDAgdGhlbiByZXR1cm5cclxuXHRwb2ludHMgPSBjdXJyZW50UGF0aC5wb2ludHNcclxuXHRsYXN0ID0gZ3BzUG9pbnRzLmxlbmd0aC0xXHJcblx0Z3BzID0gZ3BzUG9pbnRzW2xhc3RdXHJcblx0W2N1cnIsZGlzdF0gPSBmaW5kTmVhcmVzdCBncHMscG9pbnRzXHJcblx0aWYgc3RhcnRlZCBhbmQgbm90IGVuZGVkIHRoZW4gbWVzc2FnZXMucHVzaCBcImdwcyAje2N1cnJ9ICN7ZGlzdH1cIlxyXG5cdHdvcmQgPSAnJ1xyXG5cclxuXHRpZiBub3Qgc3RhcnRlZCBhbmQgMjUgPiBkaXN0YW5jZSBncHMscG9pbnRzWzBdXHJcblx0XHRzdGFydGVkID0gdHJ1ZVxyXG5cdFx0c3RhcnRpbmdUaW1lID0gbmV3IERhdGUoKVxyXG5cdFx0bWVzc2FnZXMucHVzaCBcInRyYWNrU3RhcnRlZCAje3N0YXJ0aW5nVGltZX1cIlxyXG5cdFx0c2F5ICd0cmFjayBzdGFydGVkISdcclxuXHRcdHVzZXJEaXN0YW5jZSA9IDBcclxuXHRcdG9uVHJhY2sgPSB0cnVlXHJcblx0XHRyZXR1cm5cclxuXHJcblx0aWYgc3RhcnRlZCBhbmQgbm90IGVuZGVkIGFuZCAxMCA+IGRpc3RhbmNlIGdwcyxwb2ludHNbcG9pbnRzLmxlbmd0aC0xXVxyXG5cdFx0ZW5kZWQgPSB0cnVlXHJcblx0XHRlbmRpbmdUaW1lID0gbmV3IERhdGUoKVxyXG5cdFx0ZWxhcHNlZFRpbWUgPSBlbmRpbmdUaW1lIC0gc3RhcnRpbmdUaW1lXHJcblx0XHRtZXNzYWdlcy5wdXNoIFwiZWxhcHNlZFRpbWUgI3tlbGFwc2VkVGltZX1cIlxyXG5cdFx0c2F5ICd0cmFjayBlbmRlZCEnXHJcblx0XHRyZXR1cm5cclxuXHJcblx0aWYgbm90IHN0YXJ0ZWQgdGhlbiByZXR1cm5cclxuXHRpZiBlbmRlZCB0aGVuIHJldHVyblxyXG5cclxuXHR0cnlcclxuXHRcdHNheUVUQSBncHNQb2ludHNcclxuXHRjYXRjaCBlcnJcclxuXHRcdG1lc3NhZ2VzLnB1c2ggXCIje2Vycn1cIlxyXG5cclxuXHRpZiBub3Qgb25UcmFjayBhbmQgZGlzdCA8IDEwICMgbWV0ZXJzXHJcblx0XHR3b3JkID0gJ3RyYWNrIGZvdW5kISdcclxuXHRcdG9uVHJhY2sgPSB0cnVlXHJcblx0ZWxzZSBpZiBkaXN0ID4gMjUgIyBtZXRlcnNcclxuXHRcdHdvcmQgPSAndHJhY2sgbG9zdCEnXHJcblx0XHRvblRyYWNrID0gZmFsc2UgXHJcblx0ZWxzZVxyXG5cdFx0d29yZCA9IGlmIGN1cnIrTiBvZiBoaW50cyB0aGVuIGhpbnRzW2N1cnIrTl0gZWxzZSAnJ1xyXG5cdGlmIGxhc3RTcG9rZW4gIT0gd29yZFxyXG5cdFx0bWVzc2FnZXMucHVzaCBcImhpbnQgI3tjdXJyfSAje3BvaW50c1tjdXJyXX0gI3t3b3JkfSAje2Rpc3R9XCJcclxuXHRcdHNheSB3b3JkXHJcblx0XHRsYXN0U3Bva2VuID0gd29yZFxyXG5cclxuZmluZE5lYXJlc3QgPSAocDEscG9seWdvbikgLT5cclxuXHRpbmRleCA9IDBcclxuXHRbeCx5XSA9IHAxXHJcblx0cCA9IHBvbHlnb25bMF1cclxuXHRkeCA9IHBbMF0gLSB4XHJcblx0ZHkgPSBwWzFdIC0geVxyXG5cdGJlc3QgPSBkeCpkeCArIGR5KmR5XHJcblx0Zm9yIGkgaW4gcmFuZ2UgcG9seWdvbi5sZW5ndGhcclxuXHRcdHAgPSBwb2x5Z29uW2ldXHJcblx0XHRkeCA9IHBbMF0gLSB4XHJcblx0XHRkeSA9IHBbMV0gLSB5XHJcblx0XHRkID0gZHgqZHggKyBkeSpkeVxyXG5cdFx0aWYgZCA8IGJlc3RcclxuXHRcdFx0YmVzdCA9IGRcclxuXHRcdFx0aW5kZXggPSBpXHJcblx0W2luZGV4LCBNYXRoLnJvdW5kIE1hdGguc3FydCBiZXN0XVxyXG5cclxubWFrZUhpbnRzID0gLT5cclxuXHRjb25zb2xlLmxvZyAnbWFrZUhpbnRzJ1xyXG5cdGhpbnRzID0ge31cclxuXHRwb2ludHMgPSBjdXJyZW50UGF0aC5wb2ludHNcclxuXHRjb25zb2xlLmxvZyBwb2ludHNcclxuXHRmb3IgaSBpbiByYW5nZSAyLHBvaW50cy5sZW5ndGggLSAzXHJcblx0XHRiMCA9IGJlYXJpbmcgcG9pbnRzW2ktMl0scG9pbnRzW2ldXHJcblx0XHRiMSA9IGJlYXJpbmcgcG9pbnRzW2ldLHBvaW50c1tpKzJdXHJcblx0XHRkaWZmID0gYjEgLSBiMCArIDE4MFxyXG5cdFx0ZGlmZiA9IGRpZmYgJSUgMzYwIC0gMTgwXHJcblxyXG5cdFx0d29yZCA9IGRpZmZUb1dvcmQgZGlmZlxyXG5cdFx0aWYgd29yZCAhPSAnJyB0aGVuIGhpbnRzW2ldID0gd29yZFxyXG5cdFx0XHQjY29uc29sZS5sb2cgXCIje2l9ICN7cG9pbnRzW2ldfSAje2IwfSAje2IxfSAje2RpZmZ9ICN7d29yZH1cIlxyXG5cdFx0XHQjbWVzc2FnZXMucHVzaCBcIiN7aX0gI3t3b3JkfVwiXHJcblx0Y29uc29sZS5sb2cgaGludHNcclxuIl19
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\hints.coffee