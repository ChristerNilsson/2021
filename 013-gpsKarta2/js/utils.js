// Generated by CoffeeScript 2.4.1
var ass, bearing, degrees, distance, getParameters, map, myRound, radians, range;

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

degrees = function(x) {
  return x * 180 / Math.PI;
};

radians = function(x) {
  return x * Math.PI / 180;
};

distance = function(p, q) {
  var dx, dy;
  if (p.length !== 2 || q.length !== 2) {
    return 0;
  }
  dx = p[0] - q[0];
  dy = p[1] - q[1];
  return Math.sqrt(dx * dx + dy * dy);
};

bearing = function(p, q) {
  var dx, dy, res;
  if (p.length !== 2 || q.length !== 2) {
    return 0;
  }
  dx = p[0] - q[0];
  dy = p[1] - q[1];
  res = 360 + Math.round(degrees(Math.atan2(dx, dy)));
  return res % 360;
};

//merp = (y1,y2,i,x1=0,x2=1) -> map i,x1,x2,y1,y2
// interpolate = (a, b, c, d, value) -> c + value/b * (d-c)
// ass 16, interpolate 0,1024,0,256,64
// ass 240, interpolate 0,1024,256,0,64
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxhQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUE7O0FBQUEsS0FBQSxHQUFRLENBQUMsQ0FBQzs7QUFDVixHQUFBLEdBQU0sUUFBQSxDQUFDLENBQUQsRUFBRyxJQUFFLElBQUwsQ0FBQTtTQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixDQUF0QixFQUF5QixDQUF6QjtBQUFkOztBQUNOLE9BQUEsR0FBVSxRQUFBLENBQUMsQ0FBRCxFQUFHLE1BQUksQ0FBUCxDQUFBO1NBQWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUUsRUFBQSxJQUFJLEdBQWpCLENBQUEsR0FBc0IsRUFBQSxJQUFJO0FBQXZDOztBQUVWLEdBQUEsR0FBTSxRQUFBLENBQUMsQ0FBRCxFQUFJLEVBQUosRUFBUSxFQUFSLEVBQVksRUFBWixFQUFnQixFQUFoQixDQUFBO1NBQXVCLENBQUMsQ0FBQSxHQUFJLEVBQUwsQ0FBQSxHQUFXLENBQUMsRUFBQSxHQUFLLEVBQU4sQ0FBWCxHQUF1QixDQUFDLEVBQUEsR0FBSyxFQUFOLENBQXZCLEdBQW1DO0FBQTFEOztBQUNOLEdBQUEsQ0FBSSxHQUFKLEVBQVEsR0FBQSxDQUFJLEdBQUosRUFBUSxHQUFSLEVBQVksR0FBWixFQUFnQixHQUFoQixFQUFvQixHQUFwQixDQUFSOztBQUNBLEdBQUEsQ0FBSSxHQUFKLEVBQVEsR0FBQSxDQUFJLEdBQUosRUFBUSxHQUFSLEVBQVksR0FBWixFQUFnQixHQUFoQixFQUFvQixHQUFwQixDQUFSOztBQUVBLE9BQUEsR0FBVSxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQU8sQ0FBQSxHQUFJLEdBQUosR0FBVSxJQUFJLENBQUM7QUFBdEI7O0FBQ1YsT0FBQSxHQUFVLFFBQUEsQ0FBQyxDQUFELENBQUE7U0FBTyxDQUFBLEdBQUksSUFBSSxDQUFDLEVBQVQsR0FBYztBQUFyQjs7QUFFVixRQUFBLEdBQVcsUUFBQSxDQUFDLENBQUQsRUFBRyxDQUFILENBQUE7QUFDVixNQUFBLEVBQUEsRUFBQTtFQUFBLElBQUcsQ0FBQyxDQUFDLE1BQUYsS0FBWSxDQUFaLElBQWlCLENBQUMsQ0FBQyxNQUFGLEtBQVksQ0FBaEM7QUFBdUMsV0FBTyxFQUE5Qzs7RUFDQSxFQUFBLEdBQUssQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxDQUFBO0VBQ2QsRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtTQUNkLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFLLEVBQUwsR0FBVSxFQUFBLEdBQUssRUFBekI7QUFKVTs7QUFNWCxPQUFBLEdBQVUsUUFBQSxDQUFDLENBQUQsRUFBRyxDQUFILENBQUE7QUFDVCxNQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUE7RUFBQSxJQUFHLENBQUMsQ0FBQyxNQUFGLEtBQVUsQ0FBVixJQUFlLENBQUMsQ0FBQyxNQUFGLEtBQVUsQ0FBNUI7QUFBbUMsV0FBTyxFQUExQzs7RUFDQSxFQUFBLEdBQUssQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxDQUFBO0VBQ2QsRUFBQSxHQUFLLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtFQUNkLEdBQUEsR0FBTSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFBLENBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFYLEVBQWMsRUFBZCxDQUFSLENBQVg7U0FDWixHQUFBLEdBQU07QUFMRyxFQWpCVjs7Ozs7O0FBNkJBLGFBQUEsR0FBZ0IsUUFBQSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFyQixDQUFBO0FBQ2YsTUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBO0VBQUEsQ0FBQSxHQUFJLFNBQUEsQ0FBVSxDQUFWO0VBQ0osR0FBQSxHQUFNLENBQUMsQ0FBQyxLQUFGLENBQVEsR0FBUjtFQUNOLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtBQUF3QixXQUFPLENBQUEsRUFBL0I7O0VBQ0EsQ0FBQSxHQUFJLEdBQUksQ0FBQSxDQUFBO0VBQ1IsSUFBRyxDQUFBLEtBQUcsRUFBTjtBQUFjLFdBQU8sQ0FBQSxFQUFyQjs7U0FDQSxDQUFDLENBQUMsTUFBRjs7QUFBcUI7QUFBQTtJQUFBLEtBQUEscUNBQUE7O21CQUFaLENBQUMsQ0FBQyxLQUFGLENBQVEsR0FBUjtJQUFZLENBQUE7O01BQXJCO0FBTmUiLCJzb3VyY2VzQ29udGVudCI6WyJyYW5nZSA9IF8ucmFuZ2VcclxuYXNzID0gKGEsYj10cnVlKSAtPiBjaGFpLmFzc2VydC5kZWVwRXF1YWwgYSwgYlxyXG5teVJvdW5kID0gKHgsZGVjPTApIC0+IE1hdGgucm91bmQoeCoxMCoqZGVjKS8xMCoqZGVjXHJcblxyXG5tYXAgPSAoeCwgeDAsIHgxLCB5MCwgeTEpIC0+ICh4IC0geDApIC8gKHgxIC0geDApICogKHkxIC0geTApICsgeTBcclxuYXNzIDMyNSxtYXAgMTUwLDEwMCwyMDAsMzAwLDM1MFxyXG5hc3MgMzc1LG1hcCAyNTAsMTAwLDIwMCwzMDAsMzUwXHJcblxyXG5kZWdyZWVzID0gKHgpIC0+IHggKiAxODAgLyBNYXRoLlBJXHJcbnJhZGlhbnMgPSAoeCkgLT4geCAqIE1hdGguUEkgLyAxODBcclxuXHJcbmRpc3RhbmNlID0gKHAscSkgLT5cclxuXHRpZiBwLmxlbmd0aCAhPSAyIG9yIHEubGVuZ3RoICE9IDIgdGhlbiByZXR1cm4gMFxyXG5cdGR4ID0gcFswXSAtIHFbMF1cclxuXHRkeSA9IHBbMV0gLSBxWzFdXHJcblx0TWF0aC5zcXJ0IGR4ICogZHggKyBkeSAqIGR5XHJcblxyXG5iZWFyaW5nID0gKHAscSkgLT5cclxuXHRpZiBwLmxlbmd0aCE9MiBvciBxLmxlbmd0aCE9MiB0aGVuIHJldHVybiAwXHJcblx0ZHggPSBwWzBdIC0gcVswXVxyXG5cdGR5ID0gcFsxXSAtIHFbMV1cclxuXHRyZXMgPSAzNjAgKyBNYXRoLnJvdW5kIGRlZ3JlZXMgTWF0aC5hdGFuMiBkeCxkeVxyXG5cdHJlcyAlIDM2MFxyXG5cclxuI21lcnAgPSAoeTEseTIsaSx4MT0wLHgyPTEpIC0+IG1hcCBpLHgxLHgyLHkxLHkyXHJcbiMgaW50ZXJwb2xhdGUgPSAoYSwgYiwgYywgZCwgdmFsdWUpIC0+IGMgKyB2YWx1ZS9iICogKGQtYylcclxuIyBhc3MgMTYsIGludGVycG9sYXRlIDAsMTAyNCwwLDI1Niw2NFxyXG4jIGFzcyAyNDAsIGludGVycG9sYXRlIDAsMTAyNCwyNTYsMCw2NFxyXG5cclxuZ2V0UGFyYW1ldGVycyA9IChoID0gd2luZG93LmxvY2F0aW9uLmhyZWYpIC0+XHJcblx0aCA9IGRlY29kZVVSSSBoXHJcblx0YXJyID0gaC5zcGxpdCgnPycpXHJcblx0aWYgYXJyLmxlbmd0aCAhPSAyIHRoZW4gcmV0dXJuIHt9XHJcblx0cyA9IGFyclsxXVxyXG5cdGlmIHM9PScnIHRoZW4gcmV0dXJuIHt9XHJcblx0Xy5vYmplY3QoZi5zcGxpdCAnPScgZm9yIGYgaW4gcy5zcGxpdCgnJicpKVxyXG4iXX0=
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\utils.coffee