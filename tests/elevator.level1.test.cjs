require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert;
const Elevator = require('../elevator').default;
const Person = require('../person').default;

describe('Elevator Level 1', function() {
  it('starts at floor 0 and tracks requests and riders', function() {
    const elevator = new Elevator();

    assert.equal(elevator.currentFloor, 0);
    assert.deepEqual(elevator.requests, []);
    assert.deepEqual(elevator.currentRiders, []);
  });

  it('adds a ride request', function() {
    const elevator = new Elevator();
    const person = new Person('Bob', 3, 9);

    elevator.requestRide(person);

    assert.equal(elevator.requests.length, 1);
    assert.equal(elevator.requests[0], person);
  });

  it('picks up and drops off one person', function() {
    const elevator = new Elevator();
    const person = new Person('Sue', 4, 1);
    elevator.requestRide(person);

    elevator.pickup(person);

    assert.equal(elevator.currentFloor, 4);
    assert.equal(elevator.requests.length, 0);
    assert.equal(elevator.currentRiders.length, 1);

    elevator.dropoff(person);

    assert.equal(elevator.currentFloor, 1);
    assert.equal(elevator.currentRiders.length, 0);
  });
});
