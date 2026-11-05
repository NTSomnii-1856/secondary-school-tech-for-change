# Copy this into main.py. Keep the supplied lights.py file.
from lights import flash

# Keep three items. 1 = red, 2 = amber, 3 = green.
pattern = [1, 3, 2]

for position in range(3):
    flash(pattern[position])
