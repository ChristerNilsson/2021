// Generated by CoffeeScript 2.4.1
var Path;

Path = class Path {
  constructor(path1) {
    var j, len, ref, temp, x, x0, y, y0;
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
      console.log("remove stand stills");
      temp = [this.points[0]];
      ref = this.points;
      for (j = 0, len = ref.length; j < len; j++) {
        [x, y] = ref[j];
        [x0, y0] = temp[temp.length - 1];
        if (x0 !== x || y0 !== y) {
          temp.push([x, y]);
        }
      }
      this.points = temp;
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
    return [[xmin, ymin], [xmax, ymax]];
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
    var box, currentPath, i, j, len, ref;
    localStorage.removeItem(this.hash);
    ref = range(boxes.length);
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      box = boxes[i];
      console.log(i, box);
      if (box[0] === this.hash) {
        boxes.splice(i, 1);
        currentPath = null;
        localStorage.boxes = JSON.stringify(boxes);
        return;
      }
    }
  }

};

// temp  = new Path 'Christer'
// ass 1979511370, temp.hashCode 'Christer'

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxwYXRoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBTSxPQUFOLE1BQUEsS0FBQTtFQUNDLFdBQWMsTUFBQSxDQUFBO0FBQ2IsUUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUE7SUFEYyxJQUFDLENBQUE7SUFDZixPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosRUFBbUIsSUFBQyxDQUFBLElBQXBCO0lBQ0EsSUFBRyxJQUFDLENBQUEsSUFBRCxLQUFTLEVBQVo7TUFDQyxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTyxLQUxSO0tBQUEsTUFBQTtNQU9DLElBQUMsQ0FBQSxNQUFELEdBQVUsU0FBQSxDQUFVLElBQUMsQ0FBQSxJQUFYO01BRVYsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQkFBWjtNQUNBLElBQUEsR0FBTyxDQUFDLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFUO0FBQ1A7TUFBQSxLQUFBLHFDQUFBO1FBQUksQ0FBQyxDQUFELEVBQUcsQ0FBSDtRQUNILENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQSxHQUFVLElBQUssQ0FBQSxJQUFJLENBQUMsTUFBTCxHQUFZLENBQVo7UUFDZixJQUFHLEVBQUEsS0FBSSxDQUFKLElBQVMsRUFBQSxLQUFJLENBQWhCO1VBQXVCLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFWLEVBQXZCOztNQUZEO01BR0EsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUVWLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsSUFBWDtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQVZaO01BV0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDO01BQ2pCLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQW5CUjs7RUFGYTs7RUF1QmQsUUFBVyxDQUFBLENBQUE7QUFDVixRQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQTtJQUFBLEdBQUEsR0FBTTtBQUNOO0lBQUEsS0FBQSxxQ0FBQTs7TUFDQyxDQUFDLEVBQUQsRUFBSSxFQUFKLENBQUEsR0FBVSxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsR0FBRSxDQUFGO01BQ2xCLENBQUMsRUFBRCxFQUFJLEVBQUosQ0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQTtNQUNsQixFQUFBLEdBQUssRUFBQSxHQUFHO01BQ1IsRUFBQSxHQUFLLEVBQUEsR0FBRztNQUNSLEdBQUEsSUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUEsR0FBRyxFQUFILEdBQU0sRUFBQSxHQUFHLEVBQW5CO0lBTFI7V0FNQSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVg7RUFSVTs7RUFVWCxPQUFVLENBQUEsQ0FBQTtBQUNULFFBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLElBQUEsRUFBQTtJQUFBLENBQUMsSUFBRCxFQUFNLElBQU4sQ0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQTtJQUN0QixDQUFDLElBQUQsRUFBTSxJQUFOLENBQUEsR0FBYyxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUE7QUFDdEI7SUFBQSxLQUFBLHFDQUFBO01BQUksQ0FBQyxDQUFELEVBQUcsQ0FBSDtNQUNILElBQUcsQ0FBQSxHQUFJLElBQVA7UUFBaUIsSUFBQSxHQUFPLEVBQXhCOztNQUNBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFBaUIsSUFBQSxHQUFPLEVBQXhCOztNQUNBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFBaUIsSUFBQSxHQUFPLEVBQXhCOztNQUNBLElBQUcsQ0FBQSxHQUFJLElBQVA7UUFBaUIsSUFBQSxHQUFPLEVBQXhCOztJQUpEO1dBS0EsQ0FBQyxDQUFDLElBQUQsRUFBTSxJQUFOLENBQUQsRUFBYSxDQUFDLElBQUQsRUFBTSxJQUFOLENBQWI7RUFSUzs7RUFVVixRQUFXLENBQUMsSUFBRCxDQUFBO0FBQ1YsUUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7SUFBQSxJQUFBLEdBQU87QUFDUDtJQUFBLEtBQUEscUNBQUE7O01BQ0MsSUFBQSxHQUFRLENBQUMsQ0FBQyxJQUFBLElBQVEsQ0FBVCxDQUFBLEdBQWMsSUFBZixDQUFBLEdBQXVCLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCO0lBRGhDO1dBRUE7RUFKVTs7RUFNWCxJQUFPLENBQUEsQ0FBQTtBQUNOLFFBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUE7SUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixLQUFrQixDQUFyQjtBQUE0QixhQUE1Qjs7SUFDQSxLQUFBLEdBQVE7SUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLFNBQUEsQ0FBVSxJQUFDLENBQUEsTUFBWDtJQUNSLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsSUFBWDtJQUNSLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQUNQLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFFBQUQsQ0FBQTtJQUNaLEtBQUEsdUNBQUE7O01BQ0MsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsSUFBQyxDQUFBLElBQWQ7UUFBd0IsS0FBQSxHQUFRLEtBQWhDOztJQUREO0lBRUEsSUFBRyxDQUFJLEtBQVA7TUFDQyxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosRUFBbUIsSUFBQyxDQUFBLE1BQXBCLEVBQTJCLElBQUMsQ0FBQSxJQUE1QixFQUFpQyxJQUFDLENBQUEsSUFBbEMsRUFBdUMsSUFBQyxDQUFBLEdBQXhDLEVBQTRDLElBQUMsQ0FBQSxRQUE3QztNQUNBLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBQyxJQUFDLENBQUEsSUFBRixFQUFPLElBQUMsQ0FBQSxHQUFSLENBQVg7TUFDQSxZQUFZLENBQUMsS0FBYixHQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLEtBQWY7YUFDckIsWUFBYSxDQUFBLElBQUMsQ0FBQSxJQUFELENBQWIsR0FBc0IsSUFBQyxDQUFBLEtBSnhCOztFQVRNOztFQWVQLE1BQVMsQ0FBQSxDQUFBO0FBQ1IsUUFBQSxHQUFBLEVBQUEsV0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUEsWUFBWSxDQUFDLFVBQWIsQ0FBd0IsSUFBQyxDQUFBLElBQXpCO0FBQ0E7SUFBQSxLQUFBLHFDQUFBOztNQUNDLEdBQUEsR0FBTSxLQUFNLENBQUEsQ0FBQTtNQUNaLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBWixFQUFjLEdBQWQ7TUFDQSxJQUFHLEdBQUksQ0FBQSxDQUFBLENBQUosS0FBVSxJQUFDLENBQUEsSUFBZDtRQUNDLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFlLENBQWY7UUFDQSxXQUFBLEdBQWM7UUFDZCxZQUFZLENBQUMsS0FBYixHQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLEtBQWY7QUFDckIsZUFKRDs7SUFIRDtFQUZROztBQWpFVjs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFBhdGhcclxuXHRjb25zdHJ1Y3RvciA6IChAcGF0aCkgLT5cclxuXHRcdGNvbnNvbGUubG9nICdQYXRoJyxAcGF0aFxyXG5cdFx0aWYgQHBhdGggPT0gXCJcIlxyXG5cdFx0XHRAcG9pbnRzID0gW11cclxuXHRcdFx0QGhhc2ggPSAwXHJcblx0XHRcdEBkaXN0YW5jZSA9IDBcclxuXHRcdFx0QGNvdW50ID0gMFxyXG5cdFx0XHRAYm94ID0gbnVsbFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcG9pbnRzID0gZGVjb2RlQWxsIEBwYXRoXHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZyBcInJlbW92ZSBzdGFuZCBzdGlsbHNcIlxyXG5cdFx0XHR0ZW1wID0gW0Bwb2ludHNbMF1dXHJcblx0XHRcdGZvciBbeCx5XSBpbiBAcG9pbnRzXHJcblx0XHRcdFx0W3gwLHkwXSA9IHRlbXBbdGVtcC5sZW5ndGgtMV1cclxuXHRcdFx0XHRpZiB4MCE9eCBvciB5MCE9eSB0aGVuIHRlbXAucHVzaCBbeCx5XVxyXG5cdFx0XHRAcG9pbnRzID0gdGVtcFxyXG5cclxuXHRcdFx0QGhhc2ggPSBAaGFzaENvZGUgQHBhdGhcclxuXHRcdFx0QGRpc3RhbmNlID0gQGNhbGNEaXN0KCkgIyBpbiBtZXRlcnNcclxuXHRcdFx0QGNvdW50ID0gQHBvaW50cy5sZW5ndGhcclxuXHRcdFx0QGJveCA9IEBjYWxjQm94KClcclxuXHJcblx0Y2FsY0Rpc3QgOiAtPlxyXG5cdFx0cmVzID0gMFxyXG5cdFx0Zm9yIGkgaW4gcmFuZ2UgMSxAcG9pbnRzLmxlbmd0aFxyXG5cdFx0XHRbeDAseTBdID0gQHBvaW50c1tpLTFdXHJcblx0XHRcdFt4MSx5MV0gPSBAcG9pbnRzW2ldXHJcblx0XHRcdGR4ID0geDAteDFcclxuXHRcdFx0ZHkgPSB5MC15MVxyXG5cdFx0XHRyZXMgKz0gTWF0aC5zcXJ0IGR4KmR4K2R5KmR5XHJcblx0XHRNYXRoLnJvdW5kIHJlc1xyXG5cclxuXHRjYWxjQm94IDogLT5cclxuXHRcdFt4bWluLHltaW5dID0gQHBvaW50c1swXVxyXG5cdFx0W3htYXgseW1heF0gPSBAcG9pbnRzWzBdXHJcblx0XHRmb3IgW3gseV0gaW4gQHBvaW50c1xyXG5cdFx0XHRpZiB4IDwgeG1pbiB0aGVuIHhtaW4gPSB4XHJcblx0XHRcdGlmIHggPiB4bWF4IHRoZW4geG1heCA9IHhcclxuXHRcdFx0aWYgeSA8IHltaW4gdGhlbiB5bWluID0geVxyXG5cdFx0XHRpZiB5ID4geW1heCB0aGVuIHltYXggPSB5XHJcblx0XHRbW3htaW4seW1pbl0sW3htYXgseW1heF1dXHJcblxyXG5cdGhhc2hDb2RlIDogKHBhdGgpIC0+XHJcblx0XHRoYXNoID0gMFxyXG5cdFx0Zm9yIGkgaW4gcmFuZ2UgcGF0aC5sZW5ndGhcclxuXHRcdFx0aGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIHBhdGguY2hhckNvZGVBdCBpXHJcblx0XHRoYXNoXHJcblxyXG5cdHNhdmUgOiAtPlxyXG5cdFx0aWYgQHBvaW50cy5sZW5ndGggPT0gMCB0aGVuIHJldHVyblxyXG5cdFx0Zm91bmQgPSBmYWxzZVxyXG5cdFx0QHBhdGggPSBlbmNvZGVBbGwgQHBvaW50c1xyXG5cdFx0QGhhc2ggPSBAaGFzaENvZGUgQHBhdGhcclxuXHRcdEBib3ggPSBAY2FsY0JveCgpXHJcblx0XHRAZGlzdGFuY2UgPSBAY2FsY0Rpc3QoKVxyXG5cdFx0Zm9yIGJveCBpbiBib3hlc1xyXG5cdFx0XHRpZiBib3hbMF0gPT0gQGhhc2ggdGhlbiBmb3VuZCA9IHRydWVcclxuXHRcdGlmIG5vdCBmb3VuZFxyXG5cdFx0XHRjb25zb2xlLmxvZyAnc2F2ZScsQHBvaW50cyxAcGF0aCxAaGFzaCxAYm94LEBkaXN0YW5jZVxyXG5cdFx0XHRib3hlcy5wdXNoIFtAaGFzaCxAYm94XVxyXG5cdFx0XHRsb2NhbFN0b3JhZ2UuYm94ZXMgPSBKU09OLnN0cmluZ2lmeSBib3hlc1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2VbQGhhc2hdID0gQHBhdGhcclxuXHRcclxuXHRkZWxldGUgOiAtPlxyXG5cdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gQGhhc2hcclxuXHRcdGZvciBpIGluIHJhbmdlIGJveGVzLmxlbmd0aFxyXG5cdFx0XHRib3ggPSBib3hlc1tpXVxyXG5cdFx0XHRjb25zb2xlLmxvZyBpLGJveFxyXG5cdFx0XHRpZiBib3hbMF0gPT0gQGhhc2hcclxuXHRcdFx0XHRib3hlcy5zcGxpY2UgaSwxXHJcblx0XHRcdFx0Y3VycmVudFBhdGggPSBudWxsXHJcblx0XHRcdFx0bG9jYWxTdG9yYWdlLmJveGVzID0gSlNPTi5zdHJpbmdpZnkgYm94ZXNcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcbiMgdGVtcCAgPSBuZXcgUGF0aCAnQ2hyaXN0ZXInXHJcbiMgYXNzIDE5Nzk1MTEzNzAsIHRlbXAuaGFzaENvZGUgJ0NocmlzdGVyJ1xyXG4iXX0=
//# sourceURL=c:\github\2021\013-gpsKarta2\coffee\path.coffee