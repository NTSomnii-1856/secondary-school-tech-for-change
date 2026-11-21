(() => {
  'use strict';

  const lines = value => value.join('\n');
  const card = (command, example, meaning, status = 'new') => ({command, example, meaning, status});
  const stage = (title, learn, steps, snippet, check, notebook, hint) => ({title, learn, steps, snippet, check, notebook, ...(hint ? {hint} : {})});

  const setup = lines([
    'from machine import Pin', 'import time', 'import random', '',
    'rled = Pin(15, Pin.OUT)', 'yled = Pin(13, Pin.OUT)', 'gled = Pin(14, Pin.OUT)', '',
    'rled.value(0)', 'yled.value(0)', 'gled.value(0)', '',
    'speed = 1'
  ]);
  const pins = card('Pin()', 'rled = Pin(15, Pin.OUT)\nyled = Pin(13, Pin.OUT)\ngled = Pin(14, Pin.OUT)', [
    'Pin.OUT makes a pin send an electrical signal. rled controls red on GP15, yled controls yellow on GP13 and gled controls green on GP14.',
    'Pin.OUT настраивает вывод для подачи сигнала. rled управляет красным на GP15, yled — жёлтым на GP13, gled — зелёным на GP14.',
    'Pin.OUT 把引脚设置成输出信号。rled 控制 GP15 红灯，yled 控制 GP13 黄灯，gled 控制 GP14 绿灯。',
    'Pin.OUT מגדיר פין לשליחת אות. rled שולט באדום ב־GP15, yled בצהוב ב־GP13 ו־gled בירוק ב־GP14.'
  ], 'known');
  const imports = card('import', 'from machine import Pin\nimport time\nimport random', [
    'These three lines load the tools used below. Pin controls LEDs, time.sleep() pauses and random.randint() chooses a number. Keep them at the top of main.py.',
    'Эти три строки подключают инструменты. Pin управляет светодиодами, time.sleep() делает паузу, random.randint() выбирает число. Оставь их в начале main.py.',
    '这三行加载接下来使用的工具。Pin 控制 LED，time.sleep() 暂停，random.randint() 选择数字。把它们放在 main.py 顶部。',
    'שלוש השורות טוענות את הכלים להמשך. Pin שולט בנוריות, time.sleep() ממתין ו־random.randint() בוחר מספר. השאירו אותן בראש main.py.'
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
    'order stores the answer to remember. "" starts it empty. number + 1 changes position 0 into player digit 1. str() makes text, and + adds it to the end. Here order becomes "1".',
    'order хранит ответ. "" очищает его. number + 1 превращает позицию 0 в цифру игрока 1. str() делает текст, а + добавляет его в конец. Здесь order станет "1".',
    'order 保存要记住的答案。"" 表示开始时为空。number + 1 把位置 0 变成玩家数字 1。str() 转成文本，+ 把它接到末尾。这里 order 变成 "1"。',
    'order שומר את התשובה לזכור. "" מתחיל אותו ריק. number + 1 הופך מיקום 0 לספרה 1 של השחקן. str() הופך לטקסט ו־+ מצרף לסוף. כאן order הופך ל־"1".'
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
      ['Use a list to select one of the three LEDs.', 'Выбери один из трёх светодиодов через список.', '用列表选择三盏 LED 中的一盏。', 'השתמשו ברשימה לבחירת אחת משלוש הנוריות.'],
      [
        ['Complete the setup above. In main.py, click the end of speed = 1 and press Enter twice.', 'Выполни настройку выше. В main.py нажми в конце speed = 1 и дважды нажми Enter.', '完成上方设置。在 main.py 中点击 speed = 1 末尾，按两次 Enter。', 'השלימו את ההגדרה שלמעלה. ב־main.py לחצו בסוף speed = 1 ולחצו פעמיים Enter.'],
        ['Paste this step’s code there. Press the green Run button. Red should light for one second, then turn off.', 'Вставь туда код этого шага. Нажми зелёную кнопку Run. Красный должен загореться на секунду и погаснуть.', '在这里粘贴本步骤代码。点击绿色 Run 按钮。红灯应亮一秒后熄灭。', 'הדביקו שם את הקוד של השלב. לחצו על כפתור Run הירוק. האדום צריך לדלוק לשנייה ואז לכבות.'],
        ['Press Stop. Change both [0] positions to [1], then press Run to test yellow.', 'Нажми Stop. Замени обе позиции [0] на [1], затем Run для проверки жёлтого.', '点击 Stop。把两处 [0] 改为 [1]，再点击 Run 测试黄灯。', 'לחצו Stop. שנו את שני המיקומים [0] ל־[1] ואז לחצו Run לבדיקת הצהוב.']
      ],
      'leds = [rled, yled, gled]\n\nleds[0].value(1)\ntime.sleep(speed)\nleds[0].value(0)\ntime.sleep(speed)',
      ['[0] flashes red. [1] flashes yellow. Which position will flash green?', '[0] мигает красным. [1] — жёлтым. Какая позиция включит зелёный?', '[0] 闪红灯，[1] 闪黄灯。哪个位置会闪绿灯？', '[0] מהבהב באדום. [1] מהבהב בצהוב. איזה מיקום יפעיל ירוק?'],
      [indexing, pins, value, imports]
    ),
    stage(
      ['Let the computer choose', 'Пусть компьютер выберет', '让电脑选择', 'תנו למחשב לבחור'],
      ['Let the computer select position 0, 1 or 2.', 'Пусть компьютер выберет позицию 0, 1 или 2.', '让电脑选择位置 0、1 或 2。', 'תנו למחשב לבחור מיקום 0, 1 או 2.'],
      [
        ['Press Stop. Keep the imports, Pin lines, speed and leds list. Select the four lines after the list and replace them with this step’s code.', 'Нажми Stop. Оставь импорты, строки Pin, speed и список leds. Выдели четыре строки после списка и замени их кодом этого шага.', '点击 Stop。保留导入、Pin 设置、speed 和 leds 列表。选中列表后的四行，用本步骤代码替换。', 'לחצו Stop. השאירו את הייבוא, שורות Pin, speed ורשימת leds. סמנו את ארבע השורות שאחרי הרשימה והחליפו בקוד של השלב.'],
        ['Press Run and watch one flash. Use Stop, then Run, to try five times.', 'Нажми Run и посмотри одну вспышку. Используй Stop, затем Run, чтобы повторить пять раз.', '点击 Run 观察一次闪灯。每次点击 Stop 再点击 Run，共试五次。', 'לחצו Run וצפו בהבהוב אחד. השתמשו ב־Stop ואז Run כדי לנסות חמש פעמים.']
      ],
      'number = random.randint(0, 2)\nleds[number].value(1)\ntime.sleep(speed)\nleds[number].value(0)\ntime.sleep(speed)',
      ['One LED flashes each run. A colour can repeat. Why is 3 outside this list’s positions?', 'За запуск мигает один светодиод. Цвет может повториться. Почему 3 не подходит как позиция этого списка?', '每次运行闪一盏灯，颜色可以重复。为什么 3 不能作为这个列表的位置？', 'בכל הרצה מהבהבת נורית אחת. צבע יכול לחזור. למה 3 אינו מיקום ברשימה הזאת?'],
      [random, indexing, imports]
    ),
    stage(
      ['Record the player’s digit', 'Запиши цифру для игрока', '记录玩家使用的数字', 'רשמו את הספרה לשחקן'],
      ['Save the digit for the light that flashes.', 'Сохрани цифру вспыхнувшего светодиода.', '保存闪亮灯光对应的数字。', 'שמרו את הספרה של הנורית שמהבהבת.'],
      [
        ['Press Stop. Insert order = "" on a new line just above number = random.randint(0, 2).', 'Нажми Stop. Вставь order = "" отдельной строкой прямо перед number = random.randint(0, 2).', '点击 Stop。在 number = random.randint(0, 2) 正上方插入新行 order = ""。', 'לחצו Stop. הוסיפו order = "" בשורה חדשה ממש מעל number = random.randint(0, 2).'],
        ['Immediately below the random line, add order = order + str(number + 1). Keep the four flash lines below it.', 'Сразу под случайным выбором добавь order = order + str(number + 1). Оставь четыре строки вспышки ниже.', '在随机选择下一行加入 order = order + str(number + 1)。四行闪灯代码保留在它下方。', 'מיד מתחת לבחירה האקראית הוסיפו order = order + str(number + 1). השאירו את ארבע שורות ההבהוב מתחתיה.'],
        ['After the last time.sleep(speed), add print(order) without spaces before it. Press Run and read the digit in the terminal.', 'После последнего time.sleep(speed) добавь print(order) без пробелов в начале. Нажми Run и прочитай цифру в терминале.', '在最后一行 time.sleep(speed) 后加入 print(order)，行首不留空格。点击 Run，在终端查看数字。', 'אחרי time.sleep(speed) האחרון הוסיפו print(order) בלי רווחים בתחילת השורה. לחצו Run וקראו את הספרה במסוף.']
      ],
      'order = ""\nnumber = random.randint(0, 2)\norder = order + str(number + 1)\n# Keep your flash lines here.\nprint(order)',
      ['The printed digit matches the LED. Red = 1, yellow = 2, green = 3.', 'Напечатанная цифра совпадает со светодиодом. Красный = 1, жёлтый = 2, зелёный = 3.', '显示的数字与灯相符。红 = 1，黄 = 2，绿 = 3。', 'הספרה שמודפסת מתאימה לנורית. אדום = 1, צהוב = 2, ירוק = 3.'],
      [orderCard, random],
      ['Trace a red choice. number is 0, number + 1 is 1, str(1) is "1".', 'Проследи красный выбор. number равен 0, number + 1 даёт 1, str(1) даёт "1".', '以红灯为例。number 是 0，number + 1 是 1，str(1) 是文本 "1"。', 'עקבו אחרי בחירה באדום. number הוא 0, number + 1 הוא 1, ו־str(1) הוא "1".']
    ),
    stage(
      ['Build three flashes', 'Собери три вспышки', '组成三次闪灯', 'בנו שלושה הבהובים'],
      ['Repeat the choice and flash three times.', 'Повтори выбор и вспышку три раза.', '把选择和闪灯重复三次。', 'חזרו על הבחירה וההבהוב שלוש פעמים.'],
      [
        ['Press Stop. Insert for i in range(3): between order = "" and number = random.randint(0, 2).', 'Нажми Stop. Вставь for i in range(3): между order = "" и number = random.randint(0, 2).', '点击 Stop。在 order = "" 和 number = random.randint(0, 2) 之间插入 for i in range(3):。', 'לחצו Stop. הכניסו for i in range(3): בין order = "" לבין number = random.randint(0, 2).'],
        ['Add four spaces before each of the next six lines, from number = random.randint(0, 2) through the last time.sleep(speed).', 'Добавь четыре пробела перед каждой из следующих шести строк — от number = random.randint(0, 2) до последнего time.sleep(speed).', '给接下来六行的行首各加四个空格，从 number = random.randint(0, 2) 到最后一个 time.sleep(speed)。', 'הוסיפו ארבעה רווחים בתחילת כל אחת משש השורות הבאות, מ־number = random.randint(0, 2) עד time.sleep(speed) האחרון.'],
        ['Keep print(order) after those lines with no spaces before it. Press Run and count three flashes.', 'Оставь print(order) после этих строк без пробелов в начале. Нажми Run и посчитай три вспышки.', '把 print(order) 留在这些行之后，行首没有空格。点击 Run，数三次闪灯。', 'השאירו print(order) אחרי השורות האלה, בלי רווחים בתחילתו. לחצו Run וספרו שלושה הבהובים.']
      ],
      'order = ""\nfor i in range(3):\n    # Move your random choice, record and flash lines here.\nprint(order)',
      ['Three flashes produce three digits. Repeated colours still have a dark gap.', 'Три вспышки дают три цифры. Повторяющиеся цвета разделены тёмной паузой.', '三次闪灯产生三个数字。重复颜色之间也有熄灯间隔。', 'שלושה הבהובים נותנים שלוש ספרות. גם בין צבעים חוזרים יש הפסקה חשוכה.'],
      [loop, orderCard, value]
    ),
    stage(
      ['Check the player’s guess', 'Проверь ответ игрока', '检查玩家的答案', 'בדקו את הניחוש'],
      ['Ask for three digits and compare them with the lights shown.', 'Спроси три цифры и сравни их с показанными огнями.', '询问三个数字，并与刚才的灯光顺序比较。', 'בקשו שלוש ספרות והשוו אותן לאורות שהוצגו.'],
      [
        ['Press Stop. Delete only print(order). Paste this step’s code in its place, starting answer and if at the left margin.', 'Нажми Stop. Удали только print(order). На его место вставь код шага, начиная answer и if без отступа.', '点击 Stop，只删除 print(order)。在原处粘贴本步骤代码，answer 和 if 从最左边开始。', 'לחצו Stop. מחקו רק את print(order). הדביקו במקומו את קוד השלב, כש־answer ו־if מתחילים בשוליים.'],
        ['Press Run and watch three flashes. Click inside the Wokwi terminal, type their three digits without spaces and press Enter.', 'Нажми Run и посмотри три вспышки. Нажми внутри терминала Wokwi, введи три цифры без пробелов и нажми Enter.', '点击 Run，观察三次闪灯。点击 Wokwi 终端内部，连续输入对应三个数字，不加空格，再按 Enter。', 'לחצו Run וצפו בשלושה הבהובים. לחצו בתוך מסוף Wokwi, הקלידו את שלוש הספרות בלי רווחים ולחצו Enter.'],
        ['Use Stop, then Run, for another try. Enter 000 to test the wrong-answer message.', 'Используй Stop, затем Run для новой попытки. Введи 000, чтобы проверить сообщение об ошибке.', '点击 Stop 再点击 Run 重新尝试。输入 000，测试答错的提示。', 'השתמשו ב־Stop ואז Run לניסיון נוסף. הקלידו 000 לבדיקת ההודעה על תשובה שגויה.']
      ],
      'answer = input("Guess the order (red=1, yellow=2, green=3): ")\nif answer == order:\n    print("Correct!")\nelse:\n    print("Wrong!")\n    print("The answer was", order)',
      ['A matching guess prints Correct! A wrong guess reveals that round’s answer.', 'Верный ответ выводит Correct! Неверный показывает порядок этого раунда.', '正确答案显示 Correct!。错误答案会显示本轮正确顺序。', 'ניחוש מתאים מדפיס Correct! ניחוש שגוי מציג את הסדר של הסיבוב הזה.'],
      [inputCard, ifCard]
    ),
    stage(
      ['Play another round', 'Сыграй ещё раунд', '再玩一轮', 'שחקו עוד סיבוב'],
      ['Use while True to start another round after each answer.', 'Используй while True для нового раунда после ответа.', '用 while True 在每次回答后开始新一轮。', 'השתמשו ב־while True להתחלת סיבוב נוסף אחרי כל תשובה.'],
      [
        ['Press Stop. Insert while True: directly above order = "". Keep the imports, Pin lines, speed and leds list above while.', 'Нажми Stop. Вставь while True: прямо перед order = "". Оставь импорты, строки Pin, speed и список leds выше while.', '点击 Stop。在 order = "" 正上方插入 while True:。导入、Pin 设置、speed 和 leds 列表都留在 while 上方。', 'לחצו Stop. הוסיפו while True: ממש מעל order = "". השאירו את הייבוא, שורות Pin, speed ורשימת leds מעל while.'],
        ['Add four spaces before every line from order = "" to print("The answer was", order). Keep each line’s existing spaces too.', 'Добавь четыре пробела перед каждой строкой от order = "" до print("The answer was", order). Сохрани уже имеющиеся отступы.', '给 order = "" 到 print("The answer was", order) 之间每一行再加四个空格，原有缩进也保留。', 'הוסיפו ארבעה רווחים לפני כל שורה מ־order = "" עד print("The answer was", order). שמרו גם על הרווחים שכבר היו בכל שורה.'],
        ['Press Run. Answer two rounds in the terminal, then press Stop to end the game.', 'Нажми Run. Ответь на два раунда в терминале, затем нажми Stop для завершения.', '点击 Run，在终端回答两轮，然后点击 Stop 结束游戏。', 'לחצו Run. ענו על שני סיבובים במסוף, ואז לחצו Stop לסיום המשחק.']
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
        ['Press Stop. Add score = 0 directly below the leds list, above while, with no spaces before it.', 'Нажми Stop. Добавь score = 0 прямо под списком leds, выше while, без пробелов в начале.', '点击 Stop。在 leds 列表正下方、while 上方加入 score = 0，行首没有空格。', 'לחצו Stop. הוסיפו score = 0 ממש מתחת לרשימת leds ומעל while, בלי רווחים בתחילת השורה.'],
        ['Add score = score + 1 directly below print("Correct!") with eight spaces before it.', 'Добавь score = score + 1 прямо под print("Correct!") с восемью пробелами в начале.', '在 print("Correct!") 正下方加入 score = score + 1，行首八个空格。', 'הוסיפו score = score + 1 ממש מתחת ל־print("Correct!") עם שמונה רווחים בתחילת השורה.'],
        ['Add print("Score:", score) at the end of the program with four spaces before it. Press Run and test a correct answer, then 000.', 'В конце программы добавь print("Score:", score) с четырьмя пробелами в начале. Нажми Run, проверь верный ответ, затем 000.', '在程序最后加入 print("Score:", score)，行首四个空格。点击 Run，先测试正确答案，再输入 000。', 'בסוף התוכנית הוסיפו print("Score:", score) עם ארבעה רווחים בתחילת השורה. לחצו Run ובדקו תשובה נכונה ואז 000.']
      ],
      '# Inside the correct-answer branch:\nscore = score + 1\n\n# After the if / else, still inside while:\nprint("Score:", score)',
      ['Two correct rounds and one wrong round give score 2. Why would score = 0 inside while lose your total?', 'Два верных раунда и один неверный дают счёт 2. Почему score = 0 внутри while обнулит итог?', '答对两轮、答错一轮后得分是 2。为什么把 score = 0 放在 while 内会丢失总分？', 'שני סיבובים נכונים וסיבוב שגוי נותנים ניקוד 2. למה score = 0 בתוך while ימחק את הסכום?'],
      [scoreCard, whileCard]
    ),
    stage(
      ['Risk pretend points', 'Рискни игровыми баллами', '用游戏积分下注', 'סכנו נקודות דמיוניות'],
      ['Choose a small pretend-point bet before each round.', 'Выбирай небольшую ставку игровыми баллами до раунда.', '每轮开始前选择少量游戏积分下注。', 'בחרו הימור קטן בנקודות דמיוניות לפני כל סיבוב.'],
      [
        ['Press Stop. Add points = 10 below score = 0. Replace while True: with while points > 0:.', 'Нажми Stop. Добавь points = 10 под score = 0. Замени while True: на while points > 0:.', '点击 Stop。在 score = 0 下方加入 points = 10。把 while True: 改为 while points > 0:。', 'לחצו Stop. הוסיפו points = 10 מתחת ל־score = 0. החליפו while True: ב־while points > 0:.'],
        ['Insert this step’s code just before order = "". Add four spaces before every line of the snippet to place it inside while.', 'Вставь код шага перед order = "". Добавь четыре пробела перед каждой строкой фрагмента, чтобы он оказался внутри while.', '在 order = "" 前插入本步骤代码。给片段每行再加四个空格，放进 while 内。', 'הכניסו את קוד השלב ממש לפני order = "". הוסיפו ארבעה רווחים לפני כל שורה בקטע כדי למקם אותו בתוך while.'],
        ['Under score = score + 1, add points = points + bet. Under the wrong-answer message, add points = points - bet. Use eight spaces for both. At the end, print("Points:", points) with four spaces, then Run.', 'Под score = score + 1 добавь points = points + bet. Под сообщением неверного ответа добавь points = points - bet. У обеих строк — восемь пробелов. В конце поставь print("Points:", points) с четырьмя пробелами и нажми Run.', '在 score = score + 1 下加入 points = points + bet，在错误答案提示下加入 points = points - bet，两行都缩进八个空格。最后用四个空格缩进 print("Points:", points)，再点击 Run。', 'מתחת ל־score = score + 1 הוסיפו points = points + bet. מתחת להודעת התשובה השגויה הוסיפו points = points - bet. השתמשו בשמונה רווחים לשתיהן. בסוף הוסיפו print("Points:", points) עם ארבעה רווחים ולחצו Run.']
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
        ['Press Stop. Keep speed = 1 near the top. At the bottom, after print("Points:", points), paste this step’s code.', 'Нажми Stop. Оставь speed = 1 в начале. Внизу, после print("Points:", points), вставь код шага.', '点击 Stop。保留顶部的 speed = 1。在底部 print("Points:", points) 后粘贴本步骤代码。', 'לחצו Stop. השאירו speed = 1 ליד ההתחלה. בתחתית, אחרי print("Points:", points), הדביקו את קוד השלב.'],
        ['Add four spaces before every pasted line. The line speed = 0.2 will then have eight spaces. Press Run and play two rounds.', 'Добавь четыре пробела перед каждой вставленной строкой. У строки speed = 0.2 получится восемь пробелов. Нажми Run и сыграй два раунда.', '给粘贴的每行再加四个空格，此时 speed = 0.2 行会有八个空格。点击 Run，玩两轮。', 'הוסיפו ארבעה רווחים לפני כל שורה שהודבקה. לשורה speed = 0.2 יהיו אז שמונה רווחים. לחצו Run ושחקו שני סיבובים.']
      ],
      'speed = speed * 0.8\nif speed < 0.2:\n    speed = 0.2\nprint("Next wait:", speed)',
      ['The waits start at 1 second, then 0.8, then about 0.64. They stay at or above 0.2. How would a slower setting affect fairness?', 'Паузы начинаются с 1 секунды, затем 0,8, затем около 0,64. Они не опускаются ниже 0,2. Как медленный режим повлияет на справедливость?', '等待先是 1 秒，再是 0.8 秒，再约为 0.64 秒，始终不低于 0.2 秒。慢速设置会怎样影响公平性？', 'ההמתנות מתחילות בשנייה, אחר כך 0.8 ואז בערך 0.64. הן נשארות לפחות 0.2. איך מצב איטי יותר ישפיע על ההוגנות?'],
      [speedCard, value],
      ['Put this after both result branches. It must run after correct and wrong answers.', 'Поставь после обеих ветвей результата. Код должен выполняться и после верного, и после неверного ответа.', '放在两个结果分支之后，确保答对和答错后都会执行。', 'שימו את הקוד אחרי שני ענפי התוצאה. הוא צריך לרוץ אחרי תשובה נכונה וגם אחרי תשובה שגויה.']
    )
  ];

  const stepHelp = [
    [
      'If no LED lights, check that diagram.json shows three LEDs and that main.py contains the starter above this step’s code. Use GP15 for red, GP13 for yellow and GP14 for green.',
      'Если свет не загорается, проверь три светодиода в diagram.json и наличие стартового кода перед кодом шага в main.py. Красный — GP15, жёлтый — GP13, зелёный — GP14.',
      '若没有灯亮，检查 diagram.json 中是否有三盏 LED，以及 main.py 中本步骤前是否有起始代码。红灯用 GP15，黄灯用 GP13，绿灯用 GP14。',
      'אם שום נורית אינה נדלקת, בדקו שב־diagram.json יש שלוש נוריות ושקוד ההתחלה מופיע לפני קוד השלב ב־main.py. אדום ב־GP15, צהוב ב־GP13 וירוק ב־GP14.'
    ],
    [
      'If you see IndexError, check that randint ends at 2. If you see NameError for random, put import random at the top. Use number in both LED commands.',
      'При IndexError проверь, что randint заканчивается на 2. При NameError для random добавь import random в начало. Используй number в обеих командах светодиода.',
      '若出现 IndexError，检查 randint 的上限是 2。若 random 出现 NameError，在顶部加入 import random。两条 LED 命令中都使用 number。',
      'אם מופיע IndexError, בדקו ש־randint מסתיים ב־2. אם מופיע NameError עבור random, הוסיפו import random בראש הקובץ. השתמשו ב־number בשתי פקודות הנורית.'
    ],
    [
      'If Python reports a text-and-number error, keep str(number + 1) exactly as shown. If red prints 0, add the missing + 1 inside str().',
      'Если Python сообщает об ошибке текста и числа, оставь str(number + 1) как в примере. Если красный выводит 0, добавь + 1 внутри str().',
      '若 Python 提示文本和数字的类型错误，保留示例中的 str(number + 1)。若红灯显示 0，在 str() 内补上 + 1。',
      'אם Python מציג שגיאה בין טקסט למספר, כתבו str(number + 1) בדיוק כמו בדוגמה. אם אדום מדפיס 0, הוסיפו את + 1 בתוך str().'
    ],
    [
      'If only one digit appears, move order = "" above for. If you see IndentationError, put all six repeated lines four spaces in and print(order) at the left margin.',
      'Если появляется одна цифра, перемести order = "" выше for. При IndentationError сделай отступ в четыре пробела у шести повторяемых строк, а print(order) оставь без отступа.',
      '若只出现一个数字，把 order = "" 放到 for 上方。若出现 IndentationError，六行重复代码都缩进四个空格，print(order) 从最左边开始。',
      'אם מופיעה ספרה אחת בלבד, העבירו order = "" מעל for. אם מופיע IndentationError, הזיחו את שש השורות החוזרות בארבעה רווחים והשאירו print(order) בשוליים.'
    ],
    [
      'If typing does nothing, click inside the terminal and press Enter after the digits. If every guess fails, remove spaces from your answer and compare answer == order exactly.',
      'Если ввод не работает, нажми внутри терминала и после цифр нажми Enter. Если все ответы неверны, убери пробелы из ввода и проверь точное условие answer == order.',
      '若无法输入，点击终端内部，输入数字后按 Enter。若每次都判错，去掉答案中的空格，检查条件是否正好是 answer == order。',
      'אם ההקלדה אינה פועלת, לחצו בתוך המסוף ולחצו Enter אחרי הספרות. אם כל ניחוש נכשל, הסירו רווחים מהתשובה ובדקו שכתוב בדיוק answer == order.'
    ],
    [
      'If flashes repeat without a guess, put answer and if inside while with four spaces before them. Their print lines need eight. Keep order = "" inside while and above for.',
      'Если вспышки повторяются без вопроса, поставь answer и if внутри while с четырьмя пробелами. Их строки print требуют восьми. order = "" находится внутри while перед for.',
      '若一直闪灯却不询问答案，把 answer 和 if 放到 while 内，缩进四个空格。它们的 print 行缩进八个。order = "" 放在 while 内、for 前。',
      'אם ההבהובים חוזרים בלי בקשת ניחוש, שימו answer ו־if בתוך while עם ארבעה רווחים לפניהם. שורות ההדפסה שלהם צריכות שמונה. השאירו order = "" בתוך while ולפני for.'
    ],
    [
      'If the score stays at 1, move score = 0 above while. If it rises after a wrong guess, put score = score + 1 only below print("Correct!").',
      'Если счёт остаётся 1, перемести score = 0 выше while. Если он растёт при ошибке, оставь score = score + 1 только под print("Correct!").',
      '若得分一直是 1，把 score = 0 移到 while 上方。若答错也加分，把 score = score + 1 只放在 print("Correct!") 下方。',
      'אם הניקוד נשאר 1, העבירו score = 0 מעל while. אם הוא עולה אחרי ניחוש שגוי, שימו score = score + 1 רק מתחת ל־print("Correct!").'
    ],
    [
      'If points reset, keep points = 10 above while. If points become negative, restore if bet > points: and bet = points before the flashes. At 0, while points > 0 ends the game.',
      'Если баллы сбрасываются, оставь points = 10 выше while. Если они становятся отрицательными, верни if bet > points: и bet = points перед вспышками. При 0 условие while points > 0 завершает игру.',
      '若积分被重置，把 points = 10 放在 while 上方。若积分变成负数，在闪灯前恢复 if bet > points: 和 bet = points。积分为 0 时，while points > 0 结束游戏。',
      'אם הנקודות מתאפסות, השאירו points = 10 מעל while. אם הן הופכות לשליליות, החזירו if bet > points: ו־bet = points לפני ההבהובים. ב־0 התנאי while points > 0 מסיים את המשחק.'
    ],
    [
      'If only correct answers change the speed, move the speed block after both result branches with four spaces before it. Keep speed = 0.2 inside its if with eight spaces.',
      'Если скорость меняется только при верном ответе, перемести блок скорости после обеих ветвей с отступом четыре пробела. Строка speed = 0.2 находится внутри своего if с восемью пробелами.',
      '若只有答对才加速，把速度代码块放在两个结果分支之后，缩进四个空格。speed = 0.2 位于自己的 if 内，缩进八个空格。',
      'אם המהירות משתנה רק בתשובה נכונה, העבירו את בלוק המהירות אחרי שני ענפי התוצאה עם ארבעה רווחים לפניו. השאירו speed = 0.2 בתוך ה־if שלו עם שמונה רווחים.'
    ]
  ];
  [...mainStages, ...challengeStages].forEach((item, index) => {
    item.help = stepHelp[index];
    item.notebook = item.notebook.map((entry, cardIndex) => cardIndex === 0
      ? {...entry, check: item.check, help: item.help}
      : entry);
  });

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
  const mainSetup = {
    title: ['Set up your project', 'Подготовь проект', '设置你的项目', 'הגדירו את הפרויקט'],
    needs: [
      [
        'Use a computer with a keyboard, internet access and Wokwi open in a browser.',
        'Нужен компьютер с клавиатурой, интернетом и Wokwi в браузере.',
        '使用配有键盘、能上网的电脑，在浏览器中打开 Wokwi。',
        'השתמשו במחשב עם מקלדת, חיבור לאינטרנט ו־Wokwi פתוח בדפדפן.'
      ],
      [
        'The supplied simulation includes one Raspberry Pi Pico, red/yellow/green LEDs, three 330 Ω resistors and connecting wires.',
        'В готовой схеме симулятора есть Raspberry Pi Pico, красный, жёлтый и зелёный светодиоды, три резистора 330 Ом и провода.',
        '提供的模拟电路包含一块 Raspberry Pi Pico、红黄绿三盏 LED、三个 330 Ω 电阻及接线。',
        'ההדמיה המצורפת כוללת Raspberry Pi Pico אחד, נוריות אדומה, צהובה וירוקה, שלושה נגדים של 330 Ω וחוטי חיבור.'
      ]
    ],
    steps: [
      [
        'Click Open a new Pico project. It opens Wokwi in another tab. Keep this lesson tab open too.',
        'Нажми «Открыть новый проект Pico». Wokwi откроется в другой вкладке. Оставь вкладку урока открытой.',
        '点击“新建 Pico 项目”。Wokwi 会在另一标签页打开，也保留本课程标签页。',
        'לחצו על ״פתחו פרויקט Pico חדש״. Wokwi ייפתח בלשונית נוספת. השאירו גם את לשונית השיעור פתוחה.'
      ],
      [
        'On this page, click Copy wiring. In Wokwi, click diagram.json, select all its text and paste. You should see the Pico and three LEDs.',
        'На этой странице нажми «Скопировать схему». В Wokwi нажми diagram.json, выдели весь текст и вставь. Должны появиться Pico и три светодиода.',
        '在本页点击“复制接线”。在 Wokwi 中点击 diagram.json，全选文本并粘贴。应看到 Pico 和三盏 LED。',
        'בעמוד הזה לחצו ״העתיקו חיווט״. ב־Wokwi לחצו diagram.json, סמנו את כל הטקסט והדביקו. אמורים לראות Pico ושלוש נוריות.'
      ],
      [
        'Open Starter code on this page and copy it. In Wokwi, click main.py, select all its text and paste. Press Run to check, then Stop. The three .value(0) lines turn all lights off before the first test.',
        'Открой «Стартовый код» на этой странице и скопируй. В Wokwi нажми main.py, выдели весь текст и вставь. Для проверки нажми Run, затем Stop. Три строки .value(0) выключают весь свет перед первым тестом.',
        '打开本页“起始代码”并复制。在 Wokwi 点击 main.py，全选文本并粘贴。点击 Run 检查，再点击 Stop。三行 .value(0) 会在第一次测试前关掉所有灯。',
        'פתחו בעמוד הזה את ״קוד התחלה״ והעתיקו אותו. ב־Wokwi לחצו main.py, סמנו את כל הטקסט והדביקו. לחצו Run לבדיקה ואז Stop. שלוש שורות .value(0) מכבות את כל האורות לפני הבדיקה הראשונה.'
      ]
    ],
    check: [
      'The diagram shows three LEDs. All stay off when you run only the starter. If red error text appears, copy the whole starter into main.py again before step 1.',
      'На схеме три светодиода. При запуске только стартового кода они остаются выключенными. Если появился красный текст ошибки, снова скопируй весь стартовый код в main.py перед шагом 1.',
      '电路图中有三盏 LED。只运行起始代码时，三盏灯都保持熄灭。若出现红色错误文本，在开始步骤 1 前重新把完整起始代码复制到 main.py。',
      'בתרשים יש שלוש נוריות. בהרצת קוד ההתחלה בלבד כולן נשארות כבויות. אם מופיע טקסט שגיאה אדום, העתיקו שוב את כל קוד ההתחלה אל main.py לפני שלב 1.'
    ]
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
        'Make a game that flashes three random lights and checks the numbers you type. Start with the project setup below, then build one step at a time.',
        'Сделай игру, которая показывает три случайные вспышки и проверяет введённые цифры. Начни с подготовки проекта ниже, затем выполняй шаги по порядку.',
        '制作一个游戏，随机闪三次灯，再检查你输入的数字。从下方项目设置开始，然后逐步搭建。',
        'בנו משחק שמציג שלושה הבהובים אקראיים ובודק את המספרים שהקלדתם. התחילו בהגדרת הפרויקט שלמטה, ואז בנו שלב אחד בכל פעם.'
      ],
      learn: [
        'Build a game that flashes three random lights and checks the answer.',
        'Сделай игру с тремя случайными вспышками и проверкой ответа.',
        '制作一个随机闪三次灯并检查答案的游戏。',
        'בנו משחק שמציג שלושה הבהובים אקראיים ובודק את התשובה.'
      ],
      setup: mainSetup,
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
      project: null,
      circuit: null,
      title: ['Score, pretend points and speed', 'Счёт, игровые баллы и скорость', '得分、游戏积分与速度', 'ניקוד, נקודות דמיוניות ומהירות'],
      start: [
        'Complete steps 1–6 in the Main task on this page first. Keep that main.py open. Add the challenges below in order, checking each before the next.',
        'Сначала выполни шаги 1–6 в «Основном задании» на этой странице. Оставь этот main.py открытым. Добавляй усложнения по порядку, проверяя каждое.',
        '先完成本页“主要任务”的步骤 1–6，保留该 main.py。按顺序加入下方挑战，每次检查后再继续。',
        'השלימו קודם את שלבים 1–6 ב״משימה עיקרית״ בעמוד הזה. השאירו את main.py הזה פתוח. הוסיפו את האתגרים לפי הסדר ובדקו כל אחד לפני הבא.'
      ],
      learn: [
        'Keep the score and make each round faster.',
        'Сохраняй счёт и ускоряй каждый следующий раунд.',
        '保留得分，让每一轮更快。',
        'שמרו את הניקוד והאיצו כל סיבוב.'
      ],
      setup: {
        title: ['Before the challenges', 'Перед усложнениями', '挑战开始前', 'לפני האתגרים'],
        needs: mainSetup.needs,
        steps: [[
          'Use the Pico circuit and main.py built in the Main task on this page. Select Main task above if you need to set up or finish the game first.',
          'Используй схему Pico и main.py из «Основного задания» на этой странице. Нажми «Основное задание» выше, если нужно сначала настроить или закончить игру.',
          '使用本页“主要任务”中建立的 Pico 电路和 main.py。若还需要设置或完成游戏，点击上方“主要任务”。',
          'השתמשו במעגל Pico וב־main.py שבניתם ב״משימה עיקרית״ בעמוד הזה. בחרו למעלה ״משימה עיקרית״ אם צריך קודם להגדיר או להשלים את המשחק.'
        ]],
        check: [
          'Before adding a score, your game should flash three lights, accept a guess and start the next round. Press Stop before editing.',
          'Перед добавлением счёта игра должна показать три вспышки, принять ответ и начать следующий раунд. Перед правками нажми Stop.',
          '加入得分前，游戏应闪三次灯、接受答案并开始下一轮。修改前点击 Stop。',
          'לפני הוספת ניקוד, המשחק צריך להציג שלושה הבהובים, לקבל ניחוש ולהתחיל את הסיבוב הבא. לחצו Stop לפני העריכה.'
        ]
      },
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
