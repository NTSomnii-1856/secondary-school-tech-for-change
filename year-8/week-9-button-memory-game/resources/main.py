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
buttons = [rbutton, ybutton, gbutton]
speed = 1

order = ""
for i in range(3):
    number = random.randint(0, 2)
    order = order + str(number + 1)
    leds[number].value(1)
    time.sleep(speed)
    leds[number].value(0)
    time.sleep(speed)

print("Your turn! Press three buttons, one at a time.")
answer = ""                         # Clear the player's answer.
for press in range(3):               # Collect exactly three presses.
    number = -1
    while number == -1:
        if rbutton.value() == 0:
            number = 0
        elif ybutton.value() == 0:
            number = 1
        elif gbutton.value() == 0:
            number = 2
        time.sleep(0.01)
    answer = answer + str(number + 1)
    while buttons[number].value() == 0:
        time.sleep(0.01)            # A hold must not add extra digits.
    time.sleep(0.03)

if answer == order:
    print("You win!")
else:
    print("Try again. The order was", order)
