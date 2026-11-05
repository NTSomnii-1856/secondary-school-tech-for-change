# Copy this program into main.py in the Pico MicroPython project.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)  # GP15 controls the red LED.
red.off()

for count in range(5):
    red.on()
    sleep(0.5)
    red.off()
    sleep(0.5)

print("Finished: five red flashes. Stop, then Run to replay.")
