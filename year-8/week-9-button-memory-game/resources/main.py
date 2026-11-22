from machine import Pin
import time
import random

rled = Pin(15, Pin.OUT)
yled = Pin(13, Pin.OUT)
gled = Pin(14, Pin.OUT)
rbutton = Pin(16, Pin.IN, Pin.PULL_UP)
ybutton = Pin(17, Pin.IN, Pin.PULL_UP)
gbutton = Pin(18, Pin.IN, Pin.PULL_UP)

rled.value(0)
yled.value(0)
gled.value(0)

leds = [rled, yled, gled]
speed = 1
