// Generated by CoffeeScript 2.5.1
var addButton, body, command, connect, div, start;

body = document.getElementById("body");

div = null;

command = '';

start = new Date();

connect = (button, handler) => {
  button.ontouchend = handler;
  return button.onclick = handler;
};

addButton = (title) => {
  var button;
  button = document.createElement('button');
  body.appendChild(button);
  button.innerHTML = title;
  button.style = "width:300px;height:300px";
  return connect(button, (event) => {
    var t;
    t = new Date();
    command += title + `${t - start} `;
    div.innerHTML = command;
    start = t;
    return false;
  });
};

addButton('A');

addButton('B');

div = document.createElement('div');

body.appendChild(div);

div.innerHTML = '109';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoMi5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxza2V0Y2gyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxTQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBOztBQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsY0FBVCxDQUF3QixNQUF4Qjs7QUFDUCxHQUFBLEdBQU07O0FBQ04sT0FBQSxHQUFVOztBQUNWLEtBQUEsR0FBUSxJQUFJLElBQUosQ0FBQTs7QUFFUixPQUFBLEdBQVUsQ0FBQyxNQUFELEVBQVEsT0FBUixDQUFBLEdBQUE7RUFDVCxNQUFNLENBQUMsVUFBUCxHQUFvQjtTQUNwQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUZSOztBQUlWLFNBQUEsR0FBWSxDQUFDLEtBQUQsQ0FBQSxHQUFBO0FBQ1osTUFBQTtFQUFDLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtFQUNULElBQUksQ0FBQyxXQUFMLENBQWlCLE1BQWpCO0VBQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUI7RUFDbkIsTUFBTSxDQUFDLEtBQVAsR0FBZTtTQUNmLE9BQUEsQ0FBUSxNQUFSLEVBQWUsQ0FBQyxLQUFELENBQUEsR0FBQTtBQUNoQixRQUFBO0lBQUUsQ0FBQSxHQUFJLElBQUksSUFBSixDQUFBO0lBQ0osT0FBQSxJQUFXLEtBQUEsR0FBUSxDQUFBLENBQUEsQ0FBRyxDQUFBLEdBQUUsS0FBTCxFQUFBO0lBQ25CLEdBQUcsQ0FBQyxTQUFKLEdBQWdCO0lBQ2hCLEtBQUEsR0FBUTtXQUNSO0VBTGMsQ0FBZjtBQUxXOztBQVlaLFNBQUEsQ0FBVSxHQUFWOztBQUNBLFNBQUEsQ0FBVSxHQUFWOztBQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2Qjs7QUFDTixJQUFJLENBQUMsV0FBTCxDQUFpQixHQUFqQjs7QUFDQSxHQUFHLENBQUMsU0FBSixHQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBcImJvZHlcIlxyXG5kaXYgPSBudWxsXHJcbmNvbW1hbmQgPSAnJ1xyXG5zdGFydCA9IG5ldyBEYXRlKClcclxuXHJcbmNvbm5lY3QgPSAoYnV0dG9uLGhhbmRsZXIpID0+XHJcblx0YnV0dG9uLm9udG91Y2hlbmQgPSBoYW5kbGVyXHJcblx0YnV0dG9uLm9uY2xpY2sgPSBoYW5kbGVyXHJcblxyXG5hZGRCdXR0b24gPSAodGl0bGUpID0+XHJcblx0YnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnYnV0dG9uJ1xyXG5cdGJvZHkuYXBwZW5kQ2hpbGQgYnV0dG9uXHJcblx0YnV0dG9uLmlubmVySFRNTCA9IHRpdGxlXHJcblx0YnV0dG9uLnN0eWxlID0gXCJ3aWR0aDozMDBweDtoZWlnaHQ6MzAwcHhcIlxyXG5cdGNvbm5lY3QgYnV0dG9uLChldmVudCkgPT5cclxuXHRcdHQgPSBuZXcgRGF0ZSgpXHJcblx0XHRjb21tYW5kICs9IHRpdGxlICsgXCIje3Qtc3RhcnR9IFwiXHJcblx0XHRkaXYuaW5uZXJIVE1MID0gY29tbWFuZFxyXG5cdFx0c3RhcnQgPSB0XHJcblx0XHRmYWxzZVxyXG5cclxuYWRkQnV0dG9uICdBJ1xyXG5hZGRCdXR0b24gJ0InXHJcbmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2RpdidcclxuYm9keS5hcHBlbmRDaGlsZCBkaXZcclxuZGl2LmlubmVySFRNTCA9ICcxMDknXHJcbiJdfQ==
//# sourceURL=c:\github\2021\033-MM5040\coffee\sketch2.coffee