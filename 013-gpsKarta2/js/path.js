// Generated by CoffeeScript 2.4.1
var Path;

Path = class Path {
  constructor(path1) {
    this.path = path1;
    console.log('Path', this.path);
    if (this.path === "") {
      this.points = [];
      this.hash = 0;
      this.distance = 0;
      this.count = 0;
      this.box = null;
    } else {
      this.points = decodeAll(this.path);
      // console.log "remove stand stills"
      // temp = [@points[0]]
      // for [x,y] in @points
      // 	[x0,y0] = temp[temp.length-1]
      // 	if x0!=x or y0!=y then temp.push [x,y]
      // @points = temp
      this.hash = this.hashCode(this.path);
      this.distance = this.calcDist(); // in meters
      this.count = this.points.length;
      this.box = this.calcBox();
    }
  }

  calcDist() {
    var dx, dy, i, j, len, ref, res, x0, x1, y0, y1;
    res = 0;
    ref = range(1, this.points.length);
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      [x0, y0] = this.points[i - 1];
      [x1, y1] = this.points[i];
      dx = x0 - x1;
      dy = y0 - y1;
      res += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(res);
  }

  calcBox() {
    var j, len, ref, x, xmax, xmin, y, ymax, ymin;
    [xmin, ymin] = this.points[0];
    [xmax, ymax] = this.points[0];
    ref = this.points;
    for (j = 0, len = ref.length; j < len; j++) {
      [x, y] = ref[j];
      if (x < xmin) {
        xmin = x;
      }
      if (x > xmax) {
        xmax = x;
      }
      if (y < ymin) {
        ymin = y;
      }
      if (y > ymax) {
        ymax = y;
      }
    }
    return [[myRound(xmin), myRound(ymin)], [myRound(xmax), myRound(ymax)]];
  }

  hashCode(path) {
    var hash, i, j, len, ref;
    hash = 0;
    ref = range(path.length);
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      hash = ((hash << 5) - hash) + path.charCodeAt(i);
    }
    return hash;
  }

  save() {
    var box, found, j, len;
    if (this.points.length === 0) {
      return;
    }
    found = false;
    this.path = encodeAll(this.points);
    this.hash = this.hashCode(this.path);
    this.box = this.calcBox();
    this.distance = this.calcDist();
    for (j = 0, len = boxes.length; j < len; j++) {
      box = boxes[j];
      if (box[0] === this.hash) {
        found = true;
      }
    }
    if (!found) {
      console.log('save', this.points, this.path, this.hash, this.box, this.distance);
      boxes.push([this.hash, this.box]);
      localStorage.boxes = JSON.stringify(boxes);
      return localStorage[this.hash] = this.path;
    }
  }

  delete() {
    var box, i, j, len, playPath, ref;
    localStorage.removeItem(this.hash);
    ref = range(boxes.length);
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      box = boxes[i];
      console.log(i, box);
      if (box[0] === this.hash) {
        boxes.splice(i, 1);
        playPath = null;
        localStorage.boxes = JSON.stringify(boxes);
        return;
      }
    }
  }

};

// temp  = new Path 'Christer'
// ass 1979511370, temp.hashCode 'Christer'

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxwYXRoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBTSxPQUFOLE1BQUEsS0FBQTtFQUNDLFdBQWMsTUFBQSxDQUFBO0lBQUMsSUFBQyxDQUFBO0lBQ2YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLEVBQW1CLElBQUMsQ0FBQSxJQUFwQjtJQUNBLElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxFQUFaO01BQ0MsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxHQUFELEdBQU8sS0FMUjtLQUFBLE1BQUE7TUFPQyxJQUFDLENBQUEsTUFBRCxHQUFVLFNBQUEsQ0FBVSxJQUFDLENBQUEsSUFBWCxFQUFWOzs7Ozs7O01BU0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxJQUFYO01BQ1IsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsUUFBRCxDQUFBLEVBVlo7TUFXQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUM7TUFDakIsSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFBLEVBbkJSOztFQUZhOztFQXVCZCxRQUFXLENBQUEsQ0FBQTtBQUNWLFFBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBO0lBQUEsR0FBQSxHQUFNO0FBQ047SUFBQSxLQUFBLHFDQUFBOztNQUNDLENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxHQUFFLENBQUY7TUFDbEIsQ0FBQyxFQUFELEVBQUksRUFBSixDQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBO01BQ2xCLEVBQUEsR0FBSyxFQUFBLEdBQUc7TUFDUixFQUFBLEdBQUssRUFBQSxHQUFHO01BQ1IsR0FBQSxJQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFHLEVBQUgsR0FBTSxFQUFBLEdBQUcsRUFBbkI7SUFMUjtXQU1BLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDtFQVJVOztFQVVYLE9BQVUsQ0FBQSxDQUFBO0FBQ1QsUUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBO0lBQUEsQ0FBQyxJQUFELEVBQU0sSUFBTixDQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBO0lBQ3RCLENBQUMsSUFBRCxFQUFNLElBQU4sQ0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQTtBQUN0QjtJQUFBLEtBQUEscUNBQUE7TUFBSSxDQUFDLENBQUQsRUFBRyxDQUFIO01BQ0gsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUFpQixJQUFBLEdBQU8sRUFBeEI7O01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUFpQixJQUFBLEdBQU8sRUFBeEI7O01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUFpQixJQUFBLEdBQU8sRUFBeEI7O01BQ0EsSUFBRyxDQUFBLEdBQUksSUFBUDtRQUFpQixJQUFBLEdBQU8sRUFBeEI7O0lBSkQ7V0FLQSxDQUFDLENBQUMsT0FBQSxDQUFRLElBQVIsQ0FBRCxFQUFlLE9BQUEsQ0FBUSxJQUFSLENBQWYsQ0FBRCxFQUErQixDQUFDLE9BQUEsQ0FBUSxJQUFSLENBQUQsRUFBZSxPQUFBLENBQVEsSUFBUixDQUFmLENBQS9CO0VBUlM7O0VBVVYsUUFBVyxDQUFDLElBQUQsQ0FBQTtBQUNWLFFBQUEsSUFBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUEsSUFBQSxHQUFPO0FBQ1A7SUFBQSxLQUFBLHFDQUFBOztNQUNDLElBQUEsR0FBUSxDQUFDLENBQUMsSUFBQSxJQUFRLENBQVQsQ0FBQSxHQUFjLElBQWYsQ0FBQSxHQUF1QixJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQjtJQURoQztXQUVBO0VBSlU7O0VBTVgsSUFBTyxDQUFBLENBQUE7QUFDTixRQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7QUFBNEIsYUFBNUI7O0lBQ0EsS0FBQSxHQUFRO0lBQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxTQUFBLENBQVUsSUFBQyxDQUFBLE1BQVg7SUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLElBQVg7SUFDUixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxPQUFELENBQUE7SUFDUCxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxRQUFELENBQUE7SUFDWixLQUFBLHVDQUFBOztNQUNDLElBQUcsR0FBSSxDQUFBLENBQUEsQ0FBSixLQUFVLElBQUMsQ0FBQSxJQUFkO1FBQXdCLEtBQUEsR0FBUSxLQUFoQzs7SUFERDtJQUVBLElBQUcsQ0FBSSxLQUFQO01BQ0MsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLEVBQW1CLElBQUMsQ0FBQSxNQUFwQixFQUEyQixJQUFDLENBQUEsSUFBNUIsRUFBaUMsSUFBQyxDQUFBLElBQWxDLEVBQXVDLElBQUMsQ0FBQSxHQUF4QyxFQUE0QyxJQUFDLENBQUEsUUFBN0M7TUFDQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQUMsSUFBQyxDQUFBLElBQUYsRUFBTyxJQUFDLENBQUEsR0FBUixDQUFYO01BQ0EsWUFBWSxDQUFDLEtBQWIsR0FBcUIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFmO2FBQ3JCLFlBQWEsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFiLEdBQXNCLElBQUMsQ0FBQSxLQUp4Qjs7RUFUTTs7RUFlUCxNQUFTLENBQUEsQ0FBQTtBQUNSLFFBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQTtJQUFBLFlBQVksQ0FBQyxVQUFiLENBQXdCLElBQUMsQ0FBQSxJQUF6QjtBQUNBO0lBQUEsS0FBQSxxQ0FBQTs7TUFDQyxHQUFBLEdBQU0sS0FBTSxDQUFBLENBQUE7TUFDWixPQUFPLENBQUMsR0FBUixDQUFZLENBQVosRUFBYyxHQUFkO01BQ0EsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsSUFBQyxDQUFBLElBQWQ7UUFDQyxLQUFLLENBQUMsTUFBTixDQUFhLENBQWIsRUFBZSxDQUFmO1FBQ0EsUUFBQSxHQUFXO1FBQ1gsWUFBWSxDQUFDLEtBQWIsR0FBcUIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFmO0FBQ3JCLGVBSkQ7O0lBSEQ7RUFGUTs7QUFqRVY7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBQYXRoXHJcblx0Y29uc3RydWN0b3IgOiAoQHBhdGgpIC0+XHJcblx0XHRjb25zb2xlLmxvZyAnUGF0aCcsQHBhdGhcclxuXHRcdGlmIEBwYXRoID09IFwiXCJcclxuXHRcdFx0QHBvaW50cyA9IFtdXHJcblx0XHRcdEBoYXNoID0gMFxyXG5cdFx0XHRAZGlzdGFuY2UgPSAwXHJcblx0XHRcdEBjb3VudCA9IDBcclxuXHRcdFx0QGJveCA9IG51bGxcclxuXHRcdGVsc2VcclxuXHRcdFx0QHBvaW50cyA9IGRlY29kZUFsbCBAcGF0aFxyXG5cclxuXHRcdFx0IyBjb25zb2xlLmxvZyBcInJlbW92ZSBzdGFuZCBzdGlsbHNcIlxyXG5cdFx0XHQjIHRlbXAgPSBbQHBvaW50c1swXV1cclxuXHRcdFx0IyBmb3IgW3gseV0gaW4gQHBvaW50c1xyXG5cdFx0XHQjIFx0W3gwLHkwXSA9IHRlbXBbdGVtcC5sZW5ndGgtMV1cclxuXHRcdFx0IyBcdGlmIHgwIT14IG9yIHkwIT15IHRoZW4gdGVtcC5wdXNoIFt4LHldXHJcblx0XHRcdCMgQHBvaW50cyA9IHRlbXBcclxuXHJcblx0XHRcdEBoYXNoID0gQGhhc2hDb2RlIEBwYXRoXHJcblx0XHRcdEBkaXN0YW5jZSA9IEBjYWxjRGlzdCgpICMgaW4gbWV0ZXJzXHJcblx0XHRcdEBjb3VudCA9IEBwb2ludHMubGVuZ3RoXHJcblx0XHRcdEBib3ggPSBAY2FsY0JveCgpXHJcblxyXG5cdGNhbGNEaXN0IDogLT5cclxuXHRcdHJlcyA9IDBcclxuXHRcdGZvciBpIGluIHJhbmdlIDEsQHBvaW50cy5sZW5ndGhcclxuXHRcdFx0W3gwLHkwXSA9IEBwb2ludHNbaS0xXVxyXG5cdFx0XHRbeDEseTFdID0gQHBvaW50c1tpXVxyXG5cdFx0XHRkeCA9IHgwLXgxXHJcblx0XHRcdGR5ID0geTAteTFcclxuXHRcdFx0cmVzICs9IE1hdGguc3FydCBkeCpkeCtkeSpkeVxyXG5cdFx0TWF0aC5yb3VuZCByZXNcclxuXHJcblx0Y2FsY0JveCA6IC0+XHJcblx0XHRbeG1pbix5bWluXSA9IEBwb2ludHNbMF1cclxuXHRcdFt4bWF4LHltYXhdID0gQHBvaW50c1swXVxyXG5cdFx0Zm9yIFt4LHldIGluIEBwb2ludHNcclxuXHRcdFx0aWYgeCA8IHhtaW4gdGhlbiB4bWluID0geFxyXG5cdFx0XHRpZiB4ID4geG1heCB0aGVuIHhtYXggPSB4XHJcblx0XHRcdGlmIHkgPCB5bWluIHRoZW4geW1pbiA9IHlcclxuXHRcdFx0aWYgeSA+IHltYXggdGhlbiB5bWF4ID0geVxyXG5cdFx0W1tteVJvdW5kKHhtaW4pLG15Um91bmQoeW1pbildLFtteVJvdW5kKHhtYXgpLG15Um91bmQoeW1heCldXVxyXG5cclxuXHRoYXNoQ29kZSA6IChwYXRoKSAtPlxyXG5cdFx0aGFzaCA9IDBcclxuXHRcdGZvciBpIGluIHJhbmdlIHBhdGgubGVuZ3RoXHJcblx0XHRcdGhhc2ggID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBwYXRoLmNoYXJDb2RlQXQgaVxyXG5cdFx0aGFzaFxyXG5cclxuXHRzYXZlIDogLT5cclxuXHRcdGlmIEBwb2ludHMubGVuZ3RoID09IDAgdGhlbiByZXR1cm5cclxuXHRcdGZvdW5kID0gZmFsc2VcclxuXHRcdEBwYXRoID0gZW5jb2RlQWxsIEBwb2ludHNcclxuXHRcdEBoYXNoID0gQGhhc2hDb2RlIEBwYXRoXHJcblx0XHRAYm94ID0gQGNhbGNCb3goKVxyXG5cdFx0QGRpc3RhbmNlID0gQGNhbGNEaXN0KClcclxuXHRcdGZvciBib3ggaW4gYm94ZXNcclxuXHRcdFx0aWYgYm94WzBdID09IEBoYXNoIHRoZW4gZm91bmQgPSB0cnVlXHJcblx0XHRpZiBub3QgZm91bmRcclxuXHRcdFx0Y29uc29sZS5sb2cgJ3NhdmUnLEBwb2ludHMsQHBhdGgsQGhhc2gsQGJveCxAZGlzdGFuY2VcclxuXHRcdFx0Ym94ZXMucHVzaCBbQGhhc2gsQGJveF1cclxuXHRcdFx0bG9jYWxTdG9yYWdlLmJveGVzID0gSlNPTi5zdHJpbmdpZnkgYm94ZXNcclxuXHRcdFx0bG9jYWxTdG9yYWdlW0BoYXNoXSA9IEBwYXRoXHJcblx0XHJcblx0ZGVsZXRlIDogLT5cclxuXHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtIEBoYXNoXHJcblx0XHRmb3IgaSBpbiByYW5nZSBib3hlcy5sZW5ndGhcclxuXHRcdFx0Ym94ID0gYm94ZXNbaV1cclxuXHRcdFx0Y29uc29sZS5sb2cgaSxib3hcclxuXHRcdFx0aWYgYm94WzBdID09IEBoYXNoXHJcblx0XHRcdFx0Ym94ZXMuc3BsaWNlIGksMVxyXG5cdFx0XHRcdHBsYXlQYXRoID0gbnVsbFxyXG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5ib3hlcyA9IEpTT04uc3RyaW5naWZ5IGJveGVzXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG4jIHRlbXAgID0gbmV3IFBhdGggJ0NocmlzdGVyJ1xyXG4jIGFzcyAxOTc5NTExMzcwLCB0ZW1wLmhhc2hDb2RlICdDaHJpc3RlcidcclxuIl19
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\path.coffee