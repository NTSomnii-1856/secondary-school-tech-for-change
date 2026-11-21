(() => {
  'use strict';

  const lines = value => value.join('\n');
  const card = (command, example, meaning, status = 'new') => ({command, example, meaning, status});
  const stage = (title, learn, steps, snippet, check, notebook, hint) => ({title, learn, steps, snippet, check, notebook, ...(hint ? {hint} : {})});

  const setup = lines([
    'from machine import Pin', 'import time', 'import random', '',
    'rled = Pin(15, Pin.OUT)', 'yled = Pin(13, Pin.OUT)', 'gled = Pin(14, Pin.OUT)', '',
    'speed = 1'
  ]);
  const pins = card('Pin()', 'rled = Pin(15, Pin.OUT)\nyled = Pin(13, Pin.OUT)\ngled = Pin(14, Pin.OUT)', [
    'Our class wiring. Each name stores one LED output.',
    'Схема с урока. Каждое имя хранит выход одного светодиода.',
    '课堂接线。每个名称保存一盏 LED 的输出。',
    'החיווט מהשיעור. כל שם שומר פלט של נורית אחת.'
  ], 'known');
  const imports = card('import', 'from machine import Pin\nimport time\nimport random', [
    'Import makes tools available. Pin controls outputs, time provides waits and random provides random choices.',
    'Импорт подключает инструменты. Pin управляет выходами, time даёт паузы, random — случайный выбор.',
    'import 让程序可以使用工具。Pin 控制输出，time 提供等待，random 提供随机选择。',
    'import נותן גישה לכלים. Pin שולט בפלטים, time מאפשר המתנות ו־random מאפשר בחירות אקראיות.'
  ], 'known');
  const indexing = card('leds[0]', 'leds = [rled, yled, gled]\nleds[0].value(1)', [
    'A list keeps items in order. Positions start at 0. Position 0 is red, 1 is yellow and 2 is green.',
    'Список хранит элементы по порядку. Позиции начинаются с 0. Позиция 0 — красный, 1 — жёлтый, 2 — зелёный.',
    '列表按顺序保存项目。位置从 0 开始。位置 0 是红灯，1 是黄灯，2 是绿灯。',
    'רשימה שומרת פריטים לפי הסדר. המיקומים מתחילים ב־0. מיקום 0 הוא אדום, 1 הוא צהוב ו־2 הוא ירוק.'
  ]);
  const value = card('.value() / time.sleep()', 'leds[0].value(1)\ntime.sleep(speed)\nleds[0].value(0)\ntime.sleep(speed)', [
    '1 turns the LED on. 0 turns it off. With speed = 1, each wait lasts one second.',
    '1 включает светодиод. 0 выключает. При speed = 1 каждая пауза длится секунду.',
    '1 开灯，0 关灯。speed = 1 时，每次等待一秒。',
    '1 מדליק את הנורית. 0 מכבה אותה. כש־speed = 1, כל המתנה נמשכת שנייה.'
  ], 'known');
  const random = card('random.randint(0, 2)', 'number = random.randint(0, 2)', [
    'Picks a whole number, 0, 1 or 2. Use it as a list position. The same number can appear again.',
    'Выбирает целое число 0, 1 или 2. Это позиция в списке. Одно число может выпасть снова.',
    '随机选择整数 0、1 或 2，用作列表位置。同一个数字可以再次出现。',
    'בוחר מספר שלם, 0, 1 או 2. משתמשים בו כמיקום ברשימה. אותו מספר יכול להופיע שוב.'
  ]);
  const orderCard = card('order = order + str(number + 1)', 'order = ""\nnumber = 0\norder = order + str(number + 1)', [
    'Players use 1, 2 and 3. Add 1 to the position, turn it into text with str(), then attach it to order. Here order becomes "1".',
    'Игрок использует 1, 2 и 3. Прибавь 1 к позиции, преврати число в текст через str() и добавь его в order. Здесь order станет "1".',
    '玩家使用 1、2、3。给位置加 1，用 str() 转成文本，再拼接到 order 后面。这里 order 变成 "1"。',
    'השחקן משתמש ב־1, 2 ו־3. מוסיפים 1 למיקום, הופכים לטקסט בעזרת str() ומצרפים ל־order. כאן order הופך ל־"1".'
  ]);
  const loop = card('for i in range(3)', 'for i in range(3):\n    print(i)', [
    'Runs the indented lines three times. i is 0, then 1, then 2.',
    'Выполняет строки с отступом три раза. i равен 0, затем 1, затем 2.',
    '把缩进的代码运行三次。i 依次是 0、1、2。',
    'מריץ את השורות המוזחות שלוש פעמים. i הוא 0, אחר כך 1 ואז 2.'
  ], 'known');
  const inputCard = card('input()', 'answer = input("Guess the order: ")', [
    'Waits for Enter and stores the typed answer as text. Click the Wokwi terminal to type.',
    'Ждёт Enter и сохраняет ответ как текст. Для ввода нажми на терминал Wokwi.',
    '等待按 Enter，把输入保存为文本。点击 Wokwi 终端后输入。',
    'ממתין ל־Enter ושומר את התשובה כטקסט. לחצו במסוף של Wokwi כדי להקליד.'
  ], 'known');
  const ifCard = card('answer == order', 'if answer == order:\n    print("Correct!")\nelse:\n    print("Wrong!")', [
    'Compares the whole answer with this round’s recorded order. Every digit and its position must match.',
    'Сравнивает весь ответ с порядком этого раунда. Должны совпасть все цифры и их места.',
    '把完整答案与本轮记录的顺序比较。每个数字及其位置都要相同。',
    'משווה את כל התשובה לסדר שנרשם בסיבוב הזה. כל ספרה והמיקום שלה צריכים להתאים.'
  ], 'known');
  const whileCard = card('while True', 'while True:\n    print("New round")', [
    'Repeats the indented block until you press Stop. Put order = "" at the start of that block to clear the previous answer.',
    'Повторяет блок с отступом до нажатия Stop. Помести order = "" в начало блока, чтобы очистить прошлый ответ.',
    '不断重复缩进的代码，直到点击 Stop。把 order = "" 放在该代码块开头，清除上一轮答案。',
    'חוזר על הבלוק המוזח עד שלוחצים Stop. שימו order = "" בתחילת הבלוק כדי לנקות את התשובה הקודמת.'
  ]);

  const mainStages = [
    stage(
      ['Choose an LED by position', 'Выбери светодиод по позиции', '按位置选择 LED', 'בחרו נורית לפי מיקום'],
      ['New idea · list positions start at 0.', 'Новая идея · позиции списка начинаются с 0.', '新概念 · 列表位置从 0 开始。', 'רעיון חדש · המיקומים ברשימה מתחילים ב־0.'],
      [
        ['Continue your class Pico project. For a fresh project, use the wiring panel. Copy Starter code into main.py.', 'Продолжи проект Pico с урока. Для нового проекта используй панель схемы. Скопируй стартовый код в main.py.', '继续使用课堂 Pico 项目。若新建项目，使用接线面板。把起始代码复制到 main.py。', 'המשיכו בפרויקט ה־Pico מהשיעור. לפרויקט חדש השתמשו בלוח החיווט. העתיקו את קוד ההתחלה אל main.py.'],
        ['Add the list and flash below speed = 1. Run, then change both [0] positions to [1] and run again.', 'Под speed = 1 добавь список и вспышку. Запусти, затем замени обе позиции [0] на [1] и запусти снова.', '在 speed = 1 下方加入列表和闪灯代码。运行，再把两处 [0] 改为 [1]，重新运行。', 'הוסיפו את הרשימה וההבהוב מתחת ל־speed = 1. הריצו, ואז שנו את שני המיקומים [0] ל־[1] והריצו שוב.']
      ],
      'leds = [rled, yled, gled]\n\nleds[0].value(1)\ntime.sleep(speed)\nleds[0].value(0)\ntime.sleep(speed)',
      ['[0] flashes red. [1] flashes yellow. Which position will flash green?', '[0] мигает красным. [1] — жёлтым. Какая позиция включит зелёный?', '[0] 闪红灯，[1] 闪黄灯。哪个位置会闪绿灯？', '[0] מהבהב באדום. [1] מהבהב בצהוב. איזה מיקום יפעיל ירוק?'],
      [indexing, pins, value, imports]
    ),
    stage(
      ['Let the computer choose', 'Пусть компьютер выберет', '让电脑选择', 'תנו למחשב לבחור'],
      ['New idea · choose a random list position.', 'Новая идея · выбери случайную позицию списка.', '新概念 · 随机选择列表位置。', 'רעיון חדש · בוחרים מיקום אקראי ברשימה.'],
      [
        ['Keep the list. Replace the four flash lines with the snippet below.', 'Оставь список. Замени четыре строки вспышки фрагментом ниже.', '保留列表。用下方片段替换四行闪灯代码。', 'השאירו את הרשימה. החליפו את ארבע שורות ההבהוב בקטע שלמטה.'],
        ['Run several times. Watch which LED the number chooses.', 'Запусти несколько раз. Посмотри, какой светодиод выбирает число.', '运行几次，观察数字选中了哪盏灯。', 'הריצו כמה פעמים. צפו איזו נורית המספר בוחר.']
      ],
      'number = random.randint(0, 2)\nleds[number].value(1)\ntime.sleep(speed)\nleds[number].value(0)\ntime.sleep(speed)',
      ['One LED flashes each run. A colour can repeat. Why is 3 outside this list’s positions?', 'За запуск мигает один светодиод. Цвет может повториться. Почему 3 не подходит как позиция этого списка?', '每次运行闪一盏灯，颜色可以重复。为什么 3 不能作为这个列表的位置？', 'בכל הרצה מהבהבת נורית אחת. צבע יכול לחזור. למה 3 אינו מיקום ברשימה הזאת?'],
      [random, indexing, imports]
    ),
    stage(
      ['Record the player’s digit', 'Запиши цифру для игрока', '记录玩家使用的数字', 'רשמו את הספרה לשחקן'],
      ['New idea · record a light as text.', 'Новая идея · запиши свет как текст.', '新概念 · 把灯光记录成文本。', 'רעיון חדש · מתעדים אור כטקסט.'],
      [
        ['Add order = "" just before number = random.randint(0, 2). This starts an empty text record.', 'Добавь order = "" перед number = random.randint(0, 2). Это пустая строка для записи.', '在 number = random.randint(0, 2) 前加入 order = ""，建立空的文本记录。', 'הוסיפו order = "" לפני number = random.randint(0, 2). כך מתחילים רישום טקסט ריק.'],
        ['Add the record line just after the random choice. Put print(order) after the flash and run.', 'После случайного выбора добавь строку записи. Поставь print(order) после вспышки и запусти.', '在随机选择之后加入记录这一行。在闪灯之后写 print(order)，然后运行。', 'הוסיפו את שורת הרישום מיד אחרי הבחירה האקראית. שימו print(order) אחרי ההבהוב והריצו.']
      ],
      'order = ""\nnumber = random.randint(0, 2)\norder = order + str(number + 1)\n# Keep your flash lines here.\nprint(order)',
      ['The printed digit matches the LED. Red = 1, yellow = 2, green = 3.', 'Напечатанная цифра совпадает со светодиодом. Красный = 1, жёлтый = 2, зелёный = 3.', '显示的数字与灯相符。红 = 1，黄 = 2，绿 = 3。', 'הספרה שמודפסת מתאימה לנורית. אדום = 1, צהוב = 2, ירוק = 3.'],
      [orderCard, random],
      ['Trace a red choice. number is 0, number + 1 is 1, str(1) is "1".', 'Проследи красный выбор. number равен 0, number + 1 даёт 1, str(1) даёт "1".', '以红灯为例。number 是 0，number + 1 是 1，str(1) 是文本 "1"。', 'עקבו אחרי בחירה באדום. number הוא 0, number + 1 הוא 1, ו־str(1) הוא "1".']
    ),
    stage(
      ['Build three flashes', 'Собери три вспышки', '组成三次闪灯', 'בנו שלושה הבהובים'],
      ['Reuse your for loop to record three choices.', 'Используй знакомый цикл for для трёх выборов.', '用熟悉的 for 循环记录三次选择。', 'השתמשו בלולאת for המוכרת כדי לתעד שלוש בחירות.'],
      [
        ['Keep order = "" above the loop. Add for i in range(3): below it.', 'Оставь order = "" перед циклом. Ниже добавь for i in range(3):.', '把 order = "" 保留在循环前，在下方加入 for i in range(3):。', 'השאירו order = "" לפני הלולאה. הוסיפו מתחתיו for i in range(3):.'],
        ['Indent the random choice, record line and four flash lines by four spaces. Keep print(order) at the left margin, after the loop.', 'Сделай отступ в четыре пробела у выбора числа, записи и четырёх строк вспышки. Оставь print(order) без отступа после цикла.', '把随机选择、记录以及四行闪灯代码缩进四个空格。循环结束后，print(order) 从最左边开始。', 'הזיחו בארבעה רווחים את הבחירה האקראית, הרישום וארבע שורות ההבהוב. השאירו print(order) בשוליים אחרי הלולאה.']
      ],
      'order = ""\nfor i in range(3):\n    # Move your random choice, record and flash lines here.\nprint(order)',
      ['Three flashes produce three digits. Repeated colours still have a dark gap.', 'Три вспышки дают три цифры. Повторяющиеся цвета разделены тёмной паузой.', '三次闪灯产生三个数字。重复颜色之间也有熄灯间隔。', 'שלושה הבהובים נותנים שלוש ספרות. גם בין צבעים חוזרים יש הפסקה חשוכה.'],
      [loop, orderCard, value]
    ),
    stage(
      ['Check the player’s guess', 'Проверь ответ игрока', '检查玩家的答案', 'בדקו את הניחוש'],
      ['Reuse input() and if to check this round’s order.', 'Используй знакомые input() и if для проверки порядка раунда.', '用熟悉的 input() 和 if 检查本轮顺序。', 'השתמשו ב־input() וב־if המוכרים לבדיקת הסדר בסיבוב.'],
      [
        ['Remove the temporary print(order). After the loop, ask for the guess and compare answer with order.', 'Удали временный print(order). После цикла попроси ответ и сравни answer с order.', '删除临时的 print(order)。循环结束后询问答案，并比较 answer 和 order。', 'מחקו את print(order) הזמני. אחרי הלולאה בקשו ניחוש והשוו את answer ל־order.'],
        ['Run. Click the Wokwi terminal, type three digits without spaces and press Enter. Try a matching answer and a wrong answer.', 'Запусти. Нажми на терминал Wokwi, введи три цифры без пробелов и нажми Enter. Попробуй верный и неверный ответ.', '运行，点击 Wokwi 终端，连续输入三个数字，不加空格，按 Enter。试一次正确答案和一次错误答案。', 'הריצו. לחצו במסוף של Wokwi, הקלידו שלוש ספרות בלי רווחים ולחצו Enter. נסו תשובה מתאימה ותשובה שגויה.']
      ],
      'answer = input("Guess the order (red=1, yellow=2, green=3): ")\nif answer == order:\n    print("Correct!")\nelse:\n    print("Wrong!")\n    print("The answer was", order)',
      ['A matching guess prints Correct! A wrong guess reveals that round’s answer.', 'Верный ответ выводит Correct! Неверный показывает порядок этого раунда.', '正确答案显示 Correct!。错误答案会显示本轮正确顺序。', 'ניחוש מתאים מדפיס Correct! ניחוש שגוי מציג את הסדר של הסיבוב הזה.'],
      [inputCard, ifCard]
    ),
    stage(
      ['Play another round', 'Сыграй ещё раунд', '再玩一轮', 'שחקו עוד סיבוב'],
      ['New idea · while True repeats a whole round.', 'Новая идея · while True повторяет весь раунд.', '新概念 · while True 重复完整的一轮。', 'רעיון חדש · while True חוזר על סיבוב שלם.'],
      [
        ['Add while True: after leds = [rled, yled, gled]. Move the whole round, from order = "" to the final print, inside it.', 'Добавь while True: после leds = [rled, yled, gled]. Перемести весь раунд, от order = "" до последнего print, внутрь.', '在 leds = [rled, yled, gled] 后加入 while True:。把 order = "" 到最后一行 print 的整轮代码放进去。', 'הוסיפו while True: אחרי leds = [rled, yled, gled]. העבירו לתוכו את הסיבוב כולו, מ־order = "" עד ההדפסה האחרונה.'],
        ['Add four spaces to every line of the round. Play two rounds, then press Stop.', 'Добавь четыре пробела к каждой строке раунда. Сыграй два раунда и нажми Stop.', '给整轮中的每一行再加四个空格。玩两轮后点击 Stop。', 'הוסיפו ארבעה רווחים לכל שורה בסיבוב. שחקו שני סיבובים ולחצו Stop.']
      ],
      'while True:\n    order = ""\n    # Move the rest of your round here.',
      ['The next round follows each answer. Each order has exactly three digits. Where must order be cleared?', 'После ответа начинается новый раунд. В каждом порядке ровно три цифры. Где нужно очищать order?', '每次回答后开始新一轮，每轮恰好三个数字。应该在哪里清空 order？', 'אחרי כל תשובה מתחיל סיבוב חדש. בכל סדר יש בדיוק שלוש ספרות. איפה צריך לנקות את order?'],
      [whileCard, loop],
      ['Inside while use four spaces. The flash lines inside for now use eight. Keep the guess after for and inside while.', 'Внутри while — четыре пробела. Строки вспышки внутри for теперь имеют восемь. Ввод ответа находится после for, но внутри while.', 'while 内缩进四个空格，for 内的闪灯代码现在缩进八个。询问答案放在 for 之后、while 之内。', 'בתוך while משתמשים בארבעה רווחים. שורות ההבהוב בתוך for מקבלות עכשיו שמונה. בקשת הניחוש נשארת אחרי for ובתוך while.']
    )
  ];
  mainStages.slice(0, 3).forEach(item => { item.showMap = true; });

  const scoreCard = card('score = score + 1', 'score = 0\n# Later, after a correct answer:\nscore = score + 1', [
    'Set score to 0 once, before while. Add 1 only for a correct answer.',
    'Задай score = 0 один раз перед while. Прибавляй 1 только за верный ответ.',
    '在 while 前设置一次 score = 0。只在答对时加 1。',
    'הגדירו score = 0 פעם אחת לפני while. הוסיפו 1 רק לתשובה נכונה.'
  ]);
  const betsCard = card('if / elif / else', 'if choice == "2":\n    bet = 2\nelif choice == "3":\n    bet = 3\nelse:\n    bet = 1', [
    'input() gives text. Match quoted choices to numbers. Other input uses the one-point default.',
    'input() даёт текст. Сопоставь ответы в кавычках с числами. Другой ввод означает ставку по умолчанию в один балл.',
    'input() 返回文本。把带引号的选项对应到数值。其他输入默认使用一分。',
    'input() נותן טקסט. מתאימים אפשרויות במירכאות למספרים. קלט אחר משתמש בברירת המחדל של נקודה אחת.'
  ], 'known');
  const bankCard = card('while points > 0', 'while points > 0:\n    # One round.\n\nif bet > points:\n    bet = points', [
    'while repeats while its condition is true. Continue while points remain. Cap the bet at the points available.',
    'while повторяется, пока условие верно. Продолжай, пока остаются баллы. Ограничь ставку имеющимися баллами.',
    'while 在条件为真时重复。还有积分就继续，下注最多为剩余积分。',
    'while חוזר כל עוד התנאי נכון. ממשיכים כל עוד נשארו נקודות. מגבילים את ההימור לנקודות הזמינות.'
  ]);
  const speedCard = card('speed = speed * 0.8', 'speed = speed * 0.8\nif speed < 0.2:\n    speed = 0.2', [
    'After a completed round, both waits become 80% of their previous length. The shortest wait is 0.2 seconds.',
    'После раунда обе паузы становятся равны 80% прежней длины. Минимальная пауза — 0,2 секунды.',
    '每轮完成后，两次等待都变为原来的 80%。最短等待为 0.2 秒。',
    'אחרי סיבוב שהושלם, שתי ההמתנות הופכות ל־80% מהאורך הקודם. ההמתנה הקצרה ביותר היא 0.2 שנייה.'
  ]);
  const challengeStages = [
    stage(
      ['Count correct rounds', 'Считай верные раунды', '记录答对的轮数', 'ספרו סיבובים נכונים'],
      ['Keep a score between rounds.', 'Сохраняй счёт между раундами.', '在不同轮次间保留得分。', 'שמרו ניקוד בין הסיבובים.'],
      [
        ['Add score = 0 before while. In the correct-answer branch, add 1 to score.', 'Добавь score = 0 перед while. В ветви верного ответа прибавь 1 к score.', '在 while 前加入 score = 0。答对时给 score 加 1。', 'הוסיפו score = 0 לפני while. בענף של תשובה נכונה הוסיפו 1 ל־score.'],
        ['After the if / else, print the score. Keep that print inside while.', 'После if / else выведи счёт. Оставь этот print внутри while.', '在 if / else 之后显示得分。这一行仍在 while 内。', 'אחרי if / else הדפיסו את הניקוד. השאירו את ההדפסה בתוך while.']
      ],
      '# Inside the correct-answer branch:\nscore = score + 1\n\n# After the if / else, still inside while:\nprint("Score:", score)',
      ['Two correct rounds and one wrong round give score 2. Why would score = 0 inside while lose your total?', 'Два верных раунда и один неверный дают счёт 2. Почему score = 0 внутри while обнулит итог?', '答对两轮、答错一轮后得分是 2。为什么把 score = 0 放在 while 内会丢失总分？', 'שני סיבובים נכונים וסיבוב שגוי נותנים ניקוד 2. למה score = 0 בתוך while ימחק את הסכום?'],
      [scoreCard, whileCard]
    ),
    stage(
      ['Risk pretend points', 'Рискни игровыми баллами', '用游戏积分下注', 'סכנו נקודות דמיוניות'],
      ['Choose a small pretend-point bet before each round.', 'Выбирай небольшую ставку игровыми баллами до раунда.', '每轮开始前选择少量游戏积分下注。', 'בחרו הימור קטן בנקודות דמיוניות לפני כל סיבוב.'],
      [
        ['Add points = 10 before while. Change while True: to while points > 0:.', 'Добавь points = 10 перед while. Замени while True: на while points > 0:.', '在 while 前加入 points = 10。把 while True: 改为 while points > 0:。', 'הוסיפו points = 10 לפני while. החליפו while True: ב־while points > 0:.'],
        ['At the start of the round, ask for a bet of 1, 2 or 3. Use the snippet to turn the choice into a number.', 'В начале раунда спроси ставку 1, 2 или 3. Фрагмент ниже превращает выбор в число.', '每轮开始时询问下注 1、2 或 3 分。用下方片段把选择转为数字。', 'בתחילת הסיבוב בקשו הימור של 1, 2 או 3. השתמשו בקטע כדי להפוך את הבחירה למספר.'],
        ['Correct answer adds bet to points. Wrong answer subtracts bet. Print points after the check. Keep score counting correct rounds.', 'Верный ответ прибавляет bet к points. Неверный вычитает bet. После проверки выведи points. score по-прежнему считает верные раунды.', '答对时 points 加 bet，答错时减 bet。判断后显示 points。score 继续记录答对轮数。', 'תשובה נכונה מוסיפה bet ל־points. תשובה שגויה מחסירה bet. הדפיסו points אחרי הבדיקה. score ממשיך לספור סיבובים נכונים.']
      ],
      'choice = input("Bet 1, 2 or 3 pretend points: ")\nif choice == "1":\n    bet = 1\nelif choice == "2":\n    bet = 2\nelif choice == "3":\n    bet = 3\nelse:\n    bet = 1\n    print("Using a 1-point bet.")\nif bet > points:\n    bet = points',
      ['From 10 points, win a 2-point bet to reach 12. Lose a 3-point bet to reach 9. Empty input uses 1. The game ends at 0.', 'С 10 баллов выиграй ставку 2 и получи 12. Проиграй ставку 3 и получи 9. Пустой ввод даёт 1. Игра кончается при 0.', '从 10 分开始，下注 2 分并答对得到 12 分，再下注 3 分并答错剩 9 分。空输入默认 1 分。积分到 0 时结束。', 'מ־10 נקודות, זכו בהימור של 2 והגיעו ל־12. הפסידו הימור של 3 והגיעו ל־9. קלט ריק משתמש ב־1. המשחק מסתיים ב־0.'],
      [betsCard, bankCard, scoreCard],
      ['Place the bet before order = "". The snippet belongs inside while, so indent all of it four more spaces.', 'Ставка идёт перед order = "". Весь фрагмент находится внутри while — добавь к нему четыре пробела.', '下注放在 order = "" 前。整个片段属于 while 内，因此所有行再缩进四个空格。', 'ההימור בא לפני order = "". כל הקטע שייך לתוך while, לכן הזיחו את כולו בארבעה רווחים נוספים.']
    ),
    stage(
      ['Make the next round faster', 'Ускорь следующий раунд', '让下一轮更快', 'האיצו את הסיבוב הבא'],
      ['Shorten both waits after each completed round.', 'Укорачивай обе паузы после каждого раунда.', '每完成一轮，缩短两次等待。', 'קצרו את שתי ההמתנות אחרי כל סיבוב שהושלם.'],
      [
        ['Keep speed = 1 before while. After the answer check and totals, add the speed change inside while.', 'Оставь speed = 1 перед while. После проверки ответа и итогов добавь изменение скорости внутри while.', '把 speed = 1 保留在 while 前。在答案判断及总分显示后、while 内加入速度变化。', 'השאירו speed = 1 לפני while. אחרי בדיקת התשובה והסכומים הוסיפו את שינוי המהירות בתוך while.'],
        ['Add the lower limit. Temporarily print speed and play several rounds.', 'Добавь нижний предел. Временно выводи speed и сыграй несколько раундов.', '加入下限。暂时显示 speed，玩几轮。', 'הוסיפו את הגבול התחתון. הדפיסו זמנית את speed ושחקו כמה סיבובים.']
      ],
      'speed = speed * 0.8\nif speed < 0.2:\n    speed = 0.2\nprint("Next wait:", speed)',
      ['The waits start at 1 second, then 0.8, then about 0.64. They stay at or above 0.2. How would a slower setting affect fairness?', 'Паузы начинаются с 1 секунды, затем 0,8, затем около 0,64. Они не опускаются ниже 0,2. Как медленный режим повлияет на справедливость?', '等待先是 1 秒，再是 0.8 秒，再约为 0.64 秒，始终不低于 0.2 秒。慢速设置会怎样影响公平性？', 'ההמתנות מתחילות בשנייה, אחר כך 0.8 ואז בערך 0.64. הן נשארות לפחות 0.2. איך מצב איטי יותר ישפיע על ההוגנות?'],
      [speedCard, value],
      ['Put this after both result branches. It must run after correct and wrong answers.', 'Поставь после обеих ветвей результата. Код должен выполняться и после верного, и после неверного ответа.', '放在两个结果分支之后，确保答对和答错后都会执行。', 'שימו את הקוד אחרי שני ענפי התוצאה. הוא צריך לרוץ אחרי תשובה נכונה וגם אחרי תשובה שגויה.']
    )
  ];

  const baseCode = lines([
    setup, 'leds = [rled, yled, gled]', '',
    'while True:',
    '    order = ""',
    '    for i in range(3):',
    '        number = random.randint(0, 2)',
    '        order = order + str(number + 1)',
    '        leds[number].value(1)',
    '        time.sleep(speed)',
    '        leds[number].value(0)',
    '        time.sleep(speed)',
    '    answer = input("Guess the order (red=1, yellow=2, green=3): ")',
    '    if answer == order:',
    '        print("Correct!")',
    '    else:',
    '        print("Wrong!")',
    '        print("The answer was", order)'
  ]);
  const challengeCode = lines([
    setup, 'leds = [rled, yled, gled]', 'score = 0', 'points = 10', '',
    'while points > 0:',
    '    print("Score:", score, "Pretend points:", points)',
    '    choice = input("Bet 1, 2 or 3 pretend points: ")',
    '    if choice == "1":',
    '        bet = 1',
    '    elif choice == "2":',
    '        bet = 2',
    '    elif choice == "3":',
    '        bet = 3',
    '    else:',
    '        bet = 1',
    '        print("Using a 1-point bet.")',
    '    if bet > points:',
    '        bet = points',
    '    print("This bet:", bet)',
    '    order = ""',
    '    for i in range(3):',
    '        number = random.randint(0, 2)',
    '        order = order + str(number + 1)',
    '        leds[number].value(1)',
    '        time.sleep(speed)',
    '        leds[number].value(0)',
    '        time.sleep(speed)',
    '    answer = input("Guess the order (red=1, yellow=2, green=3): ")',
    '    if answer == order:',
    '        print("Correct!")',
    '        score = score + 1',
    '        points = points + bet',
    '    else:',
    '        print("Wrong!")',
    '        print("The answer was", order)',
    '        points = points - bet',
    '    print("Score:", score, "Pretend points:", points)',
    '    speed = speed * 0.8',
    '    if speed < 0.2:',
    '        speed = 0.2',
    '    print("Next wait:", speed)', '',
    'print("Game over. Final score:", score)'
  ]);

  const figure = {
    file: 'pico-class-traffic.svg',
    caption: [
      'Red GP15, yellow GP13, green GP14. Player digits are 1, 2, 3. List positions are 0, 1, 2.',
      'Красный GP15, жёлтый GP13, зелёный GP14. Цифры игрока — 1, 2, 3. Позиции списка — 0, 1, 2.',
      '红灯 GP15，黄灯 GP13，绿灯 GP14。玩家数字为 1、2、3，列表位置为 0、1、2。',
      'אדום GP15, צהוב GP13, ירוק GP14. ספרות השחקן הן 1, 2, 3. מיקומי הרשימה הם 0, 1, 2.'
    ]
  };
  const common = {
    ...window.PICO_CLASS_CIRCUIT,
    figure,
    open: ['Open a new Pico project', 'Открыть новый проект Pico', '新建 Pico 项目', 'פתחו פרויקט Pico חדש']
  };
  const lesson = {
    year: 8,
    lesson: 8,
    platform: ['Python · Wokwi Pico', 'Python · Wokwi Pico', 'Python · Wokwi Pico', 'Python · Wokwi Pico'],
    url: 'https://ntsomnii-1856.github.io/secondary-school-tech-for-change/year-8/week-8-memory-game/',
    title: ['Build a random light memory game', 'Собери игру со случайными огнями', '制作随机灯光记忆游戏', 'בנו משחק זיכרון עם אורות אקראיים'],
    main: {
      ...common,
      title: ['Build the game', 'Собери игру', '制作游戏', 'בנו את המשחק'],
      start: [
        'How can the program remember the lights it shows? Build one part, run it, then add the next.',
        'Как программа запомнит показанные огни? Собери часть, проверь её и добавь следующую.',
        '程序如何记住自己闪过的灯？完成一小部分，运行检查，再加下一部分。',
        'איך התוכנית תזכור את האורות שהיא מציגה? בנו חלק אחד, הריצו אותו והוסיפו את הבא.'
      ],
      learn: [
        'Build the class program using a list, random choices and a text record.',
        'Собери программу с урока из списка, случайных выборов и текстовой записи.',
        '用列表、随机选择和文本记录搭建课堂程序。',
        'בנו את התוכנית מהשיעור בעזרת רשימה, בחירות אקראיות ורישום טקסט.'
      ],
      starter: setup,
      stages: mainStages,
      notebook: [indexing, pins, imports, random, orderCard, loop, inputCard, ifCard, whileCard],
      steps: mainStages.map(item => item.title),
      notes: mainStages.map(item => item.check),
      facts: mainStages[0].learn,
      code: mainStages[0].snippet,
      done: [
        'Each round shows three random flashes and checks the typed order. Another round follows each answer.',
        'Каждый раунд показывает три случайные вспышки и проверяет ответ. После ответа начинается новый раунд.',
        '每轮闪三次随机灯光并检查输入顺序，每次回答后开始新一轮。',
        'בכל סיבוב יש שלושה הבהובים אקראיים ובדיקת הסדר שהוקלד. אחרי כל תשובה מתחיל סיבוב נוסף.'
      ]
    },
    extra: {
      ...common,
      title: ['Score, pretend points and speed', 'Счёт, игровые баллы и скорость', '得分、游戏积分与速度', 'ניקוד, נקודות דמיוניות ומהירות'],
      start: [
        'Continue your working random game. Add one challenge, test it, then choose the next.',
        'Продолжи свою игру со случайными огнями. Добавь одно усложнение, проверь и переходи дальше.',
        '继续修改已经完成的随机游戏。加入一个挑战，检查后再选下一个。',
        'המשיכו במשחק האקראי שבניתם. הוסיפו אתגר אחד, בדקו אותו ואז בחרו את הבא.'
      ],
      learn: [
        'Keep results between rounds and tune the difficulty.',
        'Сохраняй результаты между раундами и меняй сложность.',
        '在不同轮次间保留结果，并调整难度。',
        'שמרו תוצאות בין הסיבובים והתאימו את רמת הקושי.'
      ],
      stages: challengeStages,
      notebook: [scoreCard, betsCard, bankCard, speedCard],
      steps: challengeStages.map(item => item.title),
      notes: challengeStages.map(item => item.check),
      facts: challengeStages[0].learn,
      code: challengeStages[0].snippet,
      done: [
        'The score counts correct rounds. Pretend points change by the bet. Each completed round shortens the waits, with a 0.2-second minimum.',
        'Счёт показывает верные раунды. Игровые баллы меняются на величину ставки. Каждый раунд укорачивает паузы до минимума 0,2 секунды.',
        'score 记录答对轮数，游戏积分按下注变化，每完成一轮就缩短等待，最短为 0.2 秒。',
        'הניקוד סופר סיבובים נכונים. הנקודות הדמיוניות משתנות לפי ההימור. כל סיבוב שהושלם מקצר את ההמתנות עד למינימום של 0.2 שנייה.'
      ]
    },
    notebook: {
      main: [indexing, pins, imports, random, orderCard, loop, inputCard, ifCard, whileCard],
      extra: []
    },
    teacher: {
      title: ['Teacher guide and solutions', 'Руководство и решения для учителя', '教师指南与参考答案', 'מדריך ופתרונות למורה'],
      guide: [
        'Period 1 is 40 minutes. Use 5 minutes to trace and check, 25 minutes to build selected checkpoints, 8 minutes for one challenge if ready and 2 minutes for an exit explanation. Continue unfinished coding in a later lesson. Period 2 is Beehive research. Begin by asking which LED leds[1] selects. Model a red choice through 0 → 1 → "1". At each checkpoint ask students to predict, run and explain one result. Keep the pin setup and current notebook card available. Check the position-to-digit mapping, the reset of order inside while and the guess outside for. If order grows beyond three digits, inspect the reset. If repeated colours merge, restore the dark wait. For greater depth, test boundary bets and justify the speed limit. Use the solution to discuss a specific step. Revisit checkpoints students cannot yet explain independently.',
        'Первый урок длится 40 минут. Отведи 5 минут на разбор и проверку, 25 — на выбранные этапы, 8 — на одно усложнение при готовности и 2 — на итоговое объяснение. Незавершённый код продолжите на следующем занятии по программированию. Второй урок — исследование для проекта Beehive. Сначала спроси, какой светодиод выбирает leds[1]. Покажи красный выбор по цепочке 0 → 1 → "1". На каждом этапе попроси предсказать, запустить и объяснить результат. Оставь настройку выводов и нужную карточку справочника. Проверь соответствие позиций цифрам, очистку order внутри while и ввод за пределами for. Если запись длиннее трёх цифр, проверь очистку. Если вспышки сливаются, верни паузу без света. Для углубления предложи граничные ставки и обоснование предела скорости. Используй решение для конкретного шага. Вернись к этапам, которые пока не удаётся объяснить самостоятельно.',
        '第一课时为 40 分钟：5 分钟追踪与检查，25 分钟完成选定检查点，准备好的学生用 8 分钟做一个挑战，最后 2 分钟作出口解释。未完成的编程留到以后的编程课继续，第二课时用于 Beehive 研究。先问 leds[1] 会选中哪盏灯，演示红灯的 0 → 1 → "1" 过程。每个检查点让学生预测、运行并解释一个结果，提供引脚设置与当前笔记卡。重点检查位置与玩家数字的对应、在 while 内清空 order，以及在 for 外询问答案。记录超过三位时检查清空位置，重复颜色连在一起时恢复熄灯等待。深入挑战可测试边界下注并解释速度下限。参考答案用于具体步骤。回顾尚无法独立解释的检查点。',
        'השיעור הראשון נמשך 40 דקות. הקדישו 5 דקות למעקב ובדיקה, 25 דקות לבניית תחנות נבחרות, 8 דקות לאתגר אחד למי שמוכן ו־2 דקות להסבר יציאה. המשיכו קוד שלא הושלם בשיעור תכנות עתידי. השיעור השני מיועד למחקר Beehive. התחילו בשאלה איזו נורית leds[1] בוחר והדגימו אדום דרך 0 → 1 → "1". בכל תחנה בקשו לצפות, להריץ ולהסביר תוצאה אחת. השאירו את הגדרת הפינים וכרטיס המחברת זמינים. בדקו התאמה בין מיקומים לספרות, איפוס order בתוך while וניחוש מחוץ ל־for. אם הרישום ארוך משלוש ספרות, בדקו את האיפוס. אם צבעים חוזרים מתחברים, החזירו את ההמתנה החשוכה. להעמקה בדקו הימורים בקצוות והסבירו את גבול המהירות. השתמשו בפתרון לדיון בשלב מסוים. חזרו לתחנות שעדיין קשה להסביר באופן עצמאי.'
      ],
      code: baseCode,
      challengeCode
    }
  };

  window.FOCUSED_LESSON = {
    lesson,
    ui: window.FOCUSED_LESSON.ui,
    links: {picoClass: window.PICO_CLASS_WOKWI}
  };
})();
