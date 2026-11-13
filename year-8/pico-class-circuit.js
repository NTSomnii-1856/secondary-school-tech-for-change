(() => {
  'use strict';

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
    serialMonitor: {display: 'always', newline: 'lf'},
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

  window.PICO_CLASS_WOKWI = 'https://wokwi.com/projects/new/micropython-pi-pico';
  window.PICO_CLASS_CIRCUIT = {
    project: 'picoClass',
    open: ['Open a new Pico in Wokwi', 'Открыть новый Pico в Wokwi', '在 Wokwi 中新建 Pico', 'פתחו Pico חדש ב־Wokwi'],
    figure,
    circuit
  };
})();
