'use strict';

/* ============================================================
   Русский язык — данные и логика
   ============================================================ */

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

function plural(n, forms) {
  const value = Math.abs(n) % 100;
  const last = value % 10;
  if (value > 10 && value < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[\u0300-\u0301]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- Алфавит ---------- */

const LETTER_TYPES = {
  vowel: 'Гласный',
  consonant: 'Согласный',
  sign: 'Без звука'
};

const ALPHABET = [
  { u: 'А', l: 'а', name: 'а', type: 'vowel', sound: '[а]', word: 'а́рбуз', plain: 'арбуз', note: 'Гласный звук можно пропеть — он образует слог.' },
  { u: 'Б', l: 'б', name: 'бэ', type: 'consonant', sound: '[б] / [б’]', word: 'берёза', plain: 'берёза', note: 'Может быть твёрдым и мягким: [б] в «быть», [б’] в «бить».' },
  { u: 'В', l: 'в', name: 'вэ', type: 'consonant', sound: '[в] / [в’]', word: 'воро́на', plain: 'ворона', note: 'Звонкий согласный: голос участвует в образовании звука.' },
  { u: 'Г', l: 'г', name: 'гэ', type: 'consonant', sound: '[г] / [г’]', word: 'го́род', plain: 'город', note: 'Звонкий согласный, образует пару с глухим [к].' },
  { u: 'Д', l: 'д', name: 'дэ', type: 'consonant', sound: '[д] / [д’]', word: 'доро́га', plain: 'дорога', note: 'Звонкий согласный, пара по глухости — [т].' },
  { u: 'Е', l: 'е', name: 'е', type: 'vowel', sound: '[э], [й’э]', word: 'ель', plain: 'ель', note: 'Может обозначать один или два звука — зависит от места в слове.' },
  { u: 'Ё', l: 'ё', name: 'ё', type: 'vowel', sound: '[о], [й’о]', word: 'ёжик', plain: 'ёжик', note: 'Всегда ударная, если в слове есть буква ё.' },
  { u: 'Ж', l: 'ж', name: 'жэ', type: 'consonant', sound: '[ж]', word: 'жук', plain: 'жук', note: 'Всегда твёрдый, парный глухой — [ш].' },
  { u: 'З', l: 'з', name: 'зэ', type: 'consonant', sound: '[з] / [з’]', word: 'зима́', plain: 'зима', note: 'Звонкий согласный, образует пару с глухим [с].' },
  { u: 'И', l: 'и', name: 'и', type: 'vowel', sound: '[и]', word: 'игла́', plain: 'игла', note: 'Гласный звук: после мягких согласных и в начале слова.' },
  { u: 'Й', l: 'й', name: 'и краткое', type: 'consonant', sound: '[й’]', word: 'йо́гурт', plain: 'йогурт', note: 'Всегда мягкий звонкий согласный. Не путайте с буквой и.' },
  { u: 'К', l: 'к', name: 'ка', type: 'consonant', sound: '[к] / [к’]', word: 'кот', plain: 'кот', note: 'Глухой согласный, пара по звонкости — [г].' },
  { u: 'Л', l: 'л', name: 'эль', type: 'consonant', sound: '[л] / [л’]', word: 'лиса́', plain: 'лиса', note: 'Звонкий согласный, не имеет глухой пары.' },
  { u: 'М', l: 'м', name: 'эм', type: 'consonant', sound: '[м] / [м’]', word: 'ма́ма', plain: 'мама', note: 'Звонкий согласный, произносится с участием голоса.' },
  { u: 'Н', l: 'н', name: 'эн', type: 'consonant', sound: '[н] / [н’]', word: 'нос', plain: 'нос', note: 'Звонкий согласный, не имеет глухой пары.' },
  { u: 'О', l: 'о', name: 'о', type: 'vowel', sound: '[о]', word: 'окно́', plain: 'окно', note: 'Под ударением звучит ясно: [о]. Без ударения — [а].' },
  { u: 'П', l: 'п', name: 'пэ', type: 'consonant', sound: '[п] / [п’]', word: 'по́ле', plain: 'поле', note: 'Глухой согласный, пара по звонкости — [б].' },
  { u: 'Р', l: 'р', name: 'эр', type: 'consonant', sound: '[р] / [р’]', word: 'раке́та', plain: 'ракета', note: 'Звонкий согласный, не имеет глухой пары.' },
  { u: 'С', l: 'с', name: 'эс', type: 'consonant', sound: '[с] / [с’]', word: 'со́лнце', plain: 'солнце', note: 'Глухой согласный, пара по звонкости — [з].' },
  { u: 'Т', l: 'т', name: 'тэ', type: 'consonant', sound: '[т] / [т’]', word: 'тетра́дь', plain: 'тетрадь', note: 'Глухой согласный, пара по звонкости — [д].' },
  { u: 'У', l: 'у', name: 'у', type: 'vowel', sound: '[у]', word: 'ули́тка', plain: 'улитка', note: 'Гласный звук, образует слог и может быть ударным.' },
  { u: 'Ф', l: 'ф', name: 'эф', type: 'consonant', sound: '[ф] / [ф’]', word: 'флаг', plain: 'флаг', note: 'Глухой согласный, пара по звонкости — [в].' },
  { u: 'Х', l: 'х', name: 'ха', type: 'consonant', sound: '[х] / [х’]', word: 'хлеб', plain: 'хлеб', note: 'Глухой согласный, не имеет звонкой пары.' },
  { u: 'Ц', l: 'ц', name: 'цэ', type: 'consonant', sound: '[ц]', word: 'ца́пля', plain: 'цапля', note: 'Всегда твёрдый, непарный глухой согласный.' },
  { u: 'Ч', l: 'ч', name: 'че', type: 'consonant', sound: '[ч’]', word: 'часы́', plain: 'часы', note: 'Всегда мягкий, непарный глухой согласный.' },
  { u: 'Ш', l: 'ш', name: 'ша', type: 'consonant', sound: '[ш]', word: 'шар', plain: 'шар', note: 'Всегда твёрдый, непарный глухой согласный.' },
  { u: 'Щ', l: 'щ', name: 'ща', type: 'consonant', sound: '[щ’]', word: 'щу́ка', plain: 'щука', note: 'Всегда мягкий, непарный глухой согласный.' },
  { u: 'Ъ', l: 'ъ', name: 'твёрдый знак', type: 'sign', sound: '—', word: 'подъе́зд', plain: 'подъезд', note: 'Разделительный твёрдый знак. Звука не обозначает.' },
  { u: 'Ы', l: 'ы', name: 'ы', type: 'vowel', sound: '[ы]', word: 'сыр', plain: 'сыр', note: 'Гласный звук. В русском языке не бывает слов, начинающихся с ы.' },
  { u: 'Ь', l: 'ь', name: 'мягкий знак', type: 'sign', sound: '—', word: 'соль', plain: 'соль', note: 'Показывает мягкость предыдущего согласного или разделяет звуки.' },
  { u: 'Э', l: 'э', name: 'э', type: 'vowel', sound: '[э]', word: 'экра́н', plain: 'экран', note: 'Гласный звук. Чаще встречается в начале слова и заимствованиях.' },
  { u: 'Ю', l: 'ю', name: 'ю', type: 'vowel', sound: '[у], [й’у]', word: 'юла́', plain: 'юла', note: 'Может обозначать один или два звука в зависимости от позиции.' },
  { u: 'Я', l: 'я', name: 'я', type: 'vowel', sound: '[а], [й’а]', word: 'я́блоко', plain: 'яблоко', note: 'Может обозначать один или два звука в зависимости от позиции.' }
];

/* ---------- Упражнения ---------- */

const EXERCISES = {
  orthography: {
    title: 'Орфография',
    questions: [
      {
        type: 'choice',
        question: 'В каком слове пропущена буква «а»?',
        options: ['р…стение', 'выр…сли', 'подр…сли', 'Р…стов'],
        correct: 0,
        explanation: 'В корне -раст-/-рос- перед сочетанием «ст» пишется «а»: растение. В остальных словах — «о»: выросли, подросли, Ростов (исключение).'
      },
      {
        type: 'choice',
        question: 'Выберите правильное написание: «Он не боит…ся высоты».',
        options: ['боится', 'боиться'],
        correct: 0,
        explanation: 'Задаём вопрос: он (что делает?) боится. В вопросе нет мягкого знака — значит, и в глаголе его нет.'
      },
      {
        type: 'input',
        question: 'Вставьте Н или НН: «серебр…ый»',
        placeholder: 'Н или НН',
        answers: ['н'],
        explanation: 'В суффиксе -ян- прилагательного пишется одна «н»: серебряный. Исключения: стеклянный, оловянный, деревянный.'
      },
      {
        type: 'choice',
        question: 'В каком слове на месте пропуска пишется «ё»?',
        options: ['ш…лк', 'ш…в', 'капюш…н', 'крыж…вник'],
        correct: 0,
        explanation: 'Проверяем: шёлк — шелка. Есть чередование с «е», поэтому пишем «ё». В остальных словах пишется «о».'
      },
      {
        type: 'input',
        question: 'Вставьте пропущенную букву: «прик…снуться»',
        placeholder: 'Одна буква',
        answers: ['о'],
        explanation: 'В корне -кас-/-кос- пишется «а», если после корня есть суффикс -а- (касаться). В слове «прикоснуться» его нет, поэтому «о».'
      },
      {
        type: 'choice',
        question: 'С каким словом НЕ пишется слитно?',
        options: ['не был', 'не пришёл', 'ненавидеть', 'не думает'],
        correct: 2,
        explanation: 'Слово «ненавидеть» без НЕ не употребляется, поэтому пишется слитно. Остальные глаголы — раздельно.'
      },
      {
        type: 'input',
        question: 'Вставьте пропущенную букву: «бе…шумный»',
        placeholder: 'Одна буква',
        answers: ['с'],
        explanation: 'Перед глухим согласным «ш» в приставке пишется «с»: бесшумный. Приставки «з-» в русском языке нет.'
      },
      {
        type: 'choice',
        question: 'В каком слове допущена ошибка?',
        options: ['здесь', 'зделать', 'бездомный', 'расписание'],
        correct: 1,
        explanation: 'Правильно — «сделать». Приставки «з-» не бывает, а в слове «здесь» «з» входит в корень.'
      }
    ]
  },
  punctuation: {
    title: 'Пунктуация',
    questions: [
      {
        type: 'choice',
        question: 'В каком предложении перед союзом «и» запятая не нужна?',
        options: [
          'Ветер стих, и наступила тишина.',
          'Мы купили яблоки, груши и сливы.',
          'Он открыл дверь, и в комнату ворвался ветер.',
          'Солнце село, и стало прохладно.'
        ],
        correct: 1,
        explanation: 'В предложении с однородными членами при одиночном союзе «и» запятая не ставится. Остальные предложения сложные: в них две грамматические основы.'
      },
      {
        type: 'choice',
        question: 'В каком предложении пропущена запятая?',
        options: [
          'Я знаю что ты прав.',
          'Что ты делаешь?',
          'Он сказал что-то странное.',
          'Что бы мне почитать?'
        ],
        correct: 0,
        explanation: 'Правильно: «Я знаю, что ты прав». Это сложноподчинённое предложение, перед союзом «что» нужна запятая. В остальных примерах «что» и «что-то» — не союзы.'
      },
      {
        type: 'choice',
        question: 'Нужны ли запятые в предложении «Лежащая на столе книга открыта»?',
        options: [
          'Да, причастный оборот выделяется с двух сторон.',
          'Нет: оборот стоит перед определяемым словом.',
          'Нужна только одна запятая — после слова «книга».'
        ],
        correct: 1,
        explanation: 'Причастный оборот «лежащая на столе» стоит перед определяемым словом «книга», поэтому запятыми не выделяется.'
      },
      {
        type: 'choice',
        question: 'Какой знак пропущен: «Когда наступил вечер _ мы отправились домой»?',
        options: ['Запятая', 'Тире', 'Двоеточие', 'Знак не нужен'],
        correct: 0,
        explanation: 'Придаточная часть «когда наступил вечер» стоит в начале сложноподчинённого предложения и отделяется запятой.'
      },
      {
        type: 'choice',
        question: 'Какой знак нужен: «Москва _ столица России»?',
        options: ['Тире', 'Двоеточие', 'Запятая', 'Знак не нужен'],
        correct: 0,
        explanation: 'Подлежащее и сказуемое выражены существительными в именительном падеже, поэтому между ними ставится тире.'
      },
      {
        type: 'input',
        question: 'Вставьте пропущенный знак: «Он взял всё необходимое _ палатку, спальник и фонарик»',
        placeholder: 'Знак препинания',
        answers: [':', 'двоеточие'],
        explanation: 'После обобщающего слова «всё необходимое» перед однородными членами ставится двоеточие.'
      }
    ]
  },
  stress: {
    title: 'Ударение',
    questions: [
      {
        type: 'choice',
        question: 'В каком слове ударение падает на первый слог?',
        options: ['звонит', 'торты', 'каталог', 'красивее'],
        correct: 1,
        explanation: 'Правильно: то́рты. Запомните: звонИт, каталОг, красИвее.'
      },
      {
        type: 'choice',
        question: 'Выберите правильный вариант ударения',
        options: ['звОнит', 'звонИт'],
        correct: 1,
        explanation: 'Литературная норма — звонИт. Ударение во всех формах глагола «звонить» падает на «и».'
      },
      {
        type: 'choice',
        question: 'В каком слове ударение падает на последний слог?',
        options: ['свёкла', 'документ', 'торты', 'банты'],
        correct: 1,
        explanation: 'Правильно: докумЕнт. Свёкла, то́рты и ба́нты произносятся с ударением на первом слоге.'
      },
      {
        type: 'choice',
        question: 'В каком слове ударение падает на второй слог?',
        options: ['алфавит', 'свёкла', 'красивее', 'каталог'],
        correct: 2,
        explanation: 'Правильно: красИвее. Сравните: алфавИт и каталОг — ударение на последнем слоге, свЁкла — на первом.'
      },
      {
        type: 'choice',
        question: 'Как правильно: «дОговор» или «договОр»?',
        options: ['дОговор', 'договОр'],
        correct: 1,
        explanation: 'Норма — договОр. Запомните форму множественного числа: договОры.'
      },
      {
        type: 'choice',
        question: 'В каком слове ударение падает на первый слог?',
        options: ['цемент', 'щавель', 'кухонный', 'звонит'],
        correct: 2,
        explanation: 'Правильно: ку́хонный. Запомните: цемЕнт, щавЕль, звонИт.'
      }
    ]
  }
};

/* ---------- Словарные слова ---------- */

const WORDS = [
  { word: 'алфави́т', plain: 'алфавит', pos: 'сущ.', meaning: 'Установленный порядок букв в языке.', example: 'Русский алфавит содержит 33 буквы.' },
  { word: 'берёза', plain: 'берёза', pos: 'сущ.', meaning: 'Лиственное дерево с белой корой.', example: 'У околицы шумела белая берёза.' },
  { word: 'воробе́й', plain: 'воробей', pos: 'сущ.', meaning: 'Маленькая птица, которая часто живёт рядом с человеком.', example: 'Воробей прыгал по дорожке в поисках крошек.' },
  { word: 'воро́на', plain: 'ворона', pos: 'сущ.', meaning: 'Крупная птица с серо-чёрным оперением.', example: 'На заборе важно сидела ворона.' },
  { word: 'го́род', plain: 'город', pos: 'сущ.', meaning: 'Крупный населённый пункт.', example: 'Мы живём в большом городе у реки.' },
  { word: 'дере́вня', plain: 'деревня', pos: 'сущ.', meaning: 'Небольшое село, населённый пункт в сельской местности.', example: 'Летом я отдыхал в деревне у бабушки.' },
  { word: 'доро́га', plain: 'дорога', pos: 'сущ.', meaning: 'Полоса земли для передвижения; путь.', example: 'Дорога ведёт к морю через лес.' },
  { word: 'здра́вствуйте', plain: 'здравствуйте', pos: 'этикет', meaning: 'Вежливое приветствие при встрече.', example: 'Здравствуйте, дорогие друзья!' },
  { word: 'земляни́ка', plain: 'земляника', pos: 'сущ.', meaning: 'Лесная душистая ягода красного цвета.', example: 'Мы набрали целую корзину земляники.' },
  { word: 'капу́ста', plain: 'капуста', pos: 'сущ.', meaning: 'Овощ с плотными листьями, растущий кочаном.', example: 'На грядке выросла большая капуста.' },
  { word: 'каранда́ш', plain: 'карандаш', pos: 'сущ.', meaning: 'Инструмент для письма и рисования с графитовым стержнем.', example: 'Я нарисовал дом цветными карандашами.' },
  { word: 'карти́на', plain: 'картина', pos: 'сущ.', meaning: 'Произведение живописи.', example: 'В музее мы увидели картину известного художника.' },
  { word: 'карто́фель', plain: 'картофель', pos: 'сущ.', meaning: 'Овощ, клубни которого употребляют в пищу.', example: 'Бабушка сварила молодой картофель.' },
  { word: 'кварти́ра', plain: 'квартира', pos: 'сущ.', meaning: 'Жилое помещение в доме.', example: 'Наша квартира находится на пятом этаже.' },
  { word: 'кла́сс', plain: 'класс', pos: 'сущ.', meaning: 'Школьная комната для занятий; коллектив учеников.', example: 'Наш класс готовится к конкурсу чтецов.' },
  { word: 'компо́т', plain: 'компот', pos: 'сущ.', meaning: 'Напиток из фруктов или ягод, сваренных с сахаром.', example: 'На обед мама приготовила яблочный компот.' },
  { word: 'коньки́', plain: 'коньки', pos: 'сущ.', meaning: 'Ботинки с полозьями для катания по льду.', example: 'Зимой мы взяли коньки и пошли на каток.' },
  { word: 'коро́ва', plain: 'корова', pos: 'сущ.', meaning: 'Домашнее животное, которое даёт молоко.', example: 'Во дворе паслась рыжая корова.' }
];

WORDS.push(
  { word: 'ле́стница', plain: 'лестница', pos: 'сущ.', meaning: 'Сооружение из ступеней для передвижения между этажами.', example: 'Мы поднялись по лестнице на третий этаж.' },
  { word: 'магази́н', plain: 'магазин', pos: 'сущ.', meaning: 'Предприятие, где продают товары.', example: 'Рядом с домом открылся новый магазин.' },
  { word: 'мали́на', plain: 'малина', pos: 'сущ.', meaning: 'Душистая ягода красного цвета; кустарник с такими ягодами.', example: 'В саду поспела сладкая малина.' },
  { word: 'медве́дь', plain: 'медведь', pos: 'сущ.', meaning: 'Крупное хищное животное с густой шерстью.', example: 'В лесу мы заметили следы медведя.' },
  { word: 'молоко́', plain: 'молоко', pos: 'сущ.', meaning: 'Белый питательный напиток, который даёт корова.', example: 'На завтрак я выпил стакан молока.' },
  { word: 'морко́вь', plain: 'морковь', pos: 'сущ.', meaning: 'Овощ оранжевого цвета, корнеплод.', example: 'Для салата нужна свежая морковь.' },
  { word: 'моро́з', plain: 'мороз', pos: 'сущ.', meaning: 'Сильный холод, низкая температура воздуха.', example: 'Ночью ударил крепкий мороз.' },
  { word: 'Москва́', plain: 'москва', pos: 'сущ.', meaning: 'Столица России, крупнейший город страны.', example: 'Москва — столица России.' },
  { word: 'наро́д', plain: 'народ', pos: 'сущ.', meaning: 'Жители страны; большая группа людей.', example: 'Русский народ бережно хранит свои традиции.' },
  { word: 'о́блако', plain: 'облако', pos: 'сущ.', meaning: 'Скопление водяного пара в небе.', example: 'По небу медленно плыло белое облако.' },
  { word: 'огоро́д', plain: 'огород', pos: 'сущ.', meaning: 'Участок земли для выращивания овощей.', example: 'Летом мы работали в огороде.' },
  { word: 'оде́жда', plain: 'одежда', pos: 'сущ.', meaning: 'Предметы, которые человек носит на себе.', example: 'Зимой нужна тёплая одежда.' },
  { word: 'одна́жды', plain: 'однажды', pos: 'нареч.', meaning: 'Один раз, когда-то в прошлом.', example: 'Однажды мы увидели в лесу лису.' },
  { word: 'оре́х', plain: 'орех', pos: 'сущ.', meaning: 'Плод с твёрдой оболочкой и съедобным ядром.', example: 'Белка нашла в дупле орех.' },
  { word: 'пена́л', plain: 'пенал', pos: 'сущ.', meaning: 'Футляр для хранения ручек, карандашей и линеек.', example: 'В пенале лежат ручка и ластик.' },
  { word: 'песо́к', plain: 'песок', pos: 'сущ.', meaning: 'Мелкие частицы горных пород.', example: 'Дети строили замок из песка.' },
  { word: 'пету́х', plain: 'петух', pos: 'сущ.', meaning: 'Домашняя птица с ярким оперением и гребнем.', example: 'Рано утром запел петух.' },
  { word: 'пого́да', plain: 'погода', pos: 'сущ.', meaning: 'Состояние атмосферы в определённый момент.', example: 'Сегодня на улице отличная погода.' }
);

WORDS.push(
  { word: 'помидо́р', plain: 'помидор', pos: 'сущ.', meaning: 'Овощ красного или жёлтого цвета, сочный плод.', example: 'В салате есть свежий помидор.' },
  { word: 'понеде́льник', plain: 'понедельник', pos: 'сущ.', meaning: 'Первый день недели после воскресенья.', example: 'В понедельник начинается новая учебная неделя.' },
  { word: 'посу́да', plain: 'посуда', pos: 'сущ.', meaning: 'Предметы для приготовления, хранения и еды пищи.', example: 'После обеда мы вымыли всю посуду.' },
  { word: 'приве́т', plain: 'привет', pos: 'сущ.', meaning: 'Дружеское приветствие при встрече.', example: 'Он передал мне привет от старого друга.' },
  { word: 'приро́да', plain: 'природа', pos: 'сущ.', meaning: 'Окружающий мир, растительный и животный мир.', example: 'Мы любим отдыхать на природе.' },
  { word: 'рабо́та', plain: 'работа', pos: 'сущ.', meaning: 'Занятие, труд, создание чего-либо.', example: 'Работа над проектом заняла целую неделю.' },
  { word: 'раке́та', plain: 'ракета', pos: 'сущ.', meaning: 'Летательный аппарат для космических полётов.', example: 'Ракета поднялась в небо и исчезла из виду.' },
  { word: 'расска́з', plain: 'рассказ', pos: 'сущ.', meaning: 'Небольшое повествование о событиях.', example: 'Учитель прочитал нам интересный рассказ.' },
  { word: 'Ро́дина', plain: 'родина', pos: 'сущ.', meaning: 'Страна, в которой человек родился; родные места.', example: 'Для каждого человека Родина дорога по-своему.' },
  { word: 'рома́шка', plain: 'ромашка', pos: 'сущ.', meaning: 'Полевой цветок с белыми лепестками и жёлтой серединкой.', example: 'В поле распустилась белая ромашка.' },
  { word: 'Росси́я', plain: 'россия', pos: 'сущ.', meaning: 'Государство в Восточной Европе и Северной Азии.', example: 'Россия — самая большая страна в мире.' },
  { word: 'ру́сский', plain: 'русский', pos: 'прил.', meaning: 'Относящийся к русскому народу, языку или культуре.', example: 'Русский язык — один из самых богатых в мире.' },
  { word: 'ряби́на', plain: 'рябина', pos: 'сущ.', meaning: 'Дерево с ярко-красными ягодами; сами ягоды.', example: 'Осенью на рябине созревают красные ягоды.' },
  { word: 'сапоги́', plain: 'сапоги', pos: 'сущ.', meaning: 'Обувь с высоким голенищем.', example: 'В дождливую погоду я надеваю резиновые сапоги.' },
  { word: 'се́вер', plain: 'север', pos: 'сущ.', meaning: 'Одна из четырёх сторон света, противоположная югу.', example: 'На севере нашей страны бывают суровые зимы.' },
  { word: 'сентя́брь', plain: 'сентябрь', pos: 'сущ.', meaning: 'Девятый месяц года, первый месяц осени.', example: 'В сентябре начинается новый учебный год.' },
  { word: 'сини́ца', plain: 'синица', pos: 'сущ.', meaning: 'Небольшая птица с жёлтой грудкой.', example: 'На кормушку прилетела синица.' },
  { word: 'соба́ка', plain: 'собака', pos: 'сущ.', meaning: 'Домашнее животное, верный друг человека.', example: 'Наша собака любит играть во дворе.' }
);

WORDS.push(
  { word: 'солда́т', plain: 'солдат', pos: 'сущ.', meaning: 'Военнослужащий, защитник страны.', example: 'Солдат несёт службу на границе.' },
  { word: 'соро́ка', plain: 'сорока', pos: 'сущ.', meaning: 'Птица с чёрно-белым оперением и длинным хвостом.', example: 'Сорока громко стрекотала на ветке.' },
  { word: 'спаси́бо', plain: 'спасибо', pos: 'этикет', meaning: 'Слово благодарности.', example: 'Спасибо за помощь и поддержку!' },
  { word: 'столи́ца', plain: 'столица', pos: 'сущ.', meaning: 'Главный город государства.', example: 'Москва — столица России.' },
  { word: 'суббо́та', plain: 'суббота', pos: 'сущ.', meaning: 'Шестой день недели.', example: 'В субботу мы всей семьёй отправились в парк.' },
  { word: 'тетра́дь', plain: 'тетрадь', pos: 'сущ.', meaning: 'Сшитые листы бумаги для записей.', example: 'Я записал домашнее задание в тетрадь.' },
  { word: 'това́рищ', plain: 'товарищ', pos: 'сущ.', meaning: 'Друг, человек, связанный с кем-то общим делом.', example: 'Мой товарищ помог мне решить задачу.' },
  { word: 'трамва́й', plain: 'трамвай', pos: 'сущ.', meaning: 'Городской электрический вид транспорта.', example: 'Мы поехали в музей на трамвае.' },
  { word: 'у́лица', plain: 'улица', pos: 'сущ.', meaning: 'Пространство между домами для движения и прогулок.', example: 'Наша улица утопает в зелени.' },
  { word: 'урожа́й', plain: 'урожай', pos: 'сущ.', meaning: 'Собранные с полей и огородов плоды, злаки.', example: 'Осенью фермеры собрали богатый урожай.' },
  { word: 'учени́к', plain: 'ученик', pos: 'сущ.', meaning: 'Тот, кто учится в школе.', example: 'Ученик внимательно слушал объяснение.' },
  { word: 'учи́тель', plain: 'учитель', pos: 'сущ.', meaning: 'Человек, который преподаёт и воспитывает.', example: 'Наш учитель любит свой предмет.' },
  { word: 'фами́лия', plain: 'фамилия', pos: 'сущ.', meaning: 'Наследственное родовое имя человека.', example: 'Запишите свою фамилию в тетрадь.' },
  { word: 'футбо́л', plain: 'футбол', pos: 'сущ.', meaning: 'Командная игра с мячом на поле.', example: 'Мой брат играет в футбол по воскресеньям.' },
  { word: 'хокке́й', plain: 'хоккей', pos: 'сущ.', meaning: 'Командная игра на льду с шайбой и клюшками.', example: 'Зимой в нашем дворе заливают каток для хоккея.' },
  { word: 'челове́к', plain: 'человек', pos: 'сущ.', meaning: 'Живое существо, обладающее разумом и речью.', example: 'Каждый человек уникален.' },
  { word: 'четве́рг', plain: 'четверг', pos: 'сущ.', meaning: 'Четвёртый день недели.', example: 'В четверг у нас урок русского языка.' },
  { word: 'чу́вство', plain: 'чувство', pos: 'сущ.', meaning: 'Способность переживать, ощущать; эмоция.', example: 'Радость — светлое чувство.' }
);

WORDS.push(
  { word: 'шоссе́', plain: 'шоссе', pos: 'сущ.', meaning: 'Широкая дорога с твёрдым покрытием.', example: 'Машина выехала на шоссе и набрала скорость.' },
  { word: 'я́блоко', plain: 'яблоко', pos: 'сущ.', meaning: 'Плод яблони, сочный и круглый.', example: 'Я взял с собой спелое яблоко.' },
  { word: 'я́года', plain: 'ягода', pos: 'сущ.', meaning: 'Небольшой сочный плод кустарников и трав.', example: 'В лесу созрела лесная ягода.' },
  { word: 'язы́к', plain: 'язык', pos: 'сущ.', meaning: 'Система звуков и слов, средство общения.', example: 'Русский язык богат и выразителен.' }
);

/* ---------- Шапка, тема, навигация ---------- */

const root = document.documentElement;
const siteHeader = $('#siteHeader');
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
const themeToggle = $('#themeToggle');
const themeMeta = $('meta[name="theme-color"]');

function applyThemeLabel() {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    themeToggle.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
  }
  if (themeMeta) {
    themeMeta.setAttribute('content', isDark ? '#121821' : '#f6f2ea');
  }
}

applyThemeLabel();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('rus-theme', next); } catch (e) {}
    applyThemeLabel();
  });
}

function closeMenu() {
  siteHeader.classList.remove('nav-open');
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const willOpen = !siteHeader.classList.contains('nav-open');
    siteHeader.classList.toggle('nav-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  });
}

$$('#mainNav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (siteHeader && !siteHeader.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 940) closeMenu();
});

const sections = $$('main section[data-section]');
const navLinks = $$('[data-nav]');
let scrollScheduled = false;

function updateOnScroll() {
  scrollScheduled = false;
  if (siteHeader) siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);

  const probe = window.scrollY + window.innerHeight * 0.32;
  let current = '';
  sections.forEach((section) => {
    if (section.offsetTop <= probe) current = section.dataset.section;
  });
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
    current = sections.length ? sections[sections.length - 1].dataset.section : current;
  }
  navLinks.forEach((link) => {
    const active = link.dataset.nav === current;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    window.requestAnimationFrame(updateOnScroll);
  }
}, { passive: true });

updateOnScroll();

/* ---------- Общие счётчики ---------- */

const totalQuestions = Object.values(EXERCISES).reduce((sum, set) => sum + set.questions.length, 0);

const statRules = $('[data-stat="rules"]');
const statExercises = $('[data-stat="exercises"]');
const statWords = $('[data-stat="words"]');

if (statRules) statRules.textContent = String($$('.rule').length);
if (statExercises) statExercises.textContent = String(totalQuestions);
if (statWords) statWords.textContent = String(WORDS.length);

const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- Фильтр правил ---------- */

const ruleCards = $$('.rule');
const ruleFilterButtons = $$('#rulesFilters .chip');

ruleFilterButtons.forEach((button) => {
  const filter = button.dataset.filter;
  const count = filter === 'all'
    ? ruleCards.length
    : ruleCards.filter((card) => card.dataset.category === filter).length;
  const countEl = $('.chip-count', button);
  if (countEl) countEl.textContent = String(count);

  button.addEventListener('click', () => {
    ruleFilterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    ruleCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
    });
  });
});

/* ---------- Упражнения: логика ---------- */

const quizCard = $('#quizCard');
const quizPanel = $('#quizPanel');
const setButtons = $$('#setList .set-btn');
const QUESTION_KEYS = ['А', 'Б', 'В', 'Г'];
let quizInView = false;

const quizState = {
  setKey: 'orthography',
  index: 0,
  score: 0,
  checked: false,
  selected: null,
  userValue: '',
  answers: [],
  results: {}
};

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function currentExercise() {
  return EXERCISES[quizState.setKey];
}

function updateSetButtons() {
  setButtons.forEach((button) => {
    const key = button.dataset.set;
    const set = EXERCISES[key];
    const active = key === quizState.setKey;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    const small = $('.set-text small', button);
    if (small) {
      small.textContent = set.questions.length + ' ' + plural(set.questions.length, ['задание', 'задания', 'заданий']);
    }
    const badge = $('.set-badge', button);
    if (badge) {
      const result = quizState.results[key];
      badge.textContent = result ? result.score + '/' + result.total : '';
      badge.classList.remove('is-good', 'is-mid', 'is-low');
      if (result) {
        const percent = Math.round((result.score / result.total) * 100);
        badge.classList.add(percent >= 80 ? 'is-good' : percent >= 60 ? 'is-mid' : 'is-low');
      }
    }
  });
}

function renderQuiz() {
  if (!quizCard) return;
  const set = currentExercise();
  const total = set.questions.length;

  if (quizState.index >= total) {
    renderResults();
    return;
  }

  const q = set.questions[quizState.index];
  const answer = quizState.answers[quizState.index];
  const isAnswered = Boolean(answer && quizState.checked);
  const progressValue = quizState.index + (isAnswered ? 1 : 0);
  const progressPercent = Math.round((progressValue / total) * 100);
  const isLast = quizState.index === total - 1;

  let answerMarkup = '';
  let hintText = '';

  if (q.type === 'choice') {
    hintText = 'Можно отвечать клавишами 1–4';
    const options = q.options.map((option, index) => {
      let stateClass = '';
      if (isAnswered) {
        if (index === q.correct) stateClass = ' is-correct';
        else if (index === quizState.selected) stateClass = ' is-wrong';
        else stateClass = ' is-muted';
      }
      return '<button type="button" class="option' + stateClass + '" data-index="' + index + '"' +
        (isAnswered ? ' aria-disabled="true"' : '') + '>' +
        '<span class="option-key">' + QUESTION_KEYS[index] + '</span>' +
        '<span class="option-text">' + option + '</span>' +
        '<span class="option-mark" aria-hidden="true"></span>' +
        '</button>';
    }).join('');

    answerMarkup = '<div class="options" role="group" aria-labelledby="questionTitle">' + options + '</div>';
  } else {
    hintText = 'Введите ответ и нажмите Enter';
    answerMarkup = '<form class="answer-form' + (isAnswered ? (answer.correct ? ' is-correct' : ' is-wrong') : '') + '" id="answerForm" novalidate>' +
      '<label class="visually-hidden" for="answerInput">Ваш ответ</label>' +
      '<input class="answer-input" id="answerInput" name="answer" type="text" placeholder="' + escapeAttr(q.placeholder || 'Введите ответ') + '" autocomplete="off" value="' + escapeAttr(quizState.userValue) + '"' + (isAnswered ? ' disabled' : '') + '>' +
      (isAnswered ? '' : '<button type="submit" class="btn btn-soft">Проверить</button>') +
      '</form>';
  }

  const feedback = isAnswered
    ? '<div class="feedback ' + (answer.correct ? 'is-correct' : 'is-wrong') + '" id="quizFeedback" aria-live="polite">' +
      '<strong>' + (answer.correct ? 'Верно!' : 'Не совсем') + '</strong>' +
      '<p>' + q.explanation + '</p></div>'
    : '<div class="feedback" id="quizFeedback" aria-live="polite"></div>';

  quizCard.innerHTML =
    '<div class="quiz-inner">' +
      '<div class="quiz-head">' +
        '<span class="quiz-tag">' + set.title + '</span>' +
        '<span class="quiz-score"><strong>' + quizState.score + '</strong> / ' + total + ' верных</span>' +
      '</div>' +
      '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + progressValue + '" aria-label="Прогресс упражнения">' +
        '<span style="width:' + progressPercent + '%"></span>' +
      '</div>' +
      '<div class="question">' +
        '<p class="q-meta">Вопрос ' + (quizState.index + 1) + ' из ' + total + '</p>' +
        '<h3 class="q-text" id="questionTitle">' + q.question + '</h3>' +
        answerMarkup +
        feedback +
        '<div class="quiz-actions">' +
          '<span class="key-hint">' + hintText + '</span>' +
          '<button type="button" class="btn btn-primary next-btn"' + (isAnswered ? '' : ' hidden') + '>' +
            (isLast ? 'Показать результат' : 'Следующий вопрос') +
            ' <span aria-hidden="true">→</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (!isAnswered) {
    if (q.type === 'choice') {
      $$('.option', quizCard).forEach((option) => {
        option.addEventListener('click', () => chooseOption(Number(option.dataset.index)));
      });
    } else {
      const form = $('#answerForm', quizCard);
      if (form) form.addEventListener('submit', checkInputAnswer);
    }
  }

  const nextButton = $('.next-btn', quizCard);
  if (nextButton) nextButton.addEventListener('click', nextQuestion);
}

function chooseOption(index) {
  if (quizState.checked) return;
  const q = currentExercise().questions[quizState.index];
  const correct = index === q.correct;
  quizState.checked = true;
  quizState.selected = index;
  quizState.userValue = q.options[index];
  quizState.answers[quizState.index] = { correct: correct, given: q.options[index] };
  if (correct) quizState.score += 1;
  renderQuiz();
  const next = $('.next-btn', quizCard);
  if (next) next.focus({ preventScroll: true });
}

function checkInputAnswer(event) {
  event.preventDefault();
  if (quizState.checked) return;
  const input = $('#answerInput', quizCard);
  if (!input) return;
  const raw = input.value.trim();
  if (!raw) {
    input.focus();
    return;
  }
  const q = currentExercise().questions[quizState.index];
  const correct = q.answers.some((answer) => normalizeText(answer) === normalizeText(raw));
  quizState.checked = true;
  quizState.selected = null;
  quizState.userValue = raw;
  quizState.answers[quizState.index] = { correct: correct, given: raw };
  if (correct) quizState.score += 1;
  renderQuiz();
  const next = $('.next-btn', quizCard);
  if (next) next.focus({ preventScroll: true });
}

function nextQuestion() {
  if (!quizState.checked) return;
  quizState.index += 1;
  quizState.checked = false;
  quizState.selected = null;
  quizState.userValue = '';
  renderQuiz();
}

function resetQuiz(clearResult) {
  if (clearResult) delete quizState.results[quizState.setKey];
  quizState.index = 0;
  quizState.score = 0;
  quizState.checked = false;
  quizState.selected = null;
  quizState.userValue = '';
  quizState.answers = [];
  updateSetButtons();
  renderQuiz();
}

function resultMessage(percent) {
  if (percent === 100) {
    return {
      title: 'Безупречно!',
      text: 'Вы отлично знаете тему. Так держать!'
    };
  }
  if (percent >= 80) {
    return {
      title: 'Отличный результат!',
      text: 'Совсем немного не хватило до идеала. Продолжайте в том же духе.'
    };
  }
  if (percent >= 60) {
    return {
      title: 'Хороший результат!',
      text: 'Основа уже есть. Повторите правила и попробуйте ещё раз — будет ещё лучше.'
    };
  }
  return {
    title: 'Есть над чем поработать',
    text: 'Не расстраивайтесь: вернитесь к правилам, разберите ошибки и попробуйте снова.'
  };
}

function renderResults() {
  const set = currentExercise();
  const total = set.questions.length;
  const percent = Math.round((quizState.score / total) * 100);
  const message = resultMessage(percent);
  quizState.results[quizState.setKey] = { score: quizState.score, total: total, percent: percent };
  updateSetButtons();

  const wrong = set.questions
    .map((question, index) => ({ question: question, answer: quizState.answers[index] }))
    .filter((item) => item.answer && !item.answer.correct);

  let reviewMarkup = '';
  if (wrong.length) {
    const items = wrong.map((item) => {
      const q = item.question;
      const right = q.type === 'choice' ? q.options[q.correct] : q.answers[0];
      return '<li>' +
        '<p class="review-q">' + q.question + '</p>' +
        '<p class="review-a"><span>Правильный ответ:</span> <b>' + right + '</b></p>' +
        '<p class="review-explain">' + q.explanation + '</p>' +
        '</li>';
    }).join('');
    reviewMarkup = '<details class="result-review">' +
      '<summary>Разбор ошибок <span>' + wrong.length + '</span></summary>' +
      '<ol class="review-list">' + items + '</ol>' +
      '</details>';
  } else {
    reviewMarkup = '<div class="result-perfect">Ни одной ошибки — прекрасная работа!</div>';
  }

  quizCard.innerHTML =
    '<div class="quiz-inner result">' +
      '<div class="quiz-head">' +
        '<span class="quiz-tag">Результат · ' + set.title + '</span>' +
        '<span class="quiz-score"><strong>' + quizState.score + '</strong> / ' + total + '</span>' +
      '</div>' +
      '<div class="result-main">' +
        '<div class="result-ring" style="--value:' + percent + '">' +
          '<div><strong>' + percent + '%</strong><span>верно</span></div>' +
        '</div>' +
        '<div class="result-copy">' +
          '<p class="q-meta">Упражнение завершено</p>' +
          '<h3>' + message.title + '</h3>' +
          '<p>' + message.text + ' Верных ответов: ' + quizState.score + ' из ' + total + '.</p>' +
          '<div class="result-actions">' +
            '<button class="btn btn-primary" type="button" id="retryBtn">Пройти ещё раз</button>' +
            '<a class="btn btn-ghost" href="#rules">Повторить правила</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      reviewMarkup +
    '</div>';

  const retry = $('#retryBtn', quizCard);
  if (retry) retry.addEventListener('click', () => resetQuiz(true));
}

setButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.set;
    if (key === quizState.setKey) return;
    quizState.setKey = key;
    resetQuiz(false);
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { quizInView = entry.isIntersecting; });
  }, { threshold: 0.22 });
  const section = $('#exercises');
  if (section) observer.observe(section);
} else {
  quizInView = true;
}

document.addEventListener('keydown', (event) => {
  if (!quizInView || event.ctrlKey || event.metaKey || event.altKey) return;
  const target = event.target;
  const tag = target && target.tagName ? target.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable)) return;
  if (quizState.index >= currentExercise().questions.length) return;

  if (!quizState.checked && /^[1-4]$/.test(event.key)) {
    const option = $$('.option', quizCard)[Number(event.key) - 1];
    if (option) {
      event.preventDefault();
      option.click();
    }
  } else if (quizState.checked && event.key === 'Enter') {
    const next = $('.next-btn', quizCard);
    if (next && !next.hidden) {
      event.preventDefault();
      next.click();
    }
  }
});

updateSetButtons();
renderQuiz();

/* ---------- Словарные слова: поиск и тренировка ---------- */

const vocabSection = $('#vocabulary');
const wordGrid = $('#wordGrid');
const wordSearch = $('#wordSearch');
const clearSearch = $('#clearSearch');
const trainingToggle = $('#trainingToggle');
const trainerNote = $('#trainerNote');
const letterFilter = $('#letterFilter');
const wordCount = $('#wordCount');
const vocabEmpty = $('#vocabEmpty');
const resetWords = $('#resetWords');
const loadMore = $('#loadMore');
const WORD_STEP = 18;

const sortedWords = WORDS.slice().sort((a, b) => a.plain.localeCompare(b.plain, 'ru'));

const wordState = {
  query: '',
  letter: 'all',
  training: false,
  limit: WORD_STEP,
  revealed: new Set()
};

function buildLetterFilter() {
  if (!letterFilter) return;
  const available = ALPHABET
    .map((letter) => letter.u)
    .filter((letter) => sortedWords.some((word) => word.plain.charAt(0).toUpperCase() === letter));

  const chip = (letter, label, extraClass) =>
    '<button type="button" class="letter-chip ' + extraClass + '" data-letter="' + letter + '" aria-pressed="' +
    (letter === wordState.letter ? 'true' : 'false') + '">' + label + '</button>';

  letterFilter.innerHTML = chip('all', 'Все', 'chip-all' + (wordState.letter === 'all' ? ' is-active' : '')) +
    available.map((letter) => chip(letter, letter, letter === wordState.letter ? 'is-active' : '')).join('');
}

function syncLetterChips() {
  $$('.letter-chip', letterFilter).forEach((chip) => {
    const active = chip.dataset.letter === wordState.letter;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
}

function wordCardMarkup(word) {
  const letter = word.plain.charAt(0).toUpperCase();
  const revealed = wordState.revealed.has(word.plain);
  const actionLabel = (revealed ? 'Скрыть значение слова «' : 'Показать значение слова «') + word.word + '»';
  const openAttrs = wordState.training
    ? ' tabindex="0" role="button" aria-pressed="' + String(revealed) + '" aria-label="' + escapeAttr(actionLabel) + '"'
    : '';

  return '<article class="word-card' + (wordState.training && revealed ? ' is-revealed' : '') + '" data-word="' + escapeAttr(word.plain) + '"' + openAttrs + '>' +
    '<div class="word-top"><span class="word-letter" aria-hidden="true">' + letter + '</span><span class="word-pos">' + word.pos + '</span></div>' +
    '<h3 class="word-title">' + word.word + '</h3>' +
    '<p class="word-meaning">' + word.meaning + '</p>' +
    '<p class="word-example">«' + word.example + '»</p>' +
    '<span class="word-hint" aria-hidden="true"><span class="hint-show">Показать значение</span><span class="hint-hide">Скрыть значение</span></span>' +
    '</article>';
}

function renderWords() {
  if (!wordGrid) return;
  const query = normalizeText(wordState.query);

  const filtered = sortedWords.filter((word) => {
    const letterOk = wordState.letter === 'all' || word.plain.charAt(0).toUpperCase() === wordState.letter;
    if (!letterOk) return false;
    if (!query) return true;
    const haystack = normalizeText(word.plain + ' ' + word.meaning + ' ' + word.example);
    return haystack.includes(query);
  });

  const visible = filtered.slice(0, wordState.limit);
  wordGrid.innerHTML = visible.map(wordCardMarkup).join('');
  wordGrid.hidden = filtered.length === 0;

  if (vocabEmpty) vocabEmpty.hidden = filtered.length !== 0;

  if (wordCount) {
    if (!filtered.length) {
      wordCount.textContent = 'Ничего не найдено';
    } else if (visible.length < filtered.length) {
      wordCount.textContent = 'Показано ' + visible.length + ' из ' + filtered.length + ' ' + plural(filtered.length, ['слова', 'слов', 'слов']);
    } else {
      wordCount.textContent = 'Найдено: ' + filtered.length + ' ' + plural(filtered.length, ['слово', 'слова', 'слов']);
    }
  }

  if (loadMore) {
    const remaining = filtered.length - visible.length;
    loadMore.hidden = remaining <= 0;
    if (remaining > 0) {
      loadMore.textContent = 'Показать ещё ' + Math.min(WORD_STEP, remaining);
    }
  }
}

function toggleWordCard(card) {
  if (!wordState.training || !card) return;
  const key = card.dataset.word;
  if (wordState.revealed.has(key)) {
    wordState.revealed.delete(key);
    card.classList.remove('is-revealed');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', 'Показать значение слова «' + $('.word-title', card).textContent + '»');
  } else {
    wordState.revealed.add(key);
    card.classList.add('is-revealed');
    card.setAttribute('aria-pressed', 'true');
    card.setAttribute('aria-label', 'Скрыть значение слова «' + $('.word-title', card).textContent + '»');
  }
}

function resetWordFilters() {
  wordState.query = '';
  wordState.letter = 'all';
  wordState.limit = WORD_STEP;
  if (wordSearch) wordSearch.value = '';
  if (clearSearch) clearSearch.hidden = true;
  syncLetterChips();
  renderWords();
}

buildLetterFilter();
renderWords();

if (wordSearch) {
  wordSearch.addEventListener('input', () => {
    wordState.query = wordSearch.value;
    wordState.limit = WORD_STEP;
    if (clearSearch) clearSearch.hidden = !wordSearch.value;
    renderWords();
  });

  wordSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && wordSearch.value) {
      event.preventDefault();
      resetWordFilters();
    }
  });
}

if (clearSearch) {
  clearSearch.addEventListener('click', () => {
    if (wordSearch) wordSearch.value = '';
    wordState.query = '';
    wordState.limit = WORD_STEP;
    clearSearch.hidden = true;
    renderWords();
    if (wordSearch) wordSearch.focus();
  });
}

if (letterFilter) {
  letterFilter.addEventListener('click', (event) => {
    const chip = event.target.closest('.letter-chip');
    if (!chip) return;
    wordState.letter = chip.dataset.letter;
    wordState.limit = WORD_STEP;
    syncLetterChips();
    renderWords();
  });
}

if (trainingToggle) {
  trainingToggle.addEventListener('click', () => {
    wordState.training = !wordState.training;
    trainingToggle.setAttribute('aria-pressed', String(wordState.training));
    if (vocabSection) vocabSection.classList.toggle('is-training', wordState.training);
    if (trainerNote) trainerNote.hidden = !wordState.training;
    wordState.revealed.clear();
    renderWords();
  });
}

if (wordGrid) {
  wordGrid.addEventListener('click', (event) => {
    const card = event.target.closest('.word-card');
    if (card) toggleWordCard(card);
  });

  wordGrid.addEventListener('keydown', (event) => {
    if (!wordState.training) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.word-card');
    if (!card) return;
    event.preventDefault();
    toggleWordCard(card);
  });
}

if (loadMore) {
  loadMore.addEventListener('click', () => {
    wordState.limit += WORD_STEP;
    renderWords();
  });
}

if (resetWords) resetWords.addEventListener('click', resetWordFilters);

/* ---------- Алфавит: карточки и озвучивание ---------- */

const letterGrid = $('#letterGrid');
const letterCard = $('#letterCard');
const letterDialog = $('#letterDialog');
const letterDialogContent = $('#letterDialogContent');
const dialogClose = $('#dialogClose');
let selectedLetter = 0;

const SPEAKER_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

function letterInnerMarkup(letter) {
  return '<div class="letter-card-head">' +
      '<span class="type-pill type-' + letter.type + '">' + LETTER_TYPES[letter.type] + '</span>' +
      '<span class="letter-num">Буква ' + (selectedLetter + 1) + ' из 33</span>' +
      '<button class="icon-btn speak-name" type="button" data-speak="' + escapeAttr(letter.name) + '" aria-label="Прослушать название буквы" title="Прослушать название буквы">' + SPEAKER_ICON + '</button>' +
    '</div>' +
    '<div class="letter-big"><span>' + letter.u + '</span><span>' + letter.l + '</span></div>' +
    '<p class="letter-name">Название буквы — <b>«' + letter.name + '»</b></p>' +
    '<div class="letter-facts">' +
      '<div class="fact"><span>Звук</span><strong>' + letter.sound + '</strong></div>' +
      '<div class="fact"><span>Тип</span><strong>' + LETTER_TYPES[letter.type] + '</strong></div>' +
    '</div>' +
    '<div class="letter-example">' +
      '<span>Пример</span>' +
      '<strong>' + letter.word + '</strong>' +
      '<small>' + letter.note + '</small>' +
      '<div class="letter-actions">' +
        '<button class="btn btn-soft speak-btn" type="button" data-speak="' + escapeAttr(letter.plain) + '">' + SPEAKER_ICON + ' Произнести слово</button>' +
      '</div>' +
    '</div>' +
    '<p class="letter-hint">Выберите другую букву в таблице</p>';
}

function renderLetterGrid() {
  if (!letterGrid) return;
  letterGrid.innerHTML = ALPHABET.map((letter, index) => {
    const active = index === selectedLetter;
    return '<button type="button" class="letter-btn' + (active ? ' is-active' : '') + '" data-index="' + index + '" data-type="' + letter.type + '" aria-pressed="' + active + '">' +
      '<span class="letter-upper">' + letter.u + '</span>' +
      '<span class="letter-lower">' + letter.l + '</span>' +
      '<span class="letter-name-small">«' + letter.name + '»</span>' +
      '<span class="visually-hidden"> — ' + LETTER_TYPES[letter.type].toLowerCase() + '</span>' +
      '</button>';
  }).join('');
}

function renderSelectedLetter() {
  const letter = ALPHABET[selectedLetter];
  if (!letter) return;
  if (letterCard) {
    letterCard.dataset.watermark = letter.u;
    letterCard.innerHTML = letterInnerMarkup(letter);
  }
  $$('.letter-btn', letterGrid).forEach((button) => {
    const active = Number(button.dataset.index) === selectedLetter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function openLetterDialog() {
  if (!letterDialog || !letterDialogContent) return;
  const letter = ALPHABET[selectedLetter];
  letterDialogContent.innerHTML = '<div class="letter-card" data-watermark="' + letter.u + '">' + letterInnerMarkup(letter) + '</div>';
  if (typeof letterDialog.showModal === 'function') {
    if (!letterDialog.open) letterDialog.showModal();
  }
}

if (letterGrid) {
  letterGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.letter-btn');
    if (!button) return;
    selectedLetter = Number(button.dataset.index);
    renderSelectedLetter();
    if (window.matchMedia('(max-width: 940px)').matches) openLetterDialog();
  });
}

if (dialogClose && letterDialog) {
  dialogClose.addEventListener('click', () => letterDialog.close());
}

if (letterDialog) {
  letterDialog.addEventListener('click', (event) => {
    if (event.target === letterDialog) letterDialog.close();
  });
}

function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = 0.82;
  const voices = window.speechSynthesis.getVoices();
  const russian = voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith('ru'));
  if (russian) utterance.voice = russian;
  window.speechSynthesis.speak(utterance);
}

if (!('speechSynthesis' in window)) {
  root.classList.add('no-speech');
} else {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-speak]');
    if (!button) return;
    speakText(button.dataset.speak);
  });
}

renderLetterGrid();
renderSelectedLetter();
