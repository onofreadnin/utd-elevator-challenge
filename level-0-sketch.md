## What the elevator needs to remember
- `currentFloor` - where it is right now
- `requests` - people waiting
- `currentRiders` - people inside
- `totalFloorsTraversed` - how far it has traveled
- `totalStopsMade` - pickup/dropoff/lobby-return stops

## Basic behavior (starting version)
Use a simple **FIFO** flow:
1. Go to the person’s floor
2. Pick them up
3. Go to their destination floor
4. Drop them off

Finish one person’s trip before handling the next request.

## How counting works
- **Floors traversed** = distance moved between floors (absolute difference)
- **Stops made** = only real stops:
  - pickup
  - dropoff
  - return to lobby (before noon idle rule)
- Moving to the same floor adds **0** travel
- No fake/extra stops

## Idle rule (Level 6)
Only check this when no one is inside:
- **Before 12:00 p.m.** → return to floor `0`
- **After 12:00 p.m.** → stay on the last floor
