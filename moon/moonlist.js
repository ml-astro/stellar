const sw = 'Sky Watcher 150/750 Explorer BD, '
const moonlist = [
    {
        title: 'Пепельный свет Луны',
        filename: 'earthshine',
        date: '26 марта 2020 г.',
        info: 'Ночная сторона Луны освещена солнечным светом, отраженным от Земли. Это явление наиболее заметно вблизи фазы новолуния, на снимке Луна находится в фазе 5%. Снимок сделан вскоре после захода Солнца, когда достаточно стемнело, чтобы пепельный свет стал различим на фоне светлого неба.',
        instruments: 'Canon 1100D, 300мм объектив',
    },
    {
        title: 'Луна над перистыми облаками',
        filename: 'img_7836',
        instruments: 'Canon 1100D, 300мм объектив',
    },
    {
        title: 'Растущая Луна',
        filename: 'moon180517',
        info: 'Луна в фазе 7%.',
        date: '17 мая 2018 г.',
        instruments: sw+'Canon 1100D',
    },
    {
        title: 'Теофил',
        filename: 'theophilus',
        info: 'Море нектара (внизу) и утро в Кратере Теофил. Диаметр кратера 99км. Высота вала над окружающей местностью достигает 1540 м. Считается, что образцы пород выброшенных при образовании этого кратера собраны астронавтами Аполлона-11 (место посадки приблизительно в 350 км на северо-запад от кратера).',
        date: '17 мая 2018 г.',
        instruments: sw+'Canon 1100D',
    },
    {
        title: 'Луна в фазе 8%',
        filename: 'moon_tower',
        date: '1 сентября 2019 г.',
        info: 'Удалось поймать момент, когда заходящая Луна проходила за таллинской телевышкой.',
        instruments: 'Canon 1100D, 300мм объектив',
    },
    {
        title: 'Луна в фазе 96%',
        filename: 'fullmoon',
        date: '29 марта 2018 г.',
        info: 'Мозаика Луны из нескольких снимков.',
        instruments: sw+'ZWO ASI224MC',
    },
    {
        title: 'Луна в фазе 73%',
        filename: 'moon_180326',
        date: '26 марта 2018 г.',
        info: 'Мозаика Луны из нескольких снимков. Сложено 37 фрагментов зелёного канала (каждый 100 из 300 кадров).',
        instruments: sw+'линза барлоу 5х, Фильтр Baader UHC-S, ZWO ASI224MC',
    },
    {
        title: 'Птолемей, Альфонс и Арзахель',
        filename: 'alphonsus',
        date: '17 февраля 2019 г.',
        info: 'Утро в ударных кратерах Птолемей (центр), Альфонс (правее) и Арзахель (правый из трех). Валы отбрасывают длинные тени на дно кратеров.',
        instruments: sw+'линза барлоу 3х + ZWO ASI224MC',
    },
    {
        title: 'Море Дождей и Кавказ',
        filename: 'aristillus',
        info: 'Море Дождей (нижняя часть кадра), Кавказ (справа) и Альпы (центр). Центральный необычный кратер - Кассини, диаметром 57км. Дно кратера испещрено малыми кратерами Кассини А и В.',
        instruments: sw+'линза барлоу 3х, ZWO ASI224MC',
    },
    {
        title: 'Таврские горы и кратер Посидоний',
        filename: 'posidonius',
        info: 'Таврские горы значительно менее заметны, чем другие лунные горы и представляют собой скорее хаотичный гористый район, нежели ярко выраженную горную систему. Наибольшей высоты горы достигают 4,9 км над поверхностью Моря Ясности и 2,1 км над средним уровнем поверхности Луны. Диаметр посидония 95 км. За счет поднятия лавы дно кратера несколько выпучено и изобилует бороздами, холмами и складками. Из-за заполнения чаши кратера лавой центральный пик отсутствует. В кратере Посидоний наблюдались кратковременные лунные явления в виде помутнения. ',
        instruments: sw+'линза барлоу 3х, ZWO ASI224MC',
    },
    {
        title: 'Арзахель',
        filename: 'arzahel',
        info: 'Сравнительно молодой 97-километровый кратер Арзахель расположен в центральной южной части видимой стороны Луны, на восточной окраине Моря Облаков. Его глубина - 3,6 км. Благодаря своей хорошей различимости кратер является одним из наиболее наблюдаемых астрономами-любителями объектов на поверхности Луны. Наилучшее время для наблюдения — седьмой день после новолуния.',
        instruments: sw+'линза барлоу 3х, ZWO ASI224MC',
    },
    {
        title: 'Аристарх и Геродот',
        filename: 'aristarchus',
        info: 'Парочка кратеров на линии дня и ночи в Океане Бурь: Аристарх (справа) и Геродот (слева). Размеры 40 и 36 км соответственно.',
        instruments: 'Canon 1100D, 300мм объектив',
    },
    {
        title: 'Аристилл, Автолик, Архимед',
        filename: 'archimedes',
        info: 'Сверху вниз: Аристилл - 54 км, Автолик - 39 км, Архимед - 81 км. Кратеры расположены на востоке Моря Дождей.',
        instruments: sw+'1100D',
    },
    {
        title: 'Южная часть Луны',
        filename: 'clavius_0',
        info: 'Панорама южной части видимой стороны Луны',
        instruments: sw+'линза барлоу 3х, ZWO ASI183MC',
    },
    {
        title: 'Залив Радуги',
        filename: 'sinusiridium',
        info: 'Маленький Залив Радуги в большом Море Дождей. Залив - на самом деле 250-километровый ударный кратер, залитый застывшей базальтовой лавой. Не знаю, то ли это заслуга инфракрасного фильтра, то ли атмосферы, то ли всего по чуть-чуть; но видимость была замечательная.',
        instruments: sw+'линза барлоу 3х, ZWO ASI183MC',
    },
    {
        title: 'Клавий',
        filename: 'clavius',
        info: 'Кратер Клавий - древний 230-километровый ударный кратер в южной части видимой стороны Луны. Является одним из древнейших образований на Луне. Южная часть вала (левая верхняя) перекрыта кратером Резерфурд. От него начинается дуга уменьшающихся в диаметре кратеров на дне Клавия: Клавий D — Клавий C — Клавий N — Клавий J — Клавий JA. Эта интересная последовательность часто используется в любительской астрономии как эталон для оценки разрешающей способности телескопа.',
        instruments: sw+'линза барлоу 2х, Canon 1100D',
    },
    {
        title: 'Пепельный свет Луны',
        filename: 'earthshine2',
        date: '11 марта 2016 г.',
        info: 'Ночная сторона Луны освещена солнечным светом, отраженным от Земли. Это явление наиболее заметно вблизи фазы новолуния, на снимке Луна находится в фазе 5%. Снимок сделан вскоре после захода Солнца, когда достаточно стемнело, чтобы пепельный свет стал различим на фоне светлого неба.',
        instruments: sw+'Canon 1100D',
    },
    {
        title: 'Луна в Гиадах',
        filename: 'moon_hya_1',
        date: '22 марта 2018 г.',
        info: 'Луна с пепельным светом проходит по скоплению Гиад в созвездии Тельца.',
        instruments: sw+'ASI224MC',
    },
    {
        title: 'Цветная Луна в фазе 66%',
        filename: 'color_quarter',
        date: '3 февраля 2020 г.',
        info: 'Луна не совсем черно-белая, ее поверхность слегка цветная. Если выкрутить ползунок насыщенности при обработке, становятся заметны различия в цвете. Цвет зависит от химического состава поверхности. Синие оттенки - области, богатые титаном; оранжевые - с пониженным содержанием титана и железа.',
        instruments: sw+'Canon 1100D',
    },
    {
        title: 'Гассенди',
        filename: 'gassendi',
        info: 'Окрестности Моря Влажности и самый большой его кратер "Гассенди", диаметром 111 км.',
        instruments: sw+'линза барлоу 3х, ZWO ASI183MC',
    },
    {
        title: 'Луна за церковью',
        filename: 'moon_church',
        date: '8 марта 2020 г.',
        info: 'Для выбора точки для этого снимка пришлось воспользоваться калькулятором положения Луны и google-картой.',
        instruments: 'Canon 1100D, объектив 300мм',
    },
    {
        title: 'Луна над городом',
        filename: 'tallinn_moonset',
        date: '5 сентября 2016 г.',
        info: 'Спонтаный снимок Луны, заходящей за жилыми девятиэтажками в соседнем городе.',
        instruments: 'Canon 1100D, Sky Watcher Skymax 90/1250'
    },
    {
        title: "Платон",
        filename: 'plato',
        info: 'Древний ударный кратер на северо-восточной границе Моря Дождей. Диаметр приблизительно 95-100 км. На юге от кратера находятся горы Тенерифе, на северо-западе простирается Море Холода, на востоке - борозды Платона.',
        instruments: sw+'линза барлоу 2х и 3х, ZWO ASI224MC'
    },
    {
        title: "Платон",
        filename: 'plato2',
        info: 'Предыдущая область Луны при другом освещении.',
        instruments: sw+'линза барлоу 2х и 3х, ZWO ASI224MC'
    },
    {
        title: "Тонкий серп молодой Луны",
        filename: 'img8649',
        date: '06 апреля 2019 г.',
        info: 'Луна в фазе 2%.',
        instruments: sw+'Canon 1100D'
    },
    {
        title: "Шиллер",
        filename: 'schiller',
        info: 'Шиллер - кратер необычной формы на юго-западной части видимого полушария Луны.  Шиллер имеет вытянутую форму, которая усиливается благодаря близости к лунному лимбу. Кратер словно создан слиянием нескольких кратеров и похож на след от подошвы обуви. Размеры кратера 179х71 км.',
        instruments: sw+'линза барлоу 2х и 3х, ZWO ASI224MC'
    },
    {
        title: "Юго-западная часть Луны",
        filename: 'schillersouth',
        info: 'Панорама юго-западной части Луны с кратером Шиллер.',
        instruments: sw+'линза барлоу 2х и 3х, ZWO ASI224MC'
    },
    {
        date: '10 июля 2016 г.',
        title: "Цветная Луна в фазе 38%",
        filename: 'color_quarter2',
        info: 'Луна не совсем черно-белая, ее поверхность слегка цветная. Если выкрутить ползунок насыщенности при обработке, становятся заметны различия в цвете. Цвет зависит от химического состава поверхности.',
        instruments: sw+'Canon 1100D',
    },
    {
        date: '30 апреля 2020 г.',
        title: "Цветная Луна на боку",
        filename: 'moon_20200430_15',
        info: 'Луна не совсем черно-белая, ее поверхность слегка цветная. Если выкрутить ползунок насыщенности при обработке, становятся заметны различия в цвете. Цвет зависит от химического состава поверхности.',
        instruments: sw+'Canon 1100D',
    },
    {
        title: "Шиккард",
        filename: 'schickard',
        info: 'Шиккард — большой лунный ударный кратер диаметром около 210 км и глубиной 1,5 км, расположенный в юго-западной части видимой стороны.',
        instruments: sw+'ASI224MC, линза барлоу 2х',
    },
    {
        title: "Луна в фазе 21%",
        filename: 'crescent',
        info: 'Один кадр.',
        instruments: sw+'Canon 1100D, линза барлоу 2х',
    },
    {
        title: "Цветное полнолуние",
        filename: 'fullmoon_color',
        info: 'Луна не совсем черно-белая, ее поверхность слегка цветная. Если выкрутить ползунок насыщенности при обработке, становятся заметны различия в цвете. Цвет зависит от химического состава поверхности.',
        instruments: sw+'Canon 1100D, линза барлоу 2х',
    },
    {
        title: "Мозаика южной части Луны",
        filename: 'southeast',
        instruments: sw+'линза барлоу 3х, ZWO ASI224MC'
    },
    {
        title: 'Луна за жилым зданием',
        filename: 'moon_building',
        date: '8 марта 2020 г.',
        info: 'Для выбора точки для этого снимка пришлось воспользоваться калькулятором положения Луны и google-картой.',
        instruments: 'Canon 1100D, объектив 300мм',
    },
]