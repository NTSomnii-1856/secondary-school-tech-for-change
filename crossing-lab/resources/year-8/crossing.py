"""Supplied button helper; students control the lights in main.py.

pause(seconds) checks the request button every 10 ms while waiting.
A press must remain steady for 30 ms. A held press counts once.
"""
from machine import Pin
from time import ticks_ms, ticks_diff, sleep_ms

_button = Pin(20, Pin.IN, Pin.PULL_UP)
_raw = _button.value()
_stable = _raw
_changed_at = ticks_ms()
_pending = False
_active = False
_armed = _stable == 1


def _poll():
    global _raw, _stable, _changed_at, _pending, _armed
    sample = _button.value()
    now = ticks_ms()
    if sample != _raw:
        _raw = sample
        _changed_at = now
    if _raw != _stable and ticks_diff(now, _changed_at) >= 30:
        _stable = _raw
        if _stable == 0:
            if _armed and not _active:
                _pending = True
            _armed = False
        else:
            _armed = not _active


def pause(seconds):
    total = max(0, int(seconds * 1000))
    start = ticks_ms()
    _poll()
    while True:
        elapsed = ticks_diff(ticks_ms(), start)
        if elapsed >= total:
            return
        remaining = total - elapsed
        sleep_ms(min(10, remaining))
        _poll()


def requested():
    _poll()
    return _pending


def begin_crossing():
    global _pending, _active, _armed
    _poll()
    _pending = False
    _active = True
    _armed = False


def end_crossing():
    global _pending, _active, _armed
    _poll()
    _active = False
    _pending = False
    _armed = _raw == 1 and _stable == 1
