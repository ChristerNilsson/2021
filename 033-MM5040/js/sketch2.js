// Generated by CoffeeScript 2.5.1
var lista, mousePressed, mouseReleased, released, setup, start, touchStarted, xdraw;

start = new Date();

released = true;

lista = [];

setup = () => {
  createCanvas(600, 600);
  lista.push('setup 001');
  return xdraw();
};

xdraw = () => {
  var i, j, len, results, s;
  background(128);
  results = [];
  for (i = j = 0, len = lista.length; j < len; i = ++j) {
    s = lista[i];
    results.push(text(s, 100, 25 + 25 * i));
  }
  return results;
};

mouseReleased = function() { // to make Android work 
  released = true;
  return false;
};

touchStarted = function() {
  lista.push("touchStarted");
  return xdraw();
};

mousePressed = function() {
  if (!released) { // to make Android work 
    return;
  }
  released = false;
  lista.push("mousePressed");
  return xdraw();
};

// keyPressed = ->
// 	player.keyPressed(key) for player in g.players
// 	if key == ' ' 
// 		autolevel()
// 		g.createProblem()
// 	#xdraw()

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoMi5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxza2V0Y2gyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxLQUFBLEVBQUEsWUFBQSxFQUFBLGFBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxZQUFBLEVBQUE7O0FBQUEsS0FBQSxHQUFRLElBQUksSUFBSixDQUFBOztBQUNSLFFBQUEsR0FBVzs7QUFDWCxLQUFBLEdBQVE7O0FBRVIsS0FBQSxHQUFRLENBQUEsQ0FBQSxHQUFBO0VBQ1AsWUFBQSxDQUFhLEdBQWIsRUFBaUIsR0FBakI7RUFDQSxLQUFLLENBQUMsSUFBTixDQUFXLFdBQVg7U0FDQSxLQUFBLENBQUE7QUFITzs7QUFLUixLQUFBLEdBQVEsQ0FBQSxDQUFBLEdBQUE7QUFDUixNQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTtFQUFDLFVBQUEsQ0FBVyxHQUFYO0FBQ0E7RUFBQSxLQUFBLCtDQUFBOztpQkFDQyxJQUFBLENBQUssQ0FBTCxFQUFPLEdBQVAsRUFBVyxFQUFBLEdBQUcsRUFBQSxHQUFHLENBQWpCO0VBREQsQ0FBQTs7QUFGTzs7QUFLUixhQUFBLEdBQWdCLFFBQUEsQ0FBQSxDQUFBLEVBQUE7RUFDZixRQUFBLEdBQVc7U0FDWDtBQUZlOztBQUloQixZQUFBLEdBQWUsUUFBQSxDQUFBLENBQUE7RUFDZCxLQUFLLENBQUMsSUFBTixDQUFXLGNBQVg7U0FDQSxLQUFBLENBQUE7QUFGYzs7QUFJZixZQUFBLEdBQWUsUUFBQSxDQUFBLENBQUE7RUFDZCxJQUFHLENBQUMsUUFBSjtBQUFrQixXQUFsQjs7RUFDQSxRQUFBLEdBQVc7RUFDWCxLQUFLLENBQUMsSUFBTixDQUFXLGNBQVg7U0FDQSxLQUFBLENBQUE7QUFKYzs7QUF0QmYiLCJzb3VyY2VzQ29udGVudCI6WyJzdGFydCA9IG5ldyBEYXRlKClcclxucmVsZWFzZWQgPSB0cnVlXHJcbmxpc3RhID0gW11cclxuXHJcbnNldHVwID0gPT5cclxuXHRjcmVhdGVDYW52YXMgNjAwLDYwMFxyXG5cdGxpc3RhLnB1c2ggJ3NldHVwIDAwMSdcclxuXHR4ZHJhdygpXHJcblxyXG54ZHJhdyA9ID0+XHJcblx0YmFja2dyb3VuZCAxMjhcclxuXHRmb3IgcyxpIGluIGxpc3RhXHJcblx0XHR0ZXh0IHMsMTAwLDI1KzI1KmlcclxuXHJcbm1vdXNlUmVsZWFzZWQgPSAtPiAjIHRvIG1ha2UgQW5kcm9pZCB3b3JrIFxyXG5cdHJlbGVhc2VkID0gdHJ1ZSBcclxuXHRmYWxzZVxyXG5cclxudG91Y2hTdGFydGVkID0gLT4gXHJcblx0bGlzdGEucHVzaCBcInRvdWNoU3RhcnRlZFwiXHJcblx0eGRyYXcoKVxyXG5cclxubW91c2VQcmVzc2VkID0gLT5cclxuXHRpZiAhcmVsZWFzZWQgdGhlbiByZXR1cm4gIyB0byBtYWtlIEFuZHJvaWQgd29yayBcclxuXHRyZWxlYXNlZCA9IGZhbHNlXHJcblx0bGlzdGEucHVzaCBcIm1vdXNlUHJlc3NlZFwiXHJcblx0eGRyYXcoKVxyXG5cclxuIyBrZXlQcmVzc2VkID0gLT5cclxuIyBcdHBsYXllci5rZXlQcmVzc2VkKGtleSkgZm9yIHBsYXllciBpbiBnLnBsYXllcnNcclxuIyBcdGlmIGtleSA9PSAnICcgXHJcbiMgXHRcdGF1dG9sZXZlbCgpXHJcbiMgXHRcdGcuY3JlYXRlUHJvYmxlbSgpXHJcbiMgXHQjeGRyYXcoKVxyXG4iXX0=
//# sourceURL=c:\github\2021\033-MM5040\coffee\sketch2.coffee