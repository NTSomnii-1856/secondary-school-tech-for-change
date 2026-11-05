# Copy this program into main.py. Keep lights.py in the same project.
from lights import flash

# 1 = red, 2 = amber, 3 = green. Keep every item between 1 and 3.
pattern = [1, 3, 2]

print("Watch the lights. Remember their order.")
for position in range(len(pattern)):
    flash(pattern[position])

print("Your turn: 1 = red, 2 = amber, 3 = green.")
print("Type one number, then press Enter. Repeat for each light.")
score = 0

for position in range(len(pattern)):
    answer = input("Next light (1, 2 or 3): ")
    # input gives text. str turns the expected number into text too.
    if answer == str(pattern[position]):
        score = score + 1

print("Score:", score, "/", len(pattern))
if score == len(pattern):
    print("You matched the whole pattern!")
else:
    print("Not this time. Watch carefully and try again.")

print("Stop, then Run to replay. Change the list for a new pattern.")
