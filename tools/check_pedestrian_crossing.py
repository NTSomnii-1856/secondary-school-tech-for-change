"""Check pedestrian-crossing logic, setup-only ZIPs and actual Uno compilation.

Python tests replace hardware and time; no simulator/cloud account is required.
If Arduino CLI and the Uno core are installed, compile the starter and teacher
example for arduino:avr:uno too. No hardware is flashed.
"""
import ast
from contextlib import contextmanager
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import types
from zipfile import ZipFile

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "crossing-lab/resources"
TEACHER = ROOT / "crossing-lab/teacher-sources"


@contextmanager
def pico(presses=(), start=0):
    clock = types.SimpleNamespace(now=start, pins={}, events=[], accepted=[])

    def button_value():
        return 0 if any(a <= clock.now < b for a, b in presses) else 1

    def safety():
        p = clock.pins
        state = lambda pin: p[pin].state if pin in p else 0
        if state(19):
            assert state(15) and not state(16) and not state(17), "Pedestrian green without exclusive vehicle red"
        if state(17) or state(16):
            assert state(18) and not state(19), "Vehicle movement without pedestrian red"
        assert sum(state(pin) for pin in (15, 16, 17)) <= 1, "Two vehicle lights on"

    class Pin:
        IN, OUT, PULL_UP = 0, 1, 2

        def __init__(self, number, mode, pull=None):
            self.number, self.mode, self.state = number, mode, 0
            clock.pins[number] = self
            if mode == self.IN:
                assert number == 20 and pull == self.PULL_UP

        def value(self):
            return button_value() if self.mode == self.IN else self.state

        def on(self):
            self.state = 1
            clock.events.append((clock.now, self.number, 1))
            safety()

        def off(self):
            self.state = 0
            clock.events.append((clock.now, self.number, 0))
            safety()

    def sleep_ms(ms):
        assert 0 <= ms <= 10, "Helper must sample button at least every 10 ms"
        safety()
        clock.now += ms

    machine = types.ModuleType("machine")
    machine.Pin = Pin
    time = types.ModuleType("time")
    time.ticks_ms = lambda: clock.now % (1 << 30)
    time.ticks_diff = lambda a, b: (a - b + (1 << 29)) % (1 << 30) - (1 << 29)
    time.sleep_ms = sleep_ms
    saved = {name: sys.modules.get(name) for name in ("machine", "time", "crossing")}
    try:
        sys.modules["machine"], sys.modules["time"] = machine, time
        spec = importlib.util.spec_from_file_location("crossing", RES / "year-8/crossing.py")
        helper = importlib.util.module_from_spec(spec)
        sys.modules["crossing"] = helper
        spec.loader.exec_module(helper)
        original_poll = helper._poll

        def observe_poll():
            previous = helper._pending
            original_poll()
            if helper._pending and not previous:
                clock.accepted.append(clock.now)

        helper._poll = observe_poll
        yield clock, helper
        safety()
    finally:
        for name, value in saved.items():
            if value is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = value


def teacher_run(presses):
    with pico(presses) as (clock, helper):
        source = (TEACHER / "year8-solution.py").read_text(encoding="utf-8")
        exec(compile(source, "teacher/year8-solution.py", "exec"), {"__name__": "__main__"})
        assert [clock.pins[n].state for n in (15, 16, 17, 18, 19)] == [1, 0, 0, 1, 0], "Finite Pico example must end all-red"
        return clock


def lit_times(clock, pin):
    return [t for t, number, state in clock.events if number == pin and state]


def check_button_helper():
    with pico([(100, 200)]) as (clock, helper):
        helper.pause(1)
        assert helper.requested(), "Short request was lost during a wait"
        assert clock.accepted == [130]
        helper.begin_crossing()
        assert not helper.requested()
        helper.pause(1)
        helper.end_crossing()
        assert not helper.requested()

    # Bounce before a stable 100-ms press must latch once.
    with pico([(100, 110), (120, 130), (140, 240)]) as (clock, helper):
        helper.pause(1)
        assert helper.requested() and clock.accepted == [170]

    with pico([(100, 120)]) as (clock, helper):
        helper.pause(1)
        assert not helper.requested(), "Pulse below the debounce interval was accepted"

    # Holding through a complete crossing cannot queue another crossing.
    with pico([(100, 4000), (4300, 4400)]) as (clock, helper):
        helper.pause(0.2)
        assert helper.requested()
        helper.begin_crossing()
        helper.pause(2)
        helper.end_crossing()
        helper.pause(1)
        assert not helper.requested()
        helper.pause(1)
        assert not helper.requested()
        helper.pause(0.3)
        assert helper.requested(), "Release and a fresh press must be accepted"
        assert clock.accepted == [130, 4330]

    # A full new press and release during the active crossing is ignored.
    with pico([(100, 200), (700, 900), (2400, 2500)]) as (clock, helper):
        helper.pause(0.3)
        helper.begin_crossing()
        helper.pause(2)
        helper.end_crossing()
        assert not helper.requested()
        helper.pause(0.3)
        assert helper.requested() and clock.accepted == [130, 2430]

    with pico([(0, 500), (600, 700)]) as (clock, helper):
        helper.pause(0.4)
        assert not helper.requested(), "Held-at-start button must first be released"
        helper.pause(0.4)
        assert helper.requested() and clock.accepted == [630]

    start = (1 << 30) - 100
    with pico([(start + 20, start + 100)], start=start) as (clock, helper):
        helper.pause(0.2)
        assert helper.requested(), "Button timing failed across ticks_ms wrap"


def check_teacher_behaviour():
    clock = teacher_run([])
    assert clock.now == 15000
    assert lit_times(clock, 17) == [0, 5000, 10000]
    assert not lit_times(clock, 19)
    for tap in (100, 2900, 3500, 4500, 4980, 5100, 9900):
        clock = teacher_run([(tap, tap + 100)])
        walk = lit_times(clock, 19)
        assert len(walk) == 1, f"Tap at {tap} was lost or repeated"
        accepted = clock.accepted[0]
        assert 1000 <= walk[0] - accepted <= 6000, "Crossing exceeded the 5-s checkpoint wait plus 1-s clearance"
        off = next(t for t, pin, state in clock.events if pin == 19 and state == 0 and t > walk[0])
        assert off - walk[0] == 5000, "Walking time changed"
        next_green = next((t for t in lit_times(clock, 17) if t > off), None)
        if next_green is not None:
            assert next_green - off == 1000, "Vehicle resumed before the all-red clearance"
    clock = teacher_run([(100, 25000)])
    assert len(lit_times(clock, 19)) == 1, "A held press restarted the crossing"
    clock = teacher_run([(100, 200), (6500, 6700), (8000, 9000)])
    assert len(lit_times(clock, 19)) == 1, "Presses during active crossing queued another crossing"
    clock = teacher_run([(100, 13000), (15000, 15100)])
    assert lit_times(clock, 19) == [6000, 18000], "Fresh press after release was not served"


def check_diagrams_and_starters():
    for year, outputs, button in [(7, [8, 9, 10, 6, 7], 2), (8, [15, 16, 17, 18, 19], 20)]:
        folder = RES / f"year-{year}"
        diagram = json.loads((folder / "diagram.json").read_text(encoding="utf-8"))
        board = "uno" if year == 7 else "pico"
        prefix = "" if year == 7 else "GP"
        parts = {p["id"]: p for p in diagram["parts"]}
        assert len(parts) == len(diagram["parts"])
        assert sum(p["type"] == "wokwi-led" for p in parts.values()) == 5
        assert sum(p["type"] == "wokwi-pushbutton" for p in parts.values()) == 1
        edges = {frozenset(c[:2]) for c in diagram["connections"]}
        for index, (name, pin) in enumerate(zip(("vehicleRed", "vehicleAmber", "vehicleGreen", "pedestrianRed", "pedestrianGreen"), outputs)):
            assert parts[f"r{index}"]["attrs"]["value"] == "330"
            assert frozenset((f"{board}:{prefix}{pin}", f"r{index}:2")) in edges
            assert frozenset((f"r{index}:1", f"{name}:A")) in edges
            assert frozenset((f"{name}:C", f"{board}:GND.1")) in edges
        assert frozenset((f"{board}:{prefix}{button}", "request:1.l")) in edges
        assert frozenset(("request:2.l", f"{board}:GND.1")) in edges
        names = ("sketch.ino", "crossing.h", "crossing.cpp", "diagram.json") if year == 7 else ("main.py", "crossing.py", "diagram.json")
        with ZipFile(folder / "student-starter.zip") as archive:
            assert archive.testzip() is None
            prefix = "sketch/" if year == 7 else ""
            assert set(archive.namelist()) == {prefix + name for name in names}
            for name in names:
                # Git may use CRLF on Windows and LF on Linux. The archived
                # source must match exactly apart from those line endings.
                archived = archive.read(prefix + name).decode("utf-8-sig").replace("\r\n", "\n")
                assert archived == (folder / name).read_text(encoding="utf-8-sig")
        if year == 8:
            source = (folder / "main.py").read_text(encoding="utf-8")
            assert not any(isinstance(n, (ast.For, ast.While, ast.If, ast.FunctionDef)) for n in ast.walk(ast.parse(source)))
            with pico() as (clock, helper):
                exec(compile(source, "student/main.py", "exec"), {})
                assert clock.now == 0 and not lit_times(clock, 17) and not lit_times(clock, 19)
                assert clock.pins[15].state == clock.pins[18].state == 1
        else:
            source = (folder / "sketch.ino").read_text(encoding="utf-8")
            loop = source.split("void loop() {", 1)[1].rsplit("}", 1)[0]
            assert not any(line.strip() for line in loop.splitlines() if not line.strip().startswith("//")), "Student loop contains a finished solution"


def compile_uno():
    cli = shutil.which("arduino-cli") or "C:/Program Files/Arduino IDE/resources/app/lib/backend/resources/arduino-cli.exe"
    if not Path(cli).exists():
        print("SKIP: Arduino CLI unavailable; Uno compilation not checked")
        return
    with tempfile.TemporaryDirectory(prefix="crossing-uno-") as temp:
        root = Path(temp)
        # Desktop sandbox profiles can point Arduino CLI at an empty package
        # directory even though the user's IDE already has the Uno toolchain.
        # A task-local config reuses that installed core without changing it.
        candidates = [Path.home() / "AppData/Local/Arduino15"]
        if os.environ.get("LOCALAPPDATA"):
            candidates.insert(0, Path(os.environ["LOCALAPPDATA"]) / "Arduino15")
        if os.environ.get("ARDUINO_DATA_DIR"):
            candidates.insert(0, Path(os.environ["ARDUINO_DATA_DIR"]))
        # In an AppContainer, Known Folders may differ from the profile that
        # owns this workspace. Reuse its IDE package cache when present.
        candidates.extend(p.parent / "AppData/Local/Arduino15" for p in ROOT.parents if p.name == "Documents")
        data = next((p for p in candidates if (p / "packages/arduino/hardware/avr").is_dir()), None)
        config_args = []
        if data is not None:
            config = root / "arduino-cli.yaml"
            config.write_text("directories:\n  data: " + json.dumps(str(data)) + "\n  downloads: " + json.dumps(str(root / "downloads")) + "\n  user: " + json.dumps(str(root / "user")) + "\n", encoding="utf-8")
            config_args = ["--config-file", str(config)]
        for kind, source in [("starter", RES / "year-7/sketch.ino"), ("teacher", TEACHER / "year7-solution.ino")]:
            folder = root / kind
            folder.mkdir()
            shutil.copyfile(source, folder / f"{kind}.ino")
            for name in ("crossing.h", "crossing.cpp"):
                shutil.copyfile(RES / "year-7" / name, folder / name)
            result = subprocess.run([str(cli), *config_args, "compile", "--fqbn", "arduino:avr:uno", "--build-path", str(root / (kind + "-build")), str(folder)], text=True, capture_output=True)
            assert result.returncode == 0, f"Arduino {kind} compile failed:\n{result.stdout}\n{result.stderr}"
            print(f"PASS: actual Arduino Uno {kind} compilation")


if __name__ == "__main__":
    check_button_helper()
    check_teacher_behaviour()
    check_diagrams_and_starters()
    print("PASS: debounce, short/held/ignored/fresh presses, safety, durations, resume, pin wiring and setup-only archives")
    compile_uno()
