"""Exercise the lesson programs without hardware or a network connection.

Run with Python 3 from the repository root:
    python tools/check_year8_wokwi.py
The fake Pin and time modules record behaviour instead of driving a Pico.
"""
import builtins
import contextlib
import io
import json
from pathlib import Path
import runpy
import sys
import types

# Keep downloadable student resource folders free of CPython cache files.
sys.dont_write_bytecode = True

RESOURCES = Path(__file__).resolve().parents[1] / "year-8/wokwi-lab/resources"


def run_program(name, answers=(), pattern=None):
    events = []
    pins = {}
    sleeps = []

    class Pin:
        OUT = 1

        def __init__(self, number, mode):
            assert mode == self.OUT
            self.number = number
            self.state = 0
            pins[number] = self

        def on(self):
            self.state = 1
            events.append((self.number, 1))
            assert sum(pin.state for pin in pins.values()) <= 1, "Two lamps lit together"

        def off(self):
            self.state = 0
            events.append((self.number, 0))

    machine = types.ModuleType("machine")
    machine.Pin = Pin
    clock = types.ModuleType("time")
    clock.sleep = sleeps.append
    old_modules = {key: sys.modules.get(key) for key in ("machine", "time", "lights")}
    old_input = builtins.input
    answers = iter(answers)
    output = io.StringIO()
    try:
        sys.modules["machine"] = machine
        sys.modules["time"] = clock
        sys.modules.pop("lights", None)
        sys.path.insert(0, str(RESOURCES))
        builtins.input = lambda prompt="": next(answers)
        with contextlib.redirect_stdout(output):
            if pattern is None:
                runpy.run_path(str(RESOURCES / name), run_name="__main__")
            else:
                source = (RESOURCES / name).read_text(encoding="utf-8")
                source = source.replace("pattern = [1, 3, 2]", f"pattern = {pattern!r}")
                exec(compile(source, name, "exec"), {"__name__": "__main__"})
        assert all(pin.state == 0 for pin in pins.values()), "A lamp stayed on at the end"
        return events, sleeps, output.getvalue()
    finally:
        builtins.input = old_input
        sys.path.remove(str(RESOURCES))
        for key, value in old_modules.items():
            if value is None:
                sys.modules.pop(key, None)
            else:
                sys.modules[key] = value


def main():
    events, sleeps, output = run_program("blink.py")
    assert [pin for pin, state in events if state] == [15] * 5
    assert sleeps == [0.5] * 10
    assert "five red flashes" in output

    events, sleeps, output = run_program("traffic.py")
    assert [pin for pin, state in events if state] == [15, 17, 16] * 3
    assert sleeps == [2, 2, 1] * 3

    events, sleeps, output = run_program("pattern.py")
    assert [pin for pin, state in events if state] == [15, 17, 16]
    assert sleeps == [0.5] * 6
    events, sleeps, output = run_program("pattern.py", pattern=[1, 1, 3, 2])
    assert [pin for pin, state in events if state] == [15, 15, 17, 16]
    assert sleeps == [0.5] * 8

    for answer, wanted in [("1", "Correct"), ("3", "Not this time"), ("", "Not this time"), ("x", "Not this time")]:
        events, sleeps, output = run_program("answer.py", [answer])
        assert [pin for pin, state in events if state] == [15]
        assert output.strip() == wanted

    for answers, expected in [
        (["1", "3", "2"], 3),
        (["1", "2", "2"], 2),
        (["2", "1", "3"], 0),
        (["", "hello", "9"], 0),
    ]:
        events, sleeps, output = run_program("memory.py", answers)
        assert [pin for pin, state in events if state] == [15, 17, 16]
        assert f"Score: {expected} / 3" in output
        assert ("You matched the whole pattern!" in output) == (expected == 3)

    # Changing length and repeating a light must not leave a hard-coded three-item loop.
    events, sleeps, output = run_program("memory.py", ["2", "2", "1", "3"], [2, 2, 1, 3])
    assert [pin for pin, state in events if state] == [16, 16, 15, 17]
    assert "Score: 4 / 4" in output

    diagram = json.loads((RESOURCES / "diagram.json").read_text(encoding="utf-8"))
    ids = [part["id"] for part in diagram["parts"]]
    assert len(ids) == len(set(ids))
    edges = {frozenset(connection[:2]) for connection in diagram["connections"]}
    for index, gpio in enumerate((15, 16, 17)):
        assert frozenset((f"pico:GP{gpio}", f"r{index}:2")) in edges
        assert frozenset((f"r{index}:1", f"led{index}:A")) in edges
        assert frozenset((f"led{index}:C", "pico:GND.1")) in edges
    assert all(part["attrs"]["value"] == "330" for part in diagram["parts"] if part["type"] == "wokwi-resistor")
    print("PASS: blink, traffic sequence/exclusive lights, pattern playback/length, answer feedback, memory scoring/input/length, circuit wiring")


if __name__ == "__main__":
    main()
