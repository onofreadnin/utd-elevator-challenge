require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert;
const Elevator = require('../elevator').default;
const Person = require('../person').default;

function createClockWithHour(hour) {
  return {
    now: () => new Date(2026, 0, 1, hour, 0, 0)
  };
}

describe('Elevator unit methods', function() {
  it('constructor sets default state', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });

    assert.equal(elevator.currentFloor, 0);
    assert.equal(elevator.totalFloorsTraversed, 0);
    assert.equal(elevator.totalStopsMade, 0);
    assert.deepEqual(elevator.requests, []);
    assert.deepEqual(elevator.currentRiders, []);
  });

  it('requestRide stores person request', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Ana', 2, 6);

    elevator.requestRide(person);

    assert.equal(elevator.requests.length, 1);
    assert.equal(elevator.requests[0], person);
  });

  it('moveToFloor updates floor and traversed count', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });

    elevator.moveToFloor(4);
    elevator.moveToFloor(1);

    assert.equal(elevator.currentFloor, 1);
    assert.equal(elevator.totalFloorsTraversed, 7);
  });

  it('removeRequest deletes one queued request', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const personA = new Person('A', 1, 2);
    const personB = new Person('B', 3, 4);
    elevator.requestRide(personA);
    elevator.requestRide(personB);

    elevator.removeRequest(personA);

    assert.equal(elevator.requests.length, 1);
    assert.equal(elevator.requests[0], personB);
  });

  it('removeRider deletes one rider', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Rider', 2, 3);
    elevator.currentRiders.push(person);

    elevator.removeRider(person);

    assert.equal(elevator.currentRiders.length, 0);
  });

  it('pickup moves to person floor, removes request, and adds rider', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Bob', 5, 7);
    elevator.requestRide(person);

    elevator.pickup(person);

    assert.equal(elevator.currentFloor, 5);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 1);
    assert.equal(elevator.totalStopsMade, 1);
  });

  it('dropoff moves to drop-off floor and removes rider', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Bob', 5, 7);
    elevator.currentRiders.push(person);
    elevator.currentFloor = 5;

    elevator.dropoff(person);

    assert.equal(elevator.currentFloor, 7);
    assert.equal(elevator.currentRiders.length, 0);
    assert.equal(elevator.totalStopsMade, 1);
  });

  it('processNextRequest handles one person completely', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Sue', 3, 8);
    elevator.requestRide(person);

    const didProcess = elevator.processNextRequest();

    assert.equal(didProcess, true);
    assert.equal(elevator.currentFloor, 8);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
    assert.equal(elevator.totalStopsMade, 2);
  });

  it('processNextRequest returns false when there is nothing to process', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });

    const didProcess = elevator.processNextRequest();

    assert.equal(didProcess, false);
  });

  it('processAllRequests handles all requests in queue order', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const personA = new Person('A', 2, 5);
    const personB = new Person('B', 1, 4);
    elevator.requestRide(personA);
    elevator.requestRide(personB);

    elevator.processAllRequests();

    assert.equal(elevator.currentFloor, 4);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });

  it('checkIfShouldReturnToLobby is true before noon', function() {
    const elevator = new Elevator({ clock: createClockWithHour(9) });

    assert.equal(elevator.checkIfShouldReturnToLobby(), true);
  });

  it('checkIfShouldReturnToLobby is false after noon', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });

    assert.equal(elevator.checkIfShouldReturnToLobby(), false);
  });

  it('handleIdleState returns to lobby before noon when idle', function() {
    const elevator = new Elevator({ clock: createClockWithHour(9) });
    elevator.currentFloor = 6;

    elevator.handleIdleState();

    assert.equal(elevator.currentFloor, 0);
    assert.equal(elevator.totalStopsMade, 1);
  });

  it('resetState clears operational state', function() {
    const elevator = new Elevator({ clock: createClockWithHour(15) });
    const person = new Person('Zed', 1, 9);
    elevator.requestRide(person);
    elevator.pickup(person);
    elevator.dropoff(person);

    elevator.resetState();

    assert.equal(elevator.currentFloor, 0);
    assert.equal(elevator.totalFloorsTraversed, 0);
    assert.equal(elevator.totalStopsMade, 0);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 0);
  });
});
