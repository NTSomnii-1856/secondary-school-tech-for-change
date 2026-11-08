#include "crossing.h"

CrossingButton Crossing;

void CrossingButton::begin() {
  pinMode(2, INPUT_PULLUP);
  raw = digitalRead(2);
  stable = raw;
  changedAt = millis();
  pending = false;
  active = false;
  // A button held when Run starts must be released before making a request.
  armed = (stable == HIGH);
}

void CrossingButton::poll() {
  uint8_t sample = digitalRead(2);
  unsigned long now = millis();
  if (sample != raw) {
    raw = sample;
    changedAt = now;
  }
  if (raw != stable && (unsigned long)(now - changedAt) >= 30) {
    stable = raw;
    if (stable == LOW) {
      if (armed && !active) pending = true;
      armed = false;
    } else {
      armed = !active;
    }
  }
}

void CrossingButton::pause(unsigned long milliseconds) {
  unsigned long start = millis();
  poll();
  while (true) {
    unsigned long elapsed = (unsigned long)(millis() - start);
    if (elapsed >= milliseconds) return;
    unsigned long remaining = milliseconds - elapsed;
    delay(remaining < 10 ? remaining : 10);
    poll();
  }
}

bool CrossingButton::requested() {
  poll();
  return pending;
}

void CrossingButton::beginCrossing() {
  poll();
  pending = false;
  active = true;
  armed = false;
}

void CrossingButton::endCrossing() {
  poll();
  active = false;
  pending = false;
  // A held or partly debounced press cannot become the next request.
  armed = (raw == HIGH && stable == HIGH);
}
