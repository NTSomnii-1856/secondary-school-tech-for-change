rows = [
    "00100100",
    "01111110",
    "11111111",
    "11111111",
    "01111110",
    "00111100",
    "00011000",
    "00000000",
]

for row in range(0, len(rows)):
    picture = rows[row].replace("0", ".")
    picture = picture.replace("1", "#")
    print(picture)
