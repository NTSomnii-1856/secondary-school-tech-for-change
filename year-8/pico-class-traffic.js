(() => {
  'use strict';

  const {lesson, links} = window.FOCUSED_LESSON;
  const lights = [
    {name: 'red', pin: 15, left: 0},
    {name: 'yellow', pin: 13, left: 100},
    {name: 'green', pin: 14, left: 200}
  ];
  const diagram = {
    version: 1,
    author: 'NTSOMNII · Tech for Change',
    editor: 'wokwi',
    parts: [
      {type: 'wokwi-pi-pico', id: 'pico', top: 170, left: 100, attrs: {}},
      ...lights.flatMap(({name, left}) => [
        {type: 'wokwi-led', id: name, top: 15, left, attrs: {color: name}},
        {type: 'wokwi-resistor', id: `r-${name}`, top: 85, left: left - 7, rotate: 90, attrs: {value: '330'}}
      ])
    ],
    connections: lights.flatMap(({name, pin}) => [
      [`pico:GP${pin}`, `r-${name}:2`, name, []],
      [`r-${name}:1`, `${name}:A`, name, []],
      [`${name}:C`, 'pico:GND.4', 'black', []]
    ]),
    dependencies: {}
  };

  const circuit = {
    open: true,
    label: ['Set up a new Wokwi circuit', 'Настрой новый проект Wokwi', '设置新的 Wokwi 电路', 'הגדירו מעגל Wokwi חדש'],
    instructions: ['Already have the class circuit? Keep it. For a new project, copy the wiring below. In Wokwi, replace everything in diagram.json with it, then return to main.py.', 'Если у тебя уже есть схема с урока, открой её. Для нового проекта скопируй схему ниже. В Wokwi замени содержимое diagram.json и вернись в main.py.', '已有课堂电路？继续使用它。若新建项目，请复制下面的接线。在 Wokwi 中替换 diagram.json 的全部内容，再返回 main.py。', 'אם כבר יש לכם מעגל מהשיעור, המשיכו איתו. בפרויקט חדש העתיקו את החיווט למטה. ב־Wokwi החליפו את כל התוכן של diagram.json וחזרו ל־main.py.'],
    copy: ['Copy wiring', 'Скопировать схему', '复制接线', 'העתיקו חיווט'],
    copied: ['Wiring copied', 'Схема скопирована', '已复制接线', 'החיווט הועתק'],
    copyFail: ['Open Show wiring, then select and copy the text.', 'Открой «Показать схему», выдели и скопируй текст.', '打开“显示接线”，再选中并复制文本。', 'פתחו ״הציגו חיווט״, סמנו והעתיקו את הטקסט.'],
    show: ['Show wiring', 'Показать схему', '显示接线', 'הציגו חיווט'],
    json: JSON.stringify(diagram, null, 2)
  };

  const figure = {
    file: 'pico-class-traffic.svg',
    caption: ['Red GP15, yellow GP13, green GP14. Each LED has its own 330 Ω resistor and connects back to GND.', 'Красный — GP15, жёлтый — GP13, зелёный — GP14. У каждого светодиода свой резистор 330 Ом и соединение с GND.', '红灯 GP15，黄灯 GP13，绿灯 GP14。每盏灯使用一个 330 Ω 电阻并接回 GND。', 'אדום GP15, צהוב GP13, ירוק GP14. לכל נורית נגד 330 Ω משלה וחיבור ל־GND.']
  };

  const common = {
    project: 'traffic8',
    open: ['Open a new Pico in Wokwi', 'Открыть новый Pico в Wokwi', '在 Wokwi 中新建 Pico', 'פתחו Pico חדש ב־Wokwi'],
    figure,
    circuit
  };

  const redBlink = `from machine import Pin
rled = Pin(15, Pin.OUT)
import time

for loop1 in range(11):
    rled.value(1)
    time.sleep(1)
    rled.value(0)
    time.sleep(1)`;

  const blinkTask = {
    ...common,
    start: ['Open your class Pico project. Start with the red LED on GP15.', 'Открой проект Pico с урока. Начни с красного светодиода на GP15.', '打开课堂 Pico 项目。从 GP15 上的红灯开始。', 'פתחו את פרויקט ה־Pico מהשיעור. התחילו בנורית האדומה ב־GP15.'],
    learn: ['Make one LED flash 11 times.', 'Заставь один светодиод мигнуть 11 раз.', '让一盏 LED 闪烁 11 次。', 'גרמו לנורית אחת להבהב 11 פעמים.'],
    steps: [
      ['Set up rled as an output on GP15.', 'Настрой rled как выход на GP15.', '将 GP15 上的 rled 设为输出。', 'הגדירו את rled כפלט ב־GP15.'],
      ['Put on, wait, off, wait inside range(11).', 'Помести включение, паузу, выключение и паузу внутрь range(11).', '在 range(11) 的缩进部分写上开灯、等待、关灯、等待。', 'הכניסו ללולאת range(11) הדלקה, המתנה, כיבוי והמתנה.'],
      ['Run main.py. Count the red flashes.', 'Запусти main.py и посчитай красные вспышки.', '运行 main.py，数一数红灯闪了几次。', 'הריצו main.py וספרו את ההבהובים האדומים.']
    ],
    notes: [
      ['Use from machine import Pin and import time.', 'Используй from machine import Pin и import time.', '使用 from machine import Pin 和 import time。', 'השתמשו ב־from machine import Pin וב־import time.'],
      ['Indent all four lines. Each wait is one second.', 'Сделай отступ у всех четырёх строк. Каждая пауза длится секунду.', '四行都要缩进。每次等待一秒。', 'הזיחו את כל ארבע השורות. כל המתנה נמשכת שנייה אחת.'],
      ['The red LED ends off.', 'В конце красный светодиод погаснет.', '最后红灯熄灭。', 'בסוף הנורית האדומה כבויה.']
    ],
    done: ['Red flashes 11 times and ends off.', 'Красный светодиод мигает 11 раз и гаснет.', '红灯闪烁 11 次，最后熄灭。', 'האדום מהבהב 11 פעמים ונשאר כבוי.'],
    facts: ['This is the red blink from class. The next task adds the other colours.', 'Так красный светодиод мигал на уроке. В следующем задании добавятся другие цвета.', '这是课堂上的红灯闪烁代码。下一项任务将加入另外两种颜色。', 'כך הנורית האדומה הבהבה בשיעור. במשימה הבאה מוסיפים את הצבעים האחרים.'],
    code: redBlink
  };

  const trafficTask = {
    ...common,
    start: ['Open the red blink project from class. Keep the 11 flashes at the top of main.py.', 'Открой проект с красным миганием. Оставь 11 вспышек в начале main.py.', '打开课堂的红灯闪烁项目。保留 main.py 开头的 11 次闪烁。', 'פתחו את פרויקט ההבהוב האדום מהשיעור. השאירו את 11 ההבהובים בראש main.py.'],
    learn: ['Add three steady lights after the red flashes.', 'Добавь три непрерывных сигнала после красных вспышек.', '在红灯闪烁结束后，让三盏灯依次常亮。', 'הוסיפו שלושה אורות רציפים אחרי ההבהובים האדומים.'],
    steps: [
      ['Set up yled on GP13 and gled on GP14 above the loop.', 'Перед циклом настрой yled на GP13 и gled на GP14.', '在循环前设置 GP13 的 yled 和 GP14 的 gled。', 'הגדירו לפני הלולאה את yled ב־GP13 ואת gled ב־GP14.'],
      ['After the loop, turn on red for 5 seconds, yellow for 3, then green for 10.', 'После цикла включи красный на 5 секунд, жёлтый на 3, затем зелёный на 10.', '循环结束后，红灯亮 5 秒，黄灯亮 3 秒，再让绿灯亮 10 秒。', 'אחרי הלולאה הדליקו אדום ל־5 שניות, צהוב ל־3, ואז ירוק ל־10.'],
      ['Run the program. Check that each light goes off before the next one turns on.', 'Запусти программу. Убедись, что каждая лампа гаснет перед включением следующей.', '运行程序。检查每盏灯都在下一盏亮起前熄灭。', 'הריצו את התוכנית. בדקו שכל אור כבה לפני שהבא נדלק.']
    ],
    notes: [
      ['Set both pins to Pin.OUT.', 'Для обоих выводов используй Pin.OUT.', '两个引脚都设为 Pin.OUT。', 'הגדירו את שני הפינים כ־Pin.OUT.'],
      ['Start these lines at the left margin so they run once.', 'Начни эти строки без отступа, чтобы они выполнились один раз.', '这些行从最左边开始，这样它们只运行一次。', 'התחילו את השורות בשוליים כדי שהן ירוצו פעם אחת.'],
      ['Use the same on, wait, off pattern for each colour.', 'Для каждого цвета повтори «включи, подожди, выключи».', '每种颜色都使用相同的开灯、等待、关灯顺序。', 'לכל צבע השתמשו באותו סדר: הדלקה, המתנה, כיבוי.']
    ],
    done: ['Red flashes 11 times. Then red stays on for 5 seconds, yellow for 3 and green for 10. At the end all lights are off.', 'Красный мигает 11 раз. Затем красный горит 5 секунд, жёлтый 3, зелёный 10. В конце все лампы погаснут.', '红灯闪 11 次。然后红灯亮 5 秒、黄灯亮 3 秒、绿灯亮 10 秒。最后全部熄灭。', 'האדום מהבהב 11 פעמים. אחר כך האדום דולק 5 שניות, הצהוב 3 והירוק 10. בסוף כל האורות כבויים.'],
    facts: ['Use the same three lines for each colour. This example is the steady red section after the loop.', 'Для каждого цвета используй те же три команды. Здесь показан постоянный красный сигнал после цикла.', '每种颜色都用同样的三行。这里演示循环结束后的红灯常亮。', 'השתמשו באותן שלוש שורות לכל צבע. הדוגמה מראה את האור האדום הרציף אחרי הלולאה.'],
    code: `rled.value(1)
time.sleep(5)
rled.value(0)`
  };

  const notebook = [
    {command: 'Imports', example: 'from machine import Pin\nimport time', meaning: ['Pin controls the Pico pins. time gives us sleep.', 'Pin управляет выводами Pico. Модуль time даёт команду sleep.', 'Pin 控制 Pico 引脚。time 提供 sleep。', 'Pin שולט בפינים של ה־Pico. המודול time נותן לנו את sleep.']},
    {command: 'Pin()', example: 'rled = Pin(15, Pin.OUT)\nyled = Pin(13, Pin.OUT)\ngled = Pin(14, Pin.OUT)', meaning: ['Set up the red, yellow and green pins as outputs.', 'Настраивает красный, жёлтый и зелёный выводы как выходы.', '把红、黄、绿三盏灯的引脚设为输出。', 'מגדיר את הפינים של האדום, הצהוב והירוק כפלטים.']},
    {command: '.value()', example: 'rled.value(1)\nrled.value(0)', meaning: ['For this circuit, 1 turns the LED on and 0 turns it off.', 'В этой схеме 1 включает светодиод, а 0 выключает.', '在这个电路中，1 开灯，0 关灯。', 'במעגל הזה 1 מדליק את הנורית ו־0 מכבה אותה.']},
    {command: 'time.sleep()', example: 'time.sleep(1)', meaning: ['Waits in seconds. Here the pause is one second.', 'Ждёт в секундах. Здесь пауза длится одну секунду.', '按秒等待。这里等待一秒。', 'ממתינה בשניות. כאן ההמתנה נמשכת שנייה אחת.']},
    {command: 'for … in range()', example: 'for loop1 in range(11):\n    rled.value(1)\n    time.sleep(1)\n    rled.value(0)\n    time.sleep(1)', meaning: ['The four indented lines run 11 times. loop1 counts from 0 to 10.', 'Четыре строки с отступом выполняются 11 раз. loop1 принимает значения от 0 до 10.', '缩进的四行运行 11 次。loop1 从 0 数到 10。', 'ארבע השורות המוזחות רצות 11 פעמים. loop1 סופר מ־0 עד 10.']}
  ];

  links.traffic8 = 'https://wokwi.com/projects/new/micropython-pi-pico';
  lesson.notebook.main = notebook;

  if (lesson.lesson === 6) {
    lesson.main = blinkTask;
    lesson.extra = {...trafficTask, title: lesson.extra.title};
  } else {
    lesson.main = {
      ...trafficTask,
      facts: ['This is the class program. Trace what each light does before you run it.', 'Это программа с урока. Перед запуском проследи, что делает каждый светодиод.', '这是课堂程序。运行前，先按顺序看看每盏灯会怎么亮。', 'זו התוכנית מהשיעור. לפני ההרצה עקבו אחר הפעולות של כל נורית.'],
      code: `from machine import Pin
rled = Pin(15, Pin.OUT)
import time
yled = Pin(13, Pin.OUT)
gled = Pin(14, Pin.OUT)

for loop1 in range(11):
    rled.value(1)
    time.sleep(1)
    rled.value(0)
    time.sleep(1)

rled.value(1)
time.sleep(5)
rled.value(0)
yled.value(1)
time.sleep(3)
yled.value(0)
gled.value(1)
time.sleep(10)
gled.value(0)`
    };

    lesson.extra.start = [
      'Open the separate crossing project. Press the button while cars are moving. The starter remembers the press and waits for car red.',
      'Открой отдельный проект перехода. Нажми кнопку, пока машины едут. Заготовка запомнит нажатие и дождётся красного для машин.',
      '打开独立的行人过街项目。在车辆通行时按按钮。起始程序会记住按键并等到车灯变红。',
      'פתחו את פרויקט מעבר החצייה. לחצו על הכפתור בזמן שהמכוניות נוסעות. הפרויקט זוכר את הלחיצה וממתין לאדום למכוניות.'
    ];
    lesson.extra.notebook = [
      {command: '.on() / .off()', example: 'ped_red.off()\nped_green.on()', meaning: ['This crossing starter uses these commands to switch the pedestrian lights.', 'В проекте перехода эти команды переключают свет для пешеходов.', '在过街项目中，这两个命令用来开关行人灯。', 'בפרויקט מעבר החצייה הפקודות האלה מדליקות ומכבות את אורות הולכי הרגל.']},
      ...lesson.notebook.extra
    ];
    lesson.notebook.extra = [];
  }
})();
