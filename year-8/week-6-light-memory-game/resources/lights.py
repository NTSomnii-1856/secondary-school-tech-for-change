# Supplied hardware helper. Students edit main.py in this lesson.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
amber = Pin(16, Pin.OUT)
green = Pin(17, Pin.OUT)
lamps = [red, amber, green]

def flash(number):
    # Light 1 = red, 2 = amber, 3 = green.
    for lamp in lamps:
        lamp.off()
    lamp = lamps[number - 1]
    lamp.on()
    sleep(0.5)
    lamp.off()
    sleep(0.5)
