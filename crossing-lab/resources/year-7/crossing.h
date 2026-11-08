#ifndef NTSOMNII_CROSSING_H
#define NTSOMNII_CROSSING_H

#include <Arduino.h>

// Supplied button helper. Student code controls the lights.
// Use pause() instead of delay() so short requests can be remembered.
// A press must stay steady for 30 ms. Each held press counts once.
class CrossingButton {
 public:
  void begin();
  void pause(unsigned long milliseconds);
  bool requested();
  void beginCrossing();
  void endCrossing();

 private:
  void poll();
  uint8_t raw = HIGH;
  uint8_t stable = HIGH;
  unsigned long changedAt = 0;
  bool pending = false;
  bool active = false;
  bool armed = true;
};

extern CrossingButton Crossing;
#endif
