(() => {
  'use strict';

  const {lesson, links} = window.FOCUSED_LESSON;
  const circuit = window.PICO_CLASS_CIRCUIT;
  links[circuit.project] = window.PICO_CLASS_WOKWI;

  const setup = `from machine import Pin
import time

rled = Pin(15, Pin.OUT)
yled = Pin(13, Pin.OUT)
gled = Pin(14, Pin.OUT)`;

  const blink = {
    ...circuit,
    start: ['Start with the red LED on GP15.', 'Начни с красного светодиода на GP15.', '从 GP15 上的红灯开始。', 'התחילו בנורית האדומה ב־GP15.'],
    learn: ['Turn an LED on, wait, then turn it off.', 'Включи светодиод, подожди и выключи его.', '点亮 LED，等待，再熄灭。', 'הדליקו נורית, המתינו וכבו אותה.'],
    steps: [
      ['Set up rled as an output on GP15.', 'Настрой rled как выход на GP15.', '将 GP15 上的 rled 设为输出。', 'הגדירו את rled כפלט ב־GP15.'],
      ['Turn it on, wait one second, then turn it off.', 'Включи, подожди секунду и выключи.', '开灯，等一秒，再关灯。', 'הדליקו, המתינו שנייה וכבו.'],
      ['Run main.py. Watch the red light.', 'Запусти main.py и посмотри на красный свет.', '运行 main.py，观察红灯。', 'הריצו main.py וצפו באור האדום.']
    ],
    notes: [
      ['Start with from machine import Pin and import time.', 'Начни с from machine import Pin и import time.', '先写 from machine import Pin 和 import time。', 'התחילו ב־from machine import Pin וב־import time.'],
      ['Use .value(1), time.sleep(1) and .value(0).', 'Используй .value(1), time.sleep(1) и .value(0).', '使用 .value(1)、time.sleep(1) 和 .value(0)。', 'השתמשו ב־.value(1), ב־time.sleep(1) וב־.value(0).'],
      ['If it stays dark, check the wire to GP15.', 'Если не горит, проверь провод к GP15.', '如果灯没亮，检查 GP15 的接线。', 'אם הנורית נשארת כבויה, בדקו את החיבור ל־GP15.']
    ],
    done: ['Red comes on for one second and goes off.', 'Красный горит секунду и гаснет.', '红灯亮一秒后熄灭。', 'האור האדום דולק שנייה ונכבה.'],
    facts: ['These lines set up the red LED. Add the three commands for the blink below them.', 'Эти строки настраивают красный светодиод. Добавь под ними три команды для мигания.', '这几行设置红灯。在下面添加让它闪一下的三条命令。', 'השורות האלה מגדירות את הנורית האדומה. הוסיפו מתחתיהן את שלוש פקודות ההבהוב.'],
    code: `from machine import Pin
import time

rled = Pin(15, Pin.OUT)`
  };

  const traffic = {
    ...circuit,
    start: ['Build this cycle in main.py.', 'Собери этот цикл в main.py.', '在 main.py 中编写这个循环。', 'בנו את המחזור הזה ב־main.py.'],
    signalSequence: [
      {lights: ['red'], label: ['Red', 'Красный', '红', 'אדום']},
      {lights: ['red', 'yellow'], label: ['Red + yellow', 'Красный и жёлтый', '红和黄', 'אדום וצהוב']},
      {lights: ['green'], label: ['Green', 'Зелёный', '绿', 'ירוק']},
      {lights: ['yellow'], label: ['Yellow', 'Жёлтый', '黄', 'צהוב']},
      {lights: ['red'], label: ['Back to red', 'Снова красный', '回到红灯', 'חזרה לאדום']}
    ],
    learn: ['Choose which LEDs stay on at each stage of the traffic-light cycle.', 'Выбери, какие лампы горят на каждом этапе цикла светофора.', '决定交通灯每个阶段亮哪些 LED。', 'בחרו אילו נוריות נשארות דולקות בכל שלב של מחזור הרמזור.'],
    starter: setup,
    steps: [
      ['Turn on red for 5 seconds. Keep red on and add yellow for 1 second.', 'Включи красный на 5 секунд. Оставь его включённым и добавь жёлтый на 1 секунду.', '先让红灯亮 5 秒。保持红灯亮，再打开黄灯 1 秒。', 'הדליקו אדום ל־5 שניות. השאירו אותו דולק והוסיפו צהוב לשנייה.'],
      ['Turn red and yellow off. Turn on green for 10 seconds.', 'Выключи красный и жёлтый. Включи зелёный на 10 секунд.', '关掉红灯和黄灯。打开绿灯 10 秒。', 'כבו את האדום והצהוב. הדליקו ירוק ל־10 שניות.'],
      ['Turn green off. Turn on yellow for 3 seconds. Then turn yellow off and red on.', 'Выключи зелёный. Включи жёлтый на 3 секунды. Затем выключи жёлтый и включи красный.', '关掉绿灯。打开黄灯 3 秒。接着关掉黄灯，打开红灯。', 'כבו את הירוק. הדליקו צהוב ל־3 שניות. אחר כך כבו צהוב והדליקו אדום.']
    ],
    notes: [
      ['Use the Starter code to set up the three pins. Code help shows the first two stages.', 'Начальный код настраивает три вывода. Подсказка показывает первые два этапа.', '使用起始代码设置三个引脚。代码提示展示前两个阶段。', 'קוד ההתחלה מגדיר את שלושת הפינים. העזרה בקוד מציגה את שני השלבים הראשונים.'],
      ['Green is the only LED on during this stage.', 'На этом этапе горит только зелёный.', '这个阶段只亮绿灯。', 'בשלב הזה רק הירוק דולק.'],
      ['Run once and watch all the way back to red.', 'Запусти и проследи весь цикл до красного.', '运行一次，观察灯光直到回到红灯。', 'הריצו פעם אחת וצפו עד שהאור חוזר לאדום.']
    ],
    done: ['Red → red + yellow → green → yellow → red.', 'Красный → красный и жёлтый → зелёный → жёлтый → красный.', '红 → 红和黄 → 绿 → 黄 → 红。', 'אדום, אדום וצהוב יחד, ירוק, צהוב, ואז שוב אדום.'],
    facts: ['After setting up the pins, begin like this. Use the steps to finish the cycle.', 'После настройки выводов начни с этих строк. Дальше следуй шагам задания.', '设置引脚后，从这几行开始。再按步骤完成整个循环。', 'אחרי הגדרת הפינים, התחילו כך. המשיכו לפי השלבים כדי להשלים את המחזור.'],
    code: `rled.value(1)
time.sleep(5)
yled.value(1)
time.sleep(1)`
  };

  const notebook = [
    {command: 'Imports', example: 'from machine import Pin\nimport time', meaning: ['Pin controls the Pico pins. time lets you use sleep.', 'Pin управляет выводами Pico. Модуль time даёт команду sleep.', 'Pin 控制 Pico 引脚。time 提供 sleep。', 'Pin שולט בפינים של ה־Pico. המודול time נותן לנו את sleep.']},
    {command: 'Pin()', example: 'rled = Pin(15, Pin.OUT)\nyled = Pin(13, Pin.OUT)\ngled = Pin(14, Pin.OUT)', meaning: ['Set up the red, yellow and green pins as outputs.', 'Настраивает красный, жёлтый и зелёный выводы как выходы.', '把红、黄、绿三盏灯的引脚设为输出。', 'מגדיר את הפינים של האדום, הצהוב והירוק כפלטים.']},
    {command: '.value()', example: 'rled.value(1)\nrled.value(0)', meaning: ['1 turns the LED on. 0 turns it off. It keeps that state until you change it.', '1 включает светодиод. 0 выключает. Состояние сохраняется до следующей команды.', '1 开灯。0 关灯。灯会保持这个状态，直到你改动它。', '1 מדליק את הנורית. 0 מכבה אותה. היא נשארת במצב הזה עד שמשנים אותו.']},
    {command: 'time.sleep()', example: 'time.sleep(1)', meaning: ['Wait one second. During the wait, every LED stays as it is.', 'Подожди секунду. Во время паузы состояние ламп сохраняется.', '等待一秒。等待时，每盏灯保持当前状态。', 'המתינו שנייה. בזמן ההמתנה מצב האורות נשאר כפי שהוא.']}
  ];

  if (lesson.lesson === 6) {
    lesson.main = blink;
    lesson.extra = {...traffic, title: lesson.extra.title};
  } else {
    lesson.main = {
      ...traffic,
      start: ['Open your Lesson 6 project and finish the cycle.', 'Открой проект урока 6 и закончи цикл.', '打开第 6 课项目并完成循环。', 'פתחו את הפרויקט משיעור 6 והשלימו את המחזור.'],
      steps: [...traffic.steps, ['Once one cycle works, use range(3) to repeat the whole cycle three times.', 'Когда один цикл работает, повтори весь цикл трижды с range(3).', '一个循环成功后，用 range(3) 把整个循环重复三次。', 'כשמחזור אחד עובד, השתמשו ב־range(3) כדי לחזור על כל המחזור שלוש פעמים.']],
      notes: [...traffic.notes, ['Keep pin setup above the loop. Indent the light changes and their waits inside it.', 'Оставь настройку выводов перед циклом. Добавь отступ у переключений ламп и пауз внутри цикла.', '引脚设置放在循环上方。循环内的开关灯和等待都要缩进。', 'השאירו את הגדרות הפינים מעל הלולאה. הזיחו את פקודות האורות וההמתנות בתוכה.']],
      done: ['The full cycle runs three times and ends on red.', 'Весь цикл проходит три раза и заканчивается красным.', '完整循环运行三次，最后停在红灯。', 'המחזור המלא רץ שלוש פעמים ומסתיים באדום.']
    };
    notebook.push({
      command: 'for … in range()',
      example: 'for cycle in range(3):\n    rled.value(1)\n    time.sleep(5)\n    # Add the rest of the cycle here.',
      meaning: ['The indented lines run three times. Put all four stages inside the loop.', 'Строки с отступом выполняются три раза. Помести все четыре этапа в цикл.', '缩进的代码运行三次。把四个阶段都放进循环。', 'השורות המוזחות רצות שלוש פעמים. הכניסו ללולאה את כל ארבעת השלבים.']
    });
  }

  lesson.notebook.main = notebook;
})();
