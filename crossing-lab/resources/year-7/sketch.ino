// Hardware setup only. Write your own light sequence inside loop().
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
  // Your normal light cycle and safe request check go here.
  // Crossing.pause(1000) waits one second while checking the button.
}
