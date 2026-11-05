# Copy this into main.py. Keep the supplied lights.py file.
from lights import flash

# Keep three items. 1 = red, 2 = amber, 3 = green.
pattern = [1, 3, 2]
# If you change the pattern, change this answer to match it.
correct = "132"

print("Watch the three lights. Remember their order.")
for position in range(3):
    flash(pattern[position])

answer = input("Type the three light numbers: ")

if answer == correct:
    print("You win!")
else:
    print("Try again.")

print("Stop, then Run to replay.")
