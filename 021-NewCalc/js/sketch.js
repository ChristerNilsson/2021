// Generated by CoffeeScript 2.4.1
var answers, bToggle, button, clear, clickList, config, decode, encode, errorlabel, execute, input, label, lista, memory, range, toggle, toggleMode, transpile, updateList,
  indexOf = [].indexOf;

label = null;

input = null;

lista = null;

errorlabel = null;

bToggle = null;

toggleMode = 1;

answers = {};

range = _.range;

memory = {
  'a': 12,
  'b': 23,
  'c': 3,
  'd': 4,
  'e': 5,
  'add': 'a+b',
  'mul': 'a*b',
  'sq': 'a*a',
  'f': '(x) -> x*x',
  'g': 'f 9',
  'h': 'i*i for i in range a'
};

config = {};

encode = function() {
  var s;
  s = encodeURI(JSON.stringify(memory));
  s = s.replace(/=/g, '%3D');
  s = s.replace(/\?/g, '%3F');
  return window.open('?content=' + s + '&config=' + encodeURI(JSON.stringify(config)));
};

decode = function() {
  var parameters;
  memory = {};
  if (indexOf.call(window.location.href, '?') >= 0) {
    parameters = getParameters();
    if (parameters.content) {
      memory = decodeURI(parameters.content);
      memory = memory.replace(/%3D/g, '=');
      memory = memory.replace(/%3F/g, '?');
      memory = JSON.parse(memory);
    }
    if (parameters.config) {
      return config = JSON.parse(decodeURI(parameters.config));
    }
  }
};

button = function(prompt, click) {
  var res;
  res = document.createElement('button');
  res.innerHTML = prompt;
  res.style = 'width:80px; font-family:courier;';
  res.onclick = click;
  document.body.appendChild(res);
  return res;
};

updateList = function() {
  var key, option, results, row;
  label.innerHTML = "";
  lista.size = _.size(memory);
  lista.length = 0;
  results = [];
  for (key in memory) {
    row = memory[key];
    if (key === 'ans') {
      if (typeof answers.ans === 'function') {
        results.push(label.innerHTML = row);
      } else {
        if (answers.ans === '') {
          results.push(label.innerHTML = answers.ans);
        } else {
          results.push(label.innerHTML = JSON.stringify(answers.ans));
        }
      }
    } else {
      option = document.createElement("option");
      if (typeof answers[key] === 'function') {
        option.innerText = `${key} = ${row}`;
      } else if (toggleMode === 0) {
        option.innerText = `${key} = ${row}`;
      } else {
        option.innerText = `${key} = ${JSON.stringify(answers[key])}`;
      }
      option.value = key;
      results.push(lista.appendChild(option));
    }
  }
  return results;
};

execute = function() {
  var arr, err, item, key, s;
  label.innerHTML = '';
  answers.ans = "";
  errorlabel.innerHTML = "";
  try {
    arr = input.value.split('=');
    arr = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = arr.length; i < len; i++) {
        item = arr[i];
        results.push(item.trim());
      }
      return results;
    })();
    // delete?
    if (input.value.slice(-1) === '=') {
      delete memory[arr[0]];
      delete answers[arr[0]];
      eval(`${arr[0]}=undefined`);
      updateList();
      return;
    }
    if (arr.length === 2 && arr[0] in memory) {
      memory[arr[0]] = arr[1];
    }
    s = (function() {
      var results;
      results = [];
      for (key in memory) {
        if (key !== 'ans') {
          results.push(`answers.${key} = (${key} = (${memory[key]}))`);
        }
      }
      return results;
    })();
    if (arr.length === 1 && arr[0] !== '') {
      s.push(`answers.ans = (${arr[0]})`);
    }
    if (arr.length === 2) {
      s.push(`answers.${arr[0]} = (${arr[0]} = (${arr[1]}))`);
    }
    eval(transpile(s.join(';')));
    if (arr.length === 1) {
      memory.ans = arr[0];
    }
    if (arr.length === 2) {
      memory[arr[0]] = arr[1];
    }
    updateList();
    return input.select();
  } catch (error) {
    err = error;
    return errorlabel.innerHTML = err.message;
  }
};

transpile = function(code) {
  var result;
  result = CoffeeScript.compile(code, {
    bare: true
  });
  return result.replace(/\n/g, '');
};

clickList = function(item) {
  var key;
  key = item.srcElement.value;
  if (key) {
    return input.value = `${key} = ${memory[key]}`;
  }
};

toggle = function() {
  toggleMode = 1 - toggleMode;
  bToggle.innerHTML = ['formulas', 'values'][toggleMode];
  return updateList();
};

clear = function() {
  input.value = "";
  return label.innerHTML = "";
};

document.body.onload = function() {
  var bShare;
  decode();
  clear = button('clear', clear);
  bToggle = button('values', toggle);
  bShare = button('share', function() {
    return encode();
  });
  label = document.createElement("p");
  label.style = 'font-family:courier; height:10px; width:99%;';
  document.body.appendChild(label);
  input = document.createElement("input");
  input.style = 'width:97%; font-family:courier; margin:5px;';
  document.body.appendChild(input);
  input.onkeypress = function(e) {
    if (e.which === 13) {
      return execute();
    }
  };
  lista = document.createElement("select");
  lista.onclick = clickList;
  lista.size = 20;
  lista.style = 'width:99%;  overflow-y:auto; font-family:courier; margin:5px;';
  document.body.appendChild(lista);
  errorlabel = document.createElement("p");
  errorlabel.style = 'font-family:courier; color:red; width:99%';
  document.body.appendChild(errorlabel);
  return execute();
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNrZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQTtFQUFBOztBQUFBLEtBQUEsR0FBUTs7QUFDUixLQUFBLEdBQVE7O0FBQ1IsS0FBQSxHQUFROztBQUNSLFVBQUEsR0FBYTs7QUFDYixPQUFBLEdBQVU7O0FBQ1YsVUFBQSxHQUFhOztBQUNiLE9BQUEsR0FBVSxDQUFBOztBQUVWLEtBQUEsR0FBUSxDQUFDLENBQUM7O0FBRVYsTUFBQSxHQUFTO0VBQUMsR0FBQSxFQUFJLEVBQUw7RUFBUSxHQUFBLEVBQUksRUFBWjtFQUFlLEdBQUEsRUFBSSxDQUFuQjtFQUFxQixHQUFBLEVBQUksQ0FBekI7RUFBMkIsR0FBQSxFQUFJLENBQS9CO0VBQWlDLEtBQUEsRUFBTSxLQUF2QztFQUE2QyxLQUFBLEVBQU0sS0FBbkQ7RUFBMEQsSUFBQSxFQUFNLEtBQWhFO0VBQXVFLEdBQUEsRUFBSyxZQUE1RTtFQUEwRixHQUFBLEVBQUksS0FBOUY7RUFBb0csR0FBQSxFQUFJO0FBQXhHOztBQUVULE1BQUEsR0FBUyxDQUFBOztBQUVULE1BQUEsR0FBUyxRQUFBLENBQUEsQ0FBQTtBQUNSLE1BQUE7RUFBQSxDQUFBLEdBQUksU0FBQSxDQUFVLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUFWO0VBQ0osQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVixFQUFlLEtBQWY7RUFDSixDQUFBLEdBQUksQ0FBQyxDQUFDLE9B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QW1CLFFBQUEsQ0FBQyxDQUFELENBQUE7SUFBTyxJQUFHLENBQUMsQ0FBQyxLQUFGLEtBQVcsRUFBZDthQUFzQixPQUFBLENBQUEsRUFBdEI7O0VBQVA7RUFFbkIsS0FBQSxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCO0VBQ1IsS0FBSyxDQUFDLE9BQU4sR0FBZ0I7RUFDaEIsS0FBSyxDQUFDLElBQU4sR0FBYTtFQUNiLEtBQUssQ0FBQyxLQUFOLEdBQWE7RUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBMEIsS0FBMUI7RUFFQSxVQUFBLEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkI7RUFDYixVQUFVLENBQUMsS0FBWCxHQUFtQjtFQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUI7U0FFQSxPQUFBLENBQUE7QUE1QnNCIiwic291cmNlc0NvbnRlbnQiOlsibGFiZWwgPSBudWxsXHJcbmlucHV0ID0gbnVsbFxyXG5saXN0YSA9IG51bGxcclxuZXJyb3JsYWJlbCA9IG51bGxcclxuYlRvZ2dsZSA9IG51bGxcclxudG9nZ2xlTW9kZSA9IDFcclxuYW5zd2VycyA9IHt9XHJcblxyXG5yYW5nZSA9IF8ucmFuZ2VcclxuXHJcbm1lbW9yeSA9IHsnYSc6MTIsJ2InOjIzLCdjJzozLCdkJzo0LCdlJzo1LCdhZGQnOidhK2InLCdtdWwnOidhKmInLCAnc3EnOiAnYSphJywgJ2YnOiAnKHgpIC0+IHgqeCcsICdnJzonZiA5JywnaCc6J2kqaSBmb3IgaSBpbiByYW5nZSBhJ31cclxuXHJcbmNvbmZpZyA9IHt9XHJcblxyXG5lbmNvZGUgPSAtPlxyXG5cdHMgPSBlbmNvZGVVUkkgSlNPTi5zdHJpbmdpZnkgbWVtb3J5XHJcblx0cyA9IHMucmVwbGFjZSAvPS9nLCclM0QnXHJcblx0cyA9IHMucmVwbGFjZSAvXFw/L2csJyUzRidcclxuXHR3aW5kb3cub3BlbiAnP2NvbnRlbnQ9JyArIHMgKyAnJmNvbmZpZz0nICsgZW5jb2RlVVJJIEpTT04uc3RyaW5naWZ5IGNvbmZpZ1xyXG5cclxuZGVjb2RlID0gLT5cclxuXHRtZW1vcnkgPSB7fVxyXG5cdGlmICc/JyBpbiB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG5cdFx0cGFyYW1ldGVycyA9IGdldFBhcmFtZXRlcnMoKVxyXG5cdFx0aWYgcGFyYW1ldGVycy5jb250ZW50XHJcblx0XHRcdG1lbW9yeSA9IGRlY29kZVVSSSBwYXJhbWV0ZXJzLmNvbnRlbnRcclxuXHRcdFx0bWVtb3J5ID0gbWVtb3J5LnJlcGxhY2UgLyUzRC9nLCc9J1xyXG5cdFx0XHRtZW1vcnkgPSBtZW1vcnkucmVwbGFjZSAvJTNGL2csJz8nXHJcblx0XHRcdG1lbW9yeSA9IEpTT04ucGFyc2UgbWVtb3J5XHJcblx0XHRpZiBwYXJhbWV0ZXJzLmNvbmZpZ1xyXG5cdFx0XHRjb25maWcgPSBKU09OLnBhcnNlIGRlY29kZVVSSSBwYXJhbWV0ZXJzLmNvbmZpZ1xyXG5cclxuYnV0dG9uID0gKHByb21wdCxjbGljaykgLT5cclxuXHRyZXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdidXR0b24nXHJcblx0cmVzLmlubmVySFRNTCA9IHByb21wdFxyXG5cdHJlcy5zdHlsZT0gJ3dpZHRoOjgwcHg7IGZvbnQtZmFtaWx5OmNvdXJpZXI7J1xyXG5cdHJlcy5vbmNsaWNrID0gY2xpY2tcclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIHJlc1xyXG5cdHJlc1xyXG5cclxudXBkYXRlTGlzdCA9ICgpIC0+XHJcblx0bGFiZWwuaW5uZXJIVE1MID0gXCJcIlxyXG5cdGxpc3RhLnNpemUgPSBfLnNpemUgbWVtb3J5XHJcblx0bGlzdGEubGVuZ3RoID0gMFxyXG5cdGZvciBrZXkgb2YgbWVtb3J5XHJcblx0XHRyb3cgPSBtZW1vcnlba2V5XVxyXG5cdFx0aWYga2V5ID09ICdhbnMnXHJcblx0XHRcdGlmIHR5cGVvZiBhbnN3ZXJzLmFucyA9PSAnZnVuY3Rpb24nXHJcblx0XHRcdFx0bGFiZWwuaW5uZXJIVE1MID0gcm93XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBhbnN3ZXJzLmFucyA9PSAnJ1xyXG5cdFx0XHRcdFx0bGFiZWwuaW5uZXJIVE1MID0gYW5zd2Vycy5hbnNcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsYWJlbC5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeSBhbnN3ZXJzLmFuc1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwib3B0aW9uXCJcclxuXHRcdFx0aWYgdHlwZW9mIGFuc3dlcnNba2V5XSA9PSAnZnVuY3Rpb24nXHJcblx0XHRcdFx0b3B0aW9uLmlubmVyVGV4dCA9IFwiI3trZXl9ID0gI3tyb3d9XCJcclxuXHRcdFx0ZWxzZSBpZiB0b2dnbGVNb2RlID09IDBcclxuXHRcdFx0XHRvcHRpb24uaW5uZXJUZXh0ID0gXCIje2tleX0gPSAje3Jvd31cIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3B0aW9uLmlubmVyVGV4dCA9IFwiI3trZXl9ID0gI3tKU09OLnN0cmluZ2lmeSBhbnN3ZXJzW2tleV19XCJcclxuXHRcdFx0b3B0aW9uLnZhbHVlID0ga2V5XHJcblx0XHRcdGxpc3RhLmFwcGVuZENoaWxkIG9wdGlvblxyXG5cclxuZXhlY3V0ZSA9IC0+XHJcblx0bGFiZWwuaW5uZXJIVE1MID0gJydcclxuXHRhbnN3ZXJzLmFucyA9IFwiXCJcclxuXHRlcnJvcmxhYmVsLmlubmVySFRNTCA9IFwiXCJcclxuXHJcblx0dHJ5XHJcblxyXG5cdFx0YXJyID0gaW5wdXQudmFsdWUuc3BsaXQgJz0nXHJcblx0XHRhcnIgPSAoaXRlbS50cmltKCkgZm9yIGl0ZW0gaW4gYXJyKVxyXG5cclxuXHRcdCMgZGVsZXRlP1xyXG5cdFx0aWYgaW5wdXQudmFsdWUuc2xpY2UoLTEpID09ICc9J1xyXG5cdFx0XHRkZWxldGUgbWVtb3J5W2FyclswXV1cclxuXHRcdFx0ZGVsZXRlIGFuc3dlcnNbYXJyWzBdXVxyXG5cdFx0XHRldmFsIFwiI3thcnJbMF19PXVuZGVmaW5lZFwiXHJcblx0XHRcdHVwZGF0ZUxpc3QoKVxyXG5cdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0aWYgYXJyLmxlbmd0aCA9PSAyIGFuZCBhcnJbMF0gb2YgbWVtb3J5XHJcblx0XHRcdG1lbW9yeVthcnJbMF1dID0gYXJyWzFdXHJcblxyXG5cdFx0cyA9IChcImFuc3dlcnMuI3trZXl9ID0gKCN7a2V5fSA9ICgje21lbW9yeVtrZXldfSkpXCIgZm9yIGtleSBvZiBtZW1vcnkgd2hlbiBrZXkhPSdhbnMnKVxyXG5cdFx0aWYgYXJyLmxlbmd0aCA9PSAxIGFuZCBhcnJbMF0gIT0gJycgdGhlbiBzLnB1c2ggXCJhbnN3ZXJzLmFucyA9ICgje2FyclswXX0pXCJcclxuXHRcdGlmIGFyci5sZW5ndGggPT0gMiB0aGVuIHMucHVzaCBcImFuc3dlcnMuI3thcnJbMF19ID0gKCN7YXJyWzBdfSA9ICgje2FyclsxXX0pKVwiXHJcblx0XHRldmFsIHRyYW5zcGlsZSBzLmpvaW4gJzsnXHJcblxyXG5cdFx0aWYgYXJyLmxlbmd0aCA9PSAxIHRoZW4gbWVtb3J5LmFucyA9IGFyclswXVxyXG5cdFx0aWYgYXJyLmxlbmd0aCA9PSAyIHRoZW4gbWVtb3J5W2FyclswXV0gPSBhcnJbMV1cclxuXHJcblx0XHR1cGRhdGVMaXN0KClcclxuXHRcdGlucHV0LnNlbGVjdCgpXHJcblxyXG5cdGNhdGNoIGVyclxyXG5cdFx0ZXJyb3JsYWJlbC5pbm5lckhUTUwgPSBlcnIubWVzc2FnZVxyXG5cclxudHJhbnNwaWxlID0gKGNvZGUpIC0+XHJcblx0cmVzdWx0ID0gQ29mZmVlU2NyaXB0LmNvbXBpbGUgY29kZSwge2JhcmU6IHRydWV9XHJcblx0cmVzdWx0LnJlcGxhY2UgL1xcbi9nLCcnXHJcblxyXG5jbGlja0xpc3QgPSAoaXRlbSkgLT5cclxuXHRrZXkgPSBpdGVtLnNyY0VsZW1lbnQudmFsdWVcclxuXHRpZiBrZXkgdGhlbiBpbnB1dC52YWx1ZSA9IFwiI3trZXl9ID0gI3ttZW1vcnlba2V5XX1cIlxyXG5cclxudG9nZ2xlID0gKCkgLT5cclxuXHR0b2dnbGVNb2RlID0gMSAtIHRvZ2dsZU1vZGVcclxuXHRiVG9nZ2xlLmlubmVySFRNTCA9IFsnZm9ybXVsYXMnLCd2YWx1ZXMnXVt0b2dnbGVNb2RlXVxyXG5cdHVwZGF0ZUxpc3QoKVxyXG5cclxuY2xlYXIgPSAtPlxyXG5cdGlucHV0LnZhbHVlID0gXCJcIlxyXG5cdGxhYmVsLmlubmVySFRNTCA9IFwiXCJcclxuXHJcbmRvY3VtZW50LmJvZHkub25sb2FkID0gLT5cclxuXHJcblx0ZGVjb2RlKClcclxuXHJcblx0Y2xlYXIgPSBidXR0b24gJ2NsZWFyJywgY2xlYXJcclxuXHRiVG9nZ2xlID0gYnV0dG9uICd2YWx1ZXMnLCB0b2dnbGVcclxuXHRiU2hhcmUgPSBidXR0b24gJ3NoYXJlJywgLT4gZW5jb2RlKClcclxuXHJcblx0bGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwicFwiXHJcblx0bGFiZWwuc3R5bGUgPSAnZm9udC1mYW1pbHk6Y291cmllcjsgaGVpZ2h0OjEwcHg7IHdpZHRoOjk5JTsnXHJcblxyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgbGFiZWxcclxuXHJcblx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiaW5wdXRcIlxyXG5cdGlucHV0LnN0eWxlID0gJ3dpZHRoOjk3JTsgZm9udC1mYW1pbHk6Y291cmllcjsgbWFyZ2luOjVweDsnXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBpbnB1dFxyXG5cdGlucHV0Lm9ua2V5cHJlc3MgPSAoZSkgLT4gaWYgZS53aGljaCA9PSAxMyB0aGVuIGV4ZWN1dGUoKVxyXG5cclxuXHRsaXN0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJzZWxlY3RcIlxyXG5cdGxpc3RhLm9uY2xpY2sgPSBjbGlja0xpc3RcclxuXHRsaXN0YS5zaXplID0gMjBcclxuXHRsaXN0YS5zdHlsZT0gJ3dpZHRoOjk5JTsgIG92ZXJmbG93LXk6YXV0bzsgZm9udC1mYW1pbHk6Y291cmllcjsgbWFyZ2luOjVweDsnXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBsaXN0YVxyXG5cclxuXHRlcnJvcmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcInBcIlxyXG5cdGVycm9ybGFiZWwuc3R5bGUgPSAnZm9udC1mYW1pbHk6Y291cmllcjsgY29sb3I6cmVkOyB3aWR0aDo5OSUnXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCBlcnJvcmxhYmVsXHJcblxyXG5cdGV4ZWN1dGUoKVxyXG4iXX0=
//# sourceURL=c:\github\2021\021-NewCalc\coffee\sketch.coffee