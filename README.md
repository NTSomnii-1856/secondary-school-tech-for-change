# Secondary School Tech for Change

NTSOMNII independent ICT lessons. Each class has its own page and ordered lessons.

## Open your class

- [Year 7](https://ntsomnii-1856.github.io/secondary-school-tech-for-change/year-7/)
- [Year 8](https://ntsomnii-1856.github.io/secondary-school-tech-for-change/year-8/)

## Curriculum maps

- [Year 7: Arduino C++ and invention](year-7/curriculum-map/)
- [Year 8: Python and connected systems](year-8/curriculum-map/)

The updated maps retain ICT before Christmas, the competition invention through April, a new exhibition project in May and the enterprise month. Year 7 Week 6 now uses an Arduino countdown project; the earlier versions remain available as alternatives.

## Current project lessons

- [Year 7: Arcade countdown](year-7/week-6-arcade-countdown/) - Arduino C++ in a ready-wired Wokwi project. Optional project: a traffic-light controller.
- [Year 8 Week 6: Blink and traffic lights](year-8/week-6-light-memory-game/) — first Wokwi and Pico MicroPython, then a three-light controller.
- [Year 7 Week 7: Pedestrian crossing](year-7/week-7-pedestrian-crossing/) — Arduino IDE C++ on an Uno; continue the student's traffic-light sketch.
- [Year 8 Week 7: Pedestrian crossing](year-8/week-7-pedestrian-crossing/) — MicroPython on a Pico; keep the taught counted `range` repetition.
- [Community Project: Smart Beehive](community-project/smart-beehive/) — one separate shared hub for both years, with weekly topics and team cards for teacher-operated Trello.

Year 8 uses the Year 7 page shell and stylesheet: two concrete objectives, separate Learn and Your turn views, three brief actions per task and optional circuit help. Wiring, GPIO labels, LED polarity and imports are explained before use. The student starter contains hardware setup and a light helper; students write the blink, traffic-light and memory-game logic. Only counted `in range(...)` examples are used. The final project is unlocked from the start. Teacher mode starts off, loads guidance and worked examples only when enabled, and follows the current task. It is a classroom display toggle, not authentication. Earlier examples remain in legacy files. The Year 8 binary page is not a record of achieved classroom coverage.

## Earlier prepared lessons

| Year | Week 5 | Week 6 |
| --- | --- | --- |
| 7 | [Scratch game gate](year-7/week-5-scratch-game-gate/) | [Arduino signal](year-7/week-6-arduino-signal/) · [Python alternative](year-7/week-6-game-club-planner/) |
| 8 | [Binary pixel studio](year-8/week-5-binary-pixel-studio/) | [Film-night booking checker](year-8/week-6-film-night-booking-checker/) |

Each lesson has learning objectives, a guide, independent problems with rubrics, **Level up (optional)** and an exit ticket. Revision links return to the saved problem. Work and self-assessment stay in the student's browser until downloaded for the teacher. The website does not automatically mark Python or Scratch projects. Hand in the working program/project too.

English, Russian, Simplified Chinese and Hebrew are available in lessons. Python and Scratch block examples use their English code/block names. Hebrew pages read right to left; code and binary data remain left to right.

Week 5 contains its student files and the locally bundled Scratch block renderer (MIT licence). No audio downloads are needed. Year 8 worked examples are in a separately fetched teacher guide, shown only with Teacher mode enabled in the lesson interface.

## Week 7 and the community project

The crossing pages use the clean Year 7 layout. Students finish their own traffic lights, add two pedestrian LEDs and a button, then write the crossing decision. Each LED has its own 330Ω resistor. The starter ZIPs contain hardware setup and a supplied button helper, with no completed traffic or crossing sequence. The helper remembers a short press while waiting, debounces it and prevents a held button from repeating a crossing. Requests are served at the next safe red checkpoint, within five seconds of acceptance. Arduino runs continuously through `loop()`; the Pico teaching example runs three rounds and finishes with both red lights on.

Teacher mode starts off on every load. It fetches prompts and worked code only when enabled. It is a classroom display toggle, not an authentication boundary. Earlier quiz-buzzer and memory-game pages remain as alternatives; the class homes now link to the pedestrian crossing. Week 8's guessing game is planned in the maps.

Smart Beehive has its own root/class tab. Week 7 defines the problem; Weeks 8–12 cover research, brainstorming, planning, a small prototype, then testing and improvement. Week 7 is available immediately. Further topics release each Monday from 16 November to 14 December 2026, using Europe/Chisinau dates. Teacher mode previews future topics and relocks them when switched off. These are instructional release gates on a static website.

Students prepare a team card locally, then copy it for the teacher's Trello board or download/restore a JSON backup. The site does not create a Trello board or sync to Trello. Teacher mode includes a board setup kit with To do / Doing / Check / Done lists. Atlassian requires users to be at least 16; pupils do not need Trello accounts. The teacher operates Trello or uses a school-approved platform.

Edit `crossing-lab/source-content/` for all four languages, or `community-project/smart-beehive/release.json` for release dates, then run `node tools/build_crossing_lessons.cjs` and commit the generated data too. Source and generated code preserve the previous Week 6 lessons.

Validation: `python tools/check_pedestrian_crossing.py` checks the Pico helper's temporal behaviour, light states, wiring and ZIPs, and compiles both Uno sketches when Arduino CLI and the Uno core are available. Browser checks use Playwright and Edge: serve the root on port 4194, then run `node tools/check_week7_pages.cjs`. Set `LESSON_BASE_URL` to check another deployment.

## Publish

GitHub Pages deploys from `main`, root folder. These are static pages; no build, secret keys or student accounts are required. Keep relative links so each year's lesson page stays separate.
