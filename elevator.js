export default class Elevator {
  constructor({ clock } = {}) {
    this.currentFloor = 0;
    this.requests = [];
    this.currentRiders = [];
    this.totalFloorsTraversed = 0;
    this.totalStopsMade = 0;
    this.clock = clock || { now: () => new Date() };
  }

  requestRide(person) {
    this.requests.push(person);
  }

  processNextRequest() {
    if (this.requests.length === 0) {
      return false;
    }

    const nextPerson = this.requests[0];
    this.pickup(nextPerson);
    this.dropoff(nextPerson);
    return true;
  }

  processAllRequests() {
    while (this.processNextRequest()) {
      // Loop until no more requests remain.
    }

    this.handleIdleState();
  }

  pickup(person) {
    this.moveToFloor(person.currentFloor);
    this.removeRequest(person);

    if (!this.currentRiders.includes(person)) {
      this.currentRiders.push(person);
    }

    this.totalStopsMade += 1;
  }

  dropoff(person) {
    this.moveToFloor(person.dropOffFloor);
    this.removeRider(person);
    this.totalStopsMade += 1;
  }

  moveToFloor(targetFloor) {
    const floorsMoved = Math.abs(targetFloor - this.currentFloor);
    this.totalFloorsTraversed += floorsMoved;
    this.currentFloor = targetFloor;
  }

  checkIfShouldReturnToLobby() {
    const currentTime = this.clock.now();
    return currentTime.getHours() < 12;
  }

  handleIdleState() {
    if (this.currentRiders.length > 0 || this.requests.length > 0) {
      return;
    }

    if (this.checkIfShouldReturnToLobby() && this.currentFloor !== 0) {
      this.moveToFloor(0);
      this.totalStopsMade += 1;
    }
  }

  resetState() {
    this.currentFloor = 0;
    this.requests = [];
    this.currentRiders = [];
    this.totalFloorsTraversed = 0;
    this.totalStopsMade = 0;
  }

  removeRequest(person) {
    const requestIndex = this.requests.indexOf(person);

    if (requestIndex !== -1) {
      this.requests.splice(requestIndex, 1);
    }
  }

  removeRider(person) {
    const riderIndex = this.currentRiders.indexOf(person);

    if (riderIndex !== -1) {
      this.currentRiders.splice(riderIndex, 1);
    }
  }
}
