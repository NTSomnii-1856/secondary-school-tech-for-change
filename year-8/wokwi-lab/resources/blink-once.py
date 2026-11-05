# Copy this whole program into main.py in the ready-wired Pico project.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
red.off()

red.on()
sleep(1)
red.off()

print("Finished: one red flash. Stop, then Run to replay.")
