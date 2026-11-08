# Hardware setup only. Write your own light sequence below.
from machine import Pin
from crossing import pause, requested, begin_crossing, end_crossing

red = Pin(15, Pin.OUT)
amber = Pin(16, Pin.OUT)
green = Pin(17, Pin.OUT)
ped_red = Pin(18, Pin.OUT)
ped_green = Pin(19, Pin.OUT)

red.on()
amber.off()
green.off()
ped_red.on()
ped_green.off()

# Your normal light cycle and safe request check go here.
# pause(1) waits one second while checking the button.
