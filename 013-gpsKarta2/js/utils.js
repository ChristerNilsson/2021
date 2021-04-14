// Generated by CoffeeScript 2.4.1
var ass, getParameters, map, myRound, range;

range = _.range;

ass = function(a, b = true) {
  return chai.assert.deepEqual(a, b);
};

myRound = function(x, dec = 0) {
  return Math.round(x * 10 ** dec) / 10 ** dec;
};

map = function(x, x0, x1, y0, y1) {
  return (x - x0) / (x1 - x0) * (y1 - y0) + y0;
};

ass(325, map(150, 100, 200, 300, 350));

ass(375, map(250, 100, 200, 300, 350));

getParameters = function(h = window.location.href) {
  var arr, f, s;
  h = decodeURI(h);
  arr = h.split('?');
  if (arr.length !== 2) {
    return {};
  }
  s = arr[1];
  if (s === '') {
    return {};
  }
  return _.object((function() {
    var i, len, ref, results;
    ref = s.split('&');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      f = ref[i];
      results.push(f.split('='));
    }
    return results;
  })());
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLEdBQUEsRUFBQSxhQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQTs7QUFBQSxLQUFBLEdBQVEsQ0FBQyxDQUFDOztBQUNWLEdBQUEsR0FBTSxRQUFBLENBQUMsQ0FBRCxFQUFHLElBQUUsSUFBTCxDQUFBO1NBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQWQ7O0FBQ04sT0FBQSxHQUFVLFFBQUEsQ0FBQyxDQUFELEVBQUcsTUFBSSxDQUFQLENBQUE7U0FBYSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBRSxFQUFBLElBQUksR0FBakIsQ0FBQSxHQUFzQixFQUFBLElBQUk7QUFBdkM7O0FBRVYsR0FBQSxHQUFNLFFBQUEsQ0FBQyxDQUFELEVBQUksRUFBSixFQUFRLEVBQVIsRUFBWSxFQUFaLEVBQWdCLEVBQWhCLENBQUE7U0FBdUIsQ0FBQyxDQUFBLEdBQUksRUFBTCxDQUFBLEdBQVcsQ0FBQyxFQUFBLEdBQUssRUFBTixDQUFYLEdBQXVCLENBQUMsRUFBQSxHQUFLLEVBQU4sQ0FBdkIsR0FBbUM7QUFBMUQ7O0FBQ04sR0FBQSxDQUFJLEdBQUosRUFBUSxHQUFBLENBQUksR0FBSixFQUFRLEdBQVIsRUFBWSxHQUFaLEVBQWdCLEdBQWhCLEVBQW9CLEdBQXBCLENBQVI7O0FBQ0EsR0FBQSxDQUFJLEdBQUosRUFBUSxHQUFBLENBQUksR0FBSixFQUFRLEdBQVIsRUFBWSxHQUFaLEVBQWdCLEdBQWhCLEVBQW9CLEdBQXBCLENBQVI7O0FBRUEsYUFBQSxHQUFnQixRQUFBLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQXJCLENBQUE7QUFDZixNQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUE7RUFBQSxDQUFBLEdBQUksU0FBQSxDQUFVLENBQVY7RUFDSixHQUFBLEdBQU0sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSO0VBQ04sSUFBRyxHQUFHLENBQUMsTUFBSixLQUFjLENBQWpCO0FBQXdCLFdBQU8sQ0FBQSxFQUEvQjs7RUFDQSxDQUFBLEdBQUksR0FBSSxDQUFBLENBQUE7RUFDUixJQUFHLENBQUEsS0FBRyxFQUFOO0FBQWMsV0FBTyxDQUFBLEVBQXJCOztTQUNBLENBQUMsQ0FBQyxNQUFGOztBQUFxQjtBQUFBO0lBQUEsS0FBQSxxQ0FBQTs7bUJBQVosQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSO0lBQVksQ0FBQTs7TUFBckI7QUFOZSIsInNvdXJjZXNDb250ZW50IjpbInJhbmdlID0gXy5yYW5nZVxyXG5hc3MgPSAoYSxiPXRydWUpIC0+IGNoYWkuYXNzZXJ0LmRlZXBFcXVhbCBhLCBiXHJcbm15Um91bmQgPSAoeCxkZWM9MCkgLT4gTWF0aC5yb3VuZCh4KjEwKipkZWMpLzEwKipkZWNcclxuXHJcbm1hcCA9ICh4LCB4MCwgeDEsIHkwLCB5MSkgLT4gKHggLSB4MCkgLyAoeDEgLSB4MCkgKiAoeTEgLSB5MCkgKyB5MFxyXG5hc3MgMzI1LG1hcCAxNTAsMTAwLDIwMCwzMDAsMzUwXHJcbmFzcyAzNzUsbWFwIDI1MCwxMDAsMjAwLDMwMCwzNTBcclxuXHJcbmdldFBhcmFtZXRlcnMgPSAoaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSAtPlxyXG5cdGggPSBkZWNvZGVVUkkgaFxyXG5cdGFyciA9IGguc3BsaXQoJz8nKVxyXG5cdGlmIGFyci5sZW5ndGggIT0gMiB0aGVuIHJldHVybiB7fVxyXG5cdHMgPSBhcnJbMV1cclxuXHRpZiBzPT0nJyB0aGVuIHJldHVybiB7fVxyXG5cdF8ub2JqZWN0KGYuc3BsaXQgJz0nIGZvciBmIGluIHMuc3BsaXQoJyYnKSlcclxuIl19
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\utils.coffee