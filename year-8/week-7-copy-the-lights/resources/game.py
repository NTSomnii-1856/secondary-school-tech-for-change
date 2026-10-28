# Supplied circuit code. Students edit main.py.
from machine import Pin
from time import sleep, sleep_ms

lamps = [Pin(15, Pin.OUT), Pin(16, Pin.OUT), Pin(17, Pin.OUT)]
buttons = [Pin(12, Pin.IN, Pin.PULL_UP), Pin(13, Pin.IN, Pin.PULL_UP), Pin(14, Pin.IN, Pin.PULL_UP)]

def flash(number):
    for lamp in lamps:
        lamp.off()
    lamps[number - 1].on()
    sleep(0.5)
    lamps[number - 1].off()
    sleep(0.5)

def read_button():
    # Finish any old hold; a new tap is one answer, not many.
    while any(button.value() == 0 for button in buttons):
        sleep_ms(10)
    while True:
        for number in range(0, 3):
            if buttons[number].value() == 0:
                sleep_ms(20)
                if buttons[number].value() == 0:
                    while buttons[number].value() == 0:
                        sleep_ms(10)
                    return number + 1
