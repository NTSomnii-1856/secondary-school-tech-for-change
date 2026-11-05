# A classroom traffic-light model. Copy this whole program into main.py.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
amber = Pin(16, Pin.OUT)
green = Pin(17, Pin.OUT)

red.off()
amber.off()
green.off()

red.on()
sleep(2)
red.off()

green.on()
sleep(2)
green.off()

amber.on()
sleep(1)
amber.off()

print("Finished: red, green, amber. Stop, then Run to replay.")
