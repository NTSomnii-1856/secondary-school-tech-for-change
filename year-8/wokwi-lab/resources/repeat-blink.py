# Copy this whole program into main.py.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
red.off()

for count in range(3):
    red.on()
    sleep(1)
    red.off()
    sleep(1)

print("Finished: three red flashes. Stop, then Run to replay.")
