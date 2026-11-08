# Teacher example only. Keep it outside the student starter.
# Normal cycle: green 3 s, amber 1 s, red 1 s, then check the request.
# Crossing: extra all-red 1 s, pedestrians green 5 s, all-red 1 s.
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

# Supplied counted-repeat line: run three complete normal cycles.
for cycle in range(3):
    red.off()
    green.on()
    pause(3)
    green.off()
    amber.on()
    pause(1)
    amber.off()
    red.on()
    pause(1)

    if requested():
        begin_crossing()
        pause(1)
        ped_red.off()
        ped_green.on()
        pause(5)
        ped_green.off()
        ped_red.on()
        pause(1)
        end_crossing()

# Three cycles are complete. Both red lights stay on.
# Stop, then Run to start a fresh demonstration.
