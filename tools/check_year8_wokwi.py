"""Exercise the lesson programs without hardware or a network connection.

Run with Python 3 from the repository root:
    python tools/check_year8_wokwi.py
The fake Pin and time modules record behaviour instead of driving a Pico.
"""
import builtins
import ast
import contextlib
import io
import json
from pathlib import Path
import runpy
import sys
import types
from zipfile import ZipFile

# Keep downloadable student resource folders free of CPython cache files.
sys.dont_write_bytecode = True

RESOURCES = Path(__file__).resolve().parents[1] / "year-8/wokwi-lab/resources"


def run_program(name, answers=(), pattern=None, replacements=None, source=None):
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
            if pattern is None and not replacements and source is None:
                runpy.run_path(str(RESOURCES / name), run_name="__main__")
            else:
                if source is None:
                    source = (RESOURCES / name).read_text(encoding="utf-8")
                if pattern is not None:
                    source = source.replace("pattern = [1, 3, 2]", f"pattern = {pattern!r}")
                for before, after in (replacements or {}).items():
                    assert before in source, f"Test replacement not found in {name}: {before}"
                    source = source.replace(before, after)
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


def verify_student_starter():
    setup_source = (RESOURCES / "setup-only.py").read_text(encoding="utf-8")
    setup_ast = ast.parse(setup_source)
    assert not any(isinstance(node, (ast.For, ast.While, ast.If, ast.FunctionDef)) for node in ast.walk(setup_ast)), "Setup file contains student solution behaviour"
    events, sleeps, output = run_program("setup-only.py")
    assert events == [(15, 0), (16, 0), (17, 0)]
    assert sleeps == [] and output == ""

    events, sleeps, output = run_program("helper-check.py")
    assert [pin for pin, state in events if state] == [15]
    assert sleeps == [0.5, 0.5]

    with ZipFile(RESOURCES / "student-starter.zip") as starter:
        assert starter.testzip() is None
        assert starter.namelist() and len(starter.namelist()) == 3
        assert set(starter.namelist()) == {"main.py", "diagram.json", "lights.py"}, "Starter must contain exactly the three student files at its root"
        starter_source = starter.read("main.py").decode("utf-8-sig")
        assert ast.dump(ast.parse(starter_source)) == ast.dump(setup_ast), "Starter main.py must contain hardware setup only"
        assert ast.dump(ast.parse(starter.read("lights.py").decode("utf-8-sig"))) == ast.dump(ast.parse((RESOURCES / "lights.py").read_text(encoding="utf-8")))
        assert json.loads(starter.read("diagram.json")) == json.loads((RESOURCES / "diagram.json").read_text(encoding="utf-8"))
        events, sleeps, output = run_program("student-starter/main.py", source=starter_source)
        assert events == [(15, 0), (16, 0), (17, 0)] and not sleeps and not output


def verify_teacher_guide():
    guide = json.loads((RESOURCES.parent / "teacher-guide.json").read_text(encoding="utf-8"))
    assert set(guide) == {"6", "7"}

    def check(entry, label, lit_pins, wanted_sleeps, answers=(), wanted_output=None):
        assert len(entry["question"]) == len(entry["watch"]) == 4
        code = entry["code"]
        assert code.strip(), f"Missing example in {label}"
        ast.parse(code, filename=label)
        events, sleeps, output = run_program(label, answers=answers, source=code)
        assert [pin for pin, state in events if state] == lit_pins, f"Unexpected playback in {label}"
        assert sleeps == wanted_sleeps, f"Unexpected timing in {label}"
        if wanted_output is not None:
            assert wanted_output in output, f"Unexpected feedback in {label}"
        return output

    for week in ("6", "7"):
        overview = guide[week]["overview"]
        assert len(overview["question"]) == len(overview["watch"]) == 4
        assert not overview["code"].strip()

    six = guide["6"]
    assert len(six["stages"]) == 6
    assert not six["stages"][0]["code"].strip()
    check(six["stages"][1], "teacher/week6/setup", [], [])
    check(six["stages"][2], "teacher/week6/blink", [15], [1])
    check(six["stages"][3], "teacher/week6/repeat", [15] * 3, [1] * 6)
    check(six["stages"][4], "teacher/week6/traffic", [15, 17, 16], [2, 2, 1])
    check(six["stages"][5], "teacher/week6/red-wait", [15, 17, 16], [4, 2, 1])
    check(six["project"], "teacher/week6/project", [15, 17, 16] * 3, [2, 2, 1] * 3)
    check(six["challenge"], "teacher/week6/challenge", [15, 17, 16], [4, 3, 1])

    seven = guide["7"]
    assert len(seven["stages"]) == 5
    check(seven["stages"][0], "teacher/week7/helper", [15], [0.5, 0.5])
    check(seven["stages"][1], "teacher/week7/explicit-list", [15, 17, 16], [0.5] * 6)
    check(seven["stages"][2], "teacher/week7/range-list", [17, 15, 16], [0.5] * 6)
    for answer, wanted in [("3", "Correct"), ("1", "Not this time"), ("", "Not this time")]:
        check(seven["stages"][3], "teacher/week7/first-answer", [17, 15, 16], [0.5] * 6, [answer], wanted)
    for entry, label, pins, correct in [
        (seven["stages"][4], "teacher/week7/game", [15, 17, 16], "132"),
        (seven["project"], "teacher/week7/project", [15, 17, 16], "132"),
        (seven["challenge"], "teacher/week7/challenge", [17, 15, 16], "312"),
    ]:
        for answer in (correct, "123", "", "x"):
            output = check(entry, label, pins, [0.5] * 6, [answer])
            assert ("You win!" in output) == (answer == correct), f"Incorrect win in {label}"
            assert ("Try again." in output) == (answer != correct), f"Incorrect retry in {label}"


def main():
    verify_student_starter()
    verify_teacher_guide()
    events, sleeps, output = run_program("blink-once.py")
    assert [pin for pin, state in events if state] == [15]
    assert sleeps == [1]
    assert "one red flash" in output

    events, sleeps, output = run_program("repeat-blink.py")
    assert [pin for pin, state in events if state] == [15] * 3
    assert sleeps == [1] * 6

    events, sleeps, output = run_program("traffic-once.py")
    assert [pin for pin, state in events if state] == [15, 17, 16]
    assert sleeps == [2, 2, 1]

    for name in ("three-lights.py", "range-lights.py"):
        events, sleeps, output = run_program(name)
        assert [pin for pin, state in events if state] == [15, 17, 16]
        assert sleeps == [0.5] * 6
        events, sleeps, output = run_program(name, pattern=[2, 2, 1])
        assert [pin for pin, state in events if state] == [16, 16, 15]
        assert sleeps == [0.5] * 6

    for answer, won in [("132", True), ("123", False), ("", False), ("x", False)]:
        events, sleeps, output = run_program("memory-simple.py", [answer])
        assert [pin for pin, state in events if state] == [15, 17, 16]
        assert ("You win!" in output) == won
        assert ("Try again." in output) == (not won)

    # The one-answer version deliberately stores a separate answer string.
    # Changing both settings together must change playback and accepted input.
    events, sleeps, output = run_program(
        "memory-simple.py", ["321"], pattern=[3, 2, 1],
        replacements={'correct = "132"': 'correct = "321"'},
    )
    assert [pin for pin, state in events if state] == [17, 16, 15]
    assert "You win!" in output
    events, sleeps, output = run_program(
        "memory-simple.py", ["132"], pattern=[3, 2, 1],
        replacements={'correct = "132"': 'correct = "321"'},
    )
    assert "Try again." in output and "You win!" not in output

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
    print("PASS: setup-only student starter ZIP, teacher stage/project/challenge examples, simple/legacy programs, memory inputs and settings, exclusive lights, circuit wiring")


if __name__ == "__main__":
    main()
