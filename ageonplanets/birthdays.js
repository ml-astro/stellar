var birthday, today;

function dayFormat(days) {
  let txt;
  count = days % 100;
  if (count >= 5 && count <= 20) {
    txt = "дней";
  } else {
    count = count % 10;
    if (count == 1) {
      txt = "день";
    } else if (count >= 2 && count <= 4) {
      txt = "дня";
    } else {
      txt = "дней";
    }
  }
  return days + " " + txt;
}

function ageFormat(age) {
  let txt;
  count = age % 100;
  if (count >= 5 && count <= 20) {
    txt = "лет";
  } else {
    count = count % 10;
    if (count == 1) {
      txt = "год";
    } else if (count >= 2 && count <= 4) {
      txt = "года";
    } else {
      txt = "лет";
    }
  }
  return age + " " + txt;
}

function currentAge(period) {
  //возраст на планете в годах
  let range = today - birthday;
  return (Math.floor(range / (period * 1000)));
}

function ageInDays(day) {
  let range = today - birthday;
  return dayFormat(Math.floor(range / 1000 / 86400 / day));
}

function nextDate(period) {
  let nextBday = new Date(birthday);
  while (today > nextBday) {
    nextBday = new Date(nextBday.setSeconds(nextBday.getSeconds() + period));
  }
  let dateString =
    "<b>" +
    nextBday.getDate() +
    " " +
    months[nextBday.getMonth()] +
    " " +
    nextBday.getFullYear() +
    "&nbsp;года</b>";
  return dateString;
}

function calculate(event) {
  event.preventDefault();

  if (document.getElementById("birthdate").value) {
    birthday = new Date(document.getElementById("birthdate").value);
    today = new Date();
    document.getElementById("bdayList").innerHTML = "";
    planets.forEach((planet) => {
      let yearsAge = currentAge(planet.period);
      let daysAge = ageInDays(planet.day);
      let nextBirthday = nextDate(planet.period);
      document.getElementById("bdayList").innerHTML += `<tr><td><img src='${
        planet.eng
      }.jpg'/></td><td><p>На ${planet.rus}:<br/><b>${yearsAge>0?ageFormat(yearsAge)+'</b> или <b>':''}${daysAge}</b>.<br/>Следующий день рождения:<br/> <b>${nextBirthday}</b></p></td></tr>`;
    });
    document.getElementById("unhide").style.display = "initial";
  }
}
