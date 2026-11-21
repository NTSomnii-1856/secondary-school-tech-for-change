int target = 10;             // Points needed to qualify.
int score = 0;
int previous = HIGH;
int finished = 0;                // 0 = final message not shown yet.
unsigned long startTime;         // Stores a time in milliseconds.
unsigned long roundTime = 10000; // 10000 ms = 10 seconds.

void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(8, OUTPUT);            // Ready / playing LED.
  Serial.begin(9600);
  for (int count = 3; count > 0; count = count - 1) {
    Serial.println(count);
    delay(1000);
  }
  Serial.println("GO!");
  previous = digitalRead(2);     // A held early press earns no point.
  digitalWrite(8, HIGH);         // The round is open.
  startTime = millis();          // Remember when GO happened.
}

void loop() {
  if (millis() - startTime < roundTime) { // Still inside the round?
    int button = digitalRead(2);
    if (button == LOW && previous == HIGH) {
      score = score + 1;
      Serial.println(score);
    }
    previous = button;
    delay(20);
  } else if (finished == 0) {     // Time up: show the result ONCE.
    digitalWrite(8, LOW);
    Serial.print("Time up! Score: ");
    Serial.println(score);
    if (score >= target) {      // At least the target score?
      Serial.println("Qualified!");
      digitalWrite(8, HIGH);
    } else {
      Serial.println("Try again!");
    }
    finished = 1;                // Do not print the result again.
  }
}