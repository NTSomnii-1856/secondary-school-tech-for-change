# Copy this program into main.py. Use the supplied three-LED circuit.
# This is a classroom traffic-light model, not a real road controller.
from machine import Pin
from time import sleep

red = Pin(15, Pin.OUT)
amber = Pin(16, Pin.OUT)
green = Pin(17, Pin.OUT)

red.off()
amber.off()
green.off()

for cycle in range(3):
    red.on()
    sleep(2)
    red.off()

    green.on()
    sleep(2)
    green.off()

    amber.on()
    sleep(1)
    amber.off()

print("Finished: three cycles. Stop, then Run to replay.")
