export default class Elevator {
  // Set up a new elevator with starting values.
  // A custom clock can be injected for testing time-based behavior.
  constructor({ clock } = {}) {
    this.currentFloor = 0;
    this.requests = [];
    this.currentRiders = [];
    this.totalFloorsTraversed = 0;
    this.totalStopsMade = 0;
    this.clock = clock || { now: () => new Date() };
  }

  // Add one person to the queue of people waiting for a ride.
  requestRide(person) {
    this.requests.push(person);
  }

  // Serve only the first request in line (FIFO order).
  // Returns false when there is nothing to process.
  processNextRequest() {
    if (this.requests.length === 0) {
      return false;
    }

    // Always serve the person at the front of the queue.
    const nextPerson = this.requests[0];
    this.pickup(nextPerson);
    this.dropoff(nextPerson);
    return true;
  }

  // Keep processing requests until none are left.
  // After that, decide whether the elevator should return to the lobby.
  processAllRequests() {
    while (this.processNextRequest()) {
      // Loop until no more requests remain.
    }

    this.handleIdleState();
  }

  // Move to the person's current floor and let them enter.
  pickup(person) {
    this.moveToFloor(person.currentFloor);
    this.removeRequest(person);

    // Avoid adding the same person twice.
    if (!this.currentRiders.includes(person)) {
      this.currentRiders.push(person);
    }

    // Picking someone up counts as a stop.
    this.totalStopsMade += 1;
  }

  // Move to the person's destination floor and let them exit.
  dropoff(person) {
    this.moveToFloor(person.dropOffFloor);
    this.removeRider(person);
    // Dropping someone off also counts as a stop.
    this.totalStopsMade += 1;
  }

  // Move elevator directly to a floor and track distance traveled.
  moveToFloor(targetFloor) {
    // Use absolute value so movement is positive whether going up or down.
    const floorsMoved = Math.abs(targetFloor - this.currentFloor);
    this.totalFloorsTraversed += floorsMoved;
    this.currentFloor = targetFloor;
  }

  // Rule: before 12 PM, the elevator should return to lobby when idle.
  checkIfShouldReturnToLobby() {
    const currentTime = this.clock.now();
    return currentTime.getHours() < 12;
  }

  // If no one is waiting or riding, handle where the elevator should park.
  handleIdleState() {
    // Do nothing if there is still work to do.
    if (this.currentRiders.length > 0 || this.requests.length > 0) {
      return;
    }

    // Return to floor 0 (lobby) before noon, but only if not already there.
    if (this.checkIfShouldReturnToLobby() && this.currentFloor !== 0) {
      this.moveToFloor(0);
      this.totalStopsMade += 1;
    }
  }

  // Reset elevator back to a clean initial state.
  resetState() {
    this.currentFloor = 0;
    this.requests = [];
    this.currentRiders = [];
    this.totalFloorsTraversed = 0;
    this.totalStopsMade = 0;
  }

  // Remove a person from the request queue, if found.
  removeRequest(person) {
    const requestIndex = this.requests.indexOf(person);

    if (requestIndex !== -1) {
      this.requests.splice(requestIndex, 1);
    }
  }

  // Remove a person from the list of current riders, if found.
  removeRider(person) {
    const riderIndex = this.currentRiders.indexOf(person);

    if (riderIndex !== -1) {
      this.currentRiders.splice(riderIndex, 1);
    }
  }
}
