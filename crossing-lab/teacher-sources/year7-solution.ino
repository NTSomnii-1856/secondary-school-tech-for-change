// Teacher example only. Keep it outside the student starter.
// Normal cycle: green 3 s, amber 1 s, red 1 s, then check the request.
// Crossing: extra all-red 1 s, pedestrians green 5 s, all-red 1 s.
#include "crossing.h"

const int vehicleRed = 8;
const int vehicleAmber = 9;
const int vehicleGreen = 10;
const int pedestrianRed = 6;
const int pedestrianGreen = 7;

void setup() {
  pinMode(vehicleRed, OUTPUT);
  pinMode(vehicleAmber, OUTPUT);
  pinMode(vehicleGreen, OUTPUT);
  pinMode(pedestrianRed, OUTPUT);
  pinMode(pedestrianGreen, OUTPUT);
  Crossing.begin();
  digitalWrite(vehicleRed, HIGH);
  digitalWrite(vehicleAmber, LOW);
  digitalWrite(vehicleGreen, LOW);
  digitalWrite(pedestrianRed, HIGH);
  digitalWrite(pedestrianGreen, LOW);
}

void loop() {
  digitalWrite(vehicleRed, LOW);
  digitalWrite(vehicleGreen, HIGH);
  Crossing.pause(3000);
  digitalWrite(vehicleGreen, LOW);
  digitalWrite(vehicleAmber, HIGH);
  Crossing.pause(1000);
  digitalWrite(vehicleAmber, LOW);
  digitalWrite(vehicleRed, HIGH);
  Crossing.pause(1000);

  if (Crossing.requested()) {
    Crossing.beginCrossing();
    Crossing.pause(1000);
    digitalWrite(pedestrianRed, LOW);
    digitalWrite(pedestrianGreen, HIGH);
    Crossing.pause(5000);
    digitalWrite(pedestrianGreen, LOW);
    digitalWrite(pedestrianRed, HIGH);
    Crossing.pause(1000);
    Crossing.endCrossing();
  }
}
