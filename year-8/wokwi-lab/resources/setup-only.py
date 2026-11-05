# Hardware setup only. Students write the light sequence.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
amber = Pin(16, Pin.OUT)
green = Pin(17, Pin.OUT)

red.off()
amber.off()
green.off()
