// Generated by CoffeeScript 2.4.1
var LETTERS, decode, decodeAll, encode, encodeAll;

LETTERS = 'zyxwvutsrqponmlkjihgfedcba0ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// endimensionell komprimering
// c b a 0 A B C = -3 -2 -1 0 1 2 3 
// Två tecken per koordinat

// Exempel: 
// [1017,1373] absolut
// [1016,1378] (-1,5)
// [1016,1383] (0,5)
// [1017,1388] (1,5)
// Kodas: 1017,1373,aE0EAE
encode = function(x, y) {
  var x0, x1, y0, y1;
  if ((-26 <= x && x <= 26) && (-26 <= y && y <= 26)) {
    return LETTERS[26 + x] + LETTERS[26 + y];
  }
  [x0, y0] = [Math.floor(x / 2), Math.floor(y / 2)];
  [x1, y1] = [x - x0, y - y0];
  return encode(x0, y0) + encode(x1, y1);
};

ass('00', encode(0, 0));

ass('0A', encode(0, 1));

ass('A0', encode(1, 0));

ass('CC', encode(3, 3));

ass('FF', encode(6, 6));

ass('GG', encode(7, 7));

ass('NN', encode(14, 14));

ass('0a', encode(0, -1));

ass('a0', encode(-1, 0));

ass('cC', encode(-3, 3));

ass('Ff', encode(6, -6));

ass('gG', encode(-7, 7));

ass('Nn', encode(14, -14));

ass('Zz', encode(26, -26));

ass('MnNm', encode(27, -27));

ass('LYMYLYMY', encode(50, 100));

decode = function(xy) {
  var ix, iy;
  ix = -26 + LETTERS.indexOf(xy[0]);
  iy = -26 + LETTERS.indexOf(xy[1]);
  return [ix, iy];
};

ass([1, 0], decode('A0'));

ass([0, 1], decode('0A'));

ass([7, 7], decode('GG'));

ass([26, -26], decode('Zz'));

encodeAll = function(pairs) {
  var dx, dy, i, j, len, ref, result, x, x0, x1, y, y0, y1;
  [x, y] = pairs[0];
  result = `${x},${y},`;
  ref = range(1, pairs.length);
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    [x0, y0] = pairs[i - 1];
    [x1, y1] = pairs[i];
    [dx, dy] = [x1 - x0, y1 - y0];
    result += encode(dx, dy);
  }
  return result;
};

ass('1017,1373,aE0E', encodeAll([[1017, 1373], [1016, 1378], [1016, 1383]]));

ass('1017,1373,', encodeAll([[1017, 1373]]));

decodeAll = function(s) {
  var dx, dy, i, j, len, points, ref, result, x, xy, y;
  result = [];
  [x, y, points] = s.split(',');
  x = parseInt(x);
  y = parseInt(y);
  result.push([x, y]);
  if (!points) {
    return result;
  }
  ref = range(0, points.length, 2);
  for (j = 0, len = ref.length; j < len; j++) {
    i = ref[j];
    xy = points.slice(i, i + 2);
    [dx, dy] = decode(xy);
    x += dx;
    y += dy;
    result.push([x, y]);
  }
  return result;
};

ass([[1017, 1373], [1016, 1378], [1016, 1383]], decodeAll('1017,1373,aE0E'));

ass([[0, 0], [3, -8], [-15, -17], [-34, -37], [-39, -55]], decodeAll('0,0,Christer'));

ass([[1, 2], [4, -6], [-14, -15], [-33, -35], [-38, -53]], decodeAll('1,2,Christer'));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHJlc3MuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcY29tcHJlc3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQTs7QUFBQSxPQUFBLEdBQVUsd0RBQVY7Ozs7Ozs7Ozs7OztBQWFBLE1BQUEsR0FBUyxRQUFBLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBQTtBQUNSLE1BQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUE7RUFBQSxJQUFHLENBQUEsQ0FBQyxFQUFELElBQU8sQ0FBUCxJQUFPLENBQVAsSUFBWSxFQUFaLENBQUEsSUFBbUIsQ0FBQSxDQUFDLEVBQUQsSUFBTyxDQUFQLElBQU8sQ0FBUCxJQUFZLEVBQVosQ0FBdEI7QUFBMEMsV0FBTyxPQUFRLENBQUEsRUFBQSxHQUFHLENBQUgsQ0FBUixHQUFnQixPQUFRLENBQUEsRUFBQSxHQUFHLENBQUgsRUFBekU7O0VBQ0EsQ0FBQyxFQUFELEVBQUksRUFBSixDQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBRSxDQUFiLENBQUQsRUFBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUUsQ0FBYixDQUFsQjtFQUNWLENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQSxHQUFVLENBQUMsQ0FBQSxHQUFFLEVBQUgsRUFBTSxDQUFBLEdBQUUsRUFBUjtTQUNWLE1BQUEsQ0FBTyxFQUFQLEVBQVUsRUFBVixDQUFBLEdBQWdCLE1BQUEsQ0FBTyxFQUFQLEVBQVUsRUFBVjtBQUpSOztBQUtULEdBQUEsQ0FBSSxJQUFKLEVBQVUsTUFBQSxDQUFPLENBQVAsRUFBUyxDQUFULENBQVY7O0FBQ0EsR0FBQSxDQUFJLElBQUosRUFBVSxNQUFBLENBQU8sQ0FBUCxFQUFTLENBQVQsQ0FBVjs7QUFDQSxHQUFBLENBQUksSUFBSixFQUFVLE1BQUEsQ0FBTyxD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SUFBTixDQUFELEVBQWEsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFiLEVBQTBCLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FBMUIsQ0FBSixFQUE2QyxTQUFBLENBQVUsZ0JBQVYsQ0FBN0M7O0FBQ0EsR0FBQSxDQUFJLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBQyxDQUFKLENBQVAsRUFBYyxDQUFDLENBQUMsRUFBRixFQUFLLENBQUMsRUFBTixDQUFkLEVBQXdCLENBQUMsQ0FBQyxFQUFGLEVBQUssQ0FBQyxFQUFOLENBQXhCLEVBQWtDLENBQUMsQ0FBQyxFQUFGLEVBQUssQ0FBQyxFQUFOLENBQWxDLENBQUosRUFBa0QsU0FBQSxDQUFVLGNBQVYsQ0FBbEQ7O0FBQ0EsR0FBQSxDQUFJLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVEsQ0FBQyxDQUFELEVBQUksQ0FBQyxDQUFMLENBQVIsRUFBZ0IsQ0FBQyxDQUFDLEVBQUYsRUFBTSxDQUFDLEVBQVAsQ0FBaEIsRUFBMkIsQ0FBQyxDQUFDLEVBQUYsRUFBTSxDQUFDLEVBQVAsQ0FBM0IsRUFBc0MsQ0FBQyxDQUFDLEVBQUYsRUFBTSxDQUFDLEVBQVAsQ0FBdEMsQ0FBSixFQUF1RCxTQUFBLENBQVUsY0FBVixDQUF2RCIsInNvdXJjZXNDb250ZW50IjpbIkxFVFRFUlMgPSAnenl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmEwQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonXHJcblxyXG4jIGVuZGltZW5zaW9uZWxsIGtvbXByaW1lcmluZ1xyXG4jIGMgYiBhIDAgQSBCIEMgPSAtMyAtMiAtMSAwIDEgMiAzIFxyXG4jIFR2w6UgdGVja2VuIHBlciBrb29yZGluYXRcclxuXHJcbiMgRXhlbXBlbDogXHJcbiMgWzEwMTcsMTM3M10gYWJzb2x1dFxyXG4jIFsxMDE2LDEzNzhdICgtMSw1KVxyXG4jIFsxMDE2LDEzODNdICgwLDUpXHJcbiMgWzEwMTcsMTM4OF0gKDEsNSlcclxuIyBLb2RhczogMTAxNywxMzczLGFFMEVBRVxyXG5cclxuZW5jb2RlID0gKHgseSkgLT5cclxuXHRpZiAtMjYgPD0geCA8PSAyNiBhbmQgLTI2IDw9IHkgPD0gMjYgdGhlbiByZXR1cm4gTEVUVEVSU1syNit4XSArIExFVFRFUlNbMjYreV1cclxuXHRbeDAseTBdID0gW01hdGguZmxvb3IoeC8yKSwgTWF0aC5mbG9vcih5LzIpXVxyXG5cdFt4MSx5MV0gPSBbeC14MCx5LXkwXVxyXG5cdGVuY29kZSh4MCx5MCkgKyBlbmNvZGUoeDEseTEpXHJcbmFzcyAnMDAnLCBlbmNvZGUgMCwwXHJcbmFzcyAnMEEnLCBlbmNvZGUgMCwxXHJcbmFzcyAnQTAnLCBlbmNvZGUgMSwwXHJcbmFzcyAnQ0MnLCBlbmNvZGUgMywzXHJcbmFzcyAnRkYnLCBlbmNvZGUgNiw2XHJcbmFzcyAnR0cnLCBlbmNvZGUgNyw3XHJcbmFzcyAnTk4nLCBlbmNvZGUgMTQsMTRcclxuYXNzICcwYScsIGVuY29kZSAwLC0xXHJcbmFzcyAnYTAnLCBlbmNvZGUgLTEsMFxyXG5hc3MgJ2NDJywgZW5jb2RlIC0zLDNcclxuYXNzICdGZicsIGVuY29kZSA2LC02XHJcbmFzcyAnZ0cnLCBlbmNvZGUgLTcsN1xyXG5hc3MgJ05uJywgZW5jb2RlIDE0LC0xNFxyXG5hc3MgJ1p6JywgZW5jb2RlIDI2LC0yNlxyXG5hc3MgJ01uTm0nLCBlbmNvZGUgMjcsLTI3XHJcbmFzcyAnTFlNWUxZTVknLCBlbmNvZGUgNTAsMTAwXHJcblxyXG5kZWNvZGUgPSAoeHkpIC0+IFxyXG5cdGl4ID0gLSAyNiArIExFVFRFUlMuaW5kZXhPZiB4eVswXVxyXG5cdGl5ID0gLSAyNiArIExFVFRFUlMuaW5kZXhPZiB4eVsxXVxyXG5cdFtpeCxpeV1cclxuYXNzIFsxLDBdLCBkZWNvZGUgJ0EwJ1xyXG5hc3MgWzAsMV0sIGRlY29kZSAnMEEnXHJcbmFzcyBbNyw3XSwgZGVjb2RlICdHRydcclxuYXNzIFsyNiwtMjZdLCBkZWNvZGUgJ1p6J1xyXG5cclxuZW5jb2RlQWxsID0gKHBhaXJzKSAtPlxyXG5cdFt4LHldID0gcGFpcnNbMF1cclxuXHRyZXN1bHQgPSBcIiN7eH0sI3t5fSxcIiBcclxuXHRmb3IgaSBpbiByYW5nZSAxLHBhaXJzLmxlbmd0aFxyXG5cdFx0W3gwLHkwXSA9IHBhaXJzW2ktMV1cclxuXHRcdFt4MSx5MV0gPSBwYWlyc1tpXVxyXG5cdFx0W2R4LGR5XSA9IFt4MS14MCwgeTEteTBdXHJcblx0XHRyZXN1bHQgKz0gZW5jb2RlIGR4LGR5XHJcblx0cmVzdWx0XHJcbmFzcyAnMTAxNywxMzczLGFFMEUnLCBlbmNvZGVBbGwgW1sxMDE3LDEzNzNdLFsxMDE2LDEzNzhdLFsxMDE2LDEzODNdXVxyXG5hc3MgJzEwMTcsMTM3MywnLCBlbmNvZGVBbGwgW1sxMDE3LDEzNzNdXVxyXG5cclxuZGVjb2RlQWxsID0gKHMpIC0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRbeCx5LHBvaW50c10gPSBzLnNwbGl0ICcsJ1xyXG5cdHggPSBwYXJzZUludCB4XHJcblx0eSA9IHBhcnNlSW50IHlcclxuXHRyZXN1bHQucHVzaCBbeCx5XVxyXG5cdGlmIG5vdCBwb2ludHMgdGhlbiByZXR1cm4gcmVzdWx0XHJcblx0Zm9yIGkgaW4gcmFuZ2UgMCxwb2ludHMubGVuZ3RoLDJcclxuXHRcdHh5ID0gcG9pbnRzLnNsaWNlIGksaSsyXHJcblx0XHRbZHgsZHldID0gZGVjb2RlIHh5XHJcblx0XHR4ICs9IGR4XHJcblx0XHR5ICs9IGR5XHJcblx0XHRyZXN1bHQucHVzaCBbeCx5XVxyXG5cdHJlc3VsdFxyXG5hc3MgW1sxMDE3LDEzNzNdLFsxMDE2LCAxMzc4XSxbMTAxNiwgMTM4M11dLCBkZWNvZGVBbGwgJzEwMTcsMTM3MyxhRTBFJ1xyXG5hc3MgW1swLDBdLFszLC04XSxbLTE1LC0xN10sWy0zNCwtMzddLFstMzksLTU1XV0sIGRlY29kZUFsbCAnMCwwLENocmlzdGVyJ1xyXG5hc3MgW1sxLCAyXSxbNCwgLTZdLFstMTQsIC0xNV0sWy0zMywgLTM1XSxbLTM4LCAtNTNdXSwgZGVjb2RlQWxsICcxLDIsQ2hyaXN0ZXInXHJcbiJdfQ==
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\compress.coffee