const stars = './js/stars.json';
const months=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря',];
const btn = document.querySelector('button');
let starData;
let age;
let birthdayStar;
let birth;
let listPosition;

//calculates person's age
function currentAge(){
  birth = document.getElementById('birthdate').value;
  if(birth){
    let birthday = new Date(document.getElementById('birthdate').value);
    let today = new Date();
    age = (today - birthday)/(1000*3600*24*365.25);
    if(age<=110){
      getStarList(stars);
    }
    else {document.querySelector('.result').innerHTML='Возраст слишком большой.';}
  }
}

//gets the json for all stars
function getStarList(url) {
  if(!starData){
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = () => {
      if(request.status === 200 && request.readyState === 4) {
        starData = JSON.parse(request.responseText);
        calculateBirthdayStar();
      }
    };
    request.send();
  }
  else calculateBirthdayStar();//проверка на повторную отправку запроса. если json уже получен, можно не запрашивать
}

//searches for previous birthdaystar and the next one
function calculateBirthdayStar(){
  for(let i=0; i<starData.length; i++){
    if(starData[i].dist < age){
      //while the distance is lower, then its considered as the last birthdaystar
      birthdayStar = starData[i];
      listPosition = i+1;
    } else {
      //if previous star is closer, then this star is the next birthdaystar
      nextStar=(starData[i]);
      displayResult();
      break;
    }
  }
}

//is the star visible to naked eye
function isVisible(star){
  if(star.mag<6){
    return `Её яркость <b>${star.mag}</b> и сейчас она видна такой, какой была при твоём рождении!`;
  }
  else if(star.mag == '~') {
    return 'Она не видна невооружённым глазом, но в телескоп была бы видна такой, как при твоём рождении!';}
  else {
    return `Её яркость <b>${star.mag}</b>, поэтому она не видна невооружённым глазом, но в телескоп была бы видна такой, как при твоём рождении!`;
  }
}

//displays text about the type of star
function displayType(star){
  switch(star.type){
    case 'pm': return 'звезда с большим собственным движением.';
    case 'ev': return 'эруптивная звезда с большими изменениями блеска из-за происходящих на ней взрывных процессов.';
    case 'by': return 'переменная звезда типа "BY Дракона". Её блеск изменяется из-за вращения, поскольку на поверхности находятся большие пятна; а также из-за хромосферной активности.';
    case 'dbl': return 'двойная или кратная звезда.';
    case 'wd*': return 'звезда-кандидат в белые карлики.';
    case 'wd': return 'белый карлик. Звезда лишена источников термоядерной энергии и светится благодаря своей тепловой энергии, постепенно остывая в течение миллиардов лет.';
    case 'dbl*': return 'спектрально-двойная звезда. Её двойственность обнаружили при помощи спектральных наблюдений. Оба компонента расположены настолько близко, что увидеть их раздельно с использованием современных телескопов невозможно.';
    case 'bd': return 'коричневый карлик массой менее 0,08 солнечных. Объект обладает промежуточными физическими характеристиками между планетой и звездой. Он никогда не превратится в полноценную звезду, а будет сжиматься и тускнеть.';
    case 'low': return 'маломассивная звезда - меньше 1 солнечной массы.';
    case 'rs': return 'переменная звезда типа RS Гончих Псов.';
    case 'ecl': return 'затменно-переменная звезда.';
    case 'pec': return 'пекулярная звезда. Такие звёзды отличаются от обычных звёзд того же спектрального класса некоторыми существенными особенностями в спектрах, а иногда и другими свойствами.';
    case 'Cataclysmic Variable Star': return 'катаклизмическая переменная звезда.';
    case 'Red Giant Branch star': return 'звезда с вершины ветви красных гигантов.';
    case 'T Tau-type Star': return 'звезда типа T Тельца.';
    case 'rot': return 'эллипсоидная переменная?';
    case 'em': return '';
    case 'Variable Star of alpha2 CVn type': return '';
    case 'Variable Star of delta sct type': return '';
    case 'Variable Star of orion type': return '';
    case 'Variable Star of gamma dor type': return '';
    case 'long-period variable star': return '';
    case 'Long Period Variable candidate': return '';
    case 'Cepheid Variable star': return '';
    case 'Star': return '';
    case 'Variable Star': return 'переменная звезда.';
    case 'Hot subdwarf': return 'горячий субкарлик.';
    case 'Young Stellar Object Candidate': return 'кандидат в протозвёзды.';
    case 'Young Stellar Object': return 'протозвезда.';
    default: return '';
  }
}

//displays all results
function displayResult(){
  document.querySelector('.result').style.display='block';
  document.querySelector('.nextresult').style.display='block';
  document.querySelector('.result').innerHTML=(
    `Сейчас свет, который прилетает к нам от звезды:<br> <b>"${birthdayStar.id}"</b> почти такого же возраста, как ты.<br>
    Звезда спектрального класса <b>${birthdayStar.spec}</b> находится на расстоянии<b> ${birthdayStar.dist} </b>световых лет от Земли.<br>
    Из открытых она занимает <b>${listPosition}</b> место по удалённости от Солнечной системы. </br>
    ${isVisible(birthdayStar)}<br><b>${birthdayStar.id}</b> - ${displayType(birthdayStar)}<br>
    Координаты звезды:<br>
    Прямое восхождение: <b>${birthdayStar.x}\xB0</b><br>
    Склонение: <b>${birthdayStar.y}\xB0</b>`
    );
    var aladin = A.aladin('#aladin-lite-div', {survey: "P/DSS2/color", fov:0.1, target: birthdayStar.id});
    let nextBirthday = new Date(birth);
    let nextDate = new Date(nextBirthday.getTime()+nextStar.dist*365.25*24*3600*1000);
    document.querySelector('.nextresult').innerHTML=`Следующий звёздный день рождения состоится для звезды:<br> <b>${nextStar.id}</b><br>и случится это <b>${nextDate.getDate()} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()} года!</b>`;
}
// спектральный класс - гигант, карлик, цвет
// положение в небе

btn.addEventListener('click', currentAge);
