from game import flash, read_button

pattern = [1, 3, 2]

for position in range(0, len(pattern)):
    flash(pattern[position])

print("Your turn. Tap the buttons in the same order.")
score = 0

for position in range(0, len(pattern)):
    pressed = read_button()
    if pressed == position:
        score = score + 1

if score == len(pattern):
    print("You matched the whole pattern!")
else:
    print("Not this time. Stop, then Run to try again.")
