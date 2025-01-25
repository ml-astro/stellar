const stars = './js/stars.json';
const constellations = './js/constellations.json';
const greek = './js/greek.json';
const starNames = './js/starnames.json';
const months=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря',];
const btn = document.querySelector('button');
//stars.json data
let starData;
//constellations.json data
let constellationNames;
//greek.json data
let greekLetters;
//starnames.json data
let starNameList;

let age;

//current birthday star object
let birthdayStar;
//birth date
let birth;
//n-th star from earth by distance
let listPosition;

//stupid fucking bullshit i havent learned to do properly. "return" did not work because im an idiot
function getData(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.onload = () => {
      if(request.status === 200 && request.readyState === 4) {
        data = request.response;
        if(url=='./js/stars.json'){
          starData = data;
        } else if(url=='./js/constellations.json') {
          constellationNames = data;
        } else if(url=='./js/greek.json') {
          greekLetters = data;
        } else {
          starNameList = data;
        }
      }
    };
    request.send();
}
//more shit like before
getData(stars);
getData(constellations);
getData(greek);
getData(starNames);

//calculates person's age
function currentAge(){
  birth = document.getElementById('birthdate').value;
  //checks if date is set
  if(birth){
    if((new Date(document.getElementById('birthdate').value)) < new Date()){
      let birthday = new Date(document.getElementById('birthdate').value);
      
      let today = new Date();
      age = (today - birthday)/(1000*3600*24*365.25);
      if(age<=110){
        calculateBirthdayStar();
      }
      else {document.querySelector('.result').innerHTML=`Возраст слишком большой. Доступен год от ${new Date().getFullYear()-111}`;}
    }
    }
}

btn.addEventListener('click', currentAge);

//searches for previous birthdaystar and the next one
function calculateBirthdayStar(){
  for(let i=0; i<starData.length; i++){
    if(starData[i].d < age){
      //while the distance is lower, then its considered as the last birthdaystar
      birthdayStar = starData[i];
      listPosition = i+1;
    } else {
      //if previous star is closer, then current star is the next birthdaystar
      nextStar=(starData[i]);
      displayResult();
      break;
    }
  }
}

//is this a naked eye star
function isVisible(star){
  let mag = Math.floor(star.m*10)/10;
  if(mag<=6){
    return `Её яркость <b>${mag}</b> и сейчас она видна такой, какой была при твоём рождении!`;
  }
  else if(mag > 6) {
    return `Её яркость <b>${mag}</b>, поэтому она не видна невооружённым глазом, но в телескоп сейчас выглядит так, как при твоём рождении!`;
  }
  else {
    return 'Она не видна невооружённым глазом, но в телескоп сейчас выглядит так, как при твоём рождении!';
  }
}

//displays text about the type of star
function displayType(star){
  switch(star.t){
    case 'pm': return 'звезда с большим собственным движением.';
    case 'ev': return 'эруптивная звезда с большими изменениями блеска из-за происходящих на ней взрывных процессов.';
    case 'by': return 'переменная звезда типа "BY Дракона". Её блеск изменяется из-за вращения, поскольку на поверхности находятся большие пятна; а также из-за хромосферной активности.';
    case 'dbl': return 'двойная или кратная звезда.';
    case 'wd*': return 'звезда-кандидат в белые карлики.';
    case 'wd': return 'белый карлик. Звезда лишена источников термоядерной энергии и светится благодаря своей тепловой энергии, постепенно остывая в течение миллиардов лет.';
    case 'dbl*': return 'спектрально-двойная звезда. Её двойственность обнаружили при помощи спектральных наблюдений. Оба компонента расположены настолько близко, что увидеть их раздельно с использованием современных телескопов невозможно.';
    case 'bd': return 'коричневый карлик массой менее 0,08 солнечных. Объект обладает промежуточными физическими характеристиками между планетой и звездой. Он никогда не превратится в полноценную звезду, а будет сжиматься и тускнеть.';
    case 'low': return 'маломассивная звезда — меньше 1 солнечной массы.';
    case 'rs': return 'переменная звезда типа RS Гончих Псов.';
    case 'ecl': return 'затменно-переменная звезда.';
    case 'pec': return 'пекулярная звезда. Такие звёзды отличаются от обычных звёзд того же спектрального класса некоторыми существенными особенностями в спектрах, а иногда и другими свойствами.';
    case 'Cataclysmic Variable Star': return 'катаклизмическая переменная звезда.';
    case 'Red Giant Branch star': return 'звезда с вершины ветви красных гигантов.';
    case 'T Tau-type Star': return 'звезда типа т Тельца.';
    case 'rot': return 'эллипсоидная переменная?';
    case 'em': return 'звезда с эмиссионными линиями в спектре';
    case 'Variable Star of alpha2 CVn type': return 'переменная звезда типа альфы2 Гочих Псов';
    case 'Variable Star of delta sct type': return 'переменная звезда типа дельты Щита';
    case 'Variable Star of orion type': return 'орионова неправильная переменная звезда';
    case 'Variable Star of gamma dor type': return 'переменная звезда типа гаммы Золотой Рыбы';
    case 'Long-period variable star': return 'долгопериодическая переменная';
    case 'Long Period Variable candidate': return 'кандидат в долгопериодические переменные';
    case 'Cepheid Variable star': return 'цефеида, пульсирующая переменная звезда. Звезды этого класса используются как стандартные свечи — по наблюдениям цефеид определяются расстояния до удалённых объектов';
    case 'Variable Star': return 'переменная звезда.';
    case 'Hot subdwarf': return 'горячий субкарлик.';
    case 'Young Stellar Object Candidate': return 'кандидат в протозвёзды.';
    case 'Young Stellar Object': return 'так называемая протозвезда, то есть находится на заключительном этапе формирования перед возникновением термоядерного синтеза.';
    default: return '';
  }
}

//displays spectral type
function displaySpectral(spectral){
  switch(true){
    case (spectral.includes('M')):
      return 'холодная красная';
    case (spectral.includes('K')):
      return 'холодная оранжевая';
    case (spectral.includes('G')):
        return 'жёлтая';
    case (spectral.includes('F')):
      return 'жёлто-белая'; 
    case (spectral.includes('A')):
      return 'белая';
    case (spectral.includes('B')):
      return 'бело-голубая';
    case (spectral.includes('O')):
      return 'голубая';
    case (spectral.includes('L') || spectral.includes('T') || spectral.includes('Y')):
      return 'коричневая карликовая';
    default:
      return '';
    }
}

//displays luminosity class
function displayLuminosity(luminosity){
  switch(true){
    case (luminosity.includes('0')):
      if(luminosity.includes('.0')){
        return('');
      }
      else return('-гипергигант');
    case (luminosity.includes('Ia')):
      return('-яркий сверхгигант');
    case (luminosity.includes('Ib')):
      return('-сверхгигант');
    case (luminosity.includes('II')):
      return('-яркий гигант');
    case (luminosity.includes('III')):
      return('-гигант');
    case (luminosity.includes('IV')):
      return('-субгигант');
    case (luminosity.includes('V')):
      return('-карлик на главной последовательности');
    case (luminosity.includes('sd')):
      return('-субкарлик');
    default:
      return('');
  }
}

//displays all star info
function displayResult(){
  document.querySelector('.result').style.display='block';
  document.querySelector('.nextresult').style.display='block';
  let properName = starProperName(birthdayStar.i);
  if(document.querySelector('section').style.opacity==0){
    document.querySelector('section').style.opacity=1;
    document.querySelector('section').style.transition='opacity 1s linear';
  }
  document.querySelector('.result').innerHTML=(
    `Прямо сейчас фотоны света, которые прилетают к нам от звезды <span class='nowrap'><b>${properName}</b></span>, почти такого же возраста, как ты! Они покинули звезду немного раньше момента твоего рождения и только сейчас достигли Земли.<br>
    ${isVisible(birthdayStar)}<br><br>
    Эта ${displaySpectral(birthdayStar.s)} звезда${displayLuminosity(birthdayStar.s)} ${birthdayStar.s=='~'?'':('спектрального класса <b>'+birthdayStar.s)}</b> находится на расстоянии<b> ${Math.floor(birthdayStar.d*100)/100} </b>световых лет от Земли.<br>
    Из открытых она занимает <b>${listPosition}-е</b> место по удалённости от Земли. <br>
    ${birthdayStar.t=='Star'? '':(`<b>${properName}</b> — ${displayType(birthdayStar)}<br>`)}
    Название по каталогу: ${birthdayStar.i}.<br><br>
    Координаты в небе:<br>
    Прямое восхождение: <b>${birthdayStar.x}\xB0</b><br>
    Склонение: <b>${birthdayStar.y}\xB0</b>`
    );
    if(birthdayStar.i != 'Солнце'){
      var aladin = A.aladin('#aladin-lite-div', {survey: "P/DSS2/color", fov:0.5, target: birthdayStar.i});
    }
    
    let nextBirthday = new Date(birth);
    let nextDate = new Date(nextBirthday.getTime()+nextStar.d*365.25*24*3600*1000);
    document.querySelector('.nextresult').innerHTML=`Твой следующий звёздный день рождения состоится для звезды <b><span class='nowrap'>"${starProperName(nextStar.i)}"</span></b> и случится это <b>${nextDate.getDate()} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()} года!</b>`;
}

//returns the proper name based on star's catalogue name
function starProperName(star){
  let nameString = star;
  for(let key in starNameList){
    if(birthdayStar.i == starNameList[key].i){
      return starNameList[key].name;
    }
  }
  
  //replace constellation and greek letter with russian
  for(let key in constellationNames){
    if(nameString.includes(constellationNames[key].short)){
      nameString = nameString.replace(constellationNames[key].short, constellationNames[key].rus);
    };
  }
  for(let key in greekLetters){
    if(nameString.includes(greekLetters[key].greek)){
      nameString = nameString.replace(greekLetters[key].greek, greekLetters[key].rus);
    }
  }
  return nameString;
}